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
	ApplicationActions,
	ApplicationActionValues,
	ApplicationStates,
	ApplicationStateValues,
} from '@pcgl-daco/data-model/src/types.js';
import { and, eq } from 'drizzle-orm';

import { type PostgresDb } from '@/db/index.js';
import { applicationActions } from '@/db/schemas/applicationActions.js';
import BaseLogger from '@/logger.js';
import { applicationActionsSortQuery } from '@/service/utils.js';
import { type AsyncResult, failure, success } from '@/utils/results.js';
import {
	type ApplicationActionRecord,
	type ApplicationActionsColumnName,
	type ApplicationRecord,
	type OrderBy,
	type PostgresTransaction,
} from './types.js';

const logger = BaseLogger.forModule('applicationActionService');

/**
 * ApplicationActionService provides methods for ApplicationActions DB access
 * @param db - Drizzle Postgres DB Instance
 */
const applicationActionSvc = (db: PostgresDb) => {
	/** @method addActionRecord: Template method for adding an Action record */
	/** New actions are created on every transition from one state to the next */
	const addActionRecord = async ({
		application,
		action,
		state_after,
		transaction,
		user_name,
	}: {
		application: ApplicationRecord;
		action: ApplicationActionValues;
		state_after: ApplicationStateValues;
		transaction?: PostgresTransaction;
		user_name?: string;
	}): AsyncResult<ApplicationActionRecord, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
		const { id: application_id, user_id, state: state_before } = application;

		const newAction: typeof applicationActions.$inferInsert = {
			application_id,
			user_id,
			user_name,
			action,
			state_before,
			state_after,
		};

		try {
			const dbTransaction = transaction ? transaction : db;
			const newActionRecord = await dbTransaction.insert(applicationActions).values(newAction).returning();
			if (!newActionRecord[0]) {
				return failure('NOT_FOUND', 'Application record is undefined');
			}

			return success(newActionRecord[0]);
		} catch (err) {
			const message = `Error creating action with user_id: ${user_id} & application_id: ${application_id}`;
			logger.error(message, err);
			return failure('SYSTEM_ERROR', message);
		}
	};

	return {
		/** @method: Aliased methods for each state transition */
		close: async (application: ApplicationRecord, transaction?: PostgresTransaction, user_name?: string) =>
			await addActionRecord({
				application,
				action: ApplicationActions.CLOSE,
				state_after: ApplicationStates.CLOSED,
				transaction,
				user_name,
			}),
		draftSubmit: async (application: ApplicationRecord, transaction?: PostgresTransaction, user_name?: string) =>
			await addActionRecord({
				application,
				action: ApplicationActions.SUBMIT_DRAFT,
				state_after: ApplicationStates.INSTITUTIONAL_REP_REVIEW,
				transaction,
				user_name,
			}),
		dacApproved: async (application: ApplicationRecord, transaction?: PostgresTransaction, user_name?: string) =>
			await addActionRecord({
				application,
				action: ApplicationActions.DAC_REVIEW_APPROVED,
				state_after: ApplicationStates.APPROVED,
				transaction,
				user_name,
			}),
		dacRejected: async (application: ApplicationRecord, transaction?: PostgresTransaction, user_name?: string) =>
			await addActionRecord({
				application,
				action: ApplicationActions.DAC_REVIEW_REJECTED,
				state_after: ApplicationStates.REJECTED,
				transaction,
				user_name,
			}),
		dacRevision: async (application: ApplicationRecord, transaction?: PostgresTransaction, user_name?: string) =>
			await addActionRecord({
				application,
				action: ApplicationActions.DAC_REVIEW_REVISION_REQUEST,
				state_after: ApplicationStates.DAC_REVISIONS_REQUESTED,
				transaction,
				user_name,
			}),
		dacSubmit: async (application: ApplicationRecord, transaction?: PostgresTransaction, user_name?: string) =>
			await addActionRecord({
				application,
				action: ApplicationActions.DAC_REVIEW_SUBMIT,
				state_after: ApplicationStates.DAC_REVIEW,
				transaction,
				user_name,
			}),
		repRevision: async (application: ApplicationRecord, transaction?: PostgresTransaction, user_name?: string) =>
			await addActionRecord({
				application,
				action: ApplicationActions.INSTITUTIONAL_REP_REVISION_REQUEST,
				state_after: ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED,
				transaction,
				user_name,
			}),
		repSubmit: async (application: ApplicationRecord, transaction?: PostgresTransaction, user_name?: string) =>
			await addActionRecord({
				application,
				action: ApplicationActions.INSTITUTIONAL_REP_SUBMIT,
				state_after: ApplicationStates.INSTITUTIONAL_REP_REVIEW,
				transaction,
				user_name,
			}),
		repApproved: async (application: ApplicationRecord, transaction?: PostgresTransaction, user_name?: string) =>
			await addActionRecord({
				application,
				action: ApplicationActions.INSTITUTIONAL_REP_APPROVED,
				state_after: ApplicationStates.DAC_REVIEW,
				transaction,
				user_name,
			}),
		revoke: async (application: ApplicationRecord, transaction?: PostgresTransaction, user_name?: string) =>
			await addActionRecord({
				application,
				action: ApplicationActions.REVOKE,
				state_after: ApplicationStates.REVOKED,
				transaction,
				user_name,
			}),
		withdraw: async (application: ApplicationRecord, transaction?: PostgresTransaction, user_name?: string) =>
			await addActionRecord({
				application,
				action: ApplicationActions.WITHDRAW,
				state_after: ApplicationStates.DRAFT,
				transaction,
				user_name,
			}),
		/** @method getActionById: Find a specific Action record */
		getActionById: async ({
			id,
		}: {
			id: number;
		}): AsyncResult<ApplicationActionRecord, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
			try {
				const actionRecord = await db.select().from(applicationActions).where(eq(applicationActions.id, id));
				if (!actionRecord[0]) {
					return failure('NOT_FOUND', 'Action record not found.');
				}

				return success(actionRecord[0]);
			} catch (err) {
				const message = `Error at getActionById with id: ${id}`;
				logger.error(message, err);
				return failure('SYSTEM_ERROR', message);
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
		}): AsyncResult<ApplicationActionRecord[], 'SYSTEM_ERROR' | 'NOT_FOUND'> => {
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
					.orderBy(...applicationActionsSortQuery(sort))
					.offset(page * pageSize)
					.limit(pageSize);

				if (!allActions.length) {
					return failure('NOT_FOUND', `No application history found with the ID: ${application_id}`);
				}

				return success(allActions);
			} catch (err) {
				const message = `Error at listActions with user_id: ${user_id}`;
				logger.error(message, err);
				return failure('SYSTEM_ERROR', message);
			}
		},
	};
};

export { applicationActionSvc };
