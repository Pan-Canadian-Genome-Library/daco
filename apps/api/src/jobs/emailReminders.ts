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
import { type ApplicationActionRecord, type ApplicationContentRecord, type EmailRecord } from '@/service/types.ts';

const logger = BaseLogger.forModule('Email Reminders');

const dateDiffCheck = ({ actionDate, interval = 7 }: { actionDate: Date | null; interval?: number }) => {
	if (!actionDate) return false;
	const currentDate = new Date().getDate();
	const comparisonDate = actionDate.getDate();
	const diff = currentDate - comparisonDate;
	return diff >= interval;
};

const getMostRecentEmail = ({
	sentEmails,
	state,
}: {
	sentEmails: EmailRecord[] | null;
	state: ApplicationStateValues;
}) => {
	// Lookup most recent reminder email sent for current state, then confirm if it was sent >7 days ago
	// If no reminder email was sent, see how long it has been in the current application state, and send a reminder if it has been in this state for >7 days
	let targetEmailTypes: Partial<{ [k in ApplicationStateValues]: EmailTypeValues }> = {
		[ApplicationStates.INSTITUTIONAL_REP_REVIEW]: EmailTypes.REMINDER_SUBMIT_INSTITUTIONAL_REP_REVIEW,
		[ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED]: EmailTypes.REMINDER_REQUEST_REVISIONS_INSTITUTIONAL_REP,
		[ApplicationStates.DAC_REVIEW]: EmailTypes.REMINDER_SUBMIT_DAC_REVIEW,
		[ApplicationStates.DAC_REVISIONS_REQUESTED]: EmailTypes.REMINDER_REQUEST_REVISIONS_DAC_REVIEW,
	};
	const targetEmailType = targetEmailTypes[state];
	const mostRecentEmail =
		(sentEmails
			? sentEmails.length > 1
				? sentEmails.find((email) => email.email_type === targetEmailType)
				: sentEmails[0]
			: null) || null;
	return mostRecentEmail;
};

const checkForEmailReminders = ({ mostRecentEmail }: { mostRecentEmail: EmailRecord | null }) => {
	const mostRecentEmailDate = mostRecentEmail?.created_at || null;
	return mostRecentEmailDate && dateDiffCheck({ actionDate: mostRecentEmailDate });
};

const getMostRecentAction = ({
	applicationActions,
	state,
}: {
	applicationActions: ApplicationActionRecord[] | null;
	state: ApplicationStateValues;
}) => {
	let targetActionTypes: Partial<{ [k in ApplicationStateValues]: ApplicationActionValues }> = {
		[ApplicationStates.INSTITUTIONAL_REP_REVIEW]: ApplicationActions.SUBMIT_DRAFT,
		[ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED]: ApplicationActions.INSTITUTIONAL_REP_REVISION_REQUEST,
		[ApplicationStates.DAC_REVIEW]: ApplicationActions.INSTITUTIONAL_REP_SUBMIT,
		[ApplicationStates.DAC_REVISIONS_REQUESTED]: ApplicationActions.DAC_REVIEW_REVISION_REQUEST,
	};
	const targetActionType = targetActionTypes[state];
	const mostRecentAction =
		(applicationActions
			? applicationActions.length > 1
				? applicationActions.find((action) => action.action === targetActionType)
				: applicationActions[0]
			: null) || null;
	return mostRecentAction;
};

