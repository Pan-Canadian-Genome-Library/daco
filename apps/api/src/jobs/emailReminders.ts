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

import { ApplicationActions, ApplicationStates, type ApplicationStateValues } from '@pcgl-daco/data-model';

import { getDbInstance } from '@/db/index.js';
import BaseLogger from '@/logger.ts';
import { applicationSvc } from '@/service/applicationService.ts';
import { emailSvc } from '@/service/email/emailsService.ts';
import {
	type ReminderEmailTypes,
	reminderEmailTypeValues,
	reminderTargetActionTypes,
	reminderTargetEmailTypes,
} from '@/service/email/types.ts';
import {
	type ApplicationActionRecord,
	type EmailRecord,
	type JoinedApplicationEmailsActionsRecord,
} from '@/service/types.ts';
import { type EmailTypeValues } from '@pcgl-daco/data-model/src/types.ts';

/**
 * Conditions for sending Application Reminder Emails
 *
 * Applications in states DRAFT, DAC_REVIEW, DAC_REVISIONS_REQUESTED, INSTITUTIONAL_REP_REVIEW, & INSTITUTIONAL_REP_REVISION_REQUESTED
 * are checked nightly at midnight to see if a follow up email needs to be sent, to prompt the next step in the Submission process.
 * The nightly cron function is setup in `/src/scheduler.ts`.
 *
 * The logic compares application state, most recent relevant application action, and the most recent relevant email sent,
 * to determine if an email reminder should be sent.
 *
 * - If the application is in one of the appropriate states requiring action,
 * - And the related Application Action was created 7 days ago (or more),
 * - Or the related Email was sent 7 days ago (or more),
 * - then an Email Reminder should be sent.
 *
 *	Not all Application States, Actions or Email Types require follow up.
 *  Some Application States have multiple associated types of emails or state transitions.
 *
 *	`reminderTargetEmailTypes` represents a map from type of Email Sent, to the relevant Application state(s)
 *	For example, if application is in state INSTITUTIONAL_REP_REVIEW, the application will check for a SUBMIT_DRAFT email record
 * 	If this email was last sent 7 days ago or more, (indicating the draft was submitted 7 days ago and now requires further action)
 *  an additional Reminder email should be sent.
 *
 *  Creating new reminders requires reviewing & confirming the following:
 *	- The relevant Application State is contained in reminderStates so that the application record is reviewed
 *	- The relevant Action or Email Type exists, and is included in reminderTargetActionTypes and/or reminderTargetEmailTypes
 *	- The dateDiffCheck is used with the correct interval definition for your use case
 * 	- A new Email Service method is created to send an Email using the Email Client and create an Email record in the database
 */

const logger = BaseLogger.forModule('Email Reminders');

/**
 * Check if the current date is more than interval days after a specific action date
 * If days passed since action date is greater than the interval, return true, else return false
 */
const dateDiffCheck = ({ actionDate, intervalDays = 7 }: { actionDate: Date; intervalDays?: number }) => {
	const currentDate = new Date();
	const valueOfActionDate = actionDate.valueOf();
	const valueOfCurrentDate = currentDate.valueOf();
	const diff = Math.round((valueOfCurrentDate - valueOfActionDate) / (1000 * 60 * 60 * 24));
	return diff >= intervalDays;
};

/*
 * Type guard to help separate records with targeted Reminder email types from other emails
 */
function isReminderEmailType(emailType: EmailTypeValues): emailType is ReminderEmailTypes {
	const testArray: string[] = [...reminderEmailTypeValues];
	return testArray.includes(emailType);
}

/**
 * Find record for email with target reminder email_type values
 * Used to determine if an application needs a follow up email (not all emails require follow up)
 * Records are pre-sorted by DB so the email should be the most recent
 */
const getRelevantReminderEmail = ({
	sentEmails,
	state,
}: {
	sentEmails: EmailRecord[];
	state: ApplicationStateValues;
}): EmailRecord | undefined => {
	const targetEmail = sentEmails?.find((email) => {
		const emailType = email.email_type;
		if (!isReminderEmailType(emailType)) {
			return false;
		}

		const allowedStates = reminderTargetEmailTypes[emailType];
		if (allowedStates?.includes(state)) {
			return true;
		}

		return false;
	});

	return targetEmail;
};

/*
 * Finds relevant record Action created with target state transition Action value
 * Records are pre-sorted by DB so first result should be most recent
 */
const getRelevantReminderAction = ({
	applicationActions,
	state,
}: {
	applicationActions: ApplicationActionRecord[];
	state: ApplicationStateValues;
}) => {
	const targetActionType = reminderTargetActionTypes[state];
	const mostRecentAction =
		applicationActions?.length && targetActionType
			? applicationActions.find((action) => targetActionType.includes(action.action))
			: null;
	return mostRecentAction;
};

/* List of Application States requiring checks for reminder Emails */
const reminderStates = [
	ApplicationStates.DRAFT,
	ApplicationStates.DAC_REVIEW,
	ApplicationStates.DAC_REVISIONS_REQUESTED,
	ApplicationStates.INSTITUTIONAL_REP_REVIEW,
	ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED,
];

/* Reviews Application, Action & Email details to determine if an Application needs a Reminder Email */
export const scheduleEmailReminders = async () => {
	const database = getDbInstance();
	const applicationService = applicationSvc(database);
	const allApplicationsResult = await applicationService.getEmailActionDetails({
		state: reminderStates,
	});

	if (allApplicationsResult.success) {
		const applications = allApplicationsResult.data;
		for (const application of applications) {
			const { state, created_at, application_actions: applicationActions, sent_emails: sentEmails } = application;

			// Early Draft applications will not have any state transition Action records
			// If Application is in DRAFT (with no previous Actions), check Application created_at Date instead
			// For all other states & actions, confirm if it has been >7 days since the last related state change or reminder email
			const mostRecentAction = applicationActions ? getRelevantReminderAction({ state, applicationActions }) : null;
			const actionDate = mostRecentAction
				? mostRecentAction.created_at
				: state === ApplicationStates.DRAFT
					? created_at
					: null;
			const needsActionReminder = actionDate ? dateDiffCheck({ actionDate }) : false;

			const mostRecentEmail = sentEmails ? getRelevantReminderEmail({ state, sentEmails }) : null;
			const emailDate = mostRecentEmail?.created_at;
			const needsEmailReminder = emailDate ? dateDiffCheck({ actionDate: emailDate }) : false;

			const sendReminder = needsEmailReminder || needsActionReminder;
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
	relatedEmail,
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

		const submittedDate = actionDate;

		// TODO: Lookup contact email Dac table
		// https://github.com/Pan-Canadian-Genome-Library/daco/issues/549
		const dacMemberName = user_name || 'DAC Member';
		const dacEmail = relatedEmail?.recipient_emails[0] || user_id;

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
						to: dacEmail,
					});
				}
				break;
			case ApplicationStates.DAC_REVISIONS_REQUESTED: {
				// Post Dac Revisions Requested, if still not Submitted 7 days later -> send email reminder to Applicant
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
						to: repEmail,
					});
				} else if (relatedAction.action === ApplicationActions.INSTITUTIONAL_REP_SUBMIT) {
					// Post Rep Revisions Submitted, if still in review 7 days later -> send Institutional Rep email reminder
					emailService.sendEmailRepRevisionsReminder({
						id: application_id,
						applicantName,
						submittedDate,
						repName,
						to: repEmail || 'pcgl_email@yopmail.com',
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
	} else {
		logger.error(
			`Error at sendEmailReminders - Missing required application information for application with id ${application_id}`,
		);
	}
};
