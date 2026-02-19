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

import {
	ApplicationActions,
	type ApplicationActionValues,
	ApplicationStates,
	type ApplicationStateValues,
	EmailTypes,
	type EmailTypeValues,
} from '@pcgl-daco/data-model';
import { type RevisionRequestModel } from '../types.ts';

// TODO: Likely to be refactored once we add translations
export const EmailSubjects = {
	INSTITUTIONAL_REP_REVIEW_REQUEST: 'Review Request for PCGL DACO Application',
	NOTIFY_APPLICANT_REP_SUBMIT_DAC_REVIEW: ' Your PCGL DACO Application Has Been Submitted for DAC Review',
	NOTIFY_DAC_REVIEW_REVISIONS: 'Request for DAC Review of PCGL DACO Application',
	NOTIFY_REVISION: 'Revisions Requested on Your PCGL DACO Application',
	NOTIFY_APPROVAL: 'Congratulations! Your DACO Application Has Been Approved',
	DACO_APPLICATION_STATUS: 'DACO Application Status',
	DACO_APPLICATION_STATUS_UPDATE: 'DACO Application Status Update',
	REMINDER_SUBMIT_DRAFT: 'Please Complete Your DACO Application',
	REMINDER_SUBMIT_REVIEW: 'Reminder: Pending Application Review Required',
	REMINDER_SUBMIT_REVISIONS: 'Reminder: Action Required – Revisions Requested on Your Application',
	REMINDER_REVIEW_SUBMITTED_REVISIONS: 'Reminder: Revised Application Awaiting Your Review',
} as const;

export type EmailSubjectsType = (typeof EmailSubjects)[keyof typeof EmailSubjects];

export type BaseEmailType = {
	to?: string | null;
	lang?: string;
};

export type EmailReminderTemplateType = {
	id: string | number;
	actionId?: number;
	applicantName?: string;
	repName?: string;
	userName?: string;
	message?: string;
	state?: string;
	submittedDate?: Date | string;
};

export type GenerateInstitutionalRepType = {
	id: string | number;
	repName: string;
	actionId?: number;
	applicantName: string;
	submittedDate: Date | string;
	// NOTE: sign up url for the institutional rep, subject to change
	registerUrl?: string;
} & BaseEmailType;

export type GenerateRejectType = {
	id: string | number;
	actionId: number;
	name: string;
	comment: string;
} & BaseEmailType;

export type GenerateApproveType = {
	id: string | number;
	actionId: number;
	name: string;
	lang?: string;
} & BaseEmailType;

export type GenerateDacRevisionType = {
	id: string | number;
	actionId: number;
	applicantName: string;
	submittedDate: Date | string;
} & BaseEmailType;

export type GenerateApplicantRevisionType = {
	id: string | number;
	actionId: number;
	applicantName: string;
	comments: RevisionRequestModel;
} & BaseEmailType;

export type GenerateApplicantRepRevisionType = {
	id: string | number;
	actionId: number;
	applicantName: string;
	institutionalRepFirstName: string;
	institutionalRepLastName: string;
	comments: RevisionRequestModel;
} & BaseEmailType;

export type GenerateClosedType = {
	id: string | number;
	actionId: number;
	applicantName: string;
	userName: string;
	submittedDate: Date | string;
	state: string;
	message: string;
} & BaseEmailType;

export type GenerateRevokeType = {
	id: string | number;
	name: string;
	comment: string;
} & BaseEmailType;

export type GenerateDraftReminderEmailType = {
	id: string | number;
	actionId?: number;
	applicantName: string;
	submittedDate: Date | string;
} & BaseEmailType;

export type GenerateSubmitRevisionReminderEmailType = {
	id: string | number;
	applicantName: string;
	actionId: number;
	repName: string;
	submittedDate: Date | string;
} & BaseEmailType;

export type GenerateRevisionReminderEmailType = {
	id: string | number;
	actionId: number;
	repName: string;
	submittedDate: Date | string;
} & BaseEmailType;

export type GenerateReviewReminderEmailType = {
	id: string | number;
	applicantName: string;
	actionId: number;
	repName: string;
	submittedDate: Date | string;
} & BaseEmailType;

