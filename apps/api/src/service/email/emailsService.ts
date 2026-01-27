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

import { EmailTypeValues, EmailTypes } from '@pcgl-daco/data-model/src/types.js';
import SMTPPool from 'nodemailer/lib/smtp-pool/index.js';

import { getEmailConfig } from '@/config/emailConfig.ts';
import { type PostgresDb } from '@/db/index.js';
import { sentEmails } from '@/db/schemas/sentEmails.ts';
import BaseLogger from '@/logger.ts';
import { EmailModel, EmailRecord } from '@/service/types.ts';
import { AsyncResult, failure, success } from '@/utils/results.ts';

import emailClient from './index.ts';
import {
	GenerateEmailApplicantAppSubmitted,
	GenerateEmailApplicantAppSubmittedPlain,
	GenerateEmailApplicantClosed,
	GenerateEmailApplicantClosedPlain,
	GenerateEmailApplicantRepRevision,
	GenerateEmailApplicantRepRevisionPlain,
	GenerateEmailApplicantRevision,
	GenerateEmailApplicantRevisionPlain,
	GenerateEmailApplicantRevoke,
	GenerateEmailApplicantRevokePlain,
	GenerateEmailApproval,
	GenerateEmailApprovalPlain,
	GenerateEmailDacForReview,
	GenerateEmailDacForReviewPlain,
	GenerateEmailDacForSubmittedRevision,
	GenerateEmailDacForSubmittedRevisionPlain,
	GenerateEmailInstitutionalRepReview,
	GenerateEmailInstitutionalRepReviewPlain,
	GenerateEmailRejection,
	GenerateEmailRejectionPlain,
	GenerateEmailReminderDacReview,
	GenerateEmailReminderDacReviewPlain,
	GenerateEmailReminderDacReviewRevisions,
	GenerateEmailReminderDacReviewRevisionsPlain,
	GenerateEmailReminderRepReview,
	GenerateEmailReminderRepReviewPlain,
	GenerateEmailReminderRepReviewRevisions,
	GenerateEmailReminderRepReviewRevisionsPlain,
	GenerateEmailReminderSubmitDacRevisions,
	GenerateEmailReminderSubmitDacRevisionsPlain,
	GenerateEmailReminderSubmitDraft,
	GenerateEmailReminderSubmitDraftPlain,
	GenerateEmailReminderSubmitRepRevisions,
	GenerateEmailReminderSubmitRepRevisionsPlain,
} from './layouts/templates/index.ts';
import {
	EmailSubjects,
	type GenerateApplicantRepRevisionType,
	type GenerateApplicantRevisionType,
	type GenerateApproveType,
	type GenerateClosedType,
	type GenerateDacRevisionType,
	type GenerateDraftReminderEmailType,
	type GenerateInstitutionalRepType,
	type GenerateRejectType,
	type GenerateReviewReminderEmailType,
	type GenerateSubmitRevisionReminderEmailType,
} from './types.ts';

const logger = BaseLogger.forModule('emailService');

const dateConverter = (date: Date | string) => {
	// America/Toronto should account for DST and automatically switch between EST and EDT
	const formatter = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'America/Toronto',
		dateStyle: 'medium',
		timeStyle: 'long',
	});
	return formatter.format(new Date(date));
};

/**
 * EmailService provides methods for sending Emails and Creating Sent Email Records
 * @param db - Drizzle Postgres DB Instance
 */
