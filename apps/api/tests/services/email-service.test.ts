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

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import assert from 'node:assert';
import { before, describe, it } from 'node:test';

import { connectToDb, type PostgresDb } from '@/db/index.js';
import { emailSvc } from '@/service/email/emailsService.ts';
import { EmailService, RevisionRequestModel } from '@/service/types.ts';

import { addInitialApplications, initTestMigration, PG_DATABASE, PG_PASSWORD, PG_USER } from '../utils/testUtils.ts';

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
			});

			assert.ok(!response.success);
		});
	});
});
