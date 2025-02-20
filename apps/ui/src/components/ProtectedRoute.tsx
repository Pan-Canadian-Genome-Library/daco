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

import { Navigate, type To } from 'react-router';

import { UserRole } from '@pcgl-daco/validation';

import type { PropsWithChildren } from 'react';
import { useUserContext } from './providers/UserProvider';

type ProtectedRouteProps = PropsWithChildren<{
	requiredRoles?: [UserRole, ...UserRole[]];
	redirectTo?: To;
}>;

const AUTH_DISABLED = import.meta.env.VITE_DISABLE_AUTH === 'true';

/**
 * Restrict a component from rendering if authorization rules are not met. Can be added to the
 * element of a Route to prevent access to that route.
 *
 * By default, users must be logged in to access the route.
 *
 * To restrict a route to only users of a specific role, you can add the `requiredRoles` prop. If you do,
 * only users with one of the required roles will be able to access that route.
 *
 * By default, unauthorized users will be redirected to the home page. To rediret to a different location,
 * provide a `redirectTo` prop
 *
 * @example
 * <Routes>
 *		<Route element={<PageLayout />}>
 *			<Route index element={<HomePage />} />
 *			<Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
 *		</Route>
 *	</Routes>
 */
const ProtectedRoute = ({ requiredRoles, redirectTo, children }: ProtectedRouteProps) => {
	const { isLoading, isLoggedIn, role } = useUserContext();

	if (AUTH_DISABLED) {
		return children;
	}

	const Redirect = () => <Navigate replace to={redirectTo || '/'} />;

	if (isLoading) {
		return <span>Loading user info...</span>;
	}
	if (!isLoggedIn) {
		return <Redirect />;
	}

	if (requiredRoles) {
		if (!role) {
			return <Redirect />;
		}
		if (!requiredRoles.includes(role)) {
			return <Redirect />;
		}
	}

	return children;
};

export default ProtectedRoute;
