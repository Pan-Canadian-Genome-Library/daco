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
	requestApplicationRevisionsByDac,
	requestApplicationRevisionsByInstitutionalRep,
	revokeApplication,
	submitApplication,
	submitRevision,
	withdrawApplication,
} from '@/controllers/applicationController.js';
import { connectToDb, type PostgresDb } from '@/db/index.js';
import { applicationSvc } from '@/service/applicationService.js';
import { type ApplicationService, type RevisionRequestModel } from '@/service/types.js';
import { ApplicationStates } from '@pcgl-daco/data-model/src/types.js';

import { ApplicationListSummary, ApplicationStateValues } from '@pcgl-daco/data-model';
import {
	addInitialApplications,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
	testApplicationId,
	testUserName,
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

	/**
	 * Function returns the first application based on the state provided if provided.
	 * @param state
	 * @returns ApplicationListSummary
	 */
	const getFirstApplicationTestByState = async (
		applicationState?: ApplicationStateValues,
	): Promise<ApplicationListSummary> => {
		const applicationRecordsResult = await testApplicationRepo.listApplications({
			user_id,
			state: applicationState ? [applicationState] : undefined,
		});

		assert.ok(applicationRecordsResult.success);

		const applicationRecords = applicationRecordsResult.data.applications;
		assert.ok(applicationRecords[0]);

		return applicationRecords[0];
	};

	describe('Edit Application', () => {
		it('should allow editing applications with status DRAFT and submitted user_id', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.DRAFT);

			const update = { applicantFirstName: 'Test' };

			const result = await editApplication({ id: testApp.id, update });

			assert.ok(result.success);

			const editedApplication = result.data;
			assert.strictEqual(editedApplication.state, ApplicationStates.DRAFT);

			assert.ok(editedApplication.contents);
			assert.strictEqual(editedApplication.contents.applicantFirstName, update.applicantFirstName);
		});

		it('should allow editing applications with state DAC_REVIEW, and revert state to DRAFT', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.DRAFT);

			assert.strictEqual(testApp.state, ApplicationStates.DRAFT);

			const stateUpdate = { state: ApplicationStates.INSTITUTIONAL_REP_REVIEW };
			const reviewRecordResult = await testApplicationRepo.findOneAndUpdate({ id: testApp.id, update: stateUpdate });

			assert.ok(reviewRecordResult.success && reviewRecordResult.data);
			assert.strictEqual(reviewRecordResult.data.state, ApplicationStates.INSTITUTIONAL_REP_REVIEW);

			/**
			 * Applications must be withdrawn before they can be edited.
			 */
			const withdrawResult = await withdrawApplication({ applicationId: testApp.id, userName: testUserName });

			assert.ok(withdrawResult.success);

			const contentUpdate = { applicantLastName: 'User' };
			const result = await editApplication({ id: testApp.id, update: contentUpdate });

			assert.ok(result.success);

			const editedApplication = result.data;
			assert.strictEqual(editedApplication.id, testApp.id);
			assert.strictEqual(editedApplication.state, ApplicationStates.DRAFT);

			assert.ok(editedApplication.contents);
			assert.strictEqual(editedApplication.contents.applicantLastName, contentUpdate.applicantLastName);
		});

		it('should error and return null when application state is not draft or review', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.DRAFT);

			const stateUpdate = { state: ApplicationStates.CLOSED };
			await testApplicationRepo.findOneAndUpdate({ id: testApp.id, update: stateUpdate });

			const contentUpdate = { applicantTitle: 'Dr.' };
			const result = await editApplication({ id: testApp.id, update: contentUpdate });

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
			const testApp = await getFirstApplicationTestByState(ApplicationStates.DAC_REVIEW);

			const rejectionReason = 'Reject';

			const result = await dacRejectApplication({ applicationId: testApp.id, rejectionReason, userName: 'Test-User' });
			assert.ok(result.success);

			const rejectedApplication = await getApplicationById({ applicationId: testApp.id });
			assert.ok(rejectedApplication.success);
			assert.strictEqual(rejectedApplication.data.state, ApplicationStates.REJECTED);
		});

		it('should failed to reject an application in NOT in DAC_REVIEW state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.CLOSED);

			const result = await dacRejectApplication({
				applicationId: testApp.id,
				rejectionReason: 'Test Reject',
				userName: 'Test-User',
			});

			assert.ok(!result.success);
			assert.ok(result.error, 'INVALID_STATE_TRANSITION');
		});
	});

	describe('Submit Revision', () => {
		it('should fail to submit a revision for an already revised application (DAC_REVISIONS_REQUESTED)', async () => {
			await testApplicationRepo.findOneAndUpdate({
				id: testApplicationId,
				update: { state: ApplicationStates.DAC_REVIEW },
			});
			const result = await submitRevision({ applicationId: testApplicationId, userName: testUserName });

			assert.ok(!result.success);
			assert.strictEqual(result.error, 'INVALID_STATE_TRANSITION');
		});

		it('should fail to submit a revision for a non-existent application', async () => {
			const result = await submitRevision({ applicationId: 9999, userName: testUserName });

			assert.ok(!result.success);
			assert.strictEqual(result.error, 'NOT_FOUND');
		});
	});

	describe('Revoke Application', () => {
		it('should successfully revoke an application in APPROVED state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.APPROVED);

			const result = await revokeApplication(testApp.id, true, 'TEST-REVOKE-COMMENT', 'Test-User');

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.REVOKED);

			// Verify the application state in the database
			const revokedApplication = await testApplicationRepo.getApplicationById({ id: testApp.id });
			assert.ok(revokedApplication.success);
			assert.strictEqual(revokedApplication.data.state, ApplicationStates.REVOKED);
		});

		it('should fail to revoke an application not in APPROVED state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.CLOSED);

			const result = await revokeApplication(testApp.id, true, 'TEST-REVOKE-COMMENT', 'Test-User');

			// Verify the revocation failed
			assert.ok(!result.success);
			assert.strictEqual(result.error, 'INVALID_STATE_TRANSITION');
		});

		it('should fail if application does not exist', async () => {
			const nonExistentId = 9999;

			const result = await revokeApplication(nonExistentId, true, 'TEST-REVOKE-COMMENT', testUserName);

			// Assert: Verify the revocation failed
			assert.ok(!result.success);
			assert.strictEqual(result.error, 'NOT_FOUND');
		});
	});

	describe('Withdraw Application', () => {
		it('should withdraw an application in DAC_REVIEW state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.DAC_REVIEW);

			const result = await withdrawApplication({ applicationId: testApp.id, userName: 'Test-User' });

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.DRAFT);
		});

		it('should withdraw an application in INSTITUTIONAL_REP_REVIEW state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.INSTITUTIONAL_REP_REVIEW);

			const result = await withdrawApplication({ applicationId: testApp.id, userName: 'Test-User' });

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.DRAFT);
		});

		it('should fail to withdraw an application in DRAFT state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.DRAFT);

			const result = await withdrawApplication({ applicationId: testApp.id, userName: 'Test-User' });

			assert.ok(!result.success);
		});

		it('should fail to withdraw an application in REJECTED state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.REJECTED);

			const result = await withdrawApplication({ applicationId: testApp.id, userName: 'Test-User' });

			assert.ok(!result.success);
		});

		it('should fail to withdraw an application in INSTITUTIONAL_REP_REVISION_REQUESTED state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED);

			const result = await withdrawApplication({ applicationId: testApp.id, userName: 'Test-User' });

			assert.ok(!result.success);
		});

		it('should fail to withdraw an application in DAC_REVISIONS_REQUESTED state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.DAC_REVISIONS_REQUESTED);

			const result = await withdrawApplication({ applicationId: testApp.id, userName: 'Test-User' });

			assert.ok(!result.success);
		});

		it('should fail to withdraw an application in APPROVED state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.APPROVED);

			const result = await withdrawApplication({ applicationId: testApp.id, userName: 'Test-User' });

			assert.ok(!result.success);
		});

		it('should fail for non-existent application', async () => {
			const result = await withdrawApplication({ applicationId: 9999, userName: testUserName });

			assert.ok(!result.success);
			assert.strictEqual(result.error, 'NOT_FOUND');
		});
	});

	describe('Close Application', () => {
		it('should close an application in DRAFT state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.DRAFT);

			const result = await closeApplication({ applicationId: testApp.id, userName: 'Test-User' });

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.CLOSED);
		});

		it('should close an application in INSTITUTIONAL_REP_REVIEW state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.INSTITUTIONAL_REP_REVIEW);

			const result = await closeApplication({ applicationId: testApp.id, userName: 'Test-User' });

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.CLOSED);
		});

		it('should close an application in DAC_REVIEW state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.DAC_REVIEW);

			const result = await closeApplication({ applicationId: testApp.id, userName: 'Test-User' });

			assert.ok(result.success);
			assert.strictEqual(result.data.state, ApplicationStates.CLOSED);
		});

		it('should prevent closing an already CLOSED application', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.CLOSED);

			const result = await closeApplication({ applicationId: testApp.id, userName: 'Test-User' });

			assert.ok(!result.success);
			assert.strictEqual(result.message, 'Application is already closed.');
		});

		it('should prevent closing in APPROVED state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.APPROVED);

			const result = await closeApplication({ applicationId: testApp.id, userName: 'Test-User' });

			assert.ok(!result.success);
			assert.strictEqual(result.message, `Cannot close application in state ${ApplicationStates.APPROVED}.`);
		});

		it('should fail for non-existent application', async () => {
			const result = await closeApplication({ applicationId: 9999, userName: testUserName });

			assert.ok(!result.success);
			assert.strictEqual(result.error, 'NOT_FOUND');
		});
	});

	describe('Request DAC Revisions', () => {
		it('should be able to create revisions DAC request when application is in DAC_REVIEW state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.DAC_REVIEW);

			const result = await requestApplicationRevisionsByDac({
				applicationId: testApp.id,
				revisionData: revisionRequestData,
				userName: testUserName,
			});

			assert.ok(result.success);
		});

		it('should fail revisions DAC request if application is not in the correct state', async () => {
			const testApp = await getFirstApplicationTestByState(ApplicationStates.CLOSED);

			const result = await requestApplicationRevisionsByDac({
				applicationId: testApp.id,
				revisionData: revisionRequestData,
				userName: testUserName,
			});

			assert.strictEqual(result.success, false, 'Function should return failure when state is incorrect');
		});

		it('should fail when application id is not found', async () => {
			// Arrange: Force an error
			const invalidApplicationId = -1;

			// Act: Call the function
			const result = await requestApplicationRevisionsByDac({
				applicationId: invalidApplicationId,
				revisionData: revisionRequestData,
				userName: testUserName,
			});

			// Assert: Should return an error message
			assert.strictEqual(result.success, false);
			assert.strictEqual(result.error, 'NOT_FOUND');
		});
	});

	describe('Get Revisions', () => {
		it('DAC revisions request should fail if not state is NOT in DAC_REVIEW', async () => {
			// Find application that is not in DAC_REVIEW state
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id, state: ['APPROVED'] });
			assert.ok(applicationRecordsResult.success);
			const testAppId = applicationRecordsResult.data.applications[0]?.id;
			assert.ok(testAppId);

			const result = await requestApplicationRevisionsByDac({
				applicationId: testAppId,
				revisionData: {
					application_id: testAppId,
					agreements_approved: false,
					appendices_approved: false,
					ethics_approved: false,
					sign_and_submit_approved: true,
					comments: 'SHOULD FAIL',
					applicant_approved: false,
					institution_rep_approved: false,
					collaborators_approved: false,
					project_approved: false,
					requested_studies_approved: false,
					created_at: new Date(),
					agreements_notes: '',
				},
				userName: 'Test-User',
			});

			assert.ok(!result.success);
			assert.ok(result.error === 'INVALID_STATE_TRANSITION');
		});

		it('REP revisions request should fail if not state is NOT in INSTITUTIONAL_REP_REVIEW', async () => {
			// Find application that is not in DAC_REVIEW state
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id, state: ['APPROVED'] });
			assert.ok(applicationRecordsResult.success);
			const testAppId = applicationRecordsResult.data.applications[0]?.id;
			assert.ok(testAppId);

			const result = await requestApplicationRevisionsByInstitutionalRep({
				applicationId: testAppId,
				revisionData: {
					application_id: testAppId,
					agreements_approved: false,
					appendices_approved: false,
					ethics_approved: false,
					sign_and_submit_approved: true,
					comments: 'SHOULD FAIL',
					applicant_approved: false,
					institution_rep_approved: false,
					collaborators_approved: false,
					project_approved: false,
					requested_studies_approved: false,
					created_at: new Date(),
				},
				userName: 'Test-User',
			});

			assert.ok(!result.success);
			assert.ok(result.error === 'INVALID_STATE_TRANSITION');
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
			const result = await submitApplication({ applicationId: id, userName: testUserName });

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
			const result = await submitApplication({ applicationId: id, userName: testUserName });

			// Assert
			assert.ok(!result.success);
			assert.strictEqual(result.error, 'INVALID_STATE_TRANSITION');
		});
	});

	describe('Application History', () => {
		it('should successfully retrieve Application History for a given ID', async () => {
			const applicationHistoryResult = await getApplicationHistory({ applicationId: testApplicationId });

			assert.ok(applicationHistoryResult.success);
			assert.ok(Array.isArray(applicationHistoryResult.data) && applicationHistoryResult.data[0]);
		});

		it('should fail when requesting an application ID with no actions', async () => {
			const applicationHistoryResult = await getApplicationHistory({ applicationId: 1000 });

			assert.ok(!applicationHistoryResult.success);
			assert.strictEqual(applicationHistoryResult.error, 'NOT_FOUND');
		});
	});

	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
