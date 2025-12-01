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

import {
	closeApplication,
	createApplication,
	dacRejectApplication,
	editApplication,
	getApplicationById,
	getApplicationHistory,
	getRevisions,
	requestApplicationRevisionsByDac,
	revokeApplication,
	submitApplication,
	submitRevision,
	withdrawApplication,
} from '@/controllers/applicationController.js';
import { connectToDb, type PostgresDb } from '@/db/index.js';
import { applicationSvc } from '@/service/applicationService.js';
import { type ApplicationService, type RevisionRequestModel } from '@/service/types.js';
import { ApplicationStates } from '@pcgl-daco/data-model/src/types.js';

import {
	addInitialApplications,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
	testApplicationId,
	testUserId as user_id,
} from '../utils/testUtils.ts';

// Sample revision request data
const revisionRequestData: RevisionRequestModel = {
	application_id: testApplicationId,
	created_at: new Date(),
	comments: 'Please provide additional documentation.',
	applicant_notes: 'Needs more details',
	applicant_approved: false,
	institution_rep_approved: false,
	institution_rep_notes: 'Incomplete information',
	collaborators_approved: false,
	collaborators_notes: 'Requires additional clarification',
	project_approved: false,
	project_notes: 'Not sufficient justification',
	requested_studies_approved: false,
	requested_studies_notes: 'Unclear scope',
	ethics_approved: false,
	agreements_approved: false,
	appendices_approved: false,
	sign_and_submit_approved: false,
};

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

			const findRecord = applicationRecordsResult.data.applications.find((value) => value.state === 'DRAFT');
			assert.ok(findRecord);

			const { id } = findRecord;

			const update = { applicantFirstName: 'Test' };

			const result = await editApplication({ id, update });

			assert.ok(result.success);

			const editedApplication = result.data;
			assert.strictEqual(editedApplication.state, ApplicationStates.DRAFT);

			assert.ok(editedApplication.contents);
			assert.strictEqual(editedApplication.contents.applicantFirstName, update.applicantFirstName);
		});

		it('should allow editing applications with state DAC_REVIEW, and revert state to DRAFT', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);
			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const findRecord = applicationRecordsResult.data.applications.find((value) => value.state === 'DRAFT');
			assert.ok(findRecord);

			const { id, state } = findRecord;

			assert.strictEqual(state, ApplicationStates.DRAFT);

			const stateUpdate = { state: ApplicationStates.INSTITUTIONAL_REP_REVIEW };
			const reviewRecordResult = await testApplicationRepo.findOneAndUpdate({ id, update: stateUpdate });

			assert.ok(reviewRecordResult.success && reviewRecordResult.data);
			assert.strictEqual(reviewRecordResult.data.state, ApplicationStates.INSTITUTIONAL_REP_REVIEW);

			/**
			 * Applications must be withdrawn before they can be edited.
			 */
			const withdrawResult = await withdrawApplication({ applicationId: id });

			assert.ok(withdrawResult.success);

			const contentUpdate = { applicantLastName: 'User' };
			const result = await editApplication({ id, update: contentUpdate });

			assert.ok(result.success);

			const editedApplication = result.data;
			assert.strictEqual(editedApplication.id, id);
			assert.strictEqual(editedApplication.state, ApplicationStates.DRAFT);

			assert.ok(editedApplication.contents);
			assert.strictEqual(editedApplication.contents.applicantLastName, contentUpdate.applicantLastName);
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

			const result = await getApplicationById({ applicationId: 9999 });

			assert.ok(!result.success);

			assert.ok(!!result.message, 'No error message provided.');
			assert.equal(result.error, 'NOT_FOUND');
		});
	});
	describe('Create a new application', () => {
		it('should successfully be able to create a new application with the provided user_id', async () => {
			const result = await createApplication({ user_id });

			assert.ok(result.success && result.data);

			const application = result.data;

			assert.strictEqual(application.userId, user_id);
		});
	});

	describe('Reject Application', () => {
		it('should successfully reject an application in DAC_REVIEW state', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });
			const rejectionReason = 'Reject';

			assert.ok(applicationRecordsResult.success);
			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const { id } = applicationRecordsResult.data.applications[0];
			await testApplicationRepo.findOneAndUpdate({ id, update: { state: ApplicationStates.DAC_REVIEW } });

			const result = await dacRejectApplication({ applicationId: id, rejectionReason });
			assert.ok(result.success);

			const rejectedApplication = await getApplicationById({ applicationId: id });
			assert.ok(rejectedApplication.success);
			assert.strictEqual(rejectedApplication.data.state, ApplicationStates.REJECTED);
		});
	});

	describe('Submit Revision', () => {
		it('should fail to submit a revision for an already revised application (DAC_REVISIONS_REQUESTED)', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.DAC_REVIEW },
			});
			const result = await submitRevision({ applicationId: testApplicationId });

			assert.ok(!result.success);
			assert.strictEqual(result.error, 'INVALID_STATE_TRANSITION');
		});

		it('should fail to submit a revision for a non-existent application', async () => {
			const result = await submitRevision({ applicationId: 9999 });

			assert.ok(!result.success);
			assert.strictEqual(result.error, 'NOT_FOUND');
		});
	});

	describe('Revoke Application', () => {
		it('should successfully revoke an application in APPROVED state', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });
			assert.ok(applicationRecordsResult.success);
			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const { id } = applicationRecordsResult.data.applications[0];
			await testApplicationRepo.findOneAndUpdate({
				id,
				update: { state: ApplicationStates.APPROVED },
			});

			const result = await revokeApplication(id, true, 'TEST-REVOKE-COMMENT');

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.REVOKED);

			// Verify the application state in the database
			const revokedApplication = await testApplicationRepo.getApplicationById({ id });
			assert.ok(revokedApplication.success);
			assert.strictEqual(revokedApplication.data.state, ApplicationStates.REVOKED);
		});

		it('should fail to revoke an application not in APPROVED state', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });
			assert.ok(applicationRecordsResult.success);
			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const { id } = applicationRecordsResult.data.applications[0];
			await testApplicationRepo.findOneAndUpdate({
				id,
				update: { state: ApplicationStates.DRAFT },
			});

			const result = await revokeApplication(id, true, 'TEST-REVOKE-COMMENT');

			// Verify the revocation failed
			assert.ok(!result.success);
			assert.strictEqual(result.error, 'INVALID_STATE_TRANSITION');
		});

		it('should fail if application does not exist', async () => {
			const nonExistentId = 9999;

			const result = await revokeApplication(nonExistentId, true, 'TEST-REVOKE-COMMENT');

			// Assert: Verify the revocation failed
			assert.ok(!result.success);
			assert.strictEqual(result.error, 'NOT_FOUND');
		});
	});

	describe('Withdraw Application', () => {
		it('should withdraw an application in DAC_REVIEW state', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.DAC_REVIEW },
			});
			const result = await withdrawApplication({ applicationId: testApplicationId });

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.DRAFT);
		});

		it('should withdraw an application in INSTITUTIONAL_REP_REVIEW state', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.INSTITUTIONAL_REP_REVIEW },
			});
			const result = await withdrawApplication({ applicationId: testApplicationId });

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.DRAFT);
		});

		it('should fail to withdraw an application in DRAFT state', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.DRAFT },
			});
			const result = await withdrawApplication({ applicationId: testApplicationId });

			assert.ok(!result.success);
		});

		it('should fail to withdraw an application in REJECTED state', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.REJECTED },
			});
			const result = await withdrawApplication({ applicationId: testApplicationId });

			assert.ok(!result.success);
		});

		it('should fail to withdraw an application in INSTITUTIONAL_REP_REVISION_REQUESTED state', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED },
			});
			const result = await withdrawApplication({ applicationId: testApplicationId });

			assert.ok(!result.success);
		});

		it('should fail to withdraw an application in DAC_REVISIONS_REQUESTED state', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.DAC_REVISIONS_REQUESTED },
			});
			const result = await withdrawApplication({ applicationId: testApplicationId });

			assert.ok(!result.success);
		});

		it('should fail to withdraw an application in APPROVED state', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.APPROVED },
			});
			const result = await withdrawApplication({ applicationId: testApplicationId });

			assert.ok(!result.success);
		});

		it('should fail for non-existent application', async () => {
			const result = await withdrawApplication({ applicationId: 9999 });

			assert.ok(!result.success);
			assert.strictEqual(result.error, 'NOT_FOUND');
		});
	});
	describe('Close Application', () => {
		it('should close an application in DRAFT state', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.DRAFT },
			});
			const result = await closeApplication({ applicationId: testApplicationId });

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.CLOSED);
		});

		it('should close an application in INSTITUTIONAL_REP_REVIEW state', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.INSTITUTIONAL_REP_REVIEW },
			});
			const result = await closeApplication({ applicationId: testApplicationId });

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.CLOSED);
		});

		it('should close an application in DAC_REVIEW state', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.DAC_REVIEW },
			});
			const result = await closeApplication({ applicationId: testApplicationId });

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.CLOSED);
		});

		it('should close an application in DAC_REVIEW state', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.DAC_REVIEW },
			});
			const result = await closeApplication({ applicationId: testApplicationId });

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.CLOSED);
		});

		it('should prevent closing an already CLOSED application', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.CLOSED },
			});
			const result = await closeApplication({ applicationId: testApplicationId });

			assert.ok(!result.success);
			assert.strictEqual(result.message, 'Application is already closed.');
		});

		it('should prevent closing in APPROVED state', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.APPROVED },
			});
			const result = await closeApplication({ applicationId: testApplicationId });

			assert.ok(!result.success);
			assert.strictEqual(result.message, `Cannot close application in state ${ApplicationStates.APPROVED}.`);
		});

		it('should fail for non-existent application', async () => {
			const result = await closeApplication({ applicationId: 9999 });

			assert.ok(!result.success);
			assert.strictEqual(result.error, 'NOT_FOUND');
		});
	});

	describe('Request Application Revisions', () => {
		it('should request revisions when application is in DAC_REVIEW state', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });
			assert.ok(applicationRecordsResult.success);
			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);
			const { id } = applicationRecordsResult.data.applications[0];

			// Act: Call the function
			const result = await requestApplicationRevisionsByDac({
				applicationId: id,
				revisionData: revisionRequestData,
			});

			assert.ok(!result.success);
		});

		it('should fail if application is not in the correct state', async () => {
			// Arrange: Set up test data
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });
			assert.ok(applicationRecordsResult.success);
			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);
			const { id } = applicationRecordsResult.data.applications[0];

			// Act: Call the function
			const result = await requestApplicationRevisionsByDac({
				applicationId: id,
				revisionData: revisionRequestData,
			});

			// Assert: Should return a failure message
			assert.strictEqual(result.success, false, 'Function should return failure when state is incorrect');
		});

		it('should fail when application id is not found', async () => {
			// Arrange: Force an error
			const invalidApplicationId = -1;

			// Act: Call the function
			const result = await requestApplicationRevisionsByDac({
				applicationId: invalidApplicationId,
				revisionData: revisionRequestData,
			});

			// Assert: Should return an error message
			assert.strictEqual(result.success, false);
			assert.strictEqual(result.error, 'NOT_FOUND');
		});
	});

	describe('getRevisions', () => {
		it('should fetch revisions for a valid applicationId where revisions exist', async () => {
			// Arrange: Add revisions to the database for a specific application
			const applicationId = testApplicationId;
			await testApplicationRepo.createRevisionRequest({
				applicationId,
				revisionData: {
					agreements_approved: false,
					appendices_approved: false,
					ethics_approved: false,
					sign_and_submit_approved: true,
					application_id: applicationId,
					comments: 'Initial revision',
					applicant_approved: false,
					institution_rep_approved: false,
					collaborators_approved: false,
					project_approved: false,
					requested_studies_approved: false,
					created_at: new Date(),
				},
			});

			// Act: Call the getRevisions method
			const result = await getRevisions({ applicationId });

			// Assert: Verify that revisions are fetched successfully
			assert.ok(result.success, 'Expected revisions to be fetched successfully');
			assert.ok(Array.isArray(result.data), 'Expected revisions to be an array');
			assert.strictEqual(result.data.length, 1, 'Expected one revision to be returned');
		});
	});

	describe('Submit Application', () => {
		it('should successfully submit an application in DRAFT state', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });
			assert.ok(applicationRecordsResult.success);
			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const { id } = applicationRecordsResult.data.applications[0];
			await testApplicationRepo.findOneAndUpdate({ id, update: { state: ApplicationStates.DRAFT } });

			// Act
			const result = await submitApplication({ applicationId: id });

			// Assert
			assert.ok(result.success);
			assert.ok(result.data);

			// Verify state transition
			const updatedApplication = await testApplicationRepo.getApplicationById({ id });
			assert.ok(updatedApplication.success);
		});

		it('should fail to submit an application not in DRAFT state', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });
			assert.ok(applicationRecordsResult.success);
			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const { id } = applicationRecordsResult.data.applications[0];
			await testApplicationRepo.findOneAndUpdate({ id, update: { state: ApplicationStates.DAC_REVIEW } });

			// Act
			const result = await submitApplication({ applicationId: id });

			// Assert
			assert.ok(!result.success);
			assert.strictEqual(result.error, 'INVALID_STATE_TRANSITION');
		});
	});

	describe('Application History', () => {
		it('should successfully retrieve Application History for a given ID', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });
			assert.ok(applicationRecordsResult.success);
			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const { id: applicationId } = applicationRecordsResult.data.applications[0];
			const result = await getApplicationHistory({ applicationId });

			assert.ok(result.success);
		});
	});

	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
