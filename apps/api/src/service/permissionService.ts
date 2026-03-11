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

import { addUsersToStudyPermission } from '@/external/pcglAuthZClient.ts';

import type { GrantUserPermissionsParams, GrantUserPermissionsResult } from './types.ts';

/**
 * This function grants user access to the requested studies
 * For each study, the AuthZ service is called using the approver's access token
 * to assign permissions to the provided list of user email addresses.
 * Returns the list of successfully granted user emails and any failure messages
 */
export const grantUserPermissions = async ({
	userEmails,
	approverAccessToken,
	studyIds,
}: GrantUserPermissionsParams): Promise<GrantUserPermissionsResult> => {
	const failureMessages: string[] = [];
	const successfulUserEmails = new Set<string>();
	for (const studyId of studyIds) {
		const result = await addUsersToStudyPermission(studyId, userEmails, approverAccessToken);
		if (!result.success) {
			failureMessages.push(result.message);
		} else {
			result.data.success.forEach((email) => successfulUserEmails.add(email));
			if (Array.isArray(result.data.error)) {
				result.data.error.forEach((error) => failureMessages.push(error));
			} else if (result.data.error) {
				failureMessages.push(result.data.error);
			}
		}
	}

	return { successfulUserEmails: Array.from(successfulUserEmails), errorMessages: failureMessages };
};
