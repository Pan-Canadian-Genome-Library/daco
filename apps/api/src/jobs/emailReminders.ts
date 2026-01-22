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

import {
	ApplicationActions,
	ApplicationActionValues,
	ApplicationStates,
	ApplicationStateValues,
	EmailTypes,
	EmailTypeValues,
} from '@pcgl-daco/data-model';

import { getDbInstance } from '@/db/index.js';
import BaseLogger from '@/logger.ts';
import { applicationSvc } from '@/service/applicationService.ts';
import { emailSvc } from '@/service/email/emailsService.ts';
import {
	type ApplicationActionRecord,
	type EmailRecord,
	type JoinedApplicationEmailsActionsRecord,
} from '@/service/types.ts';

const logger = BaseLogger.forModule('Email Reminders');

// Compare a supplied email or action date (measured in Days) against an interval value
// If days passed since action date is greater than the interval, return true, else return false
const dateDiffCheck = ({ actionDate, interval = 7 }: { actionDate: Date; interval?: number }) => {
	const currentDate = new Date().getDate();
	const comparisonDate = actionDate.getDate();
	const diff = currentDate - comparisonDate;
	return diff >= interval;
};

// Dictionary matching Reminder Email subjects to the triggering Application State
// Rep Review and Dac Review states can trigger multiple Reminder Email types depending on the previous action
const targetEmailTypes: Partial<{ [k in ApplicationStateValues]: EmailTypeValues | EmailTypeValues[] }> = {
	[ApplicationStates.DRAFT]: EmailTypes.REMINDER_SUBMIT_DRAFT,
	[ApplicationStates.INSTITUTIONAL_REP_REVIEW]: [
		EmailTypes.REMINDER_SUBMIT_INSTITUTIONAL_REP_REVIEW,
		EmailTypes.REMINDER_SUBMIT_REVISIONS_INSTITUTIONAL_REP,
	],
	[ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED]: EmailTypes.REMINDER_REQUEST_REVISIONS_INSTITUTIONAL_REP,
	[ApplicationStates.DAC_REVIEW]: [
		EmailTypes.REMINDER_SUBMIT_DAC_REVIEW,
		EmailTypes.REMINDER_SUBMIT_REVISIONS_DAC_REVIEW,
	],
	[ApplicationStates.DAC_REVISIONS_REQUESTED]: EmailTypes.REMINDER_REQUEST_REVISIONS_DAC_REVIEW,
};

// Find record for most recent relevant email created with target email_type value
const getMostRecentEmail = ({
	sentEmails,
	state,
}: {
	sentEmails: EmailRecord[] | null;
	state: ApplicationStateValues;
}) => {
	const targetEmailType = targetEmailTypes[state];
	const mostRecentEmail =
		sentEmails?.length && targetEmailType
			? sentEmails.find((email) =>
					typeof targetEmailType === 'string'
						? email.email_type === targetEmailType
						: targetEmailType.includes(email.email_type),
				)
			: null;
	return mostRecentEmail || null;
};

// Return true if a relevant email record exists and was created
const checkForEmailReminders = ({ emailDate }: { emailDate: Date | null }) => {
	return !!emailDate && dateDiffCheck({ actionDate: emailDate });
};

// Dictionary matching Application State values to related triggering State Transition Action values
// Rep Review and Dac Review states can be triggered by multiple potential State Transitions
const targetActionTypes: Partial<{
	[k in ApplicationStateValues]: ApplicationActionValues | ApplicationActionValues[];
}> = {
	[ApplicationStates.DRAFT]: ApplicationActions.WITHDRAW,
	[ApplicationStates.INSTITUTIONAL_REP_REVIEW]: [
		ApplicationActions.SUBMIT_DRAFT,
		ApplicationActions.INSTITUTIONAL_REP_SUBMIT,
	],
	[ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED]: ApplicationActions.INSTITUTIONAL_REP_REVISION_REQUEST,
	[ApplicationStates.DAC_REVIEW]: [ApplicationActions.INSTITUTIONAL_REP_SUBMIT, ApplicationActions.DAC_REVIEW_SUBMIT],
	[ApplicationStates.DAC_REVISIONS_REQUESTED]: ApplicationActions.DAC_REVIEW_REVISION_REQUEST,
};

// Find record for most recent relevant Action created with target state transition Action value
const getMostRecentAction = ({
	applicationActions,
	state,
}: {
	applicationActions: ApplicationActionRecord[] | null;
	state: ApplicationStateValues;
}) => {
	const targetActionType = targetActionTypes[state];
	const mostRecentAction =
		applicationActions?.length && targetActionType
			? applicationActions.find((action) =>
					typeof targetActionType === 'string'
						? action.action === targetActionType
						: targetActionType.includes(action.action),
				)
			: null;
	return mostRecentAction || null;
};

const checkForActionReminders = ({ actionDate }: { actionDate: Date | null }) => {
	return !!actionDate && dateDiffCheck({ actionDate });
};

