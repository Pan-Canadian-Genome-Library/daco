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
import { after, before, describe, it } from 'node:test';

import { connectToDb, type PostgresDb } from '@/db/index.js';
import { applicationSvc } from '@/service/applicationService.js';
import { type ApplicationService } from '@/service/types.js';
import { ApplicationStates } from '@pcgl-daco/data-model/src/types.js';

import {
	addInitialApplications,
	addPaginationDonors,
	allRecordsPageSize,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
	testUserId as user_id,
} from '../utils/testUtils.ts';

describe('Application Service', () => {
	let db: PostgresDb;
	let testApplicationService: ApplicationService;
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

		testApplicationService = applicationSvc(db);
	});

	describe('Get Applications', () => {
		it('should get applications requested by id, with application_contents', async () => {
			const applicationRecordsResult = await testApplicationService.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			const applicationRecords = applicationRecordsResult.data.applications;

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);

			const { id } = applicationRecords[0];

			const result = await testApplicationService.getApplicationWithContents({ id });

			assert.ok(result.success);

			const requestedApplication = result.data;
			assert.strictEqual(requestedApplication?.id, id);
			assert.strictEqual(requestedApplication?.id, requestedApplication?.contents?.application_id);
		});
	});

	describe('List Applications', () => {
		it('should filter by user_id', async () => {
			const applicationRecordsResult = await testApplicationService.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);
			const applicationRecords = applicationRecordsResult.data.applications;

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);
			assert.ok(applicationRecords[1]);
			assert.ok(applicationRecords[2]);

			assert.strictEqual(applicationRecords[0].userId, user_id);
			assert.strictEqual(applicationRecords[1].userId, user_id);
			assert.strictEqual(applicationRecords[2].userId, user_id);
		});

		it('should filter by state', async () => {
			const applicationRecordsResult = await testApplicationService.listApplications({
				state: [ApplicationStates.DRAFT],
			});

			assert.ok(applicationRecordsResult.success);
			const applicationRecords = applicationRecordsResult.data.applications;

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);
			assert.ok(applicationRecords[1]);
			assert.ok(applicationRecords[2]);

			assert.strictEqual(applicationRecords[0].state, ApplicationStates.DRAFT);
			assert.strictEqual(applicationRecords[1].state, ApplicationStates.DRAFT);
			assert.strictEqual(applicationRecords[2].state, ApplicationStates.DRAFT);
		});

		it('should allow sorting records by created_at', async () => {
			const applicationRecordsResult = await testApplicationService.listApplications({
				sort: [
					{
						direction: 'asc',
						column: 'created_at',
					},
				],
			});

			assert.ok(applicationRecordsResult.success);
			const applicationRecords = applicationRecordsResult.data.applications;

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

		it('should allow sorting records by updated_at asc', async () => {
			const updatedRecordsResult = await testApplicationService.listApplications({
				user_id,
				sort: [
					{
						direction: 'asc',
						column: 'updated_at',
					},
				],
			});

			assert.ok(updatedRecordsResult.success);
			const updatedRecords = updatedRecordsResult.data.applications;

			assert.ok(Array.isArray(updatedRecords));
			assert.ok(updatedRecords[0]);
			assert.ok(updatedRecords[1]);
			assert.ok(updatedRecords[2]);

			const date1 = updatedRecords[0].updatedAt?.valueOf();
			const date2 = updatedRecords[1].updatedAt?.valueOf();
			const date3 = updatedRecords[2].updatedAt?.valueOf();

			assert.ok(date1 && date2 && date3);
			assert.ok(date1 < date2);
			assert.ok(date2 < date3);
		});

		it('should allow sorting records by updated_at desc', async () => {
			const updatedRecordsResult = await testApplicationService.listApplications({
				user_id,
				sort: [
					{
						direction: 'asc',
						column: 'updated_at',
					},
				],
			});

			assert.ok(updatedRecordsResult.success);
			const updatedRecords = updatedRecordsResult.data.applications;

			assert.ok(Array.isArray(updatedRecords));
			assert.ok(updatedRecords[0]);
			assert.ok(updatedRecords[1]);
			assert.ok(updatedRecords[2]);

			const date1 = updatedRecords[0].updatedAt?.valueOf();
			const date2 = updatedRecords[1].updatedAt?.valueOf();
			const date3 = updatedRecords[2].updatedAt?.valueOf();

			assert.ok(date1 && date2 && date3);
			assert.ok(date1 < date2);
			assert.ok(date2 < date3);
		});

		it('should allow sorting records by state', async () => {
			const applicationRecordsResult = await testApplicationService.listApplications({
				sort: [
					{
						direction: 'asc',
						column: 'state',
					},
				],
				pageSize: allRecordsPageSize,
			});
			assert.ok(applicationRecordsResult.success);
			const { applications, pagingMetadata } = applicationRecordsResult.data;

			assert.ok(Array.isArray(applications));
			assert.ok((applications.length = pagingMetadata.pageSize));

			const draftRecordIndex = applications.findIndex((record) => record.state === ApplicationStates.DRAFT);
			const rejectedRecordIndex = applications.findIndex((record) => record.state === ApplicationStates.REJECTED);
			const approvedRecordIndex = applications.findIndex((record) => record.state === ApplicationStates.APPROVED);

			assert.ok(draftRecordIndex < rejectedRecordIndex);
			assert.ok(rejectedRecordIndex < approvedRecordIndex);
		});

		it('should return proper totals amount', async () => {
			const applicationRecordsResult = await testApplicationService.listApplications({ user_id });
			assert.ok(applicationRecordsResult.success);
			const { applications, totals } = applicationRecordsResult.data;
			assert.ok(totals);

			const localTotals = applications.reduce(
				(acc, currentApp) => {
					switch (currentApp.state) {
						case 'DRAFT':
							acc.DRAFT++;
							break;
						case 'APPROVED':
							acc.APPROVED++;
							break;
						case 'CLOSED':
							acc.CLOSED++;
							break;
						case 'DAC_REVIEW':
							acc.DAC_REVIEW++;
							break;
						case 'DAC_REVISIONS_REQUESTED':
							acc.DAC_REVISIONS_REQUESTED++;
							break;
						case 'INSTITUTIONAL_REP_REVIEW':
							acc.INSTITUTIONAL_REP_REVIEW++;
							break;
						case 'INSTITUTIONAL_REP_REVISION_REQUESTED':
							acc.INSTITUTIONAL_REP_REVISION_REQUESTED++;
							break;
						case 'REJECTED':
							acc.REJECTED++;
							break;
						case 'REVOKED':
							acc.REVOKED++;
							break;
					}
					acc.TOTAL++;
					return acc;
				},
				{
					DRAFT: 0,
					INSTITUTIONAL_REP_REVIEW: 0,
					INSTITUTIONAL_REP_REVISION_REQUESTED: 0,
					DAC_REVIEW: 0,
					DAC_REVISIONS_REQUESTED: 0,
					REJECTED: 0,
					APPROVED: 0,
					CLOSED: 0,
					REVOKED: 0,
					TOTAL: 0,
				},
			);

			assert.strictEqual(totals.DRAFT, localTotals.DRAFT);
			assert.strictEqual(totals.INSTITUTIONAL_REP_REVIEW, localTotals.INSTITUTIONAL_REP_REVIEW);
			assert.strictEqual(totals.INSTITUTIONAL_REP_REVISION_REQUESTED, localTotals.INSTITUTIONAL_REP_REVISION_REQUESTED);
			assert.strictEqual(totals.DAC_REVIEW, localTotals.DAC_REVIEW);
			assert.strictEqual(totals.DAC_REVISIONS_REQUESTED, localTotals.DAC_REVISIONS_REQUESTED);
			assert.strictEqual(totals.REJECTED, localTotals.REJECTED);
			assert.strictEqual(totals.APPROVED, localTotals.APPROVED);
			assert.strictEqual(totals.CLOSED, localTotals.CLOSED);
			assert.strictEqual(totals.REVOKED, localTotals.REVOKED);
			assert.strictEqual(totals.TOTAL, localTotals.TOTAL);
		});

		it('should allow record pagination', async () => {
			await addPaginationDonors(db); // Add extra pagination values

			const paginationResult = await testApplicationService.listApplications({ user_id, page: 2, pageSize: 10 });

			assert.ok(paginationResult.success);
			const paginatedRecords = paginationResult.data.applications;

			assert.ok(Array.isArray(paginatedRecords));
			assert.strictEqual(paginatedRecords.length, 10);

			const allRecordsResult = await testApplicationService.listApplications({ user_id, page: 1, pageSize: 20 });
			assert.ok(allRecordsResult.success);

			const allRecords = allRecordsResult.data.applications;
			assert.ok(Array.isArray(allRecords));

			//  Check if first record of paginationResult is equal to the middle record in allRecordsResult
			const firstPaginatedIndex = paginatedRecords.length - 1;
			const middleIndex = allRecords.length / 2 - 1;

			assert.ok(paginatedRecords[firstPaginatedIndex]);
			assert.ok(allRecords[middleIndex]);

			assert.strictEqual(paginatedRecords[firstPaginatedIndex].id, allRecords[middleIndex].id);
		});
	});

	describe('Create Applications', () => {
		it('should create applications with status DRAFT and submitted user_id', async () => {
			const applicationResult = await testApplicationService.createApplication({ user_id });

			assert.ok(applicationResult.success && applicationResult.data);

			const application = applicationResult.data;

			assert.strictEqual(application?.user_id, user_id);
			assert.strictEqual(application?.state, ApplicationStates.DRAFT);
		});
	});

	describe('FindOneAndUpdate Application', () => {
		it('should populate updated_at field', async () => {
			const applicationRecordsResult = await testApplicationService.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			const applicationRecords = applicationRecordsResult.data.applications;

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);

			const { id } = applicationRecords[0];
			await testApplicationService.findOneAndUpdate({ id, update: {} });

			const result = await testApplicationService.getApplicationById({ id });

			assert.ok(result.success);

			const updatedApplication = result.data;

			assert.ok(!!updatedApplication?.updated_at);
		});
	});

	describe('Edit Applications', () => {
		it('should allow editing applications and return record with updated fields', async () => {
			const applicationRecordsResult = await testApplicationService.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			const applicationRecords = applicationRecordsResult.data.applications;

			assert.ok(Array.isArray(applicationRecords) && applicationRecords[0]);

			const { id } = applicationRecords[0];

			const update = { applicant_first_name: 'Test' };

			const result = await testApplicationService.editApplication({ id, update });

			assert.ok(result.success);

			const editedApplication = result.data;

			assert.ok(editedApplication.contents);
			assert.strictEqual(editedApplication.contents.applicant_first_name, update.applicant_first_name);
		});
	});

	describe('Get Application Metadata', () => {
		it('should list statistics for how many applications are in each state category', async () => {
			const appStateTotals = await testApplicationService.applicationStateTotals();
			assert.ok(appStateTotals.success);

			const allStates = appStateTotals.data;

			const allApplications = await testApplicationService.listApplications({
				user_id,
				pageSize: allRecordsPageSize,
			});
			assert.ok(allApplications.success);

			const applicationRecords = allApplications.data.applications;

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(allStates);

			const allDraftRecords = applicationRecords.filter((records) => records.state === 'DRAFT');

			assert.equal(allStates.DRAFT, allDraftRecords.length);
			assert.equal(allStates.TOTAL, applicationRecords.length);
		});
	});

	describe('Application Comments', () => {
		const testApplicationId = 4;
		// Create test data
		before(async () => {
			await testApplicationService.createDacComment({
				applicationId: testApplicationId,
				section: 'intro',
				message: 'Intro comment',
				toDacChair: false,
				userId: 'TEST-003',
				userName: 'Jeff',
			});
			await testApplicationService.createDacComment({
				applicationId: testApplicationId,
				section: 'intro',
				message: 'Intro comment again',
				toDacChair: false,
				userId: 'TEST-003',
				userName: 'Jeff',
			});
			await testApplicationService.createDacComment({
				applicationId: testApplicationId,
				section: 'project',
				message: 'Trying this out',
				toDacChair: false,
				userId: 'TEST-005',
				userName: 'Mina',
			});
			await testApplicationService.createDacComment({
				applicationId: testApplicationId,
				section: 'project',
				message: 'Lispsum',
				toDacChair: true,
				userId: 'TEST-005',
				userName: 'Mina',
			});
		});

		it('should create a dac comment and also retrieve created comment', async () => {
			const result = await testApplicationService.createDacComment({
				applicationId: 1,
				section: 'project',
				message: 'Hello test comment',
				toDacChair: false,
				userId: 'TEST-001',
				userName: 'Julia',
			});

			assert.ok(result.success);
			const dacCommentResult = await testApplicationService.getDacComment({
				applicationId: 1,
				section: 'project',
				isDac: false,
			});

			assert.ok(dacCommentResult.success);
			assert.ok(Array.isArray(dacCommentResult.data) && dacCommentResult.data.length > 0);
			assert.ok(dacCommentResult.data[0]?.applicationId === 1);
		});

		it('should only retrieve the intro', async () => {
			const dacCommentResult = await testApplicationService.getDacComment({
				applicationId: testApplicationId,
				section: 'intro',
				isDac: false,
			});

			assert.ok(dacCommentResult.success);
			assert.ok(Array.isArray(dacCommentResult.data) && dacCommentResult.data.length === 2);
		});

		it('should retrieve dac comments if dac_chair_only is false', async () => {
			const dacCommentResult = await testApplicationService.getDacComment({
				applicationId: testApplicationId,
				section: 'project',
				isDac: false,
			});

			assert.ok(dacCommentResult.success);
			assert.ok(Array.isArray(dacCommentResult.data) && dacCommentResult.data.length === 1);
		});

		it('should retrieve all dac comments regardless dac_chair_only because user is DAC', async () => {
			const dacCommentResult = await testApplicationService.getDacComment({
				applicationId: testApplicationId,
				section: 'project',
				isDac: true,
			});

			assert.ok(dacCommentResult.success);
			assert.ok(Array.isArray(dacCommentResult.data) && dacCommentResult.data.length === 2);
		});
	});

	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