export type AllEmailsStateMapping = Record<EmailTypeValues, ApplicationStateValues[]>;

export type ReminderEmailTypes = Extract<
	EmailTypeValues,
	| typeof EmailTypes.REMINDER_SUBMIT_DRAFT
	| typeof EmailTypes.REMINDER_SUBMIT_INSTITUTIONAL_REP_REVIEW
	| typeof EmailTypes.REMINDER_SUBMIT_REVISIONS_INSTITUTIONAL_REP
	| typeof EmailTypes.NOTIFY_APPLICANT_REP_REVISIONS
	| typeof EmailTypes.REMINDER_REQUEST_REVISIONS_INSTITUTIONAL_REP
	| typeof EmailTypes.REMINDER_SUBMIT_DAC_REVIEW
	| typeof EmailTypes.REMINDER_SUBMIT_REVISIONS_DAC_REVIEW
	| typeof EmailTypes.REMINDER_REVIEW_SUBMITTED_REVISIONS
	| typeof EmailTypes.NOTIFY_APPLICANT_DAC_REVISIONS
	| typeof EmailTypes.REMINDER_REQUEST_REVISIONS_DAC_REVIEW
	| typeof EmailTypes.SUBMIT_DRAFT
	| typeof EmailTypes.REQUEST_REVISIONS_INSTITUTIONAL_REP
	| typeof EmailTypes.REQUEST_REVISIONS_DAC_REVIEW
	| typeof EmailTypes.SUBMIT_INSTITUTIONAL_REP_REVIEW
	| typeof EmailTypes.SUBMIT_REVISIONS_INSTITUTIONAL_REP
	| typeof EmailTypes.SUBMIT_REVISIONS_DAC_REVIEW
>;

export const reminderEmailTypeValues: ReminderEmailTypes[] = [
	EmailTypes.REMINDER_SUBMIT_DRAFT,
	EmailTypes.REMINDER_SUBMIT_INSTITUTIONAL_REP_REVIEW,
	EmailTypes.REMINDER_SUBMIT_REVISIONS_INSTITUTIONAL_REP,
	EmailTypes.NOTIFY_APPLICANT_REP_REVISIONS,
	EmailTypes.REMINDER_REQUEST_REVISIONS_INSTITUTIONAL_REP,
	EmailTypes.REMINDER_SUBMIT_DAC_REVIEW,
	EmailTypes.REMINDER_SUBMIT_REVISIONS_DAC_REVIEW,
	EmailTypes.REMINDER_REVIEW_SUBMITTED_REVISIONS,
	EmailTypes.NOTIFY_APPLICANT_DAC_REVISIONS,
	EmailTypes.REMINDER_REQUEST_REVISIONS_DAC_REVIEW,
	EmailTypes.SUBMIT_DRAFT,
	EmailTypes.REQUEST_REVISIONS_INSTITUTIONAL_REP,
	EmailTypes.REQUEST_REVISIONS_DAC_REVIEW,
	EmailTypes.SUBMIT_INSTITUTIONAL_REP_REVIEW,
	EmailTypes.SUBMIT_REVISIONS_INSTITUTIONAL_REP,
	EmailTypes.SUBMIT_REVISIONS_DAC_REVIEW,
] as const;

export type ReminderEmailStateMapping = Pick<AllEmailsStateMapping, ReminderEmailTypes>;
export type AdditionalEmailStateMapping = Omit<AllEmailsStateMapping, ReminderEmailTypes>;

/**
 * Dictionary matching Reminder Email subjects to the triggering Application State
 * reminderTargetEmailTypes collects only email types which require follow up emails sent
 */
