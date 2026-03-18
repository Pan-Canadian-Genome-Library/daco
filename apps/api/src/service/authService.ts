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

import { SessionUser } from '@pcgl-daco/validation';

import { getApplicationById } from '@/controllers/applicationController.ts';
import { getDbInstance } from '@/db/index.ts';
import logger from '@/logger.ts';
import type { AccessConfig } from '@/middleware/utils/types.ts';
import { failure, success, type AsyncResult } from '@/utils/results.js';
import { applicationSvc } from './applicationService.ts';
import type { ApplicationService } from './types.ts';
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
 * Validate User is allowed access to this specific Application based on user groups or userId
 * @param session Session data with user info used to confirm their role and id
 * @param applicationId - The ID of the application to confirm User's association
 * @returns boolean
 */
export async function canAccessRequest(
	user: SessionUser,
	applicationId: number,
	config: AccessConfig,
): AsyncResult<void, 'FORBIDDEN' | 'NOT_FOUND' | 'SYSTEM_ERROR'> {
	const result = await getApplicationById({ applicationId });
	if (result.success) {
		const { data } = result;
		const { dacoAdmin } = user;

		const ownsApplication = isUserApplicant(user, data.userId);
		const dacChairOfApplication = isUserDacChair(user, data.dacId);
		const dacMemberOfApplication = isUserDacMember(user, data.dacId);
		const representativeOfApplication = await isAssociatedRep(user, applicationId);

		// If accessConfig exists, this means we are stricter with who can access this resource.
		if (config?.accessConfig) {
			const { accessConfig } = config;
			if (accessConfig.applicant && ownsApplication) {
				return success(undefined);
			} else if (accessConfig.dacChair && dacChairOfApplication) {
				return success(undefined);
			} else if (accessConfig.dacMember && dacMemberOfApplication) {
				return success(undefined);
			} else if (accessConfig.dacoAdmin && dacoAdmin) {
				return success(undefined);
			} else if (accessConfig.institutionalRep && representativeOfApplication) {
				return success(undefined);
			}
			return failure('FORBIDDEN', 'User does not have permission to access or modify this application.');
		}

		// At least one needs to be authorizied
		const canAccess = ownsApplication || dacChairOfApplication || dacMemberOfApplication || representativeOfApplication;

		if (!canAccess) {
			return failure('FORBIDDEN', 'User does not have permission to access or modify this application.');
		}
	} else {
		return result;
	}
	return success(undefined);
}

export function isUserDacMember(user: SessionUser, applicationDac: string | null): boolean {
	return user.dacMember.some((dacId) => dacId === applicationDac);
}
export function isUserDacChair(user: SessionUser, applicationDac: string | null): boolean {
	return user.dacChair.some((dacId) => dacId === applicationDac);
}
export function isUserApplicant(user: SessionUser, applicationUserId: string): boolean {
	return user.userId === applicationUserId;
}
