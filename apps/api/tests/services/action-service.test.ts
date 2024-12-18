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
import { applications } from '@/db/schemas/applications.js';
import service from '@/service/action-service.js';
import appService from '@/service/application-service.js';
import { ApplicationActions, ApplicationStates } from '@pcgl-daco/data-model/src/types.js';

import {
	addInitialApplications,
	testApplicationId as application_id,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
	testUserId as user_id,
} from '../testUtils.js';

describe('Action Service', () => {
	let db: PostgresDb;
	let actionService: ReturnType<typeof service>;
	let applicationService: ReturnType<typeof appService>;
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

		actionService = service(db);
		applicationService = appService(db);
	});

	describe('All Actions', () => {
		it('should perform CREATE actions with before state DRAFT and after state DRAFT', async () => {
			const testApplicationResult = await applicationService.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await actionService.createAction(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.CREATE);
			assert.strictEqual(actionResult.state_before, ApplicationStates.DRAFT);
			assert.strictEqual(actionResult.state_after, ApplicationStates.DRAFT);
		});

		it('should perform WITHDRAW actions with after state DRAFT', async () => {
			const testApplicationResult = await applicationService.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await actionService.withdrawAction(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.WITHDRAW);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.DRAFT);
		});

		it('should perform CLOSE actions with after state CLOSED', async () => {
			const testApplicationResult = await applicationService.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await actionService.closeAction(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.CLOSE);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.CLOSED);
		});

		it('should perform REQUEST_INSTITUTIONAL_REP actions with after state REP_REVISION', async () => {
			const testApplicationResult = await applicationService.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await actionService.requestRepAction(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.REQUEST_INSTITUTIONAL_REP);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.REP_REVISION);
		});

		it('should perform INSTITUTIONAL_REP_APPROVED actions with after state DAC_REVIEW', async () => {
			const testApplicationResult = await applicationService.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await actionService.repApprovedAction(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.INSTITUTIONAL_REP_APPROVED);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.DAC_REVIEW);
		});

		it('should perform INSTITUTIONAL_REP_REJECTED actions with after state REJECTED', async () => {
			const testApplicationResult = await applicationService.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await actionService.repRejectedAction(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.INSTITUTIONAL_REP_REJECTED);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.DRAFT);
		});

		it('should perform DAC_REVIEW_APPROVED actions with after state APPROVED', async () => {
			const testApplicationResult = await applicationService.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await actionService.dacApprovedAction(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.DAC_REVIEW_APPROVED);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.APPROVED);
		});

		it('should perform DAC_REVIEW_REJECTED actions with after state REJECTED', async () => {
			const testApplicationResult = await applicationService.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await actionService.dacRejectedAction(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.DAC_REVIEW_REJECTED);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.REJECTED);
		});

		it('should perform DAC_REVIEW_REVISIONS actions with after state DAC_REVISIONS_REQUESTED', async () => {
			const testApplicationResult = await applicationService.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await actionService.dacRevisionAction(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.DAC_REVIEW_REVISIONS);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.DAC_REVIEW);
		});

		it('should perform REVOKE actions with after state REVOKED', async () => {
			const testApplicationResult = await applicationService.getApplicationById({ id: 1 });
			assert.ok(testApplicationResult.success && testApplicationResult.data);
			const testApplication = testApplicationResult.data;

			const result = await actionService.revokeAction(testApplication);

			assert.ok(result.success && result.data);

			const actionResult = result.data;

			assert.strictEqual(actionResult.user_id, user_id);
			assert.strictEqual(actionResult.application_id, application_id);
			assert.strictEqual(actionResult.action, ApplicationActions.REVOKE);
			assert.strictEqual(actionResult.state_before, testApplication.state);
			assert.strictEqual(actionResult.state_after, ApplicationStates.REVOKED);
		});
	});

	after(async () => {
		await db.delete(actions).where(eq(actions.user_id, user_id));
		await db.delete(applications).where(eq(applications.user_id, user_id));
		await container.stop();
		process.exit(0);
	});
});
