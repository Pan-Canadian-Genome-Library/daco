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

import { addDacAuthorizations, removeDacAuthorizations } from '@/external/pcglAuthZClient.ts';

import type {
	GrantDacAuthorizationsParams,
	GrantDacAuthorizationsResult,
	RevokeDacAuthorizationsParams,
	RevokeDacAuthorizationsResult,
} from './types.ts';

/**
 * This function adds dac_authorizations to the requested studies
 * For each study, the AuthZ service is called using the approver's access token
 * Returns the ids of the studies that were successfully updated and any failure messages
 */
export const grantDacAuthorizations = async ({
	applicationId,
	applicantEmail,
	approverAccessToken,
	collaboratorEmails,
	studyIds,
}: GrantDacAuthorizationsParams): Promise<GrantDacAuthorizationsResult> => {
	const failureMessages: string[] = [];
	const successfulStudyIds: string[] = [];
	for (const studyId of studyIds) {
		const result = await addDacAuthorizations({
			applicantEmail,
			applicationId,
			approverAccessToken,
			collaboratorEmails,
			studyId,
		});
		if (!result.success) {
			failureMessages.push(result.message);
		} else {
			successfulStudyIds.push(studyId);
		}
	}

	return { successfulStudyIds, errorMessages: failureMessages };
};

/**
 * This function removes the dac_authorizations of an application from the requested studies
 * For each study, the AuthZ service is called using the user's access token
 * Returns the ids of the studies that were successfully updated and any failure messages
 */
export const revokeDacAuthorizations = async ({
	applicationId,
	accessToken,
	studyIds,
}: RevokeDacAuthorizationsParams): Promise<RevokeDacAuthorizationsResult> => {
	const failureMessages: string[] = [];
	const successfulStudyIds: string[] = [];
	for (const studyId of studyIds) {
		const result = await removeDacAuthorizations({ applicationId, accessToken, studyId });
		if (!result.success) {
			failureMessages.push(result.message);
		} else {
			successfulStudyIds.push(studyId);
		}
	}

	return { successfulStudyIds, errorMessages: failureMessages };
};
