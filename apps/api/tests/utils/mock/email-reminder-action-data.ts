/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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

import { ApplicationActionModel } from '@/service/types.ts';

export const emailActionArray: Omit<ApplicationActionModel, 'id'>[] = [
	{
		user_id: 'testUser@oicr.on.ca',
		application_id: 2,
		created_at: new Date('2025-01-01T11:00:00Z'),
		user_name: 'Test User',
		action: 'SUBMIT_DRAFT',
		revisions_request_id: null,
		state_before: 'DRAFT',
		state_after: 'INSTITUTIONAL_REP_REVIEW',
	},
	{
		user_id: 'testUser@oicr.on.ca',
		application_id: 3,
		created_at: new Date('2025-01-01T12:00:00Z'),
		user_name: 'Test User',
		action: 'INSTITUTIONAL_REP_REVISION_REQUEST',
		revisions_request_id: 1,
		state_before: 'INSTITUTIONAL_REP_REVIEW',
		state_after: 'INSTITUTIONAL_REP_REVISION_REQUESTED',
	},
	{
		user_id: 'testUser@oicr.on.ca',
		application_id: 4,
		created_at: new Date('2025-01-01T13:00:00Z'),
		user_name: 'Test User',
		action: 'INSTITUTIONAL_REP_SUBMIT',
		revisions_request_id: 1,
		state_before: 'INSTITUTIONAL_REP_REVISION_REQUESTED',
		state_after: 'INSTITUTIONAL_REP_REVIEW',
	},
	{
		user_id: 'testUser@oicr.on.ca',
		application_id: 5,
		created_at: new Date('2025-01-01T14:00:00Z'),
		user_name: 'Test User',
		action: 'INSTITUTIONAL_REP_APPROVED',
		revisions_request_id: null,
		state_before: 'INSTITUTIONAL_REP_REVIEW',
		state_after: 'DAC_REVIEW',
	},
	{
		user_id: 'testUser@oicr.on.ca',
		application_id: 6,
		created_at: new Date('2025-01-01T15:00:00Z'),
		user_name: 'Test User',
		action: 'DAC_REVIEW_REVISION_REQUEST',
		revisions_request_id: 2,
		state_before: 'DAC_REVIEW',
		state_after: 'DAC_REVISIONS_REQUESTED',
	},
	{
		user_id: 'testUser@oicr.on.ca',
		application_id: 7,
		created_at: new Date('2025-01-01T15:00:00Z'),
		user_name: 'Test User',
		action: 'DAC_REVIEW_SUBMIT',
		revisions_request_id: 2,
		state_before: 'DAC_REVISIONS_REQUESTED',
		state_after: 'DAC_REVIEW',
	},
	{
		user_id: 'testUser@oicr.on.ca',
		application_id: 8,
		created_at: new Date('2025-01-01T15:00:00Z'),
		user_name: 'Test User',
		action: 'WITHDRAW',
		revisions_request_id: 3,
		state_before: 'DAC_REVIEW',
		state_after: 'DRAFT',
	},
];
