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

import { and, eq } from 'drizzle-orm';

import { type PostgresDb } from '@/db/index.js';
import { applicationActions } from '@/db/schemas/applicationActions.js';
import logger from '@/logger.js';
import { applicationActionsQuery } from '@/service/utils.js';
import { type AsyncResult, failure, success } from '@/utils/results.js';
import {
	ApplicationActions,
	ApplicationActionValues,
	ApplicationStates,
	ApplicationStateValues,
} from '@pcgl-daco/data-model/src/types.js';
import {
	type ApplicationActionRecord,
	type ApplicationActionsColumnName,
	type ApplicationRecord,
	type OrderBy,
} from './types.js';

/**
 * ApplicationActionService provides methods for ApplicationActions DB access
 * @param db - Drizzle Postgres DB Instance
 */
const applicationActionSvc = (db: PostgresDb) => {
	/** @method addActionRecord: Template method for adding an Action record */
	/** New actions are created on every transition from one state to the next */
	const addActionRecord = async (
		application: ApplicationRecord,
		action: ApplicationActionValues,
		state_after: ApplicationStateValues,
	): AsyncResult<ApplicationActionRecord> => {
		const { id: application_id, user_id, state: state_before } = application;
		const newAction: typeof applicationActions.$inferInsert = {
			application_id,
			user_id,
			action,
			state_before,
			state_after,
		};

		try {
			const newActionRecord = await db.insert(applicationActions).values(newAction).returning();
			if (!newActionRecord[0]) throw new Error('Application record is undefined');

			return success(newActionRecord[0]);
		} catch (err) {
			const message = `Error creating action with user_id: ${user_id} & application_id: ${application_id}`;
			logger.error(message);
			logger.error(err);
			return failure(message, err);
		}
	};

	return {
		/** @method: Aliased methods for each state transition */
		close: async (application: ApplicationRecord) =>
			await addActionRecord(application, ApplicationActions.CLOSE, ApplicationStates.CLOSED),
		draftSubmit: async (application: ApplicationRecord) =>
			await addActionRecord(application, ApplicationActions.SUBMIT_DRAFT, ApplicationStates.INSTITUTIONAL_REP_REVIEW),
		dacApproved: async (application: ApplicationRecord) =>
			await addActionRecord(application, ApplicationActions.DAC_REVIEW_APPROVED, ApplicationStates.APPROVED),
		dacRejected: async (application: ApplicationRecord) =>
			await addActionRecord(application, ApplicationActions.DAC_REVIEW_REJECTED, ApplicationStates.REJECTED),
		dacRevision: async (application: ApplicationRecord) =>
			await addActionRecord(
				application,
				ApplicationActions.DAC_REVIEW_REVISION_REQUEST,
				ApplicationStates.DAC_REVISIONS_REQUESTED,
			),
		dacSubmit: async (application: ApplicationRecord) =>
			await addActionRecord(application, ApplicationActions.DAC_REVIEW_SUBMIT, ApplicationStates.DAC_REVIEW),
		repRevision: async (application: ApplicationRecord) =>
			await addActionRecord(
				application,
				ApplicationActions.INSTITUTIONAL_REP_REVISION_REQUEST,
				ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED,
			),
		repSubmit: async (application: ApplicationRecord) =>
			await addActionRecord(
				application,
				ApplicationActions.INSTITUTIONAL_REP_SUBMIT,
				ApplicationStates.INSTITUTIONAL_REP_REVIEW,
			),
		repApproved: async (application: ApplicationRecord) =>
			await addActionRecord(application, ApplicationActions.INSTITUTIONAL_REP_APPROVED, ApplicationStates.DAC_REVIEW),
		revoke: async (application: ApplicationRecord) =>
			await addActionRecord(application, ApplicationActions.REVOKE, ApplicationStates.REVOKED),
		withdraw: async (application: ApplicationRecord) =>
			await addActionRecord(application, ApplicationActions.WITHDRAW, ApplicationStates.DRAFT),
		/** @method getActionById: Find a specific Action record */
		getActionById: async ({ id }: { id: number }): AsyncResult<ApplicationActionRecord> => {
			try {
				const actionRecord = await db.select().from(applicationActions).where(eq(applicationActions.id, id));
				if (!actionRecord[0]) throw new Error('Action record is undefined');

				return success(actionRecord[0]);
			} catch (err) {
				const message = `Error at getActionById with id: ${id}`;
				logger.error(message);
				logger.error(err);
				return failure(message, err);
			}
		},
		/** @method listActions: Find multiple Actions related to a given User or Application */
		listActions: async ({
			user_id,
			application_id,
			sort = [],
			page = 0,
			pageSize = 20,
		}: {
			user_id?: string;
			application_id?: number;
			sort?: Array<OrderBy<ApplicationActionsColumnName>>;
			page?: number;
			pageSize?: number;
		}): AsyncResult<ApplicationActionRecord[]> => {
			try {
				const allActions = await db
					.select()
					.from(applicationActions)
					.where(
						and(
							user_id ? eq(applicationActions.user_id, String(user_id)) : undefined,
							application_id ? eq(applicationActions.application_id, application_id) : undefined,
						),
					)
					.orderBy(...applicationActionsQuery(sort))
					.offset(page * pageSize)
					.limit(pageSize);

				return success(allActions);
			} catch (err) {
				const message = `Error at listActions with user_id: ${user_id}`;
				logger.error(message);
				logger.error(err);
				return failure(message, err);
			}
		},
	};
};

export { applicationActionSvc };
