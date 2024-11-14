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

import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { ApplicationStates } from 'pcgl-daco/packages/data-model/src/types.ts';
import { type PostgresDb } from '../db/index.ts';
import { applicationContents } from '../db/schemas/applicationContents.ts';
import { applications } from '../db/schemas/applications.ts';

const applicationService = (db: PostgresDb) => ({
	createApplication: async ({ user_id }: { user_id: string }) => {
		const newApplication: typeof applications.$inferInsert = {
			user_id,
			state: ApplicationStates.DRAFT,
		};

		try {
			const newApplicationRecord = await db.insert(applications).values(newApplication).returning();
			const { id } = newApplicationRecord[0];

			const newAppContents: typeof applicationContents.$inferInsert = {
				application_id: id,
				created_at: new Date(),
				updated_at: new Date(),
			};
			const newAppContentsRecord = await db.insert(applicationContents).values(newAppContents).returning();
			const { id: contentsId } = newAppContentsRecord[0];

			const application = await db
				.update(applications)
				.set({ contents: contentsId })
				.where(eq(applications.id, id))
				.returning();

			console.log(`Application created with user_id: ${user_id}`);

			return application[0];
		} catch (err) {
			console.error(`Error at createApplication with user_id: ${user_id}`);
			console.error(err);
			return null;
		}
	},
	findOneAndUpdate: async ({ id, update }: { id: number; update: any }) => {
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

			const application = {
				...applicationRecord[0].applications,
				contents: applicationRecord[0].application_contents,
			};

			return application;
		} catch (err) {
			console.error(`Error at getApplicationById with id: ${id}`);
			console.error(err);
			return null;
		}
	},
	listApplications: async ({
		user_id,
		state,
		sort = '',
	}: {
		user_id?: string;
		state?: ApplicationStates;
		sort?: string;
	}) => {
		const isDescending = sort?.charAt(0) === '-';
		const sortValue = isDescending ? sort.substring(1) : sort;
		const sortFunction = isDescending ? desc : asc;

		let sortKey;

		switch (sortValue) {
			case 'updated_at':
				sortKey = applications.updated_at;
				break;
			case 'state':
				sortKey = applications.state;
				break;
			case 'created_at':
			default:
				sortKey = applications.created_at;
				break;
		}

		const sortQuery = sortFunction(sortKey);

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
				.orderBy(sortQuery);

			return allApplications;
		} catch (err) {
			console.error(`Error at listApplications with user_id: ${user_id} state: ${state}`);
			console.error(err);
			return null;
		}
	},
	deleteApplication: async ({ user_id }: { user_id: string }) => {
		try {
			const deletedRecords = await db.delete(applications).where(eq(applications.user_id, user_id)).returning();
			console.log(`Application deleted with user_id: ${user_id}`);

			return deletedRecords;
		} catch (err) {
			console.error(`Error at createApplication with user_id: ${user_id}`);
			console.error(err);
			return null;
		}
	},
});

export default applicationService;