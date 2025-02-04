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

import { CollaboratorDTO } from '@pcgl-daco/data-model';

import { createCollaborators } from '@/api/collaboratorsController.js';
import { connectToDb, type PostgresDb } from '@/db/index.js';

import {
	addInitialApplications,
	testApplicationId as application_id,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
	testUserId as user_id,
} from '../testUtils.js';

describe('Collaborators Controller', () => {
	let db: PostgresDb;
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
	});

	describe('Create new collaborators', () => {
		it('should successfully create a new collaborator with the provided application id', async () => {
			const collaborators: CollaboratorDTO[] = [
				{
					collaboratorFirstName: 'Test',
					collaboratorLastName: 'User',
					collaboratorPositionTitle: 'Bioinformatician',
					collaboratorInstitutionalEmail: 'testUser@oicr.on.ca',
				},
			];

			const result = await createCollaborators({ application_id, user_id, collaborators });

			assert.ok(result.success && result.data[0]);

			const newCollaboratorRecord = result.data[0];

			assert.strictEqual(newCollaboratorRecord.application_id, application_id);
		});
	});

	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
