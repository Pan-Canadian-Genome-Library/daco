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

import { CollaboratorDTO } from '@pcgl-daco/data-model';

import { createApplication } from '@/controllers/applicationController.js';
import { createCollaborators, updateCollaborator } from '@/controllers/collaboratorsController.js';
import dbUtils, { type PostgresDb } from '@/db/index.js';
import { collaborators } from '@/db/schemas/collaborators.js';

import { testApplicationId as application_id, testUserId as user_id } from '@tests/utils/testUtils.ts';

describe('Collaborators Controller', { skip: true }, () => {
	let db: PostgresDb;

	before(async () => {
		db = dbUtils.connectToDb('');
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

			assert.strictEqual(newCollaboratorRecord.applicationId, application_id);
		});

		it('should successfully create multiple collaborators with the provided application id', async () => {
			const collaborators: CollaboratorDTO[] = [
				{
					collaboratorFirstName: 'Test',
					collaboratorLastName: 'User 2',
					collaboratorPositionTitle: 'Principal Investigator',
					collaboratorInstitutionalEmail: 'testUser2@oicr.on.ca',
				},
				{
					collaboratorFirstName: 'Test',
					collaboratorLastName: 'User 3',
					collaboratorPositionTitle: 'Scientist',
					collaboratorInstitutionalEmail: 'testUser3@oicr.on.ca',
				},
				{
					collaboratorFirstName: 'Test',
					collaboratorLastName: 'User 4',
					collaboratorPositionTitle: 'Lab Tech',
					collaboratorInstitutionalEmail: 'testUser4@oicr.on.ca',
				},
			];

			const result = await createCollaborators({ application_id, user_id, collaborators });

			assert.ok(result.success);
			assert.strictEqual(result.data.length, collaborators.length);
		});

		it('should prevent creating a new collaborator with the wrong user id', async () => {
			const collaborators: CollaboratorDTO[] = [
				{
					collaboratorFirstName: 'Principal',
					collaboratorLastName: 'Tester',
					collaboratorPositionTitle: 'Doctor',
					collaboratorInstitutionalEmail: 'testUser@oicr.on.ca',
				},
			];

			const result = await createCollaborators({ application_id, user_id: 'drTest@oicr.on.ca', collaborators });

			assert.ok(!result.success);
			assert.strictEqual(result.message, 'Unauthorized, cannot create Collaborators');
		});

		it('should prevent creating a new collaborator with the wrong application id', async () => {
			const applicationResult = await createApplication({ user_id });

			assert.ok(applicationResult.success && applicationResult.data);

			const incorrectId = applicationResult.data?.id + 10;

			const collaborators: CollaboratorDTO[] = [
				{
					collaboratorFirstName: 'Principal',
					collaboratorLastName: 'Tester',
					collaboratorPositionTitle: 'Doctor',
					collaboratorInstitutionalEmail: 'testUser@oicr.on.ca',
				},
			];

			const result = await createCollaborators({ application_id: incorrectId, user_id, collaborators });

			assert.ok(!result.success);
			assert.strictEqual(result.message, `Error at getApplicationById with id: ${incorrectId}`);
		});

		it('should prevent creating duplicate records', async () => {
			const applicationResult = await createApplication({ user_id });

			assert.ok(applicationResult.success && applicationResult.data);

			const collaborators: CollaboratorDTO[] = [
				{
					collaboratorFirstName: 'Principal',
					collaboratorLastName: 'Tester',
					collaboratorPositionTitle: 'Doctor',
					collaboratorInstitutionalEmail: 'testUser@oicr.on.ca',
				},
				{
					collaboratorFirstName: 'Principal',
					collaboratorLastName: 'Tester',
					collaboratorPositionTitle: 'Doctor',
					collaboratorInstitutionalEmail: 'testUser@oicr.on.ca',
				},
			];

			const result = await createCollaborators({ application_id, user_id, collaborators });

			assert.ok(!result.success);
			assert.strictEqual(result, `DUPLICATE_RECORD`);
		});
	});

	describe('Update Collaborators', () => {
		it('should successfully update a Collaborator', async () => {
			const testCollaborators = await db
				.select()
				.from(collaborators)
				.where(eq(collaborators.application_id, application_id));

			assert.ok(testCollaborators.length && testCollaborators[0]);

			const { id } = testCollaborators[0];

			const collaboratorUpdates = { id, collaboratorType: 'Test User' };

			const collaboratorResult = await updateCollaborator({
				application_id,
				user_id,
				collaboratorUpdates,
			});

			assert.ok(collaboratorResult.success && collaboratorResult.data[0]);

			const collaboratorRecord = collaboratorResult.data[0];
			assert.strictEqual(collaboratorRecord.collaboratorType, collaboratorUpdates.collaboratorType);
		});
	});

	after(async () => {
		process.exit(0);
	});
});
