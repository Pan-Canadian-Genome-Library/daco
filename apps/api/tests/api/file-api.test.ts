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

import formidable from 'formidable';
import assert from 'node:assert';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

import { submitRevision } from '@/controllers/applicationController.js';
import { connectToDb, type PostgresDb } from '@/db/index.js';
import { applicationSvc } from '@/service/applicationService.js';
import { type ApplicationService } from '@/service/types.js';
import { ApplicationStates } from '@pcgl-daco/data-model/src/types.js';

import { uploadEthicsFile } from '@/controllers/fileController.ts';
import {
	addInitialApplications,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
	testApplicationId,
} from '../testUtils.js';

describe('File API', () => {
	let db: PostgresDb;
	let testApplicationRepo: ApplicationService;
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

		testApplicationRepo = applicationSvc(db);
	});

	describe('Upload Ethics File', () => {
		it('Should create new file if there is no ethics_letter in the application contents', async () => {
			const mockFile: formidable.File = {
				filepath: path.join(process.cwd(), 'tests/fileuploadtest.docx'),
				hashAlgorithm: 'sha256',
				mimetype: 'application/msword',
				newFilename: 'newFileName',
				originalFilename: 'fileuploadtest',
				size: 20000,
				toJSON: function (): formidable.FileJSON {
					throw new Error('Function not implemented.');
				},
			};

			const applicationResult = await testApplicationRepo.getApplicationWithContents({ id: 1 });
			assert.ok(applicationResult.success);

			const application = applicationResult.data;
			const ethicsLetterId = application.contents?.ethics_letter;

			assert.strictEqual(ethicsLetterId, null);

			const fileResult = await uploadEthicsFile({ applicationId: 1, file: mockFile });

			assert.ok(fileResult.success);
		});

		it('Should update file if there is an existing ethics_letter id in the application contents', async () => {
			const mockFile: formidable.File = {
				filepath: path.join(process.cwd(), 'tests/fileuploadtest-2.docx'),
				hashAlgorithm: 'sha256',
				mimetype: 'application/msword',
				newFilename: 'newestFileName',
				originalFilename: 'fileuploadtest-2',
				size: 20000,
				toJSON: function (): formidable.FileJSON {
					// Does not need to be implemented, just need to satisfy formidable.File
					throw new Error('Function not implemented.');
				},
			};

			const fileResult = await uploadEthicsFile({ applicationId: 1, file: mockFile });
			assert.ok(fileResult.success);

			const applicationResult = await testApplicationRepo.getApplicationWithContents({ id: 1 });
			assert.ok(applicationResult.success);
			const application = applicationResult.data;
			const ethicsLetterId = application.contents?.ethics_letter;

			assert.strictEqual(ethicsLetterId, fileResult.data.id);
		});

		describe('Submit Revision', () => {
			it('should fail to submit a revision for an already revised application (DAC_REVISIONS_REQUESTED)', async () => {
				await testApplicationRepo.findOneAndUpdate({
					id: testApplicationId,
					update: { state: ApplicationStates.DAC_REVISIONS_REQUESTED },
				});
				const result = await submitRevision({ applicationId: testApplicationId });

				assert.ok(!result.success);
				assert.strictEqual(result.message, 'Application revision is already submitted.');
			});

			it('should fail to submit a revision for a non-existent application', async () => {
				const result = await submitRevision({ applicationId: 9999 });

				assert.ok(!result.success);
				assert.strictEqual(String(result.errors), 'Error: Application record is undefined');
			});
		});
	});
	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
