/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import { eq } from 'drizzle-orm';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

import { connectToDb, type PostgresDb } from '@/db/index.js';
import { actions } from '@/db/schemas/actions.js';
import { agreements } from '@/db/schemas/agreements.js';
import { applicationContents } from '@/db/schemas/applicationContents.js';
import { collaborators } from '@/db/schemas/collaborators.js';
import { files } from '@/db/schemas/files.js';
import { revisionRequests } from '@/db/schemas/revisionRequests.js';

import { initTestMigration, PG_DATABASE, PG_PASSWORD, PG_USER } from '../testUtils.js';

describe('Postgres Database', () => {
	let db: PostgresDb;
	let container: StartedPostgreSqlContainer;

	const user_id = 'testUser@oicr.on.ca';

	before(async () => {
		container = await new PostgreSqlContainer()
			.withUsername(PG_USER)
			.withPassword(PG_PASSWORD)
			.withDatabase(PG_DATABASE)
			.start();

		const connectionString = container.getConnectionUri();

		db = connectToDb(connectionString);

		await initTestMigration(db);
	});

	describe('Connection', () => {
		it('should connect successfully', () => {
			assert.notEqual(db, undefined);
		});
	});

	describe('Actions', () => {
		it('should create & delete', async () => {
			const testAction: typeof actions.$inferInsert = {
				application_id: 1,
				user_id,
				action: 'CREATE',
				state_before: 'none',
				state_after: 'tbd',
			};

			await db.insert(actions).values(testAction);

			const allActions = await db.select().from(actions);

			assert.strictEqual(allActions.length, 1);

			const deletedRecord = await db
				.delete(actions)
				.where(eq(actions.application_id, testAction.application_id))
				.returning();

			assert.strictEqual(deletedRecord.length, 1);
		});
	});

	describe('Agreements', () => {
		it('should create & delete', async () => {
			const testAgreements: typeof agreements.$inferInsert = {
				application_id: 1,
				name: 'Test Agreement',
				agreement_text: 'Testing Agreement',
				agreement_type: 'dac_agreement_non_disclosure',
				user_id,
				agreed_at: new Date(),
			};

			await db.insert(agreements).values(testAgreements);

			const allAgreements = await db.select().from(agreements);

			assert.strictEqual(allAgreements.length, 1);

			const deletedRecord = await db.delete(agreements).where(eq(agreements.name, testAgreements.name)).returning();

			assert.strictEqual(deletedRecord.length, 1);
		});
	});

	describe('Application Contents', () => {
		it('should create & delete', async () => {
			const testApplicationContents: typeof applicationContents.$inferInsert = {
				application_id: 1,
				updated_at: new Date(),
				applicant_first_name: 'Test',
				applicant_middle_name: '',
				applicant_last_name: 'Testerson',
				applicant_title: 'Dr.',
				applicant_suffix: 'Sr.',
				applicant_position_title: 'PHD',
				applicant_primary_affiliation: 'UHN',
				applicant_institutional_email: 'testAccount@oicr.on.ca',
				applicant_profile_url: '',
			};

			await db.insert(applicationContents).values(testApplicationContents);

			const allApplicationContents = await db.select().from(applicationContents);

			assert.strictEqual(allApplicationContents.length, 1);

			const deletedRecord = await db
				.delete(applicationContents)
				.where(eq(applicationContents.application_id, testApplicationContents.application_id))
				.returning();

			assert.strictEqual(deletedRecord.length, 1);
		});
	});

	describe('Collaborators', () => {
		it('should create & delete', async () => {
			const testCollaborators: typeof collaborators.$inferInsert = {
				application_id: 1,
				first_name: 'Thomas',
				last_name: 'Testing',
				position_title: 'Teacher',
				institutional_email: 'ttesting@oicr.on.ca',
			};

			await db.insert(collaborators).values(testCollaborators);

			const allCollaborators = await db.select().from(collaborators);

			assert.strictEqual(allCollaborators.length, 1);

			const deletedRecord = await db
				.delete(collaborators)
				.where(eq(collaborators.first_name, testCollaborators.first_name))
				.returning();

			assert.strictEqual(deletedRecord.length, 1);
		});
	});

	describe('Files', () => {
		it('should create & delete', async () => {
			const testFiles: typeof files.$inferInsert = {
				application_id: 1,
				type: 'SIGNED_APPLICATION',
				submitter_user_id: '001',
				submitted_at: new Date(),
				content: Buffer.alloc(123),
			};

			await db.insert(files).values(testFiles);

			const allFiles = await db.select().from(files);

			assert.strictEqual(allFiles.length, 1);

			const deletedRecord = await db
				.delete(files)
				.where(eq(files.submitter_user_id, testFiles.submitter_user_id))
				.returning();

			assert.strictEqual(deletedRecord.length, 1);
		});
	});

	describe('Revision Requests', () => {
		it('should create & delete', async () => {
			const testRevisions: typeof revisionRequests.$inferInsert = {
				application_id: 1,
				applicant_approved: false,
				institution_rep_approved: true,
				collaborators_approved: true,
				project_approved: false,
				requested_studies_approved: true,
			};

			await db.insert(revisionRequests).values(testRevisions);

			const allRevisions = await db.select().from(revisionRequests);

			assert.strictEqual(allRevisions.length, 1);

			const deletedRecord = await db
				.delete(revisionRequests)
				.where(eq(revisionRequests.application_id, testRevisions.application_id))
				.returning();

			assert.strictEqual(deletedRecord.length, 1);
		});
	});

	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
