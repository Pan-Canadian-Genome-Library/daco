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
import { emailSvc } from '@/service/email/emailsService.ts';

const emailService = await emailSvc();

type AssignUserPermissionsAndNotifyParams = {
	institutionalEmail: string;
	approverAccessToken: string;
	requestedStudies: string[];
	applicationId: number;
	applicantFirstName: string | null | undefined;
};

/**
 * This function assigns user permissions to the requested studies
 * First it looks for the associated PCGL user ID using the institutional email
 * Then it assigns the study permissions using the approver's access token
 * Lastly, it sends an email notification to the user upon successful assignment
 *
 * @param param0
 * @returns
 */
export const assignUserPermissionsAndNotify = async ({
	institutionalEmail,
	approverAccessToken,
	requestedStudies,
	applicationId,
	applicantFirstName,
}: AssignUserPermissionsAndNotifyParams) => {
	const lookup = await lookupUserByEmail(institutionalEmail, approverAccessToken);
	if (!lookup.success || lookup.data.length === 0) return;

	for (const studyId of requestedStudies ?? []) {
		for (const userPcglId of lookup.data) {
			const result = await addUserToStudyPermission(studyId, userPcglId, approverAccessToken);

			if (result.success) {
				emailService.sendEmailApproval({
					id: applicationId,
					to: institutionalEmail,
					name: applicantFirstName || 'N/A',
				});
			}
		}
	}
};
