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

import { getEmailConfig } from '@/config/emailConfig.ts';
import BaseLogger from '@/logger.ts';
import { AsyncResult, failure, success } from '@/utils/results.ts';
import emailClient from './index.ts';

import SMTPPool from 'nodemailer/lib/smtp-pool/index.js';
import {
	GenerateEmailApplicantAppSubmitted,
	GenerateEmailApplicantAppSubmittedPlain,
} from './layouts/templates/EmailApplicantAppSubmitted.ts';
import {
	GenerateEmailApplicantRepRevision,
	GenerateEmailApplicantRepRevisionPlain,
} from './layouts/templates/EmailApplicantRepRevision.ts';
import {
	GenerateEmailApplicantRevision,
	GenerateEmailApplicantRevisionPlain,
} from './layouts/templates/EmailApplicantRevision.ts';
import { GenerateEmailApproval, GenerateEmailApprovalPlain } from './layouts/templates/EmailApproval.ts';
import { GenerateEmailDacForReview, GenerateEmailDacForReviewPlain } from './layouts/templates/EmailDacReview.ts';
import {
	GenerateEmailDacForSubmittedRevision,
	GenerateEmailDacForSubmittedRevisionPlain,
} from './layouts/templates/EmailDacRevision.ts';
import {
	GenerateEmailInstitutionalRepReview,
	GenerateEmailInstitutionalRepReviewPlain,
} from './layouts/templates/EmailInstitutionalRepReview.ts';
import { GenerateEmailRejection, GenerateEmailRejectionPlain } from './layouts/templates/EmailRejection.ts';
import {
	EmailSubjects,
	type GenerateApplicantRepRevisionType,
	type GenerateApplicantRevisionType,
	type GenerateApproveType,
	type GenerateDacRevisionType,
	type GenerateInstitutionalRepType,
	type GenerateRejectType,
} from './types.ts';

const logger = BaseLogger.forModule('emailService');