// Reviews Application, Action & Email details to determine if an Application needs a Reminder Email
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
			const { state, created_at, application_actions: applicationActions, sent_emails: sentEmails } = application;

			// Early Draft applications will not have any state transition Action records
			// If Application is in DRAFT 7 days after creation (with no previous Actions), check created_at Date
			// For all other states, confirm if it has been >7 days since the last related state change or reminder email
			const mostRecentAction = getMostRecentAction({ state, applicationActions });
			const actionDate = mostRecentAction
				? mostRecentAction.created_at
				: state === ApplicationStates.DRAFT
					? created_at
					: null;
			const needsStateReminder = checkForActionReminders({ actionDate });

			const mostRecentEmail = getMostRecentEmail({ state, sentEmails });
			const emailDate = mostRecentEmail?.created_at || null;
			const needsEmailReminder = checkForEmailReminders({ emailDate });

			const sendReminder = needsEmailReminder || needsStateReminder;
			if (sendReminder) {
				sendEmailReminders({
					application,
					relatedAction: mostRecentAction,
					relatedEmail: mostRecentEmail,
				});
			}
		}
	} else {
		const { error, message } = allApplicationsResult;
		logger.error(message, error);
		throw new Error(message);
	}
};

// Generates & Sends Reminder Emails based on Application State
export const sendEmailReminders = ({
	application,
	relatedAction,
}: {
	application: JoinedApplicationEmailsActionsRecord;
	relatedAction?: ApplicationActionRecord | null;
	relatedEmail?: EmailRecord | null;
}) => {
	const database = getDbInstance();
	const emailService = emailSvc(database);
	const { application_id, state, created_at, application_contents } = application;
	const { id: application_action_id, created_at: actionDate, user_name, user_id } = relatedAction || {};

	if (state === ApplicationStates.DRAFT) {
		// If in State Draft for over 7 days, send a reminder email to Submit
		const { applicant_first_name, applicant_last_name, applicant_institutional_email } = application_contents || {};

		const applicantName = applicant_first_name
			? `${applicant_first_name} ${applicant_last_name || ''}`.trim()
			: 'Applicant';

		emailService.sendEmailSubmitDraftReminder({
			id: application_id,
			actionId: application_action_id,
			applicantName,
			submittedDate: actionDate || created_at,
			to: applicant_institutional_email,
		});
	} else if (
		// All post-Draft Applications should have Application Contents and at least one Action record
		!!application_contents &&
		!!relatedAction &&
		actionDate !== undefined &&
		application_action_id !== undefined
	) {
		const {
			applicant_first_name,
			applicant_last_name,
			applicant_institutional_email: applicantEmail,
			institutional_rep_first_name,
			institutional_rep_last_name,
			institutional_rep_email: repEmail,
		} = application_contents;

		const applicantName = applicant_first_name
			? `${applicant_first_name} ${applicant_last_name || ''}`.trim()
			: 'Applicant';
		const repName = institutional_rep_first_name
			? `${institutional_rep_first_name} ${institutional_rep_last_name || ''}`.trim()
			: 'Representative';

		// TODO: Need to Define Approach for Dac Member Names & Emails
		const dacEmail = user_id ?? 'pcgl_email@yopmail.com';
		const dacMemberName = user_name ? user_name : 'Dac Member';
		const submittedDate = actionDate;

		switch (state) {
			case ApplicationStates.DAC_REVIEW:
				if (relatedAction.action === ApplicationActions.INSTITUTIONAL_REP_SUBMIT) {
					// Post Institutional Rep Submission, Application has moved to Dac Review
					// If still in review 7 days later -> send email reminder to Dac Member
					emailService.sendEmailDacReviewReminder({
						id: application_id,
						applicantName,
						actionId: application_action_id,
						repName: dacMemberName,
						submittedDate,
						to: dacEmail,
					});
				} else if (relatedAction.action === ApplicationActions.DAC_REVIEW_SUBMIT) {
					// Post Dac Revisions Submitted, Application has moved back to Dac Review
					// If still in review 7 days later -> send email reminder to Dac Member
					emailService.sendEmailDacRevisionsReminder({
						id: application_id,
						actionId: application_action_id,
						applicantName,
						submittedDate,
						repName: dacMemberName,
						to: applicantEmail,
					});
				}
				break;
			case ApplicationStates.DAC_REVISIONS_REQUESTED: {
				// Post Dac Revisions Requested, if still not Subbmitted 7 days later -> send email reminder to Applicant
				emailService.sendEmailSubmitDacRevisionsReminder({
					id: application_id,
					actionId: application_action_id,
					applicantName,
					repName: dacMemberName,
					submittedDate,
					to: applicantEmail,
				});
				break;
			}
			case ApplicationStates.INSTITUTIONAL_REP_REVIEW:
				if (relatedAction.action === ApplicationActions.SUBMIT_DRAFT) {
					// Post Submit Draft, Application has moved to Rep Review
					// If still in review 7 days later -> send email reminder to Institutional Rep
					emailService.sendEmailRepReviewReminder({
						id: application_id,
						applicantName,
						actionId: application_action_id,
						repName,
						submittedDate,
						to: applicantEmail,
					});
				} else if (relatedAction.action === ApplicationActions.INSTITUTIONAL_REP_SUBMIT) {
					// Post Rep Revisions Submitted, if still in review 7 days later -> send Institutional Rep email reminder
					emailService.sendEmailRepRevisionsReminder({
						id: application_id,
						applicantName,
						submittedDate,
						repName,
						to: repEmail,
					});
				}
				break;
			case ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED:
				// Post Rep Revisions Requested, if still in review 7 days later -> send Applicant email reminder
				emailService.sendEmailSubmitRepRevisionsReminder({
					id: application_id,
					applicantName,
					actionId: application_action_id,
					submittedDate,
					repName,
					to: applicantEmail,
				});

				break;
			default:
				break;
		}
	}
};
