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

import { EmailTypes } from '@pcgl-daco/data-model/src/types.js';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { and, eq } from 'drizzle-orm';
import assert from 'node:assert';
import { before, describe, it } from 'node:test';

import { connectToDb, type PostgresDb } from '@/db/index.js';
import { sentEmails } from '@/db/schemas/sentEmails.ts';
import { emailSvc } from '@/service/email/emailsService.ts';
import { type EmailService, type RevisionRequestModel } from '@/service/types.ts';

import { ApplicationStates } from '@pcgl-daco/data-model';
import {
	addInitialActions,
	addInitialApplications,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
	testUserId,
} from '../utils/testUtils.ts';

describe('Email Service', () => {
	let db: PostgresDb;
	let container: StartedPostgreSqlContainer;
	let testEmailService: EmailService;
	// Sample revision request data
	const revisionRequestData: RevisionRequestModel = {
		application_id: 1,
		created_at: new Date(),
		comments: 'Please provide additional documentation.',
		applicant_notes: 'Needs more details',
		applicant_approved: false,
		institution_rep_approved: false,
		institution_rep_notes: 'Incomplete information',
		collaborators_approved: false,
		collaborators_notes: 'Requires additional clarification',
		project_approved: false,
		project_notes: 'Not sufficient justification',
		requested_studies_approved: false,
		requested_studies_notes: 'Unclear scope',
		agreements_approved: false,
		agreements_notes: 'N/A',
		appendices_approved: false,
		appendices_notes: 'N/A',
		ethics_approved: false,
		ethics_notes: 'N/A',
		sign_and_submit_approved: false,
		sign_and_submit_notes: 'N/A',
	};
	const applicantName = 'Test User';

	before(async () => {
		container = await new PostgreSqlContainer()
			.withUsername(PG_USER)
			.withPassword(PG_PASSWORD)
			.withDatabase(PG_DATABASE)
			.start();

		const connectionString = container.getConnectionUri();
		db = connectToDb(connectionString);

		await initTestMigration(db);
		await addInitialApplications(db);
		await addInitialActions(db);

		testEmailService = emailSvc(db);
	});

	describe('sendEmailInstitutionalRepForReview', () => {
		it('Should throw an error if recipient email is undefined or null', async () => {
			const response = await testEmailService.sendEmailInstitutionalRepForReview({
				id: 1,
				to: null,
				applicantName: 'terry',
				repName: 'Cruise',
				submittedDate: new Date(),
			});

			assert.ok(!response.success);
		});
	});

	describe('sendEmailApplicantRepRevisions', () => {
		it('Should throw an error if recipient email is undefined or null', async () => {
			const response = await testEmailService.sendEmailApplicantRepRevisions({
				id: 1,
				to: null,
				applicantName: 'terry',
				institutionalRepFirstName: 'Miles',
				institutionalRepLastName: 'Teller',
				comments: revisionRequestData,
				actionId: 0,
			});

			assert.ok(!response.success);
		});
	});

	describe('sendEmailApplicantApplicationSubmitted', () => {
		it('Should throw an error if recipient email is undefined or null', async () => {
			const response = await testEmailService.sendEmailApplicantApplicationSubmitted({
				id: 1,
				to: null,
				name: 'Applicant',
				actionId: 0,
			});

			assert.ok(!response.success);
		});
	});

	describe('sendEmailDacForReview', () => {
		it('Should throw an error if recipient email is undefined or null', async () => {
			const response = await testEmailService.sendEmailDacForReview({
				id: 1,
				to: null,
				applicantName: 'Terry',
				submittedDate: new Date(),
				actionId: 0,
			});

			assert.ok(!response.success);
		});
	});

	describe('sendEmailApplicantDacRevisions', () => {
		it('Should throw an error if recipient email is undefined or null', async () => {
			const response = await testEmailService.sendEmailApplicantDacRevisions({
				id: 1,
				to: null,
				applicantName: 'Terry',
				comments: revisionRequestData,
				actionId: 0,
			});

			assert.ok(!response.success);
		});
	});

	describe('sendEmailDacForSubmittedRevisions', () => {
		it('Should throw an error if recipient email is undefined or null', async () => {
			const response = await testEmailService.sendEmailDacForSubmittedRevisions({
				id: 1,
				to: null,
				applicantName: 'Terry',
				submittedDate: new Date(),
				actionId: 0,
			});

			assert.ok(!response.success);
		});
	});

	describe('sendEmailApproval', () => {
		it('Should throw an error if recipient email is undefined or null', async () => {
			const response = await testEmailService.sendEmailApproval({
				id: 1,
				to: null,
				name: 'Terry',
				actionId: 0,
			});

			assert.ok(!response.success);
		});
	});

	describe('sendEmailReject', () => {
		it('Should throw an error if recipient email is undefined or null', async () => {
			const response = await testEmailService.sendEmailReject({
				id: 1,
				to: null,
				name: 'Terry',
				comment: 'Rejected Application',
				actionId: 0,
			});

			assert.ok(!response.success);
		});
	});

	describe('sendEmailRevoke Applicant', () => {
		it('Should throw an error if recipient email is undefined or null', async () => {
			const response = await testEmailService.sendEmailApplicantRevoke({
				id: 1,
				to: null,
				name: 'Terry',
				comment: 'Revoke Application',
				actionId: 0,
			});

			assert.ok(!response.success);
		});
	});

	describe('sendEmailClose Application', () => {
		it('Should throw an error if recipient email is undefined or null', async () => {
			const response = await testEmailService.sendEmailApplicantClose({
				id: 1,
				to: null,
				userName: 'Terry',
				applicantName,
				message: '',
				submittedDate: new Date(),
				state: ApplicationStates.DRAFT,
				actionId: 0,
			});

			assert.ok(!response.success);
		});

		it('Should create a sent email record', async () => {
			const response = await testEmailService.sendEmailApplicantClose({
				id: 1,
				to: testUserId,
				userName: 'Terry',
				applicantName,
				message: '',
				submittedDate: new Date(),
				state: ApplicationStates.DRAFT,
				actionId: 7,
			});

			assert.ok(response.success);

			const emailRecord = await db
				.select()
				.from(sentEmails)
				.where(and(eq(sentEmails.application_id, 1), eq(sentEmails.email_type, EmailTypes.NOTIFY_APPLICANT_CLOSE)));

			assert.ok(emailRecord[0]);
		});
	});

	describe('Email Reminders', () => {
		it('sendEmailSubmitDraftReminder - Should create a Sent Email record', async () => {
			const response = await testEmailService.sendEmailSubmitDraftReminder({
				applicantName,
				id: 1,
				submittedDate: new Date(),
				to: testUserId,
			});

			assert.ok(response.success);

			const emailRecord = await db
				.select()
				.from(sentEmails)
				.where(and(eq(sentEmails.application_id, 1), eq(sentEmails.email_type, EmailTypes.REMINDER_SUBMIT_DRAFT)));

			assert.ok(emailRecord[0]);
		});

		it('sendEmailRepReviewReminder - Should create a Sent Email record', async () => {
			const response = await testEmailService.sendEmailRepReviewReminder({
				actionId: 1,
				applicantName,
				id: 1,
				repName: 'Test Representative',
				submittedDate: new Date(),
				to: testUserId,
			});

			assert.ok(response.success);

			const emailRecord = await db
				.select()
				.from(sentEmails)
				.where(
					and(
						eq(sentEmails.application_action_id, 1),
						eq(sentEmails.email_type, EmailTypes.REMINDER_SUBMIT_INSTITUTIONAL_REP_REVIEW),
					),
				);

			assert.ok(emailRecord[0]);
		});

		it('sendEmailRepRevisionsReminder - Should create a Sent Email record', async () => {
			const response = await testEmailService.sendEmailRepRevisionsReminder({
				actionId: 2,
				applicantName,
				id: 1,
				repName: 'Test Representative',
				submittedDate: new Date(),
				to: testUserId,
			});

			assert.ok(response.success);

			const emailRecord = await db
				.select()
				.from(sentEmails)
				.where(
					and(
						eq(sentEmails.application_action_id, 2),
						eq(sentEmails.email_type, EmailTypes.REMINDER_REQUEST_REVISIONS_INSTITUTIONAL_REP),
					),
				);

			assert.ok(emailRecord[0]);
		});

		it('sendEmailSubmitRepRevisionsReminder - Should create a Sent Email record', async () => {
			const response = await testEmailService.sendEmailSubmitRepRevisionsReminder({
				actionId: 3,
				applicantName,
				id: 1,
				repName: 'Test Representative',
				submittedDate: new Date(),
				to: testUserId,
			});

			assert.ok(response.success);

			const emailRecord = await db
				.select()
				.from(sentEmails)
				.where(
					and(
						eq(sentEmails.application_action_id, 3),
						eq(sentEmails.email_type, EmailTypes.REMINDER_SUBMIT_REVISIONS_INSTITUTIONAL_REP),
					),
				);

			assert.ok(emailRecord[0]);
		});

		it('sendEmailSubmitDacRevisionsReminder - Should create a Sent Email record', async () => {
			const response = await testEmailService.sendEmailSubmitDacRevisionsReminder({
				actionId: 4,
				applicantName,
				id: 1,
				repName: 'Test Representative',
				submittedDate: new Date(),
				to: testUserId,
			});

			assert.ok(response.success);

			const emailRecord = await db
				.select()
				.from(sentEmails)
				.where(
					and(
						eq(sentEmails.application_action_id, 4),
						eq(sentEmails.email_type, EmailTypes.REMINDER_SUBMIT_REVISIONS_DAC_REVIEW),
					),
				);

			assert.ok(emailRecord[0]);
		});

		it('sendEmailDacRevisionsReminder - Should create a Sent Email record', async () => {
			const response = await testEmailService.sendEmailDacRevisionsReminder({
				actionId: 5,
				applicantName,
				id: 1,
				repName: 'Test Representative',
				submittedDate: new Date(),
				to: testUserId,
			});

			assert.ok(response.success);

			const emailRecord = await db
				.select()
				.from(sentEmails)
				.where(
					and(
						eq(sentEmails.application_action_id, 5),
						eq(sentEmails.email_type, EmailTypes.REMINDER_REQUEST_REVISIONS_DAC_REVIEW),
					),
				);

			assert.ok(emailRecord[0]);
		});

		it('sendEmailDacReviewReminder - Should create a Sent Email record', async () => {
			const response = await testEmailService.sendEmailDacReviewReminder({
				actionId: 6,
				applicantName,
				id: 1,
				repName: 'Test Representative',
				submittedDate: new Date(),
				to: testUserId,
			});

			assert.ok(response.success);

			const emailRecord = await db
				.select()
				.from(sentEmails)
				.where(
					and(
						eq(sentEmails.application_action_id, 6),
						eq(sentEmails.email_type, EmailTypes.REMINDER_SUBMIT_DAC_REVIEW),
					),
				);

			assert.ok(emailRecord[0]);
		});
	});
});
