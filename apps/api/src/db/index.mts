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

import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { actionsTable } from './schemas/actions.mts';
import { applicationsTable } from './schemas/applications.mts';
import { collaboratorsTable } from './schemas/collaborators.mts';
import { filesTable } from './schemas/files.mts';
import { revisionRequestsTable } from './schemas/revisionRequests.mts';

const POSTGRES_URL = process.env.POSTGRES_URL;
const PGDATABASE = process.env.PGDATABASE;

const connectionString = `${POSTGRES_URL}${PGDATABASE}`;

const db = drizzle(connectionString!);

async function testApplications() {
	const application: typeof applicationsTable.$inferInsert = {
		name: 'John',
		age: 30,
		email: 'john@example.com',
	};
	await db.insert(applicationsTable).values(application);
	console.log('New application created');
	const users = await db.select().from(applicationsTable);
	console.log('Getting all applications from the database: ', users);
	await db
		.update(applicationsTable)
		.set({
			age: 31,
		})
		.where(eq(applicationsTable.email, application.email));
	console.log('Application info updated');
	await db.delete(applicationsTable).where(eq(applicationsTable.email, application.email));
	console.log('Application deleted');
}

async function testActions() {
	console.log('actions', actionsTable);
}

async function testCollaborators() {
	console.log('collaborators', collaboratorsTable);
}

async function testFiles() {
	console.log('files', filesTable);
}

async function testRevisions() {
	console.log('revisions', revisionRequestsTable);
}

async function testDb() {
	try {
		await testActions();
		await testApplications();
		await testCollaborators();
		await testFiles();
		await testRevisions();
	} catch (err) {
		console.error('Error at TestDb');
		console.error(err);
	}
	process.exit();
}

await testDb();