const checkForActionReminders = ({ mostRecentAction }: { mostRecentAction: ApplicationActionRecord | null }) => {
	const mostRecentActionDate = mostRecentAction?.created_at || null;
	return mostRecentActionDate && dateDiffCheck({ actionDate: mostRecentActionDate });
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
				application_id: applicationId,
				state,
				created_at: createdAt,
				application_actions: applicationActions,
				application_contents: applicationContents,
				sent_emails: sentEmails,
			} = application;

			if (state === ApplicationStates.DRAFT) {
				// If Application is still in DRAFT 7 days after creation, send a reminder email
				const sendReminder = dateDiffCheck({ actionDate: createdAt });
				if (sendReminder) {
					sendEmailReminders({
						applicationId,
						applicationContents,
						createdAt,
						state,
						action: null,
					});
				}
			} else {
				// For all other states, confirm if it has been >7 days since the last related reminder email or state change
				const mostRecentEmail = getMostRecentEmail({ state, sentEmails });
				const needsEmailReminder = checkForEmailReminders({ mostRecentEmail });
				const mostRecentAction = getMostRecentAction({ state, applicationActions });
				const needsStateReminder = checkForActionReminders({ mostRecentAction });
				const sendReminder = needsEmailReminder || needsStateReminder;
				if (sendReminder) {
					sendEmailReminders({
						applicationId,
						state,
						createdAt,
						applicationContents,
						action: mostRecentAction,
					});
				}
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
	createdAt,
	applicationContents,
	action,
}: {
	applicationId: number;
	createdAt: Date;
	state: ApplicationStateValues;

	applicationContents: ApplicationContentRecord | null;
	action: ApplicationActionRecord | null;
}) => {
	const database = getDbInstance();
	const emailService = emailSvc(database);

	const { id: application_action_id, created_at: actionDate, user_name } = action || {};
	// TODO: Correct these definitions
	const applicantName = applicationContents?.applicant_first_name ?? 'Test User';
	const applicantEmail = applicationContents?.applicant_institutional_email ?? 'testUser@email.com';
	const repEmail = applicationContents?.institutional_rep_email ?? 'testUser@email.com';
	const repName = `${applicationContents?.institutional_rep_first_name} ${applicationContents?.institutional_rep_last_name}`;
	const dacEmail = applicationContents?.institutional_rep_email ?? 'testUser@email.com';
	const submittedDate = actionDate || createdAt;

	switch (state) {
		case ApplicationStates.DRAFT:
			// if still in draft after 7 days -> send email reminder
			console.log(`\nPlease review & submit your application with ID ${applicationId} with state DRAFT\n`);
			emailService.sendEmailSubmitDraftReminder({
				id: applicationId,
				actionId: application_action_id,
				applicantName,
				submittedDate,
				repName,
				to: applicantEmail,
			});

			break;
		case ApplicationStates.DAC_REVIEW:
			// Post Submit Rep Review, Application has moved to Dac Review, if still in review 7 days later -> send email reminder
			console.log(`\nPlease review & submit your application with ID ${applicationId} in state Dac Review\n`);
			emailService.sendEmailDacReviewReminder({
				id: applicationId,
				applicantName,
				repName,
				submittedDate,
				to: dacEmail,
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
					submittedDate,
					to: applicantEmail,
				});
			} else if (user_name === 'DAC_MEMBER') {
				// Post Dac Revisions Requested, if still in review 7 days later -> send email reminder
				console.log(
					`\nPlease review & submit your application with ID ${applicationId} with state Dac Revision Requested\n`,
				);
				emailService.sendEmailDacRevisionsReminder({
					id: applicationId,
					applicantName,
					submittedDate,
					repName: 'Mr Rep',
					to: applicantEmail,
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
				actionId: application_action_id,
				repName,
				to: applicantEmail,
			});
			break;
		case ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED: {
			if (action?.user_name === 'APPLICANT') {
				// Post Rep Revisions Requested, if still in review 7 days later -> send email reminder
				console.log(
					`\nPlease review & submit your application with ID ${applicationId} and state Rep Revision Requested\n`,
				);
				emailService.sendEmailSubmitRepRevisionsReminder({
					id: applicationId,
					applicantName,
					submittedDate,
					repName: 'Mr Rep',
					to: applicantEmail,
				});
			} else if (action?.user_name === 'INSTITUTIONAL_REP') {
				// Post Rep Revisions Submitted, if still in review 7 days later -> send email reminder
				console.log(
					`\nPlease review & submit your application with ID ${applicationId} and state Rep Revision Requested\n`,
				);
				emailService.sendEmailRepRevisionsReminder({
					id: applicationId,
					applicantName,
					submittedDate,
					repName: 'Mr Rep',
					to: repEmail,
				});
			}
			break;
		}
		default:
			break;
	}
};
