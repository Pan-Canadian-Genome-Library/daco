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
import { applicationActions } from '@/db/schemas/applicationActions.js';
import { applications } from '@/db/schemas/applications.js';
import { applicationActionService } from '@/service/applicationActionService.js';
import { applicationService } from '@/service/applicationService.js';
import {
	type ApplicationActionsColumnName,
	type ApplicationActionService,
	type ApplicationService,
	type OrderBy,
} from '@/service/types.js';
import { ApplicationActions, ApplicationStates } from '@pcgl-daco/data-model/src/types.js';

import {
	addInitialApplications,
	testApplicationId as application_id,
	testActionId as id,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
	testUserId as user_id,
} from '../testUtils.js';

describe('Action Service', () => {
	let db: PostgresDb;
	let testActionRepo: ApplicationActionService;
	let testApplicationRepo: ApplicationService;
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

		testActionRepo = applicationActionService(db);
		testApplicationRepo = applicationService(db);
	});

	describe('All Actions', () => {
		it('should perform CREATE actions with before state DRAFT and after state DRAFT', async () => {
			const testApplicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await testActionRepo.create(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.CREATE);
			assert.strictEqual(actionResult.state_before, ApplicationStates.DRAFT);
			assert.strictEqual(actionResult.state_after, ApplicationStates.DRAFT);
		});

		it('should perform WITHDRAW actions with after state DRAFT', async () => {
			const testApplicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await testActionRepo.withdraw(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.WITHDRAW);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.DRAFT);
		});

		it('should perform CLOSE actions with after state CLOSED', async () => {
			const testApplicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await testActionRepo.close(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.CLOSE);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.CLOSED);
		});

		it('should perform REQUEST_REP_REVIEW actions with after state INSTITUTIONAL_REP_REVIEW', async () => {
			const testApplicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await testActionRepo.repReview(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.REQUEST_REP_REVIEW);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.INSTITUTIONAL_REP_REVIEW);
		});

		it('should perform INSTITUTIONAL_REP_REVISION actions with after state REP_REVISION', async () => {
			const testApplicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await testActionRepo.repRevision(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.INSTITUTIONAL_REP_REVISION);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.REP_REVISION);
		});

		it('should perform INSTITUTIONAL_REP_SUBMIT actions with after state INSTITUTIONAL_REP_REVIEW', async () => {
			const testApplicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await testActionRepo.repSubmit(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.INSTITUTIONAL_REP_SUBMIT);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.INSTITUTIONAL_REP_REVIEW);
		});

		it('should perform INSTITUTIONAL_REP_APPROVED actions with after state DAC_REVIEW', async () => {
			const testApplicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await testActionRepo.repApproved(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.INSTITUTIONAL_REP_APPROVED);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.DAC_REVIEW);
		});

		it('should perform DAC_REVIEW_APPROVED actions with after state APPROVED', async () => {
			const testApplicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await testActionRepo.dacApproved(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.DAC_REVIEW_APPROVED);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.APPROVED);
		});

		it('should perform DAC_REVIEW_REJECTED actions with after state REJECTED', async () => {
			const testApplicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await testActionRepo.dacRejected(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.DAC_REVIEW_REJECTED);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.REJECTED);
		});

		it('should perform DAC_REVIEW_REVISIONS actions with after state DAC_REVISIONS_REQUESTED', async () => {
			const testApplicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await testActionRepo.dacRevision(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.DAC_REVIEW_REVISIONS);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.DAC_REVISIONS_REQUESTED);
		});

		it('should perform DAC_REVIEW_SUBMIT actions with after state DAC_REVIEW', async () => {
			const testApplicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await testActionRepo.dacSubmit(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.DAC_REVIEW_SUBMIT);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.DAC_REVIEW);
		});

		it('should perform REVOKE actions with after state REVOKED', async () => {
			const testApplicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await testActionRepo.revoke(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.REVOKE);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.REVOKED);
		});
	});

	describe('Get Actions', () => {
		it('should get actions requested by id', async () => {
			const actionResult = await testActionRepo.getActionById({ id });

			assert.ok(actionResult.success && actionResult.data);

			const actionRecord = actionResult.data;

			assert.strictEqual(actionRecord.id, id);
		});

		it('should get all actions requested by user id', async () => {
			const actionResult = await testActionRepo.listActions({ user_id });

			assert.ok(actionResult.success && actionResult.data);

			const actionRecords = actionResult.data;

			assert.ok(Array.isArray(actionRecords) && actionRecords[0]);
			assert.strictEqual(actionRecords[0].user_id, user_id);
		});

		it('should get all actions requested by application id', async () => {
			const actionResult = await testActionRepo.listActions({ application_id });

			assert.ok(actionResult.success && actionResult.data);

			const actionRecords = actionResult.data;

			assert.ok(Array.isArray(actionRecords) && actionRecords[0]);
			assert.strictEqual(actionRecords[0].application_id, application_id);
		});

		it('should allow sorting requested actions by id', async () => {
			const sort: Array<OrderBy<ApplicationActionsColumnName>> = [
				{
					direction: 'desc',
					column: 'id',
				},
			];
			const actionResult = await testActionRepo.listActions({ application_id, sort });

			assert.ok(actionResult.success && actionResult.data);

			const actionRecords = actionResult.data;

			assert.ok(Array.isArray(actionRecords));

			const firstRecord = actionRecords[0];
			const lastRecord = actionRecords[actionRecords.length - 1];

			assert.ok(firstRecord && lastRecord);
			assert.ok(firstRecord.id > lastRecord.id);
		});

		it('should allow sorting requested actions by created_at', async () => {
			const sort: Array<OrderBy<ApplicationActionsColumnName>> = [
				{
					direction: 'desc',
					column: 'created_at',
				},
			];
			const actionResult = await testActionRepo.listActions({ application_id, sort });

			assert.ok(actionResult.success && actionResult.data);

			const actionRecords = actionResult.data;

			assert.ok(Array.isArray(actionRecords));

			const firstRecord = actionRecords[0];
			const lastRecord = actionRecords[actionRecords.length - 1];

			assert.ok(firstRecord && lastRecord);
			assert.ok(firstRecord.created_at > lastRecord.created_at);
		});
	});

	after(async () => {
		await db.delete(applicationActions).where(eq(applicationActions.user_id, user_id));
		await db.delete(applications).where(eq(applications.user_id, user_id));
		await container.stop();
		process.exit(0);
	});
});
