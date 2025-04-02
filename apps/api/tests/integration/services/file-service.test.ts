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

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import formidable from 'formidable';
import assert from 'node:assert';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';

import { connectToDb, type PostgresDb } from '@/db/index.js';
import { applicationSvc } from '@/service/applicationService.ts';
import { filesSvc } from '@/service/fileService.ts';
import { ApplicationService, FilesService } from '@/service/types.ts';
import {
	addInitialApplications,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
} from '@tests/utils/testUtils.ts';

describe('Signature Service', () => {
	let db: PostgresDb;
	let container: StartedPostgreSqlContainer;
	let testApplicationRepo: ApplicationService;
	let testFileService: FilesService;

	const mockFile: formidable.File = {
		filepath: path.join(process.cwd(), 'tests/utils/fileuploadtest.docx'),
		hashAlgorithm: 'sha256',
		mimetype: 'application/msword',
		newFilename: 'newFileName',
		originalFilename: 'fileuploadtest',
		size: 20000,
		toJSON: function (): formidable.FileJSON {
			throw new Error('Function not implemented.');
		},
	};

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

		testFileService = filesSvc(db);
		testApplicationRepo = applicationSvc(db);
	});

	describe('File Create', () => {
		it('should create a new application with type "ETHICS_LETTER"', async () => {
			const applicationResult = await testApplicationRepo.getApplicationWithContents({ id: 1 });
			assert.ok(applicationResult.success);

			const fileResponse = await testFileService.createFile({
				application: applicationResult.data,
				type: 'ETHICS_LETTER',
				file: mockFile,
			});

			assert.ok(fileResponse.success);

			assert.equal(fileResponse.data.type, 'ETHICS_LETTER');
		});

		it('should create a new application with type "SIGNED_APPLICATION"', async () => {
			const applicationResult = await testApplicationRepo.getApplicationWithContents({ id: 1 });
			assert.ok(applicationResult.success);

			const fileResponse = await testFileService.createFile({
				application: applicationResult.data,
				type: 'SIGNED_APPLICATION',
				file: mockFile,
			});

			assert.ok(fileResponse.success);

			assert.equal(fileResponse.data.type, 'SIGNED_APPLICATION');
		});
	});

	describe('File Update', () => {
		before(async () => {
			const applicationResult = await testApplicationRepo.editApplication({ id: 2, update: { ethics_letter: 2 } });
			assert.ok(applicationResult.success);

			await testFileService.createFile({
				application: applicationResult.data,
				type: 'ETHICS_LETTER',
				file: mockFile,
			});
		});

		it('should update an application with new file "fileuploadtest2"', async () => {
			const newMockFile: formidable.File = {
				...mockFile,
				filepath: path.join(process.cwd(), 'tests/utils/fileuploadtest-2.docx'),
				originalFilename: 'fileuploadtest-2',
			};

			const applicationResult = await testApplicationRepo.getApplicationWithContents({ id: 2 });
			assert.ok(applicationResult.success);

			const ethicsLetterId = applicationResult.data.contents?.ethics_letter;

			assert.ok(ethicsLetterId);

			const fileResponse = await testFileService.updateFile({
				fileId: ethicsLetterId,
				application: applicationResult.data,
				type: 'ETHICS_LETTER',
				file: newMockFile,
			});

			assert.ok(fileResponse.success);

			assert.equal(fileResponse.data.filename, 'fileuploadtest-2');
		});

		it('should update an application with type SIGNED_APPLICATION', async () => {
			const newMockFile: formidable.File = {
				...mockFile,
				filepath: path.join(process.cwd(), 'tests/utils/fileuploadtest-2.docx'),
				originalFilename: 'fileuploadtest-2',
			};

			const applicationResult = await testApplicationRepo.getApplicationWithContents({ id: 2 });
			assert.ok(applicationResult.success);

			const ethicsLetterId = applicationResult.data.contents?.ethics_letter;

			assert.ok(ethicsLetterId);

			const fileResponse = await testFileService.updateFile({
				fileId: ethicsLetterId,
				application: applicationResult.data,
				type: 'SIGNED_APPLICATION',
				file: newMockFile,
			});

			assert.ok(fileResponse.success);
			assert.equal(fileResponse.data.type, 'SIGNED_APPLICATION');
		});
	});

	describe('File Delete', () => {
		it('should delete by its id', async () => {
			const fileResponse = await testFileService.deleteFileById({
				fileId: 1,
			});

			assert.ok(fileResponse.success);
		});
		it('should fail if id does not exist', async () => {
			const fileResponse = await testFileService.deleteFileById({
				fileId: 999,
			});

			assert.ok(!fileResponse.success);
		});
	});

	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