const emailSvc = (db: PostgresDb) => {
	const createEmailRecord = async ({
		application_id,
		application_action_id,
		email_type,
		recipient_emails,
	}: {
		application_id: number;
		application_action_id?: number;
		email_type: EmailTypeValues;
		recipient_emails: string[];
	}): AsyncResult<EmailRecord, 'SYSTEM_ERROR'> => {
		const newEmail: EmailModel = {
			application_id,
			application_action_id,
			created_at: new Date(),
			email_type,
			recipient_emails,
		};

		try {
			const sentEmail = await db.transaction(async (transaction) => {
				const newEmailRecord = await transaction.insert(sentEmails).values(newEmail).returning();
				if (!newEmailRecord[0]) {
					throw new Error('Application record is undefined');
				}

				return newEmailRecord[0];
			});

			return success(sentEmail);
		} catch (err) {
			logger.error(`Error at createEmailRecord with application_id: ${application_id}`, err);
			return failure('SYSTEM_ERROR', 'An unexpected database failure occurred, email record was not created.');
		}
	};

	return {
		// Periodic reminder Email for the Applicant to Submit Draft
		sendEmailSubmitDraftReminder: async ({
			id,
			applicantName,
			actionId,
			submittedDate,
			to,
		}: GenerateDraftReminderEmailType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
			try {
				const {
					email: { fromAddress },
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.REMINDER_SUBMIT_DRAFT,
					html: GenerateEmailReminderSubmitDraft({
						id,
						applicantName,
						submittedDate: dateConverter(submittedDate),
					}),
					text: GenerateEmailReminderSubmitDraftPlain({
						id,
						applicantName,
						submittedDate: dateConverter(submittedDate),
					}),
				});

				await createEmailRecord({
					application_id: Number(id),
					application_action_id: actionId,
					email_type: EmailTypes.REMINDER_SUBMIT_DRAFT,
					recipient_emails: [to],
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailSubmitDraftReminder`;

				logger.error(message, error);

				return failure('SYSTEM_ERROR', message);
			}
		},
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
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.INSTITUTIONAL_REP_REVIEW_REQUEST,
					html: GenerateEmailInstitutionalRepReview({
						id,
						applicantName,
						repName,
						submittedDate: dateConverter(submittedDate),
					}),
					text: GenerateEmailInstitutionalRepReviewPlain({
						id,
						applicantName,
						repName,
						submittedDate: dateConverter(submittedDate),
					}),
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailInstitutionalRepForReview`;

				logger.error(message, error);

				return failure('SYSTEM_ERROR', message);
			}
		},
		// Periodic reminder Email for the Institutional Rep to Review Application
		sendEmailRepReviewReminder: async ({
			id,
			applicantName,
			actionId,
			repName,
			to,
		}: GenerateSubmitRevisionReminderEmailType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
			try {
				const {
					email: { fromAddress },
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.REMINDER_SUBMIT_REVIEW,
					html: GenerateEmailReminderRepReview({
						id,
						applicantName,
						repName,
						submittedDate: new Date(),
					}),
					text: GenerateEmailReminderRepReviewPlain({
						id,
						applicantName,
						repName,
						submittedDate: new Date(),
					}),
				});

				await createEmailRecord({
					application_id: Number(id),
					application_action_id: actionId,
					email_type: EmailTypes.REMINDER_SUBMIT_INSTITUTIONAL_REP_REVIEW,
					recipient_emails: [to],
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailRepReviewReminder`;

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
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

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
				const message = `Error sending email - sendEmailApplicantRepRevisions`;

				logger.error(message, error);

				return failure('SYSTEM_ERROR', message);
			}
		},
		// Periodic reminder Email for the Applicant to Submit Revisions
		sendEmailSubmitRepRevisionsReminder: async ({
			id,
			applicantName,
			actionId,
			repName,
			submittedDate,
			to,
		}: GenerateReviewReminderEmailType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
			try {
				const {
					email: { fromAddress },
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.REMINDER_SUBMIT_REVISIONS,
					html: GenerateEmailReminderSubmitRepRevisions({
						id,
						applicantName,
						repName,
						submittedDate: dateConverter(submittedDate),
					}),
					text: GenerateEmailReminderSubmitRepRevisionsPlain({
						id,
						applicantName,
						repName,
						submittedDate: dateConverter(submittedDate),
					}),
				});

				await createEmailRecord({
					application_id: Number(id),
					application_action_id: actionId,
					email_type: EmailTypes.REMINDER_SUBMIT_REVISIONS_INSTITUTIONAL_REP,
					recipient_emails: [to],
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailSubmitRepRevisionsReminder`;

				logger.error(message, error);

				return failure('SYSTEM_ERROR', message);
			}
		},
		// Periodic reminder Email for the Institutional Rep to Review Revisions
		sendEmailRepRevisionsReminder: async ({
			id,
			actionId,
			applicantName,
			repName,
			submittedDate,
			to,
		}: GenerateInstitutionalRepType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
			try {
				const {
					email: { fromAddress },
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.REMINDER_REVIEW_SUBMITTED_REVISIONS,
					html: GenerateEmailReminderRepReviewRevisions({
						id,
						applicantName,
						repName,
						submittedDate: dateConverter(submittedDate),
					}),
					text: GenerateEmailReminderRepReviewRevisionsPlain({
						id,
						applicantName,
						repName,
						submittedDate: dateConverter(submittedDate),
					}),
				});

				await createEmailRecord({
					application_id: Number(id),
					application_action_id: actionId,
					email_type: EmailTypes.REMINDER_REQUEST_REVISIONS_INSTITUTIONAL_REP,
					recipient_emails: [to],
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailRepRevisionsReminder`;

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
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.NOTIFY_APPLICANT_REP_SUBMIT_DAC_REVIEW,
					html: GenerateEmailApplicantAppSubmitted({ id, name }),
					text: GenerateEmailApplicantAppSubmittedPlain({ id, name }),
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailApplicantApplicationSubmitted`;

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
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.NOTIFY_DAC_REVIEW_REVISIONS,
					html: GenerateEmailDacForReview({ id, applicantName, submittedDate: dateConverter(submittedDate) }),
					text: GenerateEmailDacForReviewPlain({ id, applicantName, submittedDate: dateConverter(submittedDate) }),
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailDacForReview`;

				logger.error(message, error);

				return failure('SYSTEM_ERROR', message);
			}
		},
		// Periodic reminder email for DAC to review application
		sendEmailDacReviewReminder: async ({
			id,
			applicantName,
			repName,
			actionId,
			submittedDate,
			to,
		}: GenerateReviewReminderEmailType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
			try {
				const {
					email: { fromAddress },
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.REMINDER_SUBMIT_REVIEW,
					html: GenerateEmailReminderDacReview({
						id,
						applicantName,
						repName,
						submittedDate: dateConverter(submittedDate),
					}),
					text: GenerateEmailReminderDacReviewPlain({
						id,
						applicantName,
						repName,
						submittedDate: dateConverter(submittedDate),
					}),
				});

				await createEmailRecord({
					application_id: Number(id),
					application_action_id: actionId,
					email_type: EmailTypes.REMINDER_SUBMIT_DAC_REVIEW,
					recipient_emails: [to],
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailDacReviewReminder`;

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
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.NOTIFY_REVISION,
					html: GenerateEmailApplicantRevision({ id, applicantName, comments }),
					text: GenerateEmailApplicantRevisionPlain({ id, applicantName, comments }),
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailApplicantDacRevisions`;

				logger.error(message, error);

				return failure('SYSTEM_ERROR', message);
			}
		},
		// Periodic reminder Email for the Applicant to Submit DAC Revisions
		sendEmailSubmitDacRevisionsReminder: async ({
			id,
			actionId,
			applicantName,
			repName,
			submittedDate,
			to,
		}: GenerateSubmitRevisionReminderEmailType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
			try {
				const {
					email: { fromAddress },
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.REMINDER_SUBMIT_REVISIONS,
					html: GenerateEmailReminderSubmitDacRevisions({
						id,
						actionId,
						applicantName,
						repName,
						submittedDate: dateConverter(submittedDate),
					}),
					text: GenerateEmailReminderSubmitDacRevisionsPlain({
						id,
						actionId,
						applicantName,
						repName,
						submittedDate: dateConverter(submittedDate),
					}),
				});

				await createEmailRecord({
					application_id: Number(id),
					application_action_id: actionId,
					email_type: EmailTypes.REMINDER_SUBMIT_REVISIONS_DAC_REVIEW,
					recipient_emails: [to],
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailSubmitDacRevisionsReminder`;

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
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.NOTIFY_DAC_REVIEW_REVISIONS,
					html: GenerateEmailDacForSubmittedRevision({
						id,
						applicantName,
						submittedDate: dateConverter(submittedDate),
					}),
					text: GenerateEmailDacForSubmittedRevisionPlain({
						id,
						applicantName,
						submittedDate: dateConverter(submittedDate),
					}),
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailDacForSubmittedRevisions`;
				logger.error(message, error);

				return failure('SYSTEM_ERROR', message);
			}
		},
		// Periodic reminder Email for the DAC to Review Submitted Revisions
		sendEmailDacRevisionsReminder: async ({
			id,
			actionId,
			applicantName,
			repName,
			submittedDate,
			to,
		}: GenerateReviewReminderEmailType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
			try {
				const {
					email: { fromAddress },
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.REMINDER_REVIEW_SUBMITTED_REVISIONS,
					html: GenerateEmailReminderDacReviewRevisions({
						id,
						applicantName,
						repName,
						submittedDate: dateConverter(submittedDate),
					}),
					text: GenerateEmailReminderDacReviewRevisionsPlain({
						id,
						applicantName,
						repName,
						submittedDate: dateConverter(submittedDate),
					}),
				});

				createEmailRecord({
					application_id: Number(id),
					application_action_id: actionId,
					email_type: EmailTypes.REMINDER_REQUEST_REVISIONS_DAC_REVIEW,
					recipient_emails: [to],
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailDacRevisionsReminder`;

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
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.NOTIFY_APPROVAL,
					html: GenerateEmailApproval({ id, name }),
					text: GenerateEmailApprovalPlain({ id, name }),
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailApproval`;
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
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.DACO_APPLICATION_STATUS,
					html: GenerateEmailRejection({ id, name, comment }),
					text: GenerateEmailRejectionPlain({ name, comment }),
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailReject`;

				logger.error(message, error);

				return failure('SYSTEM_ERROR', message);
			}
		},
		// Email to Applicant that application has been revoked
		sendEmailApplicantRevoke: async ({
			id,
			name,
			to,
			comment,
			dacRevoked = false,
		}: GenerateRejectType & { dacRevoked?: boolean }): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
			try {
				const {
					email: { fromAddress },
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.DACO_APPLICATION_STATUS,
					html: GenerateEmailApplicantRevoke({ id, name, comment, dacRevoked }),
					text: GenerateEmailApplicantRevokePlain({ id, name, comment, dacRevoked }),
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailDacRevoke`;

				logger.error(message, error);

				return failure('SYSTEM_ERROR', message);
			}
		},
		// Email to Applicant that application has been closed
		sendEmailApplicantClose: async ({
			id,
			userName,
			applicantName,
			message,
			status,
			submittedDate,
			to,
		}: GenerateClosedType): AsyncResult<SMTPPool.SentMessageInfo, 'SYSTEM_ERROR'> => {
			try {
				const {
					email: { fromAddress },
				} = getEmailConfig;

				if (!to) {
					throw new Error(`Error retrieving address to send email to user id: ${id} `);
				}

				const response = await emailClient.sendMail({
					from: fromAddress,
					to,
					subject: EmailSubjects.DACO_APPLICATION_STATUS_UPDATE,
					html: GenerateEmailApplicantClosed({ id, userName, applicantName, message, status, submittedDate }),
					text: GenerateEmailApplicantClosedPlain({ id, userName, applicantName, message, status, submittedDate }),
				});

				return success(response);
			} catch (error) {
				const message = `Error sending email - sendEmailApplicantClose`;

				logger.error(message, error);

				return failure('SYSTEM_ERROR', message);
			}
		},
	};
};

export { emailSvc };
