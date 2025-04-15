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

import {
	ApplicationStateTotals,
	type ApplicationActionRecord,
	type ApplicationRecord,
	type JoinedApplicationRecord,
	type RevisionRequestRecord,
} from '@/service/types.ts';
import { ApplicationStates } from '@pcgl-daco/data-model/src/types.js';
import { testApplicationId, testUserId } from '@tests/utils/testUtils.ts';

export const testApplicationRecord: ApplicationRecord = {
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
	contents: { applicant_first_name: 'Test' },
};

export const testApplicationTotals: ApplicationStateTotals = {
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

export const testRevisionRequestRecord: RevisionRequestRecord = {
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

export const baseTestActionRecord: ApplicationActionRecord = {
	id: 1,
	application_id: testApplicationId,
	user_id: testUserId,
	created_at: new Date(),
	action: 'SUBMIT_DRAFT',
	revisions_request_id: null,
	state_before: 'DRAFT',
	state_after: 'INSTITUTIONAL_REP',
};
