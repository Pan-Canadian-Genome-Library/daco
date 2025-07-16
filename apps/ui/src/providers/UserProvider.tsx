/*
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/* eslint-disable react-refresh/only-export-components */

import useGetUser from '@/api/queries/useGetUser';
import { SessionUser, UserRole } from '@pcgl-daco/validation';
import { createContext, useContext, type PropsWithChildren } from 'react';

type UserState = {
	isLoading: boolean;
	isLoggedIn: boolean;
	refresh: () => void;
	role: UserRole;
	user?: SessionUser;
};

const UserContext = createContext<UserState>({
	isLoading: true,
	isLoggedIn: false,
	refresh: () => {},
	role: 'ANONYMOUS',
});

export function UserProvider({ children }: PropsWithChildren) {
	const { data, isLoading, refetch } = useGetUser();

	const refresh = () => {
		refetch();
	};

	const userState: UserState & { role: UserRole } = {
		user: data,
		role: data?.role ?? 'ANONYMOUS',
		isLoading,
		isLoggedIn: !isLoading || data ? data?.role !== 'ANONYMOUS' : true,
		refresh,
	};
	return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
}

export function useUserContext() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUserContext must be used within a UserProvider');
	}
	return context;
}
