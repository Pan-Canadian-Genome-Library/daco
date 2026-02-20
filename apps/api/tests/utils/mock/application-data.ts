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

import { type ApplicationModel } from '@/service/types.ts';
import { ApplicationStates } from '@pcgl-daco/data-model';

// Sample revision request data
export const revisionRequestData = {
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

export const applicationArray: ApplicationModel[] = [
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DRAFT,
		created_at: new Date('2025-01-01T11:00:00Z'),
		updated_at: new Date('2025-01-01T11:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.INSTITUTIONAL_REP_REVIEW,
		created_at: new Date('2025-01-01T12:00:00Z'),
		updated_at: new Date('2025-01-01T12:15:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED,
		created_at: new Date('2025-01-01T13:00:00Z'),
		updated_at: new Date('2025-01-01T13:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DAC_REVIEW,
		created_at: new Date('2025-01-01T14:00:00Z'),
		updated_at: new Date('2025-01-01T14:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DAC_REVISIONS_REQUESTED,
		created_at: new Date('2025-01-01T15:00:00Z'),
		updated_at: new Date('2025-01-01T15:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.REJECTED,
		created_at: new Date('2025-01-01T16:00:00Z'),
		updated_at: new Date('2025-01-01T16:15:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.APPROVED,
		created_at: new Date('2025-01-01T17:00:00Z'),
		updated_at: new Date('2025-01-01T17:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.CLOSED,
		created_at: new Date('2025-01-01T18:00:00Z'),
		updated_at: new Date('2025-01-01T18:15:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.REVOKED,
		created_at: new Date('2025-01-01T19:00:00Z'),
		updated_at: new Date('2025-01-01T19:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DRAFT,
		created_at: new Date('2025-01-02T10:00:00Z'),
		updated_at: new Date('2025-01-02T10:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.INSTITUTIONAL_REP_REVIEW,
		created_at: new Date('2025-01-02T11:00:00Z'),
		updated_at: new Date('2025-01-02T11:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DAC_REVIEW,
		created_at: new Date('2025-01-02T12:00:00Z'),
		updated_at: new Date('2025-01-02T12:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.APPROVED,
		created_at: new Date('2025-01-02T13:00:00Z'),
		updated_at: new Date('2025-01-02T13:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.CLOSED,
		created_at: new Date('2025-01-02T14:00:00Z'),
		updated_at: new Date('2025-01-02T14:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DRAFT,
		created_at: new Date('2025-01-02T15:00:00Z'),
		updated_at: new Date('2025-01-02T15:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED,
		created_at: new Date('2025-01-02T16:00:00Z'),
		updated_at: new Date('2025-01-02T16:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DAC_REVIEW,
		created_at: new Date('2025-01-02T17:00:00Z'),
		updated_at: new Date('2025-01-02T17:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DAC_REVISIONS_REQUESTED,
		created_at: new Date('2025-01-02T18:00:00Z'),
		updated_at: new Date('2025-01-02T18:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.REJECTED,
		created_at: new Date('2025-01-02T19:00:00Z'),
		updated_at: new Date('2025-01-02T19:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.APPROVED,
		created_at: new Date('2025-01-02T20:00:00Z'),
		updated_at: new Date('2025-01-02T20:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DAC_REVIEW,
		created_at: new Date('2025-01-02T20:00:00Z'),
		updated_at: new Date('2025-01-02T20:30:00Z'),
	},
];

export const reminderApplicationArray: ApplicationModel[] = [
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DRAFT,
		dac_id: 'dac1',
		created_at: new Date('2025-01-01T11:00:00Z'),
		updated_at: new Date('2025-01-01T11:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.INSTITUTIONAL_REP_REVIEW,
		created_at: new Date('2025-01-01T12:00:00Z'),
		updated_at: new Date('2025-01-01T12:15:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED,
		created_at: new Date('2025-01-01T13:00:00Z'),
		updated_at: new Date('2025-01-01T13:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.INSTITUTIONAL_REP_REVIEW,
		created_at: new Date('2025-01-01T14:00:00Z'),
		updated_at: new Date('2025-01-01T14:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DAC_REVIEW,
		created_at: new Date('2025-01-01T14:00:00Z'),
		updated_at: new Date('2025-01-01T14:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DAC_REVISIONS_REQUESTED,
		created_at: new Date('2025-01-01T15:00:00Z'),
		updated_at: new Date('2025-01-01T15:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DAC_REVIEW,
		created_at: new Date('2025-01-01T15:00:00Z'),
		updated_at: new Date('2025-01-01T15:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DRAFT,
		created_at: new Date('2025-01-01T15:00:00Z'),
		updated_at: new Date('2025-01-01T15:45:00Z'),
	},
];
