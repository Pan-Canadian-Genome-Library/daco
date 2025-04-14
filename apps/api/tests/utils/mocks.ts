/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import dbUtils from '@/db/index.js';
import * as schema from '@/db/schemas/index.js';
import applicationService from '@/service/applicationService.js';
import {
	ApplicationStateTotals,
	type ApplicationActionRecord,
	type ApplicationActionService,
	type ApplicationRecord,
	type ApplicationService,
	type JoinedApplicationRecord,
	type RevisionRequestRecord,
} from '@/service/types.ts';
import { success } from '@/utils/results.ts';
import { ApplicationStates } from '@pcgl-daco/data-model/src/types.js';
import { testApplicationId, testUserId } from '@tests/utils/testUtils.ts';
import { drizzle } from 'drizzle-orm/node-postgres';
import sinon from 'sinon';

// type ApplicationServiceKeys = keyof ApplicationService;

const testApplicationRecord: ApplicationRecord = {
	id: testApplicationId,
	user_id: testUserId,
	created_at: new Date(),
	updated_at: null,
	state: ApplicationStates.DRAFT,
	approved_at: null,
	expires_at: null,
	contents: null,
};

export const testJoinedApplicationRecord: JoinedApplicationRecord = {
	id: testApplicationId,
	user_id: testUserId,
	created_at: new Date(),
	updated_at: null,
	state: ApplicationStates.DRAFT,
	approved_at: null,
	expires_at: null,
	contents: {},
};

const testApplicationTotals: ApplicationStateTotals = {
	APPROVED: 0,
	CLOSED: 0,
	DAC_REVIEW: 0,
	DAC_REVISIONS_REQUESTED: 0,
	DRAFT: 1,
	INSTITUTIONAL_REP_REVIEW: 0,
	REJECTED: 0,
	INSTITUTIONAL_REP_REVISION_REQUESTED: 0,
	REVOKED: 0,
	TOTAL: 1,
};

const testRevisionRequestRecord: RevisionRequestRecord = {
	id: 1,
	application_id: testApplicationId,
	created_at: new Date(),
	comments: null,
	applicant_notes: null,
	applicant_approved: false,
	institution_rep_approved: false,
	institution_rep_notes: '',
	collaborators_approved: false,
	collaborators_notes: null,
	project_approved: false,
	project_notes: null,
	requested_studies_approved: false,
	requested_studies_notes: null,
	ethics_approved: false,
	ethics_notes: null,
	agreements_approved: false,
	agreements_notes: null,
	appendices_approved: false,
	appendices_notes: null,
	sign_and_submit_approved: false,
	sign_and_submit_notes: null,
};

const baseTestActionRecord: ApplicationActionRecord = {
	id: 1,
	application_id: testApplicationId,
	user_id: testUserId,
	created_at: new Date(),
	action: 'SUBMIT_DRAFT',
	revisions_request_id: null,
	state_before: 'DRAFT',
	state_after: 'INSTITUTIONAL_REP',
};

export type MockDb = ReturnType<typeof drizzle.mock<typeof schema>>;
export const testDb: MockDb = drizzle.mock({ schema });
export const mockDbInstance = sinon.stub(dbUtils, 'getDbInstance').callsFake(() => testDb);

export const mockApplicationRepo: ApplicationService = {
	createApplication: async () => success(testApplicationRecord),
	editApplication: async () => success(testJoinedApplicationRecord),
	findOneAndUpdate: async () => success(testApplicationRecord),
	getApplicationById: async ({ id: number }) => success(testApplicationRecord),
	getApplicationWithContents: async () => success(testJoinedApplicationRecord),
	listApplications: async () =>
		success({ applications: [], pagingMetadata: { totalRecords: 1, page: 0, pageSize: 20 } }),
	applicationStateTotals: async () => success(testApplicationTotals),
	createRevisionRequest: async () => success(testRevisionRequestRecord),
	getApplicationForCollaboratorId: async () => success(testApplicationRecord),
	getRevisions: async () => success([testRevisionRequestRecord]),
};
export const appSvcSpy = sinon.spy(mockApplicationRepo);
// Sinon cannot stub ESM https://sinonjs.org/how-to/stub-dependency/
export const mockService = sinon.stub(applicationService, 'applicationSvc').callsFake(() => appSvcSpy);

export const mockActionRepo: ApplicationActionService = {
	close: async () => new Promise(() => success(baseTestActionRecord)),
	draftSubmit: async () => new Promise(() => success(baseTestActionRecord)),
	dacApproved: async () => new Promise(() => success(baseTestActionRecord)),
	dacRejected: async () => new Promise(() => success(baseTestActionRecord)),
	dacRevision: async () => new Promise(() => success(baseTestActionRecord)),
	dacSubmit: async () => new Promise(() => success(baseTestActionRecord)),
	repRevision: async () => new Promise(() => success(baseTestActionRecord)),
	repSubmit: async () => new Promise(() => success(baseTestActionRecord)),
	repApproved: async () => new Promise(() => success(baseTestActionRecord)),
	revoke: async () => new Promise(() => success(baseTestActionRecord)),
	withdraw: async () => new Promise(() => success(baseTestActionRecord)),
	getActionById: async () => new Promise(() => success(baseTestActionRecord)),
	listActions: async () => new Promise(() => success([baseTestActionRecord])),
};

// export const mockApplicationDb = Object.keys(applicationSvc).reduce(
// 	(acc, key) => {
// 		return {
// 			...acc,
// 			[key]: mock.fn(() => {
// 				return success({ user_id: testUserId, application_id: testApplicationId });
// 			}),
// 		};
// 	},
// 	{} as { [K in ApplicationServiceKeys]: Mock<Function> },
// );

// TODO: Add Mocks
// testCollaboratorsRepo
// testFileService
// testSignatureService
