/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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

import { getDbInstance } from '@/db/index.js';
import { emailSvc } from '@/service/email/emailsService.ts';
import { ApplicationActionRecord } from '@/service/types.ts';
import { ApplicationListSummary, ApplicationStates, EmailTypes } from '@pcgl-daco/data-model';

export const sendEmailReminders = ({
	application,
	action,
}: {
	application: ApplicationListSummary;
	action: ApplicationActionRecord;
}) => {
	const database = getDbInstance();
	const emailService = emailSvc(database);

	const { applicant, id: applicationId } = application;
	const { id: application_action_id, created_at, user_name } = action;

	const applicantName = applicant?.firstName ?? 'Test User';
	const applicantEmail = applicant?.email ?? 'testUser@email.com';
	const repEmail = applicant?.email ?? 'testUser@email.com';
	const dacEmail = applicant?.email ?? 'testUser@email.com';

	switch (application.state) {
		case ApplicationStates.DRAFT:
			// if still in draft after 7 days -> send email reminder
			console.log(`\nPlease review & submit your application with ID ${applicationId} with state DRAFT\n`);

			emailService.sendEmailSubmitDraftReminder({
				id: applicationId,
				applicantName,
				submittedDate: created_at,
				repName: 'The Rep',
				to: applicantEmail,
			});
			emailService.createEmailRecord({
				application_action_id,
				email_type: EmailTypes.REMINDER_SUBMIT_DRAFT,
				recipient_emails: [applicantEmail],
			});
			break;
		case ApplicationStates.DAC_REVIEW:
			// Post Submit Rep Review, Application has moved to Dac Review, if still in review 7 days later -> send email reminder
			console.log(`\nPlease review & submit your application with ID ${applicationId} in state Dac Review\n`);
			emailService.sendEmailDacReviewReminder({
				id: applicationId,
				applicantName,
				submittedDate: created_at,
				to: dacEmail,
			});
			emailService.createEmailRecord({
				application_action_id,
				email_type: EmailTypes.REMINDER_SUBMIT_DAC_REVIEW,
				recipient_emails: [dacEmail],
			});
			break;
		case ApplicationStates.DAC_REVISIONS_REQUESTED: {
			if (user_name === 'APPLICANT') {
				// Post Dac Revisions Submitted, if still not submitted 7 days later -> send email reminder
				console.log(
					`\nPlease review & submit your application with ID ${applicationId} and state Dac Revision Requested\n`,
				);
				emailService.sendEmailSubmitDacRevisionsReminder({
					id: applicationId,
					applicantName,
					repName: 'Mr Rep',
					submittedDate: created_at,
					to: applicantEmail,
				});
				emailService.createEmailRecord({
					application_action_id,
					email_type: EmailTypes.REMINDER_SUBMIT_REVISIONS_DAC_REVIEW,
					recipient_emails: [applicantEmail],
				});
			} else if (user_name === 'DAC_MEMBER') {
				// Post Dac Revisions Requested, if still in review 7 days later -> send email reminder
				console.log(
					`\nPlease review & submit your application with ID ${applicationId} with state Dac Revision Requested\n`,
				);
				emailService.sendEmailDacRevisionsReminder({
					id: applicationId,
					applicantName,
					submittedDate: created_at,
					repName: 'Mr Rep',
					to: applicantEmail,
				});
				emailService.createEmailRecord({
					application_action_id,
					email_type: EmailTypes.REMINDER_REQUEST_REVISIONS_DAC_REVIEW,
					recipient_emails: [dacEmail],
				});
			}
			break;
		}
		case ApplicationStates.INSTITUTIONAL_REP_REVIEW:
			// Post Submit Draft, Application has moved to Rep Review, if still in review 7 days later -> send email reminder
			console.log(`\nPlease review & submit your application with ID ${applicationId} and state Rep Review\n`);
			emailService.sendEmailRepReviewReminder({
				id: applicationId,
				applicantName,
				submittedDate: created_at,
				repName: 'Mr Rep',
				to: applicantEmail,
			});
			emailService.createEmailRecord({
				application_action_id,
				email_type: EmailTypes.REMINDER_SUBMIT_INSTITUTIONAL_REP_REVIEW,
				recipient_emails: [applicantEmail],
			});
			break;
		case ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED: {
			if (action.user_name === 'APPLICANT') {
				// Post Rep Revisions Requested, if still in review 7 days later -> send email reminder
				console.log(
					`\nPlease review & submit your application with ID ${applicationId} and state Rep Revision Requested\n`,
				);
				emailService.sendEmailSubmitRepRevisionsReminder({
					id: applicationId,
					applicantName,
					submittedDate: created_at,
					repName: 'Mr Rep',
					to: applicantEmail,
				});
				emailService.createEmailRecord({
					application_action_id,
					email_type: EmailTypes.REMINDER_SUBMIT_REVISIONS_INSTITUTIONAL_REP,
					recipient_emails: [applicantEmail],
				});
			} else if (action.user_name === 'INSTITUTIONAL_REP') {
				// Post Rep Revisions Submitted, if still in review 7 days later -> send email reminder
				console.log(
					`\nPlease review & submit your application with ID ${applicationId} and state Rep Revision Requested\n`,
				);
				emailService.sendEmailRepRevisionsReminder({
					id: applicationId,
					applicantName,
					submittedDate: created_at,
					repName: 'Mr Rep',
					to: repEmail,
				});
				emailService.createEmailRecord({
					application_action_id,
					email_type: EmailTypes.REMINDER_REQUEST_REVISIONS_INSTITUTIONAL_REP,
					recipient_emails: [repEmail],
				});
			}
			break;
		}
		default:
			break;
	}
};
