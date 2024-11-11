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
import { drizzle } from 'drizzle-orm/node-postgres';

import { ApplicationStates } from 'pcgl-daco/packages/data-model/src/types.ts';
import { applicationService } from '../../service/application-service.ts';

type PostgresDb = ReturnType<typeof drizzle>;

describe('Postgres Database', () => {
	let db: PostgresDb;
	let container: StartedPostgreSqlContainer;

	const user_id = 'testUser@oicr.on.ca';

	before(async () => {
		container = await new PostgreSqlContainer().start();
		const connectionString = container.getConnectionUri();
		db = drizzle(connectionString);
	});

	describe('Connection', () => {
		it('should connect successfully', () => {
			assert.notEqual(db, undefined);
		});
	});

	describe('Applications', () => {
		it('should create applications with status DRAFT and submitted user_id', async () => {
			const applicationRecords = await applicationService.createApplication({ user_id });

			assert.ok(Array.isArray(applicationRecords));
			assert.strictEqual(applicationRecords[0].user_id, user_id);
			assert.strictEqual(applicationRecords[0].state, ApplicationStates.DRAFT);
		});

		it('should get applications requested by id', async () => {
			const applicationRecords = await applicationService.listApplications({ user_id });

			assert.ok(Array.isArray(applicationRecords));

			const { id } = applicationRecords[0];

			const requestedApplication = await applicationService.getApplicationById({ id });

			assert.ok(Array.isArray(requestedApplication));
			assert.strictEqual(requestedApplication[0].id, id);
		});

		it('should list applications filtered by user_id', async () => {
			const applicationRecords = await applicationService.listApplications({ user_id });

			assert.ok(Array.isArray(applicationRecords));
			assert.strictEqual(applicationRecords.length, 1);
		});

		it('should list applications filtered by state', async () => {
			const applicationRecords = await applicationService.listApplications({ state: ApplicationStates.DRAFT });

			assert.ok(Array.isArray(applicationRecords));
			assert.strictEqual(applicationRecords.length, 1);
		});

		it('should delete applications with a given user_id', async () => {
			const deletedRecords = await applicationService.deleteApplication({ user_id });

			assert.ok(Array.isArray(deletedRecords));
			assert.strictEqual(deletedRecords.length, 1);
		});
	});

	after(async () => {
		await container.stop();
		process.exit();
	});
});