export const reminderTargetEmailTypes: { [k in ReminderEmailTypes]: ApplicationStateValues[] } = {
	[EmailTypes.REMINDER_SUBMIT_DRAFT]: [ApplicationStates.DRAFT],
	[EmailTypes.REMINDER_SUBMIT_INSTITUTIONAL_REP_REVIEW]: [ApplicationStates.INSTITUTIONAL_REP_REVIEW],
	[EmailTypes.REMINDER_SUBMIT_REVISIONS_INSTITUTIONAL_REP]: [ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED],
	[EmailTypes.NOTIFY_APPLICANT_REP_REVISIONS]: [ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED],
	[EmailTypes.REMINDER_REQUEST_REVISIONS_INSTITUTIONAL_REP]: [ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED],
	[EmailTypes.REMINDER_SUBMIT_DAC_REVIEW]: [ApplicationStates.DAC_REVIEW],
	[EmailTypes.REMINDER_SUBMIT_REVISIONS_DAC_REVIEW]: [ApplicationStates.DAC_REVISIONS_REQUESTED],
	[EmailTypes.REMINDER_REVIEW_SUBMITTED_REVISIONS]: [
		ApplicationStates.DAC_REVIEW,
		ApplicationStates.INSTITUTIONAL_REP_REVIEW,
	],
	[EmailTypes.NOTIFY_APPLICANT_DAC_REVISIONS]: [ApplicationStates.DAC_REVISIONS_REQUESTED],
	[EmailTypes.REMINDER_REQUEST_REVISIONS_DAC_REVIEW]: [ApplicationStates.DAC_REVISIONS_REQUESTED],
	[EmailTypes.SUBMIT_DRAFT]: [ApplicationStates.INSTITUTIONAL_REP_REVIEW],
	[EmailTypes.REQUEST_REVISIONS_INSTITUTIONAL_REP]: [ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED],
	[EmailTypes.REQUEST_REVISIONS_DAC_REVIEW]: [ApplicationStates.DAC_REVISIONS_REQUESTED],
	[EmailTypes.SUBMIT_INSTITUTIONAL_REP_REVIEW]: [ApplicationStates.DAC_REVIEW],
	[EmailTypes.SUBMIT_REVISIONS_INSTITUTIONAL_REP]: [ApplicationStates.INSTITUTIONAL_REP_REVIEW],
	[EmailTypes.SUBMIT_REVISIONS_DAC_REVIEW]: [ApplicationStates.DAC_REVIEW],
} as const;

/**
 * Dictionary matching Reminder Email subjects to the triggering Application State
 * additionalEmailTypes collects only email types which do not require follow up
 */
export const additionalEmailTypes: AdditionalEmailStateMapping = {
	[EmailTypes.NOTIFY_APPLICANT_WITHDRAW]: [ApplicationStates.DRAFT],
	[EmailTypes.NOTIFY_APPLICANT_CLOSE]: [ApplicationStates.CLOSED],
	[EmailTypes.NOTIFY_APPLICANT_REVOKE]: [ApplicationStates.REVOKED],
	[EmailTypes.NOTIFY_APPLICANT_DAC_REVIEW_REJECTED]: [ApplicationStates.REJECTED],
	[EmailTypes.NOTIFY_APPLICANT_DAC_APPROVAL]: [ApplicationStates.APPROVED],
	[EmailTypes.NOTIFY_COLLABORATORS_DAC_APPROVAL]: [ApplicationStates.APPROVED],
	[EmailTypes.SUBMIT_DAC_REVIEW]: [ApplicationStates.APPROVED],
} as const;

export const allTargetEmailTypes: Record<EmailTypeValues, ApplicationStateValues[]> = {
	...reminderTargetEmailTypes,
	...additionalEmailTypes,
} as const;

// Dictionary matching Application State values to related triggering State Transition Action values
// Rep Review and Dac Review states can be triggered by multiple potential State Transitions
export const reminderTargetActionTypes: Partial<{
	[k in ApplicationStateValues]: ApplicationActionValues[];
}> = {
	[ApplicationStates.DRAFT]: [ApplicationActions.WITHDRAW],
	[ApplicationStates.INSTITUTIONAL_REP_REVIEW]: [
		ApplicationActions.SUBMIT_DRAFT,
		ApplicationActions.INSTITUTIONAL_REP_SUBMIT,
	],
	[ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED]: [ApplicationActions.INSTITUTIONAL_REP_REVISION_REQUEST],
	[ApplicationStates.DAC_REVIEW]: [ApplicationActions.INSTITUTIONAL_REP_SUBMIT, ApplicationActions.DAC_REVIEW_SUBMIT],
	[ApplicationStates.DAC_REVISIONS_REQUESTED]: [ApplicationActions.DAC_REVIEW_REVISION_REQUEST],
};
