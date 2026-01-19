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

import { ApplicationStates, ApplicationStateValues, EmailTypes } from '@pcgl-daco/data-model';

import { getDbInstance } from '@/db/index.js';
import BaseLogger from '@/logger.ts';
import { applicationSvc } from '@/service/applicationService.ts';
import { emailSvc } from '@/service/email/emailsService.ts';
import { type ApplicationActionRecord, type ApplicationContentRecord, type EmailRecord } from '@/service/types.ts';

const logger = BaseLogger.forModule('Email Reminders');

const dateDiffCheck = ({
	created_at,
	interval = 7,
	sentEmails = [],
}: {
	created_at: Date;
	sentEmails: EmailRecord[] | null;
	interval?: number;
}) => {
	const actionDate = created_at.getDate();
	const currentDate = new Date().getDate();
	const diff = currentDate - actionDate;
	return diff > interval;
};

export const scheduleEmailReminders = async () => {
	const database = getDbInstance();
	const applicationService = applicationSvc(database);
	const allApplicationsResult = await applicationService.getEmailActionDetails({
		state: [
			ApplicationStates.DRAFT,
			ApplicationStates.DAC_REVIEW,
			ApplicationStates.DAC_REVISIONS_REQUESTED,
			ApplicationStates.INSTITUTIONAL_REP_REVIEW,
			ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED,
		],
	});

	if (allApplicationsResult.success) {
		const applications = allApplicationsResult.data;
		for (const application of applications) {
			// TODO: change to findOne / pageSize 1
			const {
				application_id,
				state,
				application_actions: applicationActions,
				application_contents: applicationContents,
				sent_emails: sentEmails,
			} = application;

			const action = applicationActions ? applicationActions[0] : null;
			if (!action || !applicationContents) {
				logger.error(`Error retrieving actions for application with ID ${application_id}`);
				continue;
			}
			// TODO: add check when last email was sent date w/ matching email type
			const { created_at } = action;
			const sendReminder = dateDiffCheck({ created_at, sentEmails });
			if (sendReminder) {
				sendEmailReminders({ applicationId: application_id, applicationContents, action, state });
			}
		}
	} else {
		console.log(allApplicationsResult);
		throw new Error('Error retrieving applications');
	}
};

export const sendEmailReminders = ({
	applicationId,
	state,
	applicationContents,
	action,
}: {
	applicationId: number;
	state: ApplicationStateValues;
	applicationContents: ApplicationContentRecord;
	action: ApplicationActionRecord;
}) => {
	const database = getDbInstance();
	const emailService = emailSvc(database);

	const { id: application_action_id, created_at, user_name } = action;

	const applicantName = applicationContents.applicant_first_name ?? 'Test User';
	const applicantEmail = applicationContents.applicant_institutional_email ?? 'testUser@email.com';
	const repEmail = applicationContents.institutional_rep_email ?? 'testUser@email.com';
	const dacEmail = applicationContents.institutional_rep_email ?? 'testUser@email.com';

	switch (state) {
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
				application_id: applicationId,
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
				application_id: applicationId,
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
					application_id: applicationId,
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
					application_id: applicationId,
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
				application_id: applicationId,
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
					application_id: applicationId,
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
					application_id: applicationId,
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
