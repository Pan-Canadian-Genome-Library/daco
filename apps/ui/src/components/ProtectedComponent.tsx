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

import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { useUserContext } from '@/providers/UserProvider';
import { ApplicationStateValues } from '@pcgl-daco/data-model';
import { Skeleton } from 'antd';
import type { PropsWithChildren } from 'react';
import { Membership } from './ProtectedRoute';

type ProtectedComponentProps = PropsWithChildren<{
	requiredMembership?: [Membership, ...Membership[]];
	requiredStates?: [ApplicationStateValues, ...ApplicationStateValues[]];
}>;

/**
 * Restrict a component from rendering if authorization rules are not met. Can be added
 * around any component to prevent the component from rendering if the user roles are not
 * correct.
 *
 * By default, users must be logged in to see the component.
 *
 * To restrict a component to only users of a specific role, you can add the `requiredRoles` prop. If you do,
 * only users with one of the required roles will be able to access that component.
 *
 * To restrict a component to only show when in a certain state, you can add the `requiredStates` prop. If you do,
 * a component will only be visible if the app is in a certain state.

 * @example
 * <div>
 *  <ProtectedComponent requiredRoles={['DAC_MEMBER']} requiredStates={['DRAFT']}>
 *      <Button>Button for DACs only<Button/>
 * </ProtectedComponent>
 * </div>
 */
const ProtectedComponent = ({ requiredMembership, requiredStates, children }: ProtectedComponentProps) => {
	const { isLoading, isLoggedIn } = useUserContext();

	const {
		state: { applicationState, applicationUserPermissions },
	} = useApplicationContext();

	const { isApplicant, isDacChair, isDacMember, isInstitutionalRep } = applicationUserPermissions;

	if (isLoading) {
		return <Skeleton />;
	}
	if (!isLoggedIn) {
		return null;
	}

	if (requiredStates) {
		if (!requiredStates.includes(applicationState)) {
			return null;
		}
	}

	if (requiredMembership) {
		if (requiredMembership.includes('DAC') && (isDacChair || isDacMember)) {
			return children;
		} else if (requiredMembership.includes('INSTITUTIONAL_REP') && isInstitutionalRep) {
			return children;
		} else if (isApplicant) {
			return children;
		} else {
			return null;
		}
	}

	return children;
};

export default ProtectedComponent;
