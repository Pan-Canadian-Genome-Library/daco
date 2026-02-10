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

import { addUserToStudyPermission, lookupUserByEmail } from '@/external/pcglAuthZClient.ts';

import type { GrantUserPermissionsParams, GrantUserPermissionsResult } from './types.ts';

/**
 * This function grants a user access to the requested studies
 * First, it looks for the associated PCGL user ID using the institutional email
 * Then, it grants the study permissions using the approver's access token
 * Returns the list of successfully granted study IDs and any failure messages
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
