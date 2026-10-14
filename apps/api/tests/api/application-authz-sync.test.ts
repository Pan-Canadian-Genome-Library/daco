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

import assert from 'node:assert';
import { after, afterEach, before, beforeEach, describe, it, mock } from 'node:test';

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

import { approveApplication, revokeApplication } from '@/controllers/applicationController.js';
import { connectToDb, type PostgresDb } from '@/db/index.js';
import { applicationSvc } from '@/service/applicationService.js';
import { collaboratorsSvc } from '@/service/collaboratorsService.js';
import { type ApplicationService } from '@/service/types.js';
import { ApplicationStates, type ApplicationStateValues } from '@pcgl-daco/data-model/src/types.js';

import {
	addStudyAndDacUsers,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
	testUserId,
} from '../utils/testUtils.ts';

type StudyBehaviour = 'ok' | 'fail' | 'not_found';

type AuthZCall = { method: string; studyId: string; body: { collaborator_emails?: string[] } };

const STUDY_IDS = ['study1', 'study2'];
const APPLICANT_EMAIL = 'applicant@oicr.on.ca';
const COLLABORATOR_EMAILS = ['collab1@oicr.on.ca', 'collab2@oicr.on.ca'];

describe('Application AuthZ dac_authorizations sync', () => {
	let db: PostgresDb;
	let applicationRepo: ApplicationService;
	let container: StartedPostgreSqlContainer;

	// Per-test behaviour of the mocked AuthZ service, keyed by study id (defaults to 'ok')
	let grantBehaviour: Record<string, StudyBehaviour>;
	let removeBehaviour: Record<string, StudyBehaviour>;
	let authZCalls: AuthZCall[];

	const jsonResponse = (body: unknown, status = 200) =>
		new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

	beforeEach(() => {
		grantBehaviour = {};
		removeBehaviour = {};
		authZCalls = [];

		mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
			const url = String(input);

			if (url.endsWith('/verify')) {
				return jsonResponse({ token: 'test-service-token' });
			}

			const match = url.match(/\/study\/([^/]+)\/dac_authorizations$/);
			if (match?.[1]) {
				const studyId = match[1];
				const method = init?.method ?? 'GET';
				authZCalls.push({ method, studyId, body: init?.body ? JSON.parse(String(init.body)) : {} });

				const behaviour = (method === 'DELETE' ? removeBehaviour : grantBehaviour)[studyId] ?? 'ok';
				if (behaviour === 'fail') {
					return jsonResponse({ message: 'AuthZ failure' }, 500);
				}
				if (behaviour === 'not_found') {
					return jsonResponse({ message: 'Not found' }, 404);
				}
				return jsonResponse(
					method === 'DELETE' ? { success: [studyId], error: [] } : { success: [studyId], error: [] },
				);
			}

			throw new Error(`Unexpected fetch call in test: ${url}`);
		});
	});

	afterEach(() => {
		mock.restoreAll();
	});

	/** Creates an application with contents in the given state, requesting the given studies */
	const createTestApplication = async (state: ApplicationStateValues, studies: string[] = STUDY_IDS) => {
		const created = await applicationRepo.createApplication({
			user_id: testUserId,
			applicant_institutional_email: APPLICANT_EMAIL,
		});
		assert.ok(created.success);

		const id = created.data.id;
		const edited = await applicationRepo.editApplication({ id, update: { requested_studies: studies } });
		assert.ok(edited.success);

		const collaboratorsResult = await collaboratorsSvc(db).createCollaborators({
			newCollaborators: COLLABORATOR_EMAILS.map((email, index) => ({
				application_id: id,
				first_name: `Collab${index}`,
				last_name: 'Test',
				institutional_email: email,
			})),
		});
		assert.ok(collaboratorsResult.success);

		const updated = await applicationRepo.findOneAndUpdate({ id, update: { state } });
		assert.ok(updated.success);

		return id;
	};

	const getState = async (id: number) => {
		const result = await applicationRepo.getApplicationById({ id });
		assert.ok(result.success);
		return result.data.state;
	};

	const callsFor = (method: string) => authZCalls.filter((call) => call.method === method);
	const collaboratorEmailsSent = (method: string) =>
		callsFor(method).map((call) => [...(call.body.collaborator_emails ?? [])].sort());
	const studiesCalled = (method: string) => [...new Set(callsFor(method).map((call) => call.studyId))].sort();

	before(async () => {
		container = await new PostgreSqlContainer()
			.withUsername(PG_USER)
			.withPassword(PG_PASSWORD)
			.withDatabase(PG_DATABASE)
			.start();

		db = connectToDb(container.getConnectionUri());

		await initTestMigration(db);
		await addStudyAndDacUsers(db);

		applicationRepo = applicationSvc(db);
	});

	describe('Approve Application', () => {
		it('grants dac_authorizations for every requested study and then approves', async () => {
			const id = await createTestApplication(ApplicationStates.DAC_REVIEW);

			const result = await approveApplication({
				applicationId: id,
				approverAccessToken: 'token',
				userName: 'Test User',
			});

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.APPROVED);
			assert.deepStrictEqual(studiesCalled('POST'), STUDY_IDS);
			assert.ok(collaboratorEmailsSent('POST').every((emails) => emails.join() === COLLABORATOR_EMAILS.join()));
			assert.strictEqual(callsFor('DELETE').length, 0);
			assert.strictEqual(await getState(id), ApplicationStates.APPROVED);
		});

		it('does not approve and rolls back the grants when AuthZ fails for a study', async () => {
			const id = await createTestApplication(ApplicationStates.DAC_REVIEW);
			grantBehaviour['study2'] = 'fail';

			const result = await approveApplication({
				applicationId: id,
				approverAccessToken: 'token',
				userName: 'Test User',
			});

			assert.ok(!result.success);
			assert.strictEqual(result.error, 'SYSTEM_ERROR');
			assert.ok(result.message.includes('study2'));
			assert.ok(!result.message.includes('study1'));

			// State was never committed
			assert.strictEqual(await getState(id), ApplicationStates.DAC_REVIEW);

			// Every requested study is cleaned up, including the collaborators' dac_authorizations
			assert.deepStrictEqual(studiesCalled('DELETE'), STUDY_IDS);
			assert.ok(collaboratorEmailsSent('DELETE').every((emails) => emails.join() === COLLABORATOR_EMAILS.join()));
		});

		it('still fails cleanly when the rollback finds nothing to remove (AuthZ 404)', async () => {
			const id = await createTestApplication(ApplicationStates.DAC_REVIEW);
			grantBehaviour['study1'] = 'fail';
			removeBehaviour['study1'] = 'not_found';
			removeBehaviour['study2'] = 'not_found';

			const result = await approveApplication({
				applicationId: id,
				approverAccessToken: 'token',
				userName: 'Test User',
			});

			assert.ok(!result.success);
			assert.strictEqual(await getState(id), ApplicationStates.DAC_REVIEW);
		});

		it('can be approved again after a failed attempt', async () => {
			const id = await createTestApplication(ApplicationStates.DAC_REVIEW);
			grantBehaviour['study2'] = 'fail';

			const failed = await approveApplication({
				applicationId: id,
				approverAccessToken: 'token',
				userName: 'Test User',
			});
			assert.ok(!failed.success);

			grantBehaviour = {};
			const retried = await approveApplication({
				applicationId: id,
				approverAccessToken: 'token',
				userName: 'Test User',
			});

			assert.ok(retried.success);
			assert.strictEqual(await getState(id), ApplicationStates.APPROVED);
		});

		it('does not call AuthZ when the application is not in DAC_REVIEW', async () => {
			const id = await createTestApplication(ApplicationStates.DRAFT);

			const result = await approveApplication({
				applicationId: id,
				approverAccessToken: 'token',
				userName: 'Test User',
			});

			assert.ok(!result.success);
			assert.strictEqual(result.error, 'INVALID_STATE_TRANSITION');
			assert.strictEqual(authZCalls.length, 0);
			assert.strictEqual(await getState(id), ApplicationStates.DRAFT);
		});

		it('does not approve when no studies were requested', async () => {
			const id = await createTestApplication(ApplicationStates.DAC_REVIEW, []);

			const result = await approveApplication({
				applicationId: id,
				approverAccessToken: 'token',
				userName: 'Test User',
			});

			assert.ok(!result.success);
			assert.strictEqual(authZCalls.length, 0);
			assert.strictEqual(await getState(id), ApplicationStates.DAC_REVIEW);
		});
	});

	describe('Revoke Application', () => {
		it('removes dac_authorizations for every requested study and then revokes', async () => {
			const id = await createTestApplication(ApplicationStates.APPROVED);

			const result = await revokeApplication(id, true, 'reason', 'Test User', 'token');

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.REVOKED);
			assert.deepStrictEqual(studiesCalled('DELETE'), STUDY_IDS);
			// The collaborators' emails are required by AuthZ to remove their dac_authorizations
			assert.ok(callsFor('DELETE').length >= STUDY_IDS.length);
			assert.ok(collaboratorEmailsSent('DELETE').every((emails) => emails.join() === COLLABORATOR_EMAILS.join()));
			assert.strictEqual(await getState(id), ApplicationStates.REVOKED);
		});

		it('does not revoke when AuthZ fails for a study, so the revoke can be retried', async () => {
			const id = await createTestApplication(ApplicationStates.APPROVED);
			removeBehaviour['study1'] = 'fail';

			const result = await revokeApplication(id, true, 'reason', 'Test User', 'token');

			assert.ok(!result.success);
			assert.strictEqual(result.error, 'SYSTEM_ERROR');
			assert.ok(result.message.includes('study1'));
			assert.ok(!result.message.includes('study2'));
			assert.strictEqual(await getState(id), ApplicationStates.APPROVED);
		});

		it('can be retried after a partial failure, treating already removed studies (404) as removed', async () => {
			const id = await createTestApplication(ApplicationStates.APPROVED);
			removeBehaviour['study1'] = 'fail';

			const failed = await revokeApplication(id, true, 'reason', 'Test User', 'token');
			assert.ok(!failed.success);

			// study2 was removed by the first attempt so AuthZ now reports 404 for it; study1 recovers
			removeBehaviour = { study1: 'ok', study2: 'not_found' };
			const retried = await revokeApplication(id, true, 'reason', 'Test User', 'token');

			assert.ok(retried.success);
			assert.strictEqual(await getState(id), ApplicationStates.REVOKED);
		});

		it('revokes when AuthZ reports 404 for every study (already removed)', async () => {
			const id = await createTestApplication(ApplicationStates.APPROVED);
			removeBehaviour = { study1: 'not_found', study2: 'not_found' };

			const result = await revokeApplication(id, true, 'reason', 'Test User', 'token');

			assert.ok(result.success);
			assert.strictEqual(await getState(id), ApplicationStates.REVOKED);
		});

		it('does not call AuthZ when the application is not APPROVED', async () => {
			const id = await createTestApplication(ApplicationStates.CLOSED);

			const result = await revokeApplication(id, true, 'reason', 'Test User', 'token');

			assert.ok(!result.success);
			assert.strictEqual(result.error, 'INVALID_STATE_TRANSITION');
			assert.strictEqual(authZCalls.length, 0);
			assert.strictEqual(await getState(id), ApplicationStates.CLOSED);
		});
	});

	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
