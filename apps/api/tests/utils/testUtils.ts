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
import { eq } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { type PostgresDb } from '@/db/index.js';
import { applicationContents } from '@/db/schemas/applicationContents.js';
import { applications } from '@/db/schemas/applications.js';
import logger from '@/logger.js';

export const testUserId = 'testUser@oicr.on.ca';
export const testApplicationId = 1;
export const testActionId = 1;
export const PG_DATABASE = 'testUser';
export const PG_USER = 'testPassword';
export const PG_PASSWORD = 'postgres';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const migrationsFolder = __dirname + '/../../drizzle';

export const initTestMigration = async (db: PostgresDb) => {
	try {
		await migrate(db, { migrationsFolder });
	} catch (err) {
		logger.error('Error Migrating on Database startup');
		logger.error(err);
		throw err;
	}
};

/** Sets Number of Db Records to Seed @ start of test run using addInitialApplications */
export const numTestApplications = 20;
/** Used to bypass pagination impacting test results */
export const allRecordsPageSize = 2 * numTestApplications;

export const addInitialApplications = async (db: PostgresDb) => {
	const newApplication: typeof applications.$inferInsert = {
		user_id: testUserId,
		state: ApplicationStates.DRAFT,
	};

	/** Create 20 Initial Applications w/ Contents */
	for (let i = 0; i < numTestApplications; i++) {
		const newRecord = await db.insert(applications).values(newApplication).returning();
		if (!newRecord[0]) throw new Error('Error creating test application records');

		const { id } = newRecord[0];

		const newAppContents: typeof applicationContents.$inferInsert = {
			application_id: id,
			created_at: new Date(),
			updated_at: new Date(),
		};
		const newAppContentsRecord = await db.insert(applicationContents).values(newAppContents).returning();
		if (!newAppContentsRecord[0]) throw new Error('Error creating test application content records');

		const { id: contentsId } = newAppContentsRecord[0];

		await db.update(applications).set({ contents: contentsId }).where(eq(applications.id, id));
	}
};

/** Create additional 20 Applications to test paginated results */
export const addPaginationDonors = async (db: PostgresDb) => {
	const newApplication: typeof applications.$inferInsert = {
		user_id: testUserId,
		state: ApplicationStates.DRAFT,
	};

	for (let i = 0; i < 20; i++) {
		await db.insert(applications).values(newApplication);
	}
};
