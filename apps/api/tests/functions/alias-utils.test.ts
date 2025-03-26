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

import { JoinedApplicationRecord } from '@/service/types.ts';
import { aliasApplicationContentsRecord, aliasApplicationRecord } from '@/utils/aliases.ts';
import { ApplicationStates } from '@pcgl-daco/data-model/src/types.js';
import { type UpdateEditApplicationRequest } from '@pcgl-daco/validation';
import assert from 'node:assert';
import { describe } from 'node:test';
import { testUserId } from '../utils/testUtils.ts';

describe('Alias Utils', () => {
	describe('Alias snake_case to camelCase', () => {
		const testData: JoinedApplicationRecord = {
			id: 1,
			user_id: testUserId,
			state: ApplicationStates.DRAFT,
			created_at: new Date(),
			approved_at: new Date(),
			updated_at: null,
			expires_at: null,
			contents: null,
		};
		const aliasResult = aliasApplicationRecord(testData);
		assert.ok(aliasResult.success && aliasResult.data);
		assert.ok(aliasResult.data.hasOwnProperty('userId'));
		assert.ok(aliasResult.data.hasOwnProperty('createdAt'));
		assert.ok(aliasResult.data.hasOwnProperty('approvedAt'));
	});

	describe('Alias camelCase to snake_case', () => {
		const testData: UpdateEditApplicationRequest = {
			applicantFirstName: 'Test',
			applicantLastName: 'User',
			applicantPositionTitle: 'Dr.',
			applicantInstitutionalEmail: testUserId,
		};
		const aliasResult = aliasApplicationContentsRecord(testData);
		assert.ok(aliasResult.success && aliasResult.data);
		assert.ok(aliasResult.data.hasOwnProperty('applicant_first_name'));
		assert.ok(aliasResult.data.hasOwnProperty('applicant_last_name'));
		assert.ok(aliasResult.data.hasOwnProperty('applicant_position_title'));
		assert.ok(aliasResult.data.hasOwnProperty('applicant_institutional_email'));
	});

	describe('Remove keys not in schema', () => {
		const testData: JoinedApplicationRecord = {
			id: 1,
			user_id: testUserId,
			state: ApplicationStates.DRAFT,
			created_at: new Date(),
			approved_at: new Date(),
			updated_at: null,
			expires_at: null,
			contents: {
				applicant_first_name: 'Test',
				ethics_letter: 0,
				ethics_review_required: true,
				signed_pdf: 0,
			},
		};

		const aliasResult = aliasApplicationRecord(testData);

		assert.ok(aliasResult.success && aliasResult.data.contents);
		assert.ok(aliasResult.data.contents.hasOwnProperty('applicantFirstName'));
		assert.ok(!aliasResult.data.contents.hasOwnProperty('ethicsLetter'));
		assert.ok(!aliasResult.data.contents.hasOwnProperty('ethicsReviewRequired'));
		assert.ok(!aliasResult.data.contents.hasOwnProperty('signedPdf'));
	});
});
