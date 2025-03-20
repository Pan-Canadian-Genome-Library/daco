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

import { ApplicationModel } from '@/service/types.ts';
import { ApplicationDTO } from '@pcgl-daco/data-model';
import { ApplicationStates } from '@pcgl-daco/data-model/src/types.js';
import assert from 'node:assert';
import { describe } from 'node:test';
import { testUserId } from '../utils/testUtils.ts';

import { convertToCamelCase, convertToSnakeCase } from '@/utils/aliases.ts';

describe('Alias Utils', () => {
	describe('Alias camelCase to snake_case', () => {
		const testData: ApplicationDTO = {
			id: 1,
			userId: testUserId,
			state: ApplicationStates.DRAFT,
			createdAt: new Date(),
			approvedAt: new Date(),
		};

		const aliasResult = convertToSnakeCase<ApplicationDTO, ApplicationModel>(testData);

		assert.ok(aliasResult.hasOwnProperty('user_id'));
		assert.ok(aliasResult.hasOwnProperty('created_at'));
		assert.ok(aliasResult.hasOwnProperty('approved_at'));
	});

	describe('Alias camelCase to snake_case', () => {
		const testData: ApplicationModel = {
			user_id: testUserId,
			state: ApplicationStates.DRAFT,
			created_at: new Date(),
			approved_at: new Date(),
		};

		const aliasResult = convertToCamelCase<ApplicationModel, ApplicationDTO>(testData);

		assert.ok(aliasResult.hasOwnProperty('userId'));
		assert.ok(aliasResult.hasOwnProperty('createdAt'));
		assert.ok(aliasResult.hasOwnProperty('approvedAt'));
	});

	describe('Remove specific keys', () => {
		const testData: ApplicationModel = {
			user_id: testUserId,
			state: ApplicationStates.DRAFT,
			created_at: new Date(),
			approved_at: new Date(),
			updated_at: new Date(),
		};

		const omitKeys = ['approved_at', 'updated_at'];

		const aliasResult = convertToCamelCase<ApplicationModel, ApplicationDTO>(testData, omitKeys);

		assert.ok(aliasResult.hasOwnProperty('userId'));
		assert.ok(aliasResult.hasOwnProperty('createdAt'));
		assert.ok(!aliasResult.hasOwnProperty('approvedAt'));
		assert.ok(!aliasResult.hasOwnProperty('updatedAt'));
	});
});
