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
import { after, before, describe, it } from 'node:test';

import { connectToDb, type PostgresDb } from '@/db/index.js';
import { applicationSvc } from '@/service/applicationService.ts';
import { collaboratorsSvc } from '@/service/collaboratorsService.ts';
import { filesSvc } from '@/service/fileService.ts';
import { pdfService } from '@/service/pdf/pdfService.ts';
import { signatureService } from '@/service/signatureService.ts';
import {
	ApplicationService,
	CollaboratorsService,
	FilesService,
	PDFService,
	SignatureService,
} from '@/service/types.ts';
import {
	convertToApplicationRecord,
	convertToCollaboratorRecords,
	convertToFileRecord,
	convertToSignatureRecord,
} from '@/utils/aliases.ts';
import formidable from 'formidable';
import assert from 'node:assert';
import path from 'node:path';
import {
	addInitialApplications,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
	testUserId,
} from '../utils/testUtils.ts';

describe('File Service', () => {
	let db: PostgresDb;
	let container: StartedPostgreSqlContainer;
	let testApplicationRepo: ApplicationService;
	let testFileService: FilesService;
	let testSignatureService: SignatureService;
	let testCollaboratorService: CollaboratorsService;
	let testPDFService: PDFService;

	const mockFile: formidable.File = {
		filepath: path.join(process.cwd(), 'tests/utils/test-daco-pdf.pdf'),
		hashAlgorithm: 'sha256',
		mimetype: '	application/pdf',
		newFilename: 'ethics_pdf-test',
		originalFilename: 'test-daco-pdf.pdf',
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
		testPDFService = pdfService();
		testSignatureService = signatureService(db);
		testApplicationRepo = applicationSvc(db);
		testCollaboratorService = collaboratorsSvc(db);
	});

	describe('Create a PDF File', () => {
		it('should successfully create a PDF file based off an application record.', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id: testUserId });

			assert.ok(applicationRecordsResult.success);

			const applicationRecords = applicationRecordsResult.data;

			assert.ok(Array.isArray(applicationRecords.applications));
			assert.ok(applicationRecords.applications[0]);

			const test_app = applicationRecords.applications[0];

			const applicationContents = await testApplicationRepo.getApplicationWithContents({ id: test_app.id });

			assert.ok(applicationContents.success);
			assert.ok(applicationContents.data);

			const signatureContents = await testSignatureService.getApplicationSignature({ application_id: test_app.id });
			assert.ok(signatureContents.success);
			assert.ok(signatureContents.data);

			const collabContents = await testCollaboratorService.listCollaborators(test_app.id);
			assert.ok(collabContents.success);
			assert.ok(collabContents.data);

			const fileResponse = await testFileService.createFile({
				application: applicationContents.data,
				type: 'ETHICS_LETTER',
				file: mockFile,
			});

			assert.ok(fileResponse.success);

			const fileData = await testFileService.getFileById({ fileId: fileResponse.data.id });
			assert.ok(fileData.success);

			const aliasedAppData = convertToApplicationRecord(applicationContents.data);
			assert.ok(aliasedAppData.success);

			const aliasedSignatureData = convertToSignatureRecord(signatureContents.data);
			assert.ok(aliasedSignatureData.success);

			const aliasedCollabData = convertToCollaboratorRecords(collabContents.data);
			assert.ok(aliasedCollabData.success && Array.isArray(aliasedCollabData.data));

			const aliasedFileData = convertToFileRecord(fileData.data);
			assert.ok(aliasedFileData.success);

			const pdfCreation = await testPDFService.renderPCGLApplicationPDF({
				filename: 'test.pdf',
				applicationContents: aliasedAppData.data,
				signatureContents: aliasedSignatureData.data,
				fileContents: aliasedFileData.data,
				collaboratorsContents: aliasedCollabData.data,
			});

			assert.ok(pdfCreation.success);
			assert.ok(pdfCreation.data);
			assert.ok(pdfCreation.data instanceof Uint8Array);
		});
		it('should fail to create a PDF file if no ethics exemption or approval letter exists.', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id: testUserId });

			assert.ok(applicationRecordsResult.success);

			const applicationRecords = applicationRecordsResult.data;

			assert.ok(Array.isArray(applicationRecords.applications));
			assert.ok(applicationRecords.applications[0]);

			const test_app = applicationRecords.applications[0];

			const applicationContents = await testApplicationRepo.getApplicationWithContents({ id: test_app.id });

			assert.ok(applicationContents.success);
			assert.ok(applicationContents.data);

			const signatureContents = await testSignatureService.getApplicationSignature({ application_id: test_app.id });
			assert.ok(signatureContents.success);
			assert.ok(signatureContents.data);

			const collabContents = await testCollaboratorService.listCollaborators(test_app.id);
			assert.ok(collabContents.success);
			assert.ok(collabContents.data);

			const fileResponse = await testFileService.createFile({
				application: applicationContents.data,
				type: 'ETHICS_LETTER',
				file: mockFile,
			});

			assert.ok(fileResponse.success);

			const fileData = await testFileService.getFileById({ fileId: fileResponse.data.id });
			assert.ok(fileData.success);

			const aliasedAppData = convertToApplicationRecord(applicationContents.data);
			assert.ok(aliasedAppData.success);

			const aliasedSignatureData = convertToSignatureRecord(signatureContents.data);
			assert.ok(aliasedSignatureData.success);

			const aliasedCollabData = convertToCollaboratorRecords(collabContents.data);
			assert.ok(aliasedCollabData.success && Array.isArray(aliasedCollabData.data));

			const aliasedFileData = convertToFileRecord(fileData.data);
			assert.ok(aliasedFileData.success);

			aliasedFileData.data.id = 10;
			aliasedFileData.data.content = null;

			const pdfCreation = await testPDFService.renderPCGLApplicationPDF({
				filename: 'test.pdf',
				applicationContents: aliasedAppData.data,
				signatureContents: aliasedSignatureData.data,
				fileContents: aliasedFileData.data,
				collaboratorsContents: aliasedCollabData.data,
			});

			assert.ok(!pdfCreation.success);
		});
	});

	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
