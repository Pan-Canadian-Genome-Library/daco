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
import { failure } from '@/utils/results.ts';
import emailClient from './index.ts';

import {
	GenerateEmailApplicantRevision,
	GenerateEmailApplicantRevisionPlain,
} from './layouts/templates/EmailApplicantRevision.ts';
import { GenerateEmailApproval, GenerateEmailApprovalPlain } from './layouts/templates/EmailApproval.ts';
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
	type GenerateApplicantRevisionType,
	type GenerateApproveType,
	type GenerateDacRevisionType,
	type GenerateInstitutionalRepType,
	type GenerateRejectType,
} from './types.ts';

const logger = BaseLogger.forModule('emailService');

const emailSvc = () => ({
	sendEmailApplicantForRevisions: async ({
		id,
		applicantName,
		submittedDate,
		comments,
		to,
	}: GenerateApplicantRevisionType) => {
		try {
			const {
				email: { fromAddress },
			} = getEmailConfig();

			emailClient.sendMail({
				from: fromAddress,
				to,
				subject: EmailSubjects.NOTIFY_REVISION,
				html: GenerateEmailApplicantRevision({ id, applicantName, submittedDate, comments }),
				text: GenerateEmailApplicantRevisionPlain({ id, applicantName, submittedDate, comments }),
			});
		} catch (error) {
			const message = `Error sending email to recipient: ${to}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	sendEmailDacForSubmittedRevisions: async ({ id, applicantName, submittedDate, to }: GenerateDacRevisionType) => {
		try {
			const {
				email: { fromAddress },
			} = getEmailConfig();

			emailClient.sendMail({
				from: fromAddress,
				to,
				subject: EmailSubjects.NOTIFY_DAC_REVIEW_REVISIONS,
				html: GenerateEmailDacForSubmittedRevision({ id, applicantName, submittedDate }),
				text: GenerateEmailDacForSubmittedRevisionPlain({ id, applicantName, submittedDate }),
			});
		} catch (error) {
			const message = `Error sending email to recipient: ${to}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	sendEmailInstitutionalRepReview: async ({
		id,
		applicantName,
		repName,
		submittedDate,
		to,
	}: GenerateInstitutionalRepType) => {
		try {
			const {
				email: { fromAddress },
			} = getEmailConfig();

			emailClient.sendMail({
				from: fromAddress,
				to,
				subject: EmailSubjects.INSTITUTIONAL_REP_REVIEW_REQUEST,
				html: GenerateEmailInstitutionalRepReview({ id, applicantName, repName, submittedDate }),
				text: GenerateEmailInstitutionalRepReviewPlain({ id, applicantName, repName, submittedDate }),
			});
		} catch (error) {
			const message = `Error sending email to recipient: ${to}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	sendEmailApproval: async ({ id, name, to }: GenerateApproveType) => {
		try {
			const {
				email: { fromAddress },
			} = getEmailConfig();

			emailClient.sendMail({
				from: fromAddress,
				to,
				subject: EmailSubjects.NOTIFY_APPROVAL,
				html: GenerateEmailApproval({ id, name }),
				text: GenerateEmailApprovalPlain({ id, name }),
			});
		} catch (error) {
			const message = `Error sending email to recipient: ${to}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	sendEmailReject: async ({ id, name, to, comment }: GenerateRejectType) => {
		try {
			const {
				email: { fromAddress },
			} = getEmailConfig();

			emailClient.sendMail({
				from: fromAddress,
				to,
				subject: EmailSubjects.DACO_APPLICATION_STATUS,
				html: GenerateEmailRejection({ id, name, comment }),
				text: GenerateEmailRejectionPlain({ name, comment }),
			});
		} catch (error) {
			const message = `Error sending email to recipient: ${to}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
});

export { emailSvc };
