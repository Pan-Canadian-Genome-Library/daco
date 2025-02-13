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

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';

import { ApplicationStateManager, createApplicationStateManager } from '@/controllers/stateManager.js';
import { connectToDb, type PostgresDb } from '@/db/index.js';
import { applicationActions } from '@/db/schemas/applicationActions.js';
import { applications } from '@/db/schemas/applications.js';
import { applicationActionSvc } from '@/service/applicationActionService.js';
import { applicationSvc } from '@/service/applicationService.js';
import { type ApplicationActionService, type ApplicationService } from '@/service/types.js';
import { ApplicationActions, ApplicationStates, type ApplicationStateValues } from '@pcgl-daco/data-model/src/types.js';
import { addInitialApplications, initTestMigration, PG_DATABASE, PG_PASSWORD, PG_USER } from '../testUtils.js';

const {
	APPROVED,
	CLOSED,
	DAC_REVIEW,
	DAC_REVISIONS_REQUESTED,
	DRAFT,
	INSTITUTIONAL_REP_REVIEW,
	REJECTED,
	INSTITUTIONAL_REP_REVISION_REQUESTED,
	REVOKED,
} = ApplicationStates;

describe('State Machine', () => {
	let db: PostgresDb;
	let container: StartedPostgreSqlContainer;
	let testStateManager: ApplicationStateManager;

	let testActionRepo: ApplicationActionService;
	let testApplicationRepo: ApplicationService;

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

		testActionRepo = applicationActionSvc(db);
		testApplicationRepo = applicationSvc(db);
	});

	describe('Application State Manager', () => {
		let stateValue: ApplicationStateValues = DRAFT;

		it('create Application State Manager classes', async () => {
			const result = await createApplicationStateManager({ id: 1 });
			assert.ok(result.success);

			testStateManager = result.data;
			assert.ok(testStateManager);
		});

		it('should initialize with state DRAFT', () => {
			stateValue = testStateManager.getState();
			assert.strictEqual(stateValue, DRAFT);
		});

		it('should change from DRAFT to DRAFT on edit', async () => {
			await testStateManager.editDraft();
			stateValue = testStateManager.getState();
			assert.strictEqual(stateValue, DRAFT);
		});

		it('should change from DRAFT to CLOSED on close', async () => {
			const result = await createApplicationStateManager({ id: 2 });
			assert.ok(result.success);

			const draftReviewManager = result.data;
			await draftReviewManager.closeDraft();
			stateValue = draftReviewManager.getState();
			assert.strictEqual(stateValue, CLOSED);
		});

		it('should change from DRAFT to INSTITUTIONAL_REP_REVIEW on submit', async () => {
			await testStateManager.submitDraft();
			stateValue = testStateManager.getState();
			assert.strictEqual(stateValue, INSTITUTIONAL_REP_REVIEW);

			const actionResult = await testActionRepo.listActions({ application_id: 1 });
			assert.ok(actionResult.success && actionResult.data);
			assert.ok(
				actionResult.data.find(
					(record) =>
						record.action === ApplicationActions.SUBMIT_DRAFT &&
						record.state_before === ApplicationStates.DRAFT &&
						record.state_after === ApplicationStates.INSTITUTIONAL_REP_REVIEW,
				),
			);

			const applicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(applicationResult.success && applicationResult.data);
			assert.ok(applicationResult.data.state === 'INSTITUTIONAL_REP_REVIEW');
		});

		it('should change from INSTITUTIONAL_REP_REVIEW to DRAFT on withdraw', async () => {
			const result = await createApplicationStateManager({ id: 1 });
			assert.ok(result.success);
			assert.ok(result.data.state === 'INSTITUTIONAL_REP_REVIEW');

			const dacReviewManager = result.data;
			await dacReviewManager.withdrawRepReview();
			stateValue = dacReviewManager.getState();
			assert.strictEqual(stateValue, DRAFT);

			const actionResult = await testActionRepo.listActions({ application_id: 1 });
			assert.ok(actionResult.success && actionResult.data);
			assert.ok(
				actionResult.data.find(
					(record) =>
						record.action === ApplicationActions.WITHDRAW &&
						record.state_before === ApplicationStates.INSTITUTIONAL_REP_REVIEW &&
						record.state_after === ApplicationStates.DRAFT,
				),
			);
		});

		it('should allow edit on INSTITUTIONAL_REP_REVIEW', async () => {
			const editResult = await testStateManager.editRepReview();
			stateValue = testStateManager.getState();
			assert.ok(editResult.success);
			assert.strictEqual(stateValue, INSTITUTIONAL_REP_REVIEW);
		});

		it('should change from INSTITUTIONAL_REP_REVIEW to CLOSED on close', async () => {
			const result = await createApplicationStateManager({ id: 3 });
			assert.ok(result.success);

			const dacReviewManager = result.data;
			await dacReviewManager.submitDraft();
			stateValue = dacReviewManager.getState();
			assert.strictEqual(stateValue, INSTITUTIONAL_REP_REVIEW);

			await dacReviewManager.closeRepReview();
			stateValue = dacReviewManager.getState();
			assert.strictEqual(stateValue, CLOSED);

			const actionResult = await testActionRepo.listActions({ application_id: 3 });
			assert.ok(actionResult.success && actionResult.data);

			assert.ok(
				actionResult.data.find(
					(record) =>
						record.action === ApplicationActions.CLOSE &&
						record.state_before === ApplicationStates.INSTITUTIONAL_REP_REVIEW &&
						record.state_after === ApplicationStates.CLOSED,
				),
			);
		});

		it('should change from INSTITUTIONAL_REP_REVIEW to INSTITUTIONAL_REP_REVISION_REQUESTED on revision_request', async () => {
			await testStateManager.submitDraft();
			const revisionResult = await testStateManager.reviseRepReview();
			stateValue = testStateManager.getState();
			assert.ok(revisionResult.success);
			assert.strictEqual(stateValue, INSTITUTIONAL_REP_REVISION_REQUESTED);
		});

		it('should change from INSTITUTIONAL_REP_REVISION_REQUESTED to INSTITUTIONAL_REP_REVIEW on submit', async () => {
			stateValue = testStateManager.getState();
			await testStateManager.submitRepRevision();
			stateValue = testStateManager.getState();
			assert.strictEqual(stateValue, INSTITUTIONAL_REP_REVIEW);
		});

		it('should change from INSTITUTIONAL_REP_REVIEW to DAC_REVIEW on approval', async () => {
			stateValue = testStateManager.getState();
			await testStateManager.approveRepReview();
			stateValue = testStateManager.getState();
			assert.strictEqual(stateValue, DAC_REVIEW);

			const actionResult = await testActionRepo.listActions({ application_id: 1 });
			assert.ok(actionResult.success && actionResult.data);
			assert.ok(
				actionResult.data.find(
					(record) =>
						record.action === ApplicationActions.INSTITUTIONAL_REP_APPROVED &&
						record.state_before === ApplicationStates.INSTITUTIONAL_REP_REVIEW &&
						record.state_after === ApplicationStates.DAC_REVIEW,
				),
			);

			const applicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(applicationResult.success && applicationResult.data);
			assert.ok(applicationResult.data.state === ApplicationStates.DAC_REVIEW);
		});

		it('should change from DAC_REVIEW to DAC_REVISIONS_REQUESTED on revision_request', async () => {
			stateValue = testStateManager.getState();
			await testStateManager.reviseDacReview();
			stateValue = testStateManager.getState();
			assert.strictEqual(stateValue, DAC_REVISIONS_REQUESTED);
		});

		it('should change from DAC_REVISIONS_REQUESTED to DAC_REVIEW on submit', async () => {
			stateValue = testStateManager.getState();
			await testStateManager.submitDacRevision();
			stateValue = testStateManager.getState();
			assert.strictEqual(stateValue, DAC_REVIEW);
		});

		it('should change from DAC_REVIEW to REJECTED on rejected', async () => {
			const result = await createApplicationStateManager({ id: 4 });
			assert.ok(result.success);

			const dacReviewManager = result.data;
			await dacReviewManager.submitDraft();
			await dacReviewManager.approveRepReview();
			stateValue = dacReviewManager.getState();
			assert.strictEqual(stateValue, DAC_REVIEW);

			await dacReviewManager.rejectDacReview();
			stateValue = dacReviewManager.getState();
			assert.strictEqual(stateValue, REJECTED);

			const actionResult = await testActionRepo.listActions({ application_id: 4 });
			assert.ok(actionResult.success && actionResult.data);

			assert.ok(
				actionResult.data.find(
					(record) =>
						record.action === ApplicationActions.DAC_REVIEW_REJECTED &&
						record.state_before === ApplicationStates.DAC_REVIEW &&
						record.state_after === ApplicationStates.REJECTED,
				),
			);
		});

		it('should allow edit on DAC_REVIEW', async () => {
			const result = await createApplicationStateManager({ id: 5 });
			assert.ok(result.success);

			const draftReviewManager = result.data;
			await draftReviewManager.submitDraft();
			await draftReviewManager.approveRepReview();
			const editResult = await draftReviewManager.editDacReview();

			stateValue = draftReviewManager.getState();
			assert.ok(editResult.success);
			assert.strictEqual(stateValue, DAC_REVIEW);
		});

		it('should change from DAC_REVIEW to CLOSED on close', async () => {
			const result = await createApplicationStateManager({ id: 5 });
			assert.ok(result.success);

			const dacStateManager = result.data;
			await dacStateManager.submitDraft();
			await dacStateManager.approveRepReview();

			stateValue = dacStateManager.getState();
			assert.strictEqual(stateValue, DAC_REVIEW);

			await dacStateManager.closeDacReview();

			stateValue = dacStateManager.getState();
			assert.strictEqual(stateValue, CLOSED);

			const actionResult = await testActionRepo.listActions({ application_id: 5 });
			assert.ok(actionResult.success && actionResult.data);
			assert.ok(
				actionResult.data.find(
					(record) =>
						record.action === ApplicationActions.CLOSE &&
						record.state_before === ApplicationStates.DAC_REVIEW &&
						record.state_after === ApplicationStates.CLOSED,
				),
			);
		});

		it('should change from DAC_REVIEW to APPROVED on approval', async () => {
			stateValue = testStateManager.getState();
			assert.strictEqual(stateValue, DAC_REVIEW);

			await testStateManager.approveDacReview();
			stateValue = testStateManager.getState();
			assert.strictEqual(stateValue, APPROVED);

			const actionResult = await testActionRepo.listActions({ application_id: 1 });
			assert.ok(actionResult.success && actionResult.data);
			assert.ok(
				actionResult.data.find(
					(record) =>
						record.action === ApplicationActions.DAC_REVIEW_APPROVED &&
						record.state_before === ApplicationStates.DAC_REVIEW &&
						record.state_after === ApplicationStates.APPROVED,
				),
			);

			const applicationResult = await testApplicationRepo.getApplicationById({ id: 1 });
			assert.ok(applicationResult.success && applicationResult.data);
			assert.ok(applicationResult.data.state === ApplicationStates.APPROVED);
		});

		it('should change from APPROVED to REVOKED on revoked', async () => {
			await testStateManager.revokeApproval();
			stateValue = testStateManager.getState();
			assert.strictEqual(stateValue, REVOKED);
		});
	});

	after(async () => {
		await db.delete(applicationActions);
		await db.delete(applications);
		await container.stop();
		process.exit(0);
	});
});
