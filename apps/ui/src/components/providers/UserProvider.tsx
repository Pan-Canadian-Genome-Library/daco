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

import type { UserResponse } from '@pcgl-daco/validation';
import { createContext, useContext, type PropsWithChildren } from 'react';
import useGetUser from '../../api/useGetUser';

type UserState = {
	isLoading: boolean;
	isLoggedIn: boolean;
	refresh: () => void;
} & Partial<UserResponse>;

const UserContext = createContext<UserState>({ isLoading: true, isLoggedIn: false, refresh: () => {} });

export function UserProvider({ children }: PropsWithChildren) {
	const { data, isLoading, refetch } = useGetUser();

	// TODO: update local storage

	const refresh = () => {
		// TODO: update local storage
		refetch();
	};

	const value: UserState = {
		...data,
		isLoading,
		isLoggedIn: isLoading ? false : data ? data.role !== 'ANONYMOUS' : false,
		refresh,
	};
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useCount must be used within a CountProvider');
	}
	return context;
}
