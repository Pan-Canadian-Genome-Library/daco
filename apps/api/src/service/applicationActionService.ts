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
import { applicationActionsQuery } from '@/service/utils.js';
import { failure, Failure, success, Success } from '@/utils/results.js';
import {
	ApplicationActions,
	ApplicationActionValues,
	ApplicationStates,
	ApplicationStateValues,
} from '@pcgl-daco/data-model/src/types.js';
import {
	type ApplicationActionData,
	type ApplicationActionsColumnName,
	type ApplicationData,
	type OrderBy,
} from './types.js';

const applicationActionService = (db: PostgresDb) => {
	// New actions are created on every transition from one state to the next
	const addActionRecord = async (
		application: ApplicationData,
		action: ApplicationActionValues,
		state_after: ApplicationStateValues,
	): Promise<Success<ApplicationActionData> | Failure> => {
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
			console.error(message);
			console.error(err);
			return failure(message, err);
		}
	};

	return {
		create: async (application: ApplicationData) =>
			await addActionRecord(application, ApplicationActions.CREATE, ApplicationStates.DRAFT),
		withdraw: async (application: ApplicationData) =>
			await addActionRecord(application, ApplicationActions.WITHDRAW, ApplicationStates.DRAFT),
		close: async (application: ApplicationData) =>
			await addActionRecord(application, ApplicationActions.CLOSE, ApplicationStates.CLOSED),
		draftSubmit: async (application: ApplicationData) =>
			await addActionRecord(application, ApplicationActions.SUBMIT_DRAFT, ApplicationStates.INSTITUTIONAL_REP_REVIEW),
		repRevision: async (application: ApplicationData) =>
			await addActionRecord(
				application,
				ApplicationActions.INSTITUTIONAL_REP_REVISION_REQUEST,
				ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED,
			),
		repSubmit: async (application: ApplicationData) =>
			await addActionRecord(
				application,
				ApplicationActions.INSTITUTIONAL_REP_SUBMIT,
				ApplicationStates.INSTITUTIONAL_REP_REVIEW,
			),
		repApproved: async (application: ApplicationData) =>
			await addActionRecord(application, ApplicationActions.INSTITUTIONAL_REP_APPROVED, ApplicationStates.DAC_REVIEW),
		dacApproved: async (application: ApplicationData) =>
			await addActionRecord(application, ApplicationActions.DAC_REVIEW_APPROVED, ApplicationStates.APPROVED),
		dacRejected: async (application: ApplicationData) =>
			await addActionRecord(application, ApplicationActions.DAC_REVIEW_REJECTED, ApplicationStates.REJECTED),
		dacRevision: async (application: ApplicationData) =>
			await addActionRecord(
				application,
				ApplicationActions.DAC_REVIEW_REVISION_REQUEST,
				ApplicationStates.DAC_REVISIONS_REQUESTED,
			),
		dacSubmit: async (application: ApplicationData) =>
			await addActionRecord(application, ApplicationActions.DAC_REVIEW_SUBMIT, ApplicationStates.DAC_REVIEW),
		revoke: async (application: ApplicationData) =>
			await addActionRecord(application, ApplicationActions.REVOKE, ApplicationStates.REVOKED),
		getActionById: async ({ id }: { id: number }): Promise<Success<ApplicationActionData> | Failure> => {
			try {
				const actionRecord = await db.select().from(applicationActions).where(eq(applicationActions.id, id));
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
			sort?: Array<OrderBy<ApplicationActionsColumnName>>;
			page?: number;
			pageSize?: number;
		}): Promise<Success<ApplicationActionData[]> | Failure> => {
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
				console.error(message);
				console.error(err);
				return failure(message, err);
			}
		},
	};
};

export { applicationActionService };
