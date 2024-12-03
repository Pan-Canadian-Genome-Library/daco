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

import { ApplicationStates, ApplicationStateValues } from '@pcgl-daco/data-model/src/types.js';
import { ApplicationEvents, ApplicationManager, createApplicationManager } from '../../src/api/states.js';
import { connectToDb, type PostgresDb } from '../../src/db/index.js';
import { addInitialApplications, initTestMigration, PG_DATABASE, PG_PASSWORD, PG_USER } from '../testUtils.js';

const { DRAFT, INSTITUTIONAL_REP_REVIEW, REP_REVISION, DAC_REVIEW, DAC_REVISIONS_REQUESTED, APPROVED } =
	ApplicationStates;

describe('State Machine', () => {
	let db: PostgresDb;
	let container: StartedPostgreSqlContainer;
	let manager: ApplicationManager;

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
	});

	describe('Application Manager', () => {
		it('create Application Manager classes', async () => {
			manager = await createApplicationManager({ id: 1 });

			assert.ok(manager);
		});
	});

	describe('Application State Machine', () => {
		let value: ApplicationStateValues = DRAFT;

		it('should initialize with state DRAFT', () => {
			value = manager.getState();
			assert.strictEqual(value, DRAFT);
		});

		it('should change from DRAFT to INSTITUTIONAL_REP_REVIEW on submit', async () => {
			await manager.dispatch(ApplicationEvents.submit);
			value = manager.getState();
			assert.strictEqual(value, INSTITUTIONAL_REP_REVIEW);
		});

		it('should change from INSTITUTIONAL_REP_REVIEW to DRAFT on edit', async () => {
			await manager.dispatch(ApplicationEvents.edit);
			value = manager.getState();
			assert.strictEqual(value, DRAFT);
		});

		it('should change from INSTITUTIONAL_REP_REVIEW to REP_REVISION on revision_request', async () => {
			await manager.dispatch(ApplicationEvents.submit);
			await manager.dispatch(ApplicationEvents.revision_request);
			value = manager.getState();
			assert.strictEqual(value, REP_REVISION);
		});

		it('should change from REP_REVISION to INSTITUTIONAL_REP_REVIEW on submit', async () => {
			if (manager.can(ApplicationEvents.submit)) {
				await manager.dispatch(ApplicationEvents.submit);
				value = manager.getState();
				assert.strictEqual(value, INSTITUTIONAL_REP_REVIEW);
			}
		});

		it('should change from INSTITUTIONAL_REP_REVIEW to DAC_REVIEW on submit', async () => {
			await manager.dispatch(ApplicationEvents.submit);
			value = manager.getState();
			assert.strictEqual(value, DAC_REVIEW);
		});

		it('should change from DAC_REVIEW to DAC_REVISIONS_REQUESTED on revision_request', async () => {
			await manager.dispatch(ApplicationEvents.revision_request);
			value = manager.getState();
			assert.strictEqual(value, DAC_REVISIONS_REQUESTED);
		});

		it('should change from DAC_REVISIONS_REQUESTED to DAC_REVIEW on submit', async () => {
			await manager.dispatch(ApplicationEvents.submit);
			value = manager.getState();
			assert.strictEqual(value, DAC_REVIEW);
		});

		it('should change from DAC_REVIEW to APPROVED on approval', async () => {
			await manager.dispatch(ApplicationEvents.approve);
			value = manager.getState();
			assert.strictEqual(value, APPROVED);
		});
	});

	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
