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
import actionService from '@/service/applicationActionService.ts';
import applicationService from '@/service/applicationService.js';
import { type ApplicationActionService, type ApplicationService } from '@/service/types.ts';
import { success } from '@/utils/results.ts';
import { drizzle } from 'drizzle-orm/node-postgres';
import sinon from 'sinon';
import {
	baseTestActionRecord,
	testApplicationRecord,
	testApplicationTotals,
	testJoinedApplicationRecord,
	testRevisionRequestRecord,
} from './testData.ts';

// Mock DB & Repo Functions
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

export const mockActionRepo: ApplicationActionService = {
	close: async () => success(baseTestActionRecord),
	draftSubmit: async () => success(baseTestActionRecord),
	dacApproved: async () => success(baseTestActionRecord),
	dacRejected: async () => success(baseTestActionRecord),
	dacRevision: async () => success(baseTestActionRecord),
	dacSubmit: async () => success(baseTestActionRecord),
	repRevision: async () => success(baseTestActionRecord),
	repSubmit: async () => success(baseTestActionRecord),
	repApproved: async () => success(baseTestActionRecord),
	revoke: async () => success(baseTestActionRecord),
	withdraw: async () => success(baseTestActionRecord),
	getActionById: async () => success(baseTestActionRecord),
	listActions: async () => success([baseTestActionRecord]),
};

// TODO: Add Mocks
// testCollaboratorsRepo
// testFileService
// testSignatureService

// Spies

export const appSvcSpy = sinon.spy(mockApplicationRepo);
export const actionSvcSpy = sinon.spy(mockActionRepo);

// Stubs
// Sinon cannot stub ESM, so we stub default exports
// https://sinonjs.org/how-to/stub-dependency/
export const mockApplicationService = sinon.stub(applicationService, 'applicationSvc').callsFake(() => appSvcSpy);
export const mockActionService = sinon.stub(actionService, 'applicationActionSvc').callsFake(() => actionSvcSpy);
