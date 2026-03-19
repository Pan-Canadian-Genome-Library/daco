/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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
import { dacSvc } from '@/service/dacService.ts';
import { type DacModel, type DacService } from '@/service/types.ts';

import { addStudyAndDacUsers, initTestMigration, PG_DATABASE, PG_PASSWORD, PG_USER } from '../utils/testUtils.ts';

describe('Dac Service', () => {
	let db: PostgresDb;
	let container: StartedPostgreSqlContainer;
	let dacService: DacService;

	before(async () => {
		container = await new PostgreSqlContainer()
			.withUsername(PG_USER)
			.withPassword(PG_PASSWORD)
			.withDatabase(PG_DATABASE)
			.start();

		const connectionString = container.getConnectionUri();
		db = connectToDb(connectionString);

		await initTestMigration(db);
		await addStudyAndDacUsers(db);

		dacService = dacSvc(db);
	});

	describe('Dac Service', () => {
		it('should allow creating Dac records', async () => {
			const testRecords: DacModel[] = [
				{
					dac_id: 'dac8',
					dac_name: 'Ocular Cancer DAC',
					dac_description: 'DAC Group for ocular cancer studies',
					contact_name: 'Dr. Four Eyes PHD',
					contact_email: 'testuser@example.com',
					created_at: new Date(),
					updated_at: new Date(),
				},
			];

			const result = await dacService.createDacRecords({ dacGroups: testRecords });

			assert.ok(result.success && result.data[0]);
			assert.strictEqual(result.data[0].dac_id, testRecords[0]?.dac_id);
		});

		it('should updating existing studies', async () => {
			const testRecords: DacModel[] = [
				{
					dac_id: 'dac8',
					dac_name: 'Ocular Cancer DAC',
					dac_description: 'DAC Group for ocular cancer studies',
					contact_name: 'Dr. Near Sighted MD',
					contact_email: 'testuser@example.com',
					created_at: new Date(),
					updated_at: new Date(),
				},
			];

			const result = await dacService.createDacRecords({ dacGroups: testRecords });

			assert.ok(result.success && result.data[0]);
			assert.deepStrictEqual(result.data[0].contact_name, testRecords[0]?.contact_name);
		});
	});
	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
