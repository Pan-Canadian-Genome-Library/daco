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

import {
	createApplication,
	editApplication,
	getApplicationById,
	getApplicationStateTotals,
	rejectApplication,
	submitRevision,
	uploadEthicsFile,
} from '@/controllers/applicationController.js';
import { connectToDb, type PostgresDb } from '@/db/index.js';
import { applicationSvc } from '@/service/applicationService.js';
import { type ApplicationService } from '@/service/types.js';
import { ApplicationStates } from '@pcgl-daco/data-model/src/types.js';

import {
	addInitialApplications,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
	testApplicationId,
	testUserId as user_id,
} from '../testUtils.js';

describe('Application API', () => {
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

	describe('Edit Application', () => {
		it('should allow editing applications with status DRAFT and submitted user_id', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);
			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const { id } = applicationRecordsResult.data.applications[0];

			const update = { applicantFirstName: 'Test' };

			const result = await editApplication({ id, update });

			assert.ok(result.success);

			const editedApplication = result.data;
			assert.strictEqual(editedApplication.state, ApplicationStates.DRAFT);

			assert.ok(editedApplication.contents);
			assert.strictEqual(editedApplication.contents.applicant_first_name, update.applicantFirstName);
		});

		it('should allow editing applications with state DAC_REVIEW, and revert state to DRAFT', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);
			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const { id, state } = applicationRecordsResult.data.applications[0];

			assert.strictEqual(state, ApplicationStates.DRAFT);

			const stateUpdate = { state: ApplicationStates.INSTITUTIONAL_REP_REVIEW };
			const reviewRecordResult = await testApplicationRepo.findOneAndUpdate({ id, update: stateUpdate });

			assert.ok(reviewRecordResult.success && reviewRecordResult.data);
			assert.strictEqual(reviewRecordResult.data.state, ApplicationStates.INSTITUTIONAL_REP_REVIEW);

			const contentUpdate = { applicantLastName: 'User' };
			const result = await editApplication({ id, update: contentUpdate });
			assert.ok(result.success);

			const editedApplication = result.data;
			assert.strictEqual(editedApplication.id, id);
			assert.strictEqual(editedApplication.state, ApplicationStates.DRAFT);

			assert.ok(editedApplication.contents);
			assert.strictEqual(editedApplication.contents.applicant_last_name, contentUpdate.applicantLastName);
		});

		it('should error and return null when application state is not draft or review', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });
			assert.ok(applicationRecordsResult.success);

			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);
			const { id } = applicationRecordsResult.data.applications[0];

			const stateUpdate = { state: ApplicationStates.CLOSED };
			await testApplicationRepo.findOneAndUpdate({ id, update: stateUpdate });

			const contentUpdate = { applicantTitle: 'Dr.' };
			const result = await editApplication({ id, update: contentUpdate });

			assert.ok(!result.success);
		});
	});

	describe('Get Application by ID', () => {
		it('should successfully be able to find an application with an ID', async () => {
			const result = await getApplicationById({ applicationId: testApplicationId });

			assert.ok(result.success);

			const application = result.data;

			assert.strictEqual(application.id, testApplicationId);

			assert.ok(application.contents);
		});

		it('should error with a not found error, not being able to find a non-existant application ID', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const last_id = applicationRecordsResult.data.applications[applicationRecordsResult.data.applications.length - 1];

			assert.ok(last_id?.id);

			const result = await getApplicationById({ applicationId: last_id.id + 1 });

			assert.ok(!result.success);

			const error_message = String(result.errors);

			assert.strictEqual(error_message, 'Error: Application record is undefined');
		});
	});

	describe('Get Application Metadata', () => {
		it('should get the counts for each of the application states', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const result = await getApplicationStateTotals({ userId: user_id });

			const totalDraftApplications = applicationRecordsResult.data.applications.filter(
				(apps) => apps.state === 'DRAFT',
			).length;

			assert.ok(result.success);
			assert.ok(result.data);

			assert.equal(result.data.DRAFT, totalDraftApplications);
			assert.equal(result.data.TOTAL, applicationRecordsResult.data.applications.length);
		});
	});

	describe('Create a new application', () => {
		it('should successfully be able to create a new application with the provided user_id', async () => {
			const result = await createApplication({ user_id });

			assert.ok(result.success && result.data);

			const application = result.data;

			assert.strictEqual(application.user_id, user_id);

			assert.ok(application.contents);
		});
	});

	describe('Reject Application', () => {
		it('should successfully reject an application in DAC_REVIEW state', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });
			assert.ok(applicationRecordsResult.success);
			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const { id } = applicationRecordsResult.data.applications[0];
			await testApplicationRepo.findOneAndUpdate({ id, update: { state: ApplicationStates.DAC_REVIEW } });

			const result = await rejectApplication({ applicationId: id });
			assert.ok(result.success);

			const rejectedApplication = await getApplicationById({ applicationId: id });
			assert.ok(rejectedApplication.success);
			assert.strictEqual(rejectedApplication.data.state, ApplicationStates.REJECTED);
		});
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

		after(async () => {
			await container.stop();
			process.exit(0);
		});
	});
});
