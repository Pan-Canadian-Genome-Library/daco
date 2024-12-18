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

import { type PostgresDb } from '@/db/index.js';
import { actions } from '@/db/schemas/actions.js';
import { failure, success } from '@/utils/results.js';
import {
	ActionValues,
	ApplicationActions,
	ApplicationStates,
	ApplicationStateValues,
} from '@pcgl-daco/data-model/src/types.js';
import { ApplicationData } from './types.js';

const actionService = (db: PostgresDb) => {
	const addActionRecord = async (
		application: ApplicationData,
		action: ActionValues,
		state_after: ApplicationStateValues,
	) => {
		const { id: application_id, user_id, state: state_before } = application;
		const newAction: typeof actions.$inferInsert = {
			application_id,
			user_id,
			action,
			state_before,
			state_after,
		};

		try {
			const newActionRecord = await db.insert(actions).values(newAction).returning();
			if (!newActionRecord[0]) throw new Error('Application record is undefined');

			return success(newActionRecord[0]);
		} catch (err) {
			const message = `Error creating action with user_id: ${user_id} & application_id: ${application_id}`;
			console.error(message);
			console.error(err);
			return failure(message, err);
		}
	};

	return {
		createAction: async (application: ApplicationData) => {
			const action = ApplicationActions.CREATE;
			const state_after = ApplicationStates.DRAFT;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		withdrawAction: async (application: ApplicationData) => {
			const action = ApplicationActions.WITHDRAW;
			const state_after = ApplicationStates.DRAFT;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		closeAction: async (application: ApplicationData) => {
			const action = ApplicationActions.CLOSE;
			const state_after = ApplicationStates.CLOSED;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		requestRepAction: async (application: ApplicationData) => {
			const action = ApplicationActions.REQUEST_INSTITUTIONAL_REP;
			const state_after = ApplicationStates.REP_REVISION;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		repApprovedAction: async (application: ApplicationData) => {
			const action = ApplicationActions.INSTITUTIONAL_REP_APPROVED;
			const state_after = ApplicationStates.DAC_REVIEW;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		repRejectedAction: async (application: ApplicationData) => {
			const action = ApplicationActions.INSTITUTIONAL_REP_REJECTED;
			const state_after = ApplicationStates.DRAFT;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		dacApprovedAction: async (application: ApplicationData) => {
			const action = ApplicationActions.DAC_REVIEW_APPROVED;
			const state_after = ApplicationStates.APPROVED;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		dacRejectedAction: async (application: ApplicationData) => {
			const action = ApplicationActions.DAC_REVIEW_REJECTED;
			const state_after = ApplicationStates.REJECTED;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		dacRevisionAction: async (application: ApplicationData) => {
			const action = ApplicationActions.DAC_REVIEW_REVISIONS;
			const state_after = ApplicationStates.DAC_REVIEW;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		revokeAction: async (application: ApplicationData) => {
			const action = ApplicationActions.REVOKE;
			const state_after = ApplicationStates.REVOKED;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
	};
};

export default actionService;
