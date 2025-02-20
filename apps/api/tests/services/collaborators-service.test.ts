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

import { eq } from 'drizzle-orm';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

import { connectToDb, type PostgresDb } from '@/db/index.js';
import { collaborators } from '@/db/schemas/collaborators.js';
import { collaboratorsSvc } from '@/service/collaboratorsService.js';
import { type CollaboratorModel, type CollaboratorsService } from '@/service/types.js';

import {
	addInitialApplications,
	testApplicationId as application_id,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
} from '../testUtils.js';

describe('Application Service', () => {
	let db: PostgresDb;
	let testCollaboratorsRepo: CollaboratorsService;
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

		testCollaboratorsRepo = collaboratorsSvc(db);
	});

	describe('Create Collaborators', () => {
		it('should allow creating multiple collaborators', async () => {
			const collaborators: CollaboratorModel[] = [
				{
					first_name: 'Test',
					last_name: 'User',
					position_title: 'Bioinformatician',
					institutional_email: 'testUser01@oicr.on.ca',
					application_id,
				},
				{
					first_name: 'Test',
					last_name: 'User',
					position_title: 'Developer',
					institutional_email: 'testUser02@oicr.on.ca',
					application_id,
				},
			];

			const collaboratorResult = await testCollaboratorsRepo.createCollaborators({ newCollaborators: collaborators });

			assert.ok(collaboratorResult.success && collaboratorResult.data);

			const newCollaborators = collaboratorResult.data;

			assert.strictEqual(newCollaborators?.length, collaborators.length);
		});

		it('should prevent creating a duplicate Collaborator', async () => {
			const collaborators: CollaboratorModel[] = [
				{
					first_name: 'Test',
					last_name: 'User',
					position_title: 'Bioinformatician',
					institutional_email: 'testUser01@oicr.on.ca',
					application_id,
				},
			];

			const collaboratorResult = await testCollaboratorsRepo.createCollaborators({ newCollaborators: collaborators });

			assert.ok(!collaboratorResult.success);
			assert.strictEqual(collaboratorResult.errors, 'DuplicateRecords');
		});
	});

	after(async () => {
		await db.delete(collaborators).where(eq(collaborators.application_id, application_id));
		await container.stop();
		process.exit(0);
	});
});
