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

import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { eq } from 'drizzle-orm';

import { ApplicationStates } from '@pcgl-daco/data-model/src/types.js';
import { connectToDb, type PostgresDb } from '../../src/db/index.js';
import { applications } from '../../src/db/schemas/applications.js';
import service from '../../src/service/application-service.js';

import {
	addInitialApplications,
	addPaginationDonors,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
	testUserId as user_id,
} from '../testUtils.js';

describe('Application Service', () => {
	let db: PostgresDb;
	let applicationService: ReturnType<typeof service>;
	let container: StartedPostgreSqlContainer;

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

		applicationService = service(db);
	});

	describe('Create Applications', () => {
		it('should create applications with status DRAFT and submitted user_id', async () => {
			const application = await applicationService.createApplication({ user_id });

			assert.notEqual(application, null);
			assert.strictEqual(application?.user_id, user_id);
			assert.strictEqual(application?.state, ApplicationStates.DRAFT);
		});
	});

	describe('Get Applications', () => {
		it('should get applications requested by id, with application_contents', async () => {
			const applicationRecords = await applicationService.listApplications({ user_id });

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);

			const { id } = applicationRecords[0];

			const requestedApplication = await applicationService.getApplicationById({ id });

			assert.notEqual(requestedApplication, null);
			assert.strictEqual(requestedApplication?.id, id);
			assert.strictEqual(requestedApplication?.id, requestedApplication?.contents?.application_id);
		});
	});

	describe('FindOneAndUpdate Application', () => {
		it('should populate updated_at field', async () => {
			const applicationRecords = await applicationService.listApplications({ user_id });
			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);

			const { id } = applicationRecords[0];
			await applicationService.findOneAndUpdate({ id, update: {} });

			const updatedApplication = await applicationService.getApplicationById({ id });

			assert.notEqual(updatedApplication, null);
			assert.ok(!!updatedApplication?.updated_at);
		});
	});

	describe('List Applications', () => {
		it('should filter by user_id', async () => {
			const applicationRecords = await applicationService.listApplications({ user_id });

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);
			assert.ok(applicationRecords[1]);
			assert.ok(applicationRecords[2]);

			assert.strictEqual(applicationRecords[0].user_id, user_id);
			assert.strictEqual(applicationRecords[1].user_id, user_id);
			assert.strictEqual(applicationRecords[2].user_id, user_id);
		});

		it('should filter by state', async () => {
			const applicationRecords = await applicationService.listApplications({ state: ApplicationStates.DRAFT });

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);
			assert.ok(applicationRecords[1]);
			assert.ok(applicationRecords[2]);

			assert.strictEqual(applicationRecords[0].state, ApplicationStates.DRAFT);
			assert.strictEqual(applicationRecords[1].state, ApplicationStates.DRAFT);
			assert.strictEqual(applicationRecords[2].state, ApplicationStates.DRAFT);
		});

		it('should allow sorting records by created_at', async () => {
			const applicationRecords = await applicationService.listApplications({
				sort: [
					{
						direction: 'asc',
						column: 'created_at',
					},
				],
			});

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);
			assert.ok(applicationRecords[1]);
			assert.ok(applicationRecords[2]);

			const date1 = applicationRecords[0].createdAt.valueOf();
			const date2 = applicationRecords[1].createdAt.valueOf();
			const date3 = applicationRecords[2].createdAt.valueOf();

			assert.ok(date1 < date2);
			assert.ok(date2 < date3);
		});

		it('should allow sorting records by updated_at', async () => {
			const applicationRecords = await applicationService.listApplications({ user_id });

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);
			assert.ok(applicationRecords[1]);
			assert.ok(applicationRecords[2]);

			const { id: zeroRecordId } = applicationRecords[0];
			const { id: firstRecordId } = applicationRecords[1];
			const { id: secondRecordId } = applicationRecords[2];

			// State values are used in the next test so first record remains in 'Draft', this is just populating `updatedAt`
			await applicationService.findOneAndUpdate({ id: zeroRecordId, update: {} });
			await applicationService.findOneAndUpdate({ id: firstRecordId, update: { state: ApplicationStates.APPROVED } });
			await applicationService.findOneAndUpdate({ id: secondRecordId, update: { state: ApplicationStates.REJECTED } });

			const updatedRecords = await applicationService.listApplications({ user_id });

			assert.ok(Array.isArray(updatedRecords));
			assert.ok(updatedRecords[0]);
			assert.ok(updatedRecords[1]);
			assert.ok(updatedRecords[2]);

			const date1 = updatedRecords[0].updatedAt?.valueOf();
			const date2 = updatedRecords[1].updatedAt?.valueOf();
			const date3 = updatedRecords[2].updatedAt?.valueOf();

			assert.ok(date1 && date2 && date1 < date2);
			assert.ok(date2 && date3 && date2 < date3);
		});

		it('should allow sorting records by state', async () => {
			const applicationRecords = await applicationService.listApplications({
				sort: [
					{
						direction: 'asc',
						column: 'state',
					},
				],
			});

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords.length >= 3);

			const draftRecordIndex = applicationRecords.findIndex((record) => record.state === ApplicationStates.DRAFT);
			const rejectedRecordIndex = applicationRecords.findIndex((record) => record.state === ApplicationStates.REJECTED);
			const approvedRecordIndex = applicationRecords.findIndex((record) => record.state === ApplicationStates.APPROVED);

			assert.ok(draftRecordIndex < rejectedRecordIndex);
			assert.ok(rejectedRecordIndex < approvedRecordIndex);
		});

		it('should allow record pagination', async () => {
			await addPaginationDonors(db);

			const paginatedRecords = await applicationService.listApplications({ user_id, page: 1, pageSize: 10 });

			// Test that only 10 were returned
			assert.ok(Array.isArray(paginatedRecords));
			assert.strictEqual(paginatedRecords.length, 10);

			const allRecords = await applicationService.listApplications({ user_id });

			assert.ok(Array.isArray(allRecords));

			const lastPaginatedIndex = paginatedRecords.length - 1;
			const middleIndex = allRecords.length - 10;
			const lastIndex = allRecords.length - 1;

			assert.ok(paginatedRecords[0]);
			assert.ok(paginatedRecords[lastPaginatedIndex]);
			assert.ok(allRecords[middleIndex]);
			assert.ok(allRecords[lastIndex]);

			// Test that pagination returned 'page 2' of the results
			assert.strictEqual(paginatedRecords[0].id, allRecords[middleIndex].id);
			assert.strictEqual(paginatedRecords[lastPaginatedIndex].id, allRecords[lastIndex].id);
		});

		after(async () => {
			await db.delete(applications).where(eq(applications.user_id, user_id));
		});
	});

	describe('Edit Applications', () => {
		before(async () => {
			await addInitialApplications(db);
		});

		it('should allow editing applications with status DRAFT and submitted user_id', async () => {
			const applicationRecords = await applicationService.listApplications({ user_id });

			assert.ok(Array.isArray(applicationRecords) && applicationRecords[0]);

			const { id } = applicationRecords[0];

			const update = { applicant_first_name: 'Test' };

			const editedApplication = await applicationService.editApplication({ id, update });

			assert.ok(editedApplication && editedApplication.contents);
			assert.strictEqual(editedApplication.state, ApplicationStates.DRAFT);
			assert.strictEqual(editedApplication.contents.applicant_first_name, update.applicant_first_name);
		});

		it('should allow editing applications with state DAC_REVIEW, and revert state to DRAFT', async () => {
			const applicationRecords = await applicationService.listApplications({ user_id });

			assert.ok(Array.isArray(applicationRecords) && applicationRecords[0]);

			const { id, state } = applicationRecords[0];

			assert.strictEqual(state, ApplicationStates.DRAFT);

			const stateUpdate = { state: ApplicationStates.INSTITUTIONAL_REP_REVIEW };
			const reviewRecord = await applicationService.findOneAndUpdate({ id, update: stateUpdate });

			assert.ok(Array.isArray(reviewRecord) && reviewRecord[0]);
			assert.strictEqual(reviewRecord[0].state, ApplicationStates.INSTITUTIONAL_REP_REVIEW);

			const contentUpdate = { applicant_last_name: 'User' };
			const editedApplication = await applicationService.editApplication({ id, update: contentUpdate });

			assert.ok(editedApplication && editedApplication.contents);
			assert.strictEqual(editedApplication.id, id);
			assert.strictEqual(editedApplication.state, ApplicationStates.DRAFT);
			assert.strictEqual(editedApplication.contents.applicant_last_name, contentUpdate.applicant_last_name);
		});

		// TODO: Move test to API
		it.skip('should error and return null when application state is not draft or review', async () => {
			const applicationRecords = await applicationService.listApplications({ user_id });

			assert.ok(Array.isArray(applicationRecords) && applicationRecords[0]);

			const { id, state } = applicationRecords[0];

			assert.strictEqual(state, ApplicationStates.DRAFT);

			const stateUpdate = { state: ApplicationStates.DAC_REVISIONS_REQUESTED };
			const reviewRecord = await applicationService.findOneAndUpdate({ id, update: stateUpdate });

			assert.ok(Array.isArray(reviewRecord) && reviewRecord[0]);
			assert.strictEqual(reviewRecord[0].state, ApplicationStates.DAC_REVISIONS_REQUESTED);

			const contentUpdate = { applicant_title: 'Dr.' };
			const editedApplication = await applicationService.editApplication({ id, update: contentUpdate });

			assert.ok(!editedApplication);
		});
	});

	after(async () => {
		await db.delete(applications).where(eq(applications.user_id, user_id));
		await container.stop();
		process.exit(0);
	});
});