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
import { applications } from '@/db/schemas/applications.js';

import { applicationSvc } from '@/service/applicationService.ts';
import { filesSvc } from '@/service/fileService.ts';
import { ApplicationService, FilesService } from '@/service/types.ts';
import formidable from 'formidable';
import path from 'node:path';
import {
	addInitialApplications,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
	testUserId as user_id,
} from '../testUtils.js';

describe('Signature Service', () => {
	let db: PostgresDb;
	let container: StartedPostgreSqlContainer;
	let testApplicationRepo: ApplicationService;
	let testFileService: FilesService;

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

			const fileResponse = await testFileService.createFile({
				application: applicationResult.data,
				type: 'ETHICS_LETTER',
				file: mockFile,
			});

			assert.ok(fileResponse.success);

			assert.equal(fileResponse.data.type, 'ETHICS_LETTER');
		});
		it('should create a new application with type "SIGNED_APPLICATION"', async () => {
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

			const fileResponse = await testFileService.createFile({
				application: applicationResult.data,
				type: 'SIGNED_APPLICATION',
				file: mockFile,
			});

			assert.ok(fileResponse.success);

			assert.equal(fileResponse.data.type, 'SIGNED_APPLICATION');
		});
	});

	after(async () => {
		await db.delete(applications).where(eq(applications.user_id, user_id));
		await container.stop();
		process.exit(0);
	});
});
