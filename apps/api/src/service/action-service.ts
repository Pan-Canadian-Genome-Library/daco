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

import { and, asc, eq } from 'drizzle-orm';

import { type PostgresDb } from '@/db/index.js';
import { actions } from '@/db/schemas/actions.js';
// TODO: Revisit Sort import { sortQuery } from '@/service/utils.js';
import { failure, success } from '@/utils/results.js';
import {
	ActionValues,
	ApplicationActions,
	ApplicationStates,
	ApplicationStateValues,
} from '@pcgl-daco/data-model/src/types.js';
import { ApplicationData, type ActionsColumnName, type OrderBy } from './types.js';

const actionService = (db: PostgresDb) => {
	// New actions are created on every transition from one state to the next
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
		create: async (application: ApplicationData) => {
			const action = ApplicationActions.CREATE;
			const state_after = ApplicationStates.DRAFT;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		withdraw: async (application: ApplicationData) => {
			const action = ApplicationActions.WITHDRAW;
			const state_after = ApplicationStates.DRAFT;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		close: async (application: ApplicationData) => {
			const action = ApplicationActions.CLOSE;
			const state_after = ApplicationStates.CLOSED;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		repReview: async (application: ApplicationData) => {
			const action = ApplicationActions.REQUEST_REP_REVIEW;
			const state_after = ApplicationStates.INSTITUTIONAL_REP_REVIEW;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		repRevision: async (application: ApplicationData) => {
			const action = ApplicationActions.INSTITUTIONAL_REP_REVISION;
			const state_after = ApplicationStates.REP_REVISION;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		repSubmit: async (application: ApplicationData) => {
			const action = ApplicationActions.INSTITUTIONAL_REP_SUBMIT;
			const state_after = ApplicationStates.INSTITUTIONAL_REP_REVIEW;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		repApproved: async (application: ApplicationData) => {
			const action = ApplicationActions.INSTITUTIONAL_REP_APPROVED;
			const state_after = ApplicationStates.DAC_REVIEW;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		dacApproved: async (application: ApplicationData) => {
			const action = ApplicationActions.DAC_REVIEW_APPROVED;
			const state_after = ApplicationStates.APPROVED;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		dacRejected: async (application: ApplicationData) => {
			const action = ApplicationActions.DAC_REVIEW_REJECTED;
			const state_after = ApplicationStates.REJECTED;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		dacRevision: async (application: ApplicationData) => {
			const action = ApplicationActions.DAC_REVIEW_REVISIONS;
			const state_after = ApplicationStates.DAC_REVISIONS_REQUESTED;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		dacSubmit: async (application: ApplicationData) => {
			const action = ApplicationActions.DAC_REVIEW_SUBMIT;
			const state_after = ApplicationStates.DAC_REVIEW;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		revoke: async (application: ApplicationData) => {
			const action = ApplicationActions.REVOKE;
			const state_after = ApplicationStates.REVOKED;

			const result = await addActionRecord(application, action, state_after);
			return result;
		},
		getActionById: async ({ id }: { id: number }) => {
			try {
				const actionRecord = await db.select().from(actions).where(eq(actions.id, id));
				if (!actionRecord[0]) throw new Error('Action record is undefined');

				return success(actionRecord[0]);
			} catch (err) {
				const message = `Error at getActionById with id: ${id}`;
				console.error(message);
				console.error(err);
				return failure(message, err);
			}
		},
		listActions: async ({
			user_id,
			application_id,
			sort = [],
			page = 0,
			pageSize = 20,
		}: {
			user_id?: string;
			application_id?: number;
			sort?: Array<OrderBy<ActionsColumnName>>;
			page?: number;
			pageSize?: number;
		}) => {
			try {
				const allActions = await db
					.select()
					.from(actions)
					.where(
						and(
							user_id ? eq(actions.user_id, String(user_id)) : undefined,
							application_id ? eq(actions.application_id, application_id) : undefined,
						),
					)
					// TODO: Revisit Sort ...sortQuery(sort)
					.orderBy(asc(actions.created_at))
					.offset(page * pageSize)
					.limit(pageSize);

				return success(allActions);
			} catch (err) {
				const message = `Error at listActions with user_id: ${user_id}`;
				console.error(message);
				console.error(err);
				return failure(message, err);
			}
		},
	};
};

export default actionService;
