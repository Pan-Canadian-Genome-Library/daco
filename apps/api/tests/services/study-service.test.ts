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
import { after, before, describe, it } from 'node:test';

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

import { connectToDb, type PostgresDb } from '@/db/index.js';

import { studySvc } from '@/service/studyService.ts';
import { StudyService } from '@/service/types.ts';
import { addStudyAndDacUsers, initTestMigration, PG_DATABASE, PG_PASSWORD, PG_USER } from '../utils/testUtils.ts';

describe('File API', () => {
	let db: PostgresDb;
	let container: StartedPostgreSqlContainer;
	let studyService: StudyService;

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
		// TODO: Will utilize below once applicationContents.dac_id is in main then add relevant test cases
		// await addInitialApplications(db);

		studyService = studySvc(db);
	});

	describe('Study', () => {
		it('should get study by id', async () => {
			const testRecordId = 'study1';
			const result = await studyService.getStudyById({ studyId: testRecordId });

			assert.ok(result.success && result.data);
			assert.strictEqual(result.data.studyId, testRecordId);
		});

		it('should fail to get study if study does not exist', async () => {
			const testRecordId = 'MISSING-STUDY';
			const result = await studyService.getStudyById({ studyId: testRecordId });

			assert.ok(!result.success);
			assert.ok(result.error, 'NOT_FOUND');
		});
	});
	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
