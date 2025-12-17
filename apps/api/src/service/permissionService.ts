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

import { getDbInstance } from '@/db/index.ts';
import { addUserToStudyPermission, lookupUserByEmail } from '@/external/pcglAuthZClient.ts';
import { failure, type AsyncResult } from '@/utils/results.ts';

import { applicationSvc } from './applicationService.ts';
import { collaboratorsSvc } from './collaboratorsService.ts';
import type { ApplicationService, GrantUserPermissionsParams, GrantUserPermissionsResult } from './types.ts';

/**
 * This function grants a user access to the requested studies
 * First, it looks for the associated PCGL user ID using the institutional email
 * Then, it grants the study permissions using the approver's access token
 * Returns the list of successfully granted study IDs and any failure messages
 *
 * @param param0
 * @returns
 */
export const grantUserPermissions = async ({
	institutionalEmail,
	approverAccessToken,
	requestedStudies,
}: GrantUserPermissionsParams): Promise<GrantUserPermissionsResult> => {
	const lookup = await lookupUserByEmail(institutionalEmail, approverAccessToken);

	if (!lookup.success) {
		return { success: false, failureMessages: [lookup.message] };
	}

	const failureMessages = [];
	for (const studyId of requestedStudies ?? []) {
		for (const userPcglId of lookup.data) {
			const result = await addUserToStudyPermission(studyId, userPcglId, approverAccessToken);
			if (!result.success) {
				failureMessages.push(result.message);
			}
		}
	}

	return { success: failureMessages.length === 0, failureMessages };
};

/**
 * Verifies that the applicant and all collaborators associated with an application
 * have active user accounts and returns their user IDs.
 * @param applicationId
 * @param approverAccessToken
 * @returns
 */
export const verifyApplicationUserAccounts = async (
	applicationId: number,
	approverAccessToken: string,
): AsyncResult<{ userIds: string[] }, 'SYSTEM_ERROR' | 'APPLICATION_USERS_NOT_FOUND'> => {
	const database = getDbInstance();

	const applicationService: ApplicationService = applicationSvc(database);
	const collaboratorsService = await collaboratorsSvc(database);

	const emailLookupFailures: string[] = [];
	const verifiedUserIds: string[] = [];

	// Check if applicant has an active account
	const applicationContents = await applicationService.getApplicationWithContents({ id: applicationId });
	if (!applicationContents.success) {
		return failure('SYSTEM_ERROR', 'Unable to retrieve application contents.');
	}

	const applicantEmail = applicationContents.data.contents?.applicant_institutional_email || '';

	const applicantLookup = await lookupUserByEmail(applicantEmail, approverAccessToken);
	if (!applicantLookup.success) {
		emailLookupFailures.push(applicantEmail);
	} else {
		verifiedUserIds.push(...applicantLookup.data);
	}

	// Check if collaborators have active accounts
	const collaboratorResp = await collaboratorsService.listCollaborators(applicationId);
	if (!collaboratorResp.success) {
		return failure('SYSTEM_ERROR', `Unable to retrieve collaborators: ${collaboratorResp.message}`);
	}
	for (const collaborator of collaboratorResp.data) {
		const collabEmail = collaborator.institutional_email || '';
		const collabLookup = await lookupUserByEmail(collabEmail, approverAccessToken);
		if (!collabLookup.success) {
			emailLookupFailures.push(collabEmail);
		} else {
			verifiedUserIds.push(...collabLookup.data);
		}
	}

	if (emailLookupFailures.length > 0) {
		return failure('APPLICATION_USERS_NOT_FOUND', emailLookupFailures.join('; '));
	}
	return { success: true, data: { userIds: verifiedUserIds } };
};
