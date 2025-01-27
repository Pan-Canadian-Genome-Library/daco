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

import { and, eq, inArray, sql } from 'drizzle-orm';

import { type PostgresDb } from '@/db/index.js';
import { applicationContents } from '@/db/schemas/applicationContents.js';
import { applications } from '@/db/schemas/applications.js';
import logger from '@/logger.js';
import { applicationsQuery } from '@/service/utils.js';
import { failure, success } from '@/utils/results.js';
import { ApplicationStates, ApplicationStateValues } from '@pcgl-daco/data-model/src/types.js';
import { applicationActionService } from './applicationActionService.js';
import {
	type ApplicationContentUpdates,
	type ApplicationsColumnName,
	type ApplicationUpdates,
	type OrderBy,
} from './types.js';

const applicationService = (db: PostgresDb) => ({
	createApplication: async ({ user_id }: { user_id: string }) => {
		const newApplication: typeof applications.$inferInsert = {
			user_id,
			state: ApplicationStates.DRAFT,
		};

		try {
			const application = await db.transaction(async (transaction) => {
				// Create Application
				const newApplicationRecord = await transaction.insert(applications).values(newApplication).returning();
				if (!newApplicationRecord[0]) throw new Error('Application record is undefined');

				// Create associated ApplicationContents
				const { id: application_id } = newApplicationRecord[0];

				const newAppContents: typeof applicationContents.$inferInsert = {
					application_id,
					created_at: new Date(),
					updated_at: new Date(),
				};
				const newAppContentsRecord = await transaction.insert(applicationContents).values(newAppContents).returning();
				if (!newAppContentsRecord[0]) throw new Error('Application contents record is undefined');

				// Create associated Actions
				const actionRepo = applicationActionService(db);
				const actionResult = await actionRepo.create(newApplicationRecord[0]);
				if (!actionResult.success) throw new Error(actionResult.errors);

				// Join records
				const { id: contents_id } = newAppContentsRecord[0];

				const application = await transaction
					.update(applications)
					.set({ contents: contents_id })
					.where(eq(applications.id, application_id))
					.returning();

				return application[0];
			});
			return success(application);
		} catch (err) {
			const message = `Error at createApplication with user_id: ${user_id}`;

			logger.error(message);
			logger.error(err);

			return failure(message, err);
		}
	},

	editApplication: async ({ id, update }: { id: number; update: ApplicationContentUpdates }) => {
		try {
			const application = await db.transaction(async (transaction) => {
				// Update Application Contents
				const contents = { ...update, updated_at: sql`NOW()` };
				const editedContents = await transaction
					.update(applicationContents)
					.set(contents)
					.where(eq(applicationContents.application_id, id))
					.returning();

				// Update Related Application
				const applicationUpdates = {
					updated_at: sql`NOW()`,
					state: ApplicationStates.DRAFT,
				};
				const editedApplication = await transaction
					.update(applications)
					.set(applicationUpdates)
					.where(eq(applications.id, id))
					.returning();

				// Returns merged record
				return {
					...editedApplication[0],
					contents: editedContents[0],
				};
			});

			return success(application);
		} catch (err) {
			const message = `Error at editApplication with id: ${id}`;
			logger.error(message);
			logger.error(err);
			return failure(message, err);
		}
	},

	findOneAndUpdate: async ({ id, update }: { id: number; update: ApplicationUpdates }) => {
		try {
			const application = await db
				.update(applications)
				.set({ ...update, updated_at: sql`NOW()` })
				.where(eq(applications.id, id))
				.returning();

			return success(application);
		} catch (err) {
			const message = `Error at findOneAndUpdate with id: ${id}`;
			logger.error(message);
			logger.error(err);
			return failure(message, err);
		}
	},

	getApplicationById: async ({ id }: { id: number }) => {
		try {
			const applicationRecord = await db.select().from(applications).where(eq(applications.id, id));
			if (!applicationRecord[0]) throw new Error('Application record is undefined');

			return success(applicationRecord[0]);
		} catch (err) {
			const message = `Error at getApplicationById with id: ${id}`;
			logger.error(message);
			logger.error(err);
			return failure(message, err);
		}
	},

	getApplicationWithContents: async ({ id }: { id: number }) => {
		try {
			const applicationRecord = await db
				.select()
				.from(applications)
				.where(eq(applications.id, id))
				.leftJoin(applicationContents, eq(applications.contents, applicationContents.id));

			if (!applicationRecord[0]) throw new Error('Application record not found');

			const application = {
				...applicationRecord[0].applications,
				contents: applicationRecord[0].application_contents,
			};

			return success(application);
		} catch (err) {
			const message = `Error at getApplicationById with id: ${id}`;
			logger.error(message);
			logger.error(err);

			return failure(message, err);
		}
	},

	listApplications: async ({
		user_id,
		state = [],
		sort = [],
		page = 0,
		pageSize = 20,
	}: {
		user_id?: string;
		state?: ApplicationStateValues[];
		sort?: Array<OrderBy<ApplicationsColumnName>>;
		page?: number;
		pageSize?: number;
	}) => {
		try {
			/**
			 * Ensure that the page size or page somehow passed into here is not negative or not a number.
			 * This should be handled at at the router layer, but just in-case.
			 */
			if (Number.isNaN(page) || Number.isNaN(pageSize)) {
				throw Error('Page and/or page size must be a positive integer.');
			} else if (page < 0 || pageSize < 0) {
				throw Error('Page and/or page size must be non-negative values.');
			}

			const rawApplicationData = await db
				.select({
					id: applications.id,
					user_id: applications.user_id,
					state: applications.state,
					createdAt: applications.created_at,
					updatedAt: applications.updated_at,
					applicantInformation: {
						createdAt: applicationContents.created_at,
						firstName: applicationContents.applicant_first_name,
						lastName: applicationContents.applicant_last_name,
						email: applicationContents.applicant_institutional_email,
						country: applicationContents.institution_country,
						institution: applicationContents.applicant_primary_affiliation,
					},
				})
				.from(applications)
				.where(
					and(
						user_id ? eq(applications.user_id, String(user_id)) : undefined,
						state.length ? inArray(applications.state, state) : undefined,
					),
				)
				.leftJoin(applicationContents, eq(applications.contents, applicationContents.id))
				.orderBy(...applicationsQuery(sort))
				.offset(page * pageSize)
				.limit(pageSize);

			const applicationRecordsCount = await db.$count(
				applications,
				and(
					user_id ? eq(applications.user_id, String(user_id)) : undefined,
					state.length ? inArray(applications.state, state) : undefined,
				),
			);

			let returnableApplications = rawApplicationData;

			/**
			 * Sort DAC_REVIEW records to the top to display on the front end, however...
			 *
			 * We only want to sort DAC_REVIEW records to the top if:
			 * 	- The user hasn't sorted by any filter
			 * 	- If the sorting filters include DAC_REVIEW
			 * 		- Keeping in mind that if it includes JUST DAC_REVIEW, then we skip
			 * 		 since the sorting will already be handled by drizzle in this case.
			 */
			if (!state?.length || (state.length !== 1 && state?.includes(ApplicationStates.DAC_REVIEW))) {
				const reviewApplications = returnableApplications.filter(
					(applications) => applications.state === ApplicationStates.DAC_REVIEW,
				);

				returnableApplications = [
					...reviewApplications,
					...returnableApplications.filter((applications) => applications.state !== ApplicationStates.DAC_REVIEW),
				];
			}

			const applicationsList = {
				applications: returnableApplications,
				pagingMetadata: {
					totalRecords: applicationRecordsCount,
					page: page,
					pageSize: pageSize,
				},
			};

			return success(applicationsList);
		} catch (err) {
			const message = `Error at listApplications with user_id: ${user_id} state: ${state}`;
			logger.error(message);
			logger.error(err);
			return failure(message, err);
		}
	},

	applicationStateTotals: async ({ user_id }: { user_id?: string }) => {
		try {
			const rawApplicationData = await db
				.select({
					APPROVED: db.$count(applications, eq(applications.state, 'APPROVED')),
					CLOSED: db.$count(applications, eq(applications.state, 'CLOSED')),
					DAC_REVIEW: db.$count(applications, eq(applications.state, 'DAC_REVIEW')),
					DAC_REVISIONS_REQUESTED: db.$count(applications, eq(applications.state, 'DAC_REVISIONS_REQUESTED')),
					DRAFT: db.$count(applications, eq(applications.state, 'DRAFT')),
					INSTITUTIONAL_REP_REVIEW: db.$count(applications, eq(applications.state, 'INSTITUTIONAL_REP_REVIEW')),
					REJECTED: db.$count(applications, eq(applications.state, 'REJECTED')),
					INSTITUTIONAL_REP_REVISION_REQUESTED: db.$count(
						applications,
						eq(applications.state, 'INSTITUTIONAL_REP_REVISION_REQUESTED'),
					),
					REVOKED: db.$count(applications, eq(applications.state, 'REVOKED')),
					TOTAL: db.$count(applications),
				})
				.from(applications)
				.limit(1);

			if (rawApplicationData && rawApplicationData.length) {
				return success(rawApplicationData[0]);
			} else {
				return success({
					APPROVED: 0,
					CLOSED: 0,
					DAC_REVIEW: 0,
					DAC_REVISIONS_REQUESTED: 0,
					DRAFT: 0,
					INSTITUTIONAL_REP_REVIEW: 0,
					REJECTED: 0,
					INSTITUTIONAL_REP_REVISION_REQUESTED: 0,
					REVOKED: 0,
					TOTAL: 0,
				});
			}
		} catch (exception) {
			const message = `Error at applicationStateTotals with user_id: ${user_id}.`;
			logger.error(message);
			logger.error(exception);
			return failure(message, exception);
		}
	},
});

export { applicationService };
