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

import { SessionUser, userRoleSchema } from '@pcgl-daco/validation';

import { authConfig } from '@/config/authConfig.js';
import { getApplicationById } from '@/controllers/applicationController.ts';
import { getDbInstance } from '@/db/index.ts';
import logger from '@/logger.ts';
import { type UserRoleOmitRep } from '@/middleware/authMiddleware.ts';
import { failure, success, type AsyncResult } from '@/utils/results.js';
import { applicationSvc } from './applicationService.ts';
import type { ApplicationService } from './types.ts';

/**
 * Will check if the user is APPLICANT, DAC_MEMBER or DAC_CHAIR
 *
 * Since the INSTITUTIONAL_REP role is determined by users email
 * comparisons between session and institutional_rep email from the application contents, the logic
 * is not included here but instead custom to endpoints that require specific rep functionality.
 * As such reps will have an APPLICANT role.
 *
 */
export function getUserRole(user: SessionUser | undefined): UserRoleOmitRep {
	if (!user) {
		return userRoleSchema.Values.ANONYMOUS;
	}

	// TODO: removing in the auth refactor
	const isDacReviewer = user.groups?.some((group) => group.name === authConfig.AUTHZ_GROUP_PREFIX_DAC_MEMBER);
	const isDacChair = user.groups?.some((group) => group.name === authConfig.AUTHZ_GROUP_PREFIX_DAC_CHAIR);

	if (isDacChair) {
		return userRoleSchema.Values.DAC_CHAIR;
	} else if (isDacReviewer) {
		return userRoleSchema.Values.DAC_MEMBER;
	}
	return userRoleSchema.Values.APPLICANT;
}

/**
 * Based on user data stored in session data, determine the user's role & if the application is associated with them.
 */
export async function isAssociatedRep(user: SessionUser, applicationId: number): Promise<Boolean> {
	const database = getDbInstance();
	const applicationService: ApplicationService = applicationSvc(database);

	const app = await applicationService.getApplicationWithContents({ id: applicationId });

	if (!app.success) {
		logger.error('Look up for validating isAssociatedRep failed! Returning false. - Application ID: ', applicationId);
		return false;
	}

	const repEmail = app.data.contents?.institutional_rep_email?.toLocaleLowerCase().trim();

	if (user?.emails.some((val) => val.address.toLocaleLowerCase().trim() === repEmail)) {
		return true;
	}

	return false;
}

/**
 * Validate User is allowed access to this specific Application based on userRole or userId
 * @param session Session data with user info used to confirm their role and id
 * @param applicationId - The ID of the application to confirm User's association
 * @returns boolean
 */
export async function canAccessRequest(
	user: SessionUser,
	applicationId: number,
): AsyncResult<void, 'FORBIDDEN' | 'NOT_FOUND' | 'SYSTEM_ERROR'> {
	const userRole = getUserRole(user);

	const hasSpecialAccess =
		userRole === userRoleSchema.Values.DAC_MEMBER ||
		userRole === userRoleSchema.Values.DAC_CHAIR ||
		(await isAssociatedRep(user, applicationId));

	const result = await getApplicationById({ applicationId });
	if (result.success) {
		const { data } = result;
		const { userId } = user;
		const canAccess = data.userId === userId || hasSpecialAccess;

		if (!canAccess) {
			return failure('FORBIDDEN', 'User does not have permission to access or modify this application.');
		}
	} else {
		return result;
	}
	return success(undefined);
}
