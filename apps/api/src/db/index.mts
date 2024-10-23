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
import { usersTable } from './schemas/users.mts';

const POSTGRES_URL = process.env.POSTGRES_URL;
const PGDATABASE = process.env.PGDATABASE;

const connectionString = `${POSTGRES_URL}${PGDATABASE}`;
console.log('connectionString', connectionString);

const db = drizzle(connectionString!);
console.log('db', db);

const result = await db.execute('select 1');
console.log('result', result);

const pool = db.$client;
console.log('pool', pool);

async function main() {
	const user: typeof usersTable.$inferInsert = {
		name: 'John',
		age: 30,
		email: 'john@example.com',
	};
	await db.insert(usersTable).values(user);
	console.log('New user created!');
	const users = await db.select().from(usersTable);
	console.log('Getting all users from the database: ', users);
	await db
		.update(usersTable)
		.set({
			age: 31,
		})
		.where(eq(usersTable.email, user.email));
	console.log('User info updated!');
	await db.delete(usersTable).where(eq(usersTable.email, user.email));
	console.log('User deleted!');

	process.exit();
}
main();
