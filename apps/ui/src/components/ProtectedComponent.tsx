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
 * around any component to prevent the component from rendering if the user membership are not
 * correct.
 *
 * Since accounts membership is determined on a per-application basis, this component will only work in routes `/applications/*` and will check the user's membership for the current application.
 *
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
		if (
			(requiredMembership.includes('APPLICANT') && isApplicant) ||
			(requiredMembership.includes('DAC_MEMBER') && isDacMember) ||
			(requiredMembership.includes('DAC_CHAIR') && isDacChair) ||
			(requiredMembership.includes('INSTITUTIONAL_REP') && isInstitutionalRep)
		) {
			return children;
		} else {
			return null;
		}
	}

	return children;
};

export default ProtectedComponent;