const emailSvc = () => ({
	// Email to the Institutional Rep to Review Application
	sendEmailInstitutionalRepForReview: async ({
		id,
		applicantName,
		repName,
		submittedDate,
		to,
	}: GenerateInstitutionalRepType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
		try {
			const {
				email: { fromAddress },
			} = getEmailConfig();

			const response = await emailClient.sendMail({
				from: fromAddress,
				to,
				subject: EmailSubjects.INSTITUTIONAL_REP_REVIEW_REQUEST,
				html: GenerateEmailInstitutionalRepReview({
					id,
					applicantName,
					repName,
					submittedDate,
				}),
				text: GenerateEmailInstitutionalRepReviewPlain({
					id,
					applicantName,
					repName,
					submittedDate,
				}),
			});

			return success(response);
		} catch (error) {
			const message = `Error sending email to recipient: ${to}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	// Email to Applicant & Notify Institutional Rep Revisions
	sendEmailApplicantRepRevisions: async ({
		id,
		applicantName,
		institutionalRepFirstName,
		institutionalRepLastName,
		comments,
		to,
	}: GenerateApplicantRepRevisionType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
		try {
			const {
				email: { fromAddress },
			} = getEmailConfig();

			const response = await emailClient.sendMail({
				from: fromAddress,
				to,
				subject: EmailSubjects.NOTIFY_REVISION,
				html: GenerateEmailApplicantRepRevision({
					id,
					applicantName,
					institutionalRepFirstName,
					institutionalRepLastName,
					comments,
				}),
				text: GenerateEmailApplicantRepRevisionPlain({
					id,
					applicantName,
					institutionalRepFirstName,
					institutionalRepLastName,
					comments,
				}),
			});

			return success(response);
		} catch (error) {
			const message = `Error sending email to recipient: ${to}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	// Email to notify Applicant that application is submitted by Rep for DAC review
	sendEmailApplicantApplicationSubmitted: async ({
		id,
		name,
		to,
	}: GenerateApproveType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
		try {
			const {
				email: { fromAddress },
			} = getEmailConfig();

			const response = await emailClient.sendMail({
				from: fromAddress,
				to,
				subject: EmailSubjects.NOTIFY_APPLICANT_REP_SUBMIT_DAC_REVIEW,
				html: GenerateEmailApplicantAppSubmitted({ id, name }),
				text: GenerateEmailApplicantAppSubmittedPlain({ id, name }),
			});

			return success(response);
		} catch (error) {
			const message = `Error sending email to recipient: ${to}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	// Email to notify DAC for review
	sendEmailDacForReview: async ({
		id,
		applicantName,
		submittedDate,
		to,
	}: GenerateDacRevisionType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
		try {
			const {
				email: { fromAddress },
			} = getEmailConfig();

			const response = await emailClient.sendMail({
				from: fromAddress,
				to,
				subject: EmailSubjects.NOTIFY_DAC_REVIEW_REVISIONS,
				html: GenerateEmailDacForReview({ id, applicantName, submittedDate }),
				text: GenerateEmailDacForReviewPlain({ id, applicantName, submittedDate }),
			});

			return success(response);
		} catch (error) {
			const message = `Error sending email to recipient: ${to}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	// Email to Applicant about DAC Revisions
	sendEmailApplicantDacRevisions: async ({
		id,
		applicantName,
		comments,
		to,
	}: GenerateApplicantRevisionType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
		try {
			const {
				email: { fromAddress },
			} = getEmailConfig();

			const response = await emailClient.sendMail({
				from: fromAddress,
				to,
				subject: EmailSubjects.NOTIFY_REVISION,
				html: GenerateEmailApplicantRevision({ id, applicantName, comments }),
				text: GenerateEmailApplicantRevisionPlain({ id, applicantName, comments }),
			});

			return success(response);
		} catch (error) {
			const message = `Error sending email to recipient: ${to}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	// Email to DAC about Submitted Revisions
	sendEmailDacForSubmittedRevisions: async ({
		id,
		applicantName,
		submittedDate,
		to,
	}: GenerateDacRevisionType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
		try {
			const {
				email: { fromAddress },
			} = getEmailConfig();

			const response = await emailClient.sendMail({
				from: fromAddress,
				to,
				subject: EmailSubjects.NOTIFY_DAC_REVIEW_REVISIONS,
				html: GenerateEmailDacForSubmittedRevision({ id, applicantName, submittedDate }),
				text: GenerateEmailDacForSubmittedRevisionPlain({ id, applicantName, submittedDate }),
			});

			return success(response);
		} catch (error) {
			const message = `Error sending email to recipient: ${to}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	// Email to Collaborators & Notify Approval
	// Email to Applicant & Notify Approval
	sendEmailApproval: async ({
		id,
		name,
		to,
	}: GenerateApproveType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
		try {
			const {
				email: { fromAddress },
			} = getEmailConfig();

			const response = await emailClient.sendMail({
				from: fromAddress,
				to,
				subject: EmailSubjects.NOTIFY_APPROVAL,
				html: GenerateEmailApproval({ id, name }),
				text: GenerateEmailApprovalPlain({ id, name }),
			});

			return success(response);
		} catch (error) {
			const message = `Error sending email to recipient: ${to}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	// Email to Applicant & Notify Disapproval
	sendEmailReject: async ({
		id,
		name,
		to,
		comment,
	}: GenerateRejectType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
		try {
			const {
				email: { fromAddress },
			} = getEmailConfig();

			const response = await emailClient.sendMail({
				from: fromAddress,
				to,
				subject: EmailSubjects.DACO_APPLICATION_STATUS,
				html: GenerateEmailRejection({ id, name, comment }),
				text: GenerateEmailRejectionPlain({ name, comment }),
			});

			return success(response);
		} catch (error) {
			const message = `Error sending email to recipient: ${to}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
});

export { emailSvc };
