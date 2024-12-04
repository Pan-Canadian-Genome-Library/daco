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

import { ApplicationStates } from '@pcgl-daco/data-model/src/types.js';
import { and, eq, sql } from 'drizzle-orm';
import { type PostgresDb } from '../db/index.js';
import { applicationContents } from '../db/schemas/applicationContents.js';
import { applications } from '../db/schemas/applications.js';
import { failure, success } from '../utils/results.js';
import {
	type ApplicationContentUpdates,
	type ApplicationsColumnName,
	type ApplicationUpdates,
	type OrderBy,
} from './types.js';
import { sortQuery } from './utils.js';

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
				const { id } = newApplicationRecord[0];

				const newAppContents: typeof applicationContents.$inferInsert = {
					application_id: id,
					created_at: new Date(),
					updated_at: new Date(),
				};
				const newAppContentsRecord = await transaction.insert(applicationContents).values(newAppContents).returning();
				if (!newAppContentsRecord[0]) throw new Error('Application contents record is undefined');

				// Join records
				const { id: contentsId } = newAppContentsRecord[0];

				const application = await transaction
					.update(applications)
					.set({ contents: contentsId })
					.where(eq(applications.id, id))
					.returning();

				return application[0];
			});
			return application;
		} catch (err) {
			console.error(`Error at createApplication with user_id: ${user_id}`);
			console.error(err);
			return null;
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
			console.error(message);
			console.error(err);
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

			return application;
		} catch (err) {
			console.error(`Error at findOneAndUpdate with id: ${id}`);
			console.error(err);
			return null;
		}
	},
	getApplicationById: async ({ id }: { id: number }) => {
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
			console.error(message);
			console.error(err);

			return failure(message, err);
		}
	},
	listApplications: async ({
		user_id,
		state,
		sort = [],
		page = 0,
		pageSize = 20,
	}: {
		user_id?: string;
		state?: ApplicationStates;
		sort?: Array<OrderBy<ApplicationsColumnName>>;
		page?: number;
		pageSize?: number;
	}) => {
		try {
			const allApplications = await db
				.select({
					id: applications.id,
					user_id: applications.user_id,
					state: applications.state,
					createdAt: applications.created_at,
					updatedAt: applications.updated_at,
				})
				.from(applications)
				.where(
					and(
						user_id ? eq(applications.user_id, String(user_id)) : undefined,
						state ? eq(applications.state, state) : undefined,
					),
				)
				.orderBy(...sortQuery(sort))
				.offset(page * pageSize)
				.limit(pageSize);

			return allApplications;
		} catch (err) {
			console.error(`Error at listApplications with user_id: ${user_id} state: ${state}`);
			console.error(err);
			return null;
		}
	},
});

export default applicationService;
