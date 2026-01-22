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

const dateDiffCheck = ({ actionDate, interval = 7 }: { actionDate: Date | null; interval?: number }) => {
	if (!actionDate) return false;
	const currentDate = new Date().getDate();
	const comparisonDate = actionDate.getDate();
	const diff = currentDate - comparisonDate;
	return diff >= interval;
};

const targetEmailTypes: Partial<{ [k in ApplicationStateValues]: EmailTypeValues }> = {
	[ApplicationStates.INSTITUTIONAL_REP_REVIEW]: EmailTypes.REMINDER_SUBMIT_INSTITUTIONAL_REP_REVIEW,
	[ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED]: EmailTypes.REMINDER_REQUEST_REVISIONS_INSTITUTIONAL_REP,
	[ApplicationStates.DAC_REVIEW]: EmailTypes.REMINDER_SUBMIT_DAC_REVIEW,
	[ApplicationStates.DAC_REVISIONS_REQUESTED]: EmailTypes.REMINDER_REQUEST_REVISIONS_DAC_REVIEW,
};

const getMostRecentEmail = ({
	sentEmails,
	state,
}: {
	sentEmails: EmailRecord[] | null;
	state: ApplicationStateValues;
}) => {
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

const targetActionTypes: Partial<{ [k in ApplicationStateValues]: ApplicationActionValues }> = {
	[ApplicationStates.INSTITUTIONAL_REP_REVIEW]: ApplicationActions.SUBMIT_DRAFT,
	[ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED]: ApplicationActions.INSTITUTIONAL_REP_REVISION_REQUEST,
	[ApplicationStates.DAC_REVIEW]: ApplicationActions.INSTITUTIONAL_REP_SUBMIT,
	[ApplicationStates.DAC_REVISIONS_REQUESTED]: ApplicationActions.DAC_REVIEW_REVISION_REQUEST,
};

const getMostRecentAction = ({
	applicationActions,
	state,
}: {
	applicationActions: ApplicationActionRecord[] | null;
	state: ApplicationStateValues;
}) => {
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
			const {
				state,
				created_at: createdAt,
				application_actions: applicationActions,
				sent_emails: sentEmails,
			} = application;

			if (state === ApplicationStates.DRAFT) {
				// TODO: Handle Withdrawn vs New Application
				// If Application is still in DRAFT 7 days after creation, send a reminder email
				const sendReminder = dateDiffCheck({ actionDate: createdAt });
				if (sendReminder) {
					sendEmailReminders({
						application,
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
						application,
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
	application,
	action,
}: {
	application: JoinedApplicationEmailsActionsRecord;
	action: ApplicationActionRecord | null;
}) => {
	const database = getDbInstance();
	const emailService = emailSvc(database);
	const { application_id, state, created_at, application_contents } = application;
	const { id: application_action_id, created_at: actionDate, user_name, user_id } = action || {};

	if (state === ApplicationStates.DRAFT) {
		const { applicant_first_name, applicant_last_name, applicant_institutional_email } = application_contents || {};

		const applicantName = applicant_first_name
			? `${applicant_first_name} ${applicant_last_name || ''}`.trim()
			: 'Applicant';

		// if still in draft after 7 days -> send email reminder
		emailService.sendEmailSubmitDraftReminder({
			id: application_id,
			actionId: application_action_id,
			applicantName,
			submittedDate: actionDate || created_at,
			to: applicant_institutional_email,
		});
	} else if (
		application_contents !== null &&
		action !== null &&
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
		// TODO: Need to Define Approach for Dac Member
		const dacEmail = user_id ?? 'pcgl_email@yopmail.com';
		const dacMemberName = user_name ? user_name : 'Dac Member';
		const submittedDate = actionDate;

		switch (state) {
			case ApplicationStates.DAC_REVIEW:
				// Post Submit Rep Review, Application has moved to Dac Review, if still in review 7 days later -> send email reminder
				emailService.sendEmailDacReviewReminder({
					id: application_id,
					applicantName,
					actionId: application_action_id,
					repName: dacMemberName,
					submittedDate,
					to: dacEmail,
				});

				break;
			case ApplicationStates.DAC_REVISIONS_REQUESTED: {
				// TODO: Check Action type
				if (user_name === 'APPLICANT') {
					// Post Dac Revisions Submitted, if still not submitted 7 days later -> send email reminder
					emailService.sendEmailSubmitDacRevisionsReminder({
						id: application_id,
						actionId: application_action_id,
						applicantName,
						repName: dacMemberName,
						submittedDate,
						to: applicantEmail,
					});
				} else if (user_name === 'DAC_MEMBER') {
					// Post Dac Revisions Requested, if still in review 7 days later -> send email reminder
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
			}
			case ApplicationStates.INSTITUTIONAL_REP_REVIEW:
				// Post Submit Draft, Application has moved to Rep Review, if still in review 7 days later -> send email reminder
				emailService.sendEmailRepReviewReminder({
					id: application_id,
					applicantName,
					actionId: application_action_id,
					repName,
					submittedDate,
					to: applicantEmail,
				});
				break;
			case ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED: {
				// TODO: Check Action type
				if (action.user_name === 'APPLICANT') {
					// Post Rep Revisions Requested, if still in review 7 days later -> send Applicant email reminder
					emailService.sendEmailSubmitRepRevisionsReminder({
						id: application_id,
						applicantName,
						actionId: application_action_id,
						submittedDate,
						repName,
						to: applicantEmail,
					});
				} else if (action.user_name === 'INSTITUTIONAL_REP') {
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
			}
			default:
				break;
		}
	}
};
