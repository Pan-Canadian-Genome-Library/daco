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

import { setStatus, Status } from '@/app-health.js';
import * as schema from '@/db/schemas/index.js';
import BaseLogger from '@/logger.js';
import { MockDb } from '@tests/utils/mocks.ts';
import { drizzle } from 'drizzle-orm/node-postgres';

const logger = BaseLogger.forModule('index');

export type PostgresDb = ReturnType<typeof drizzle<typeof schema>>;

let pgDatabase: PostgresDb;

const getDbInstance = (): PostgresDb | MockDb => {
	if (!pgDatabase) throw new Error('Not connected to Postgres database');
	return pgDatabase;
};

const connectToDb = (connectionString: string): PostgresDb => {
	try {
		const db = drizzle<typeof schema>(connectionString);
		pgDatabase = db;

		setStatus('db', { status: Status.OK });
		return db;
	} catch (err) {
		logger.error('Error on Database startup: \n', err);

		if (err instanceof Error) {
			setStatus('db', { status: Status.ERROR, info: { err: err.message } });
		} else {
			setStatus('db', { status: Status.ERROR, info: { err: String(err) } });
		}
		throw err;
	}
};

// Default Export used for Sinon Test Mocking
const dbUtils = { connectToDb, getDbInstance };

export default dbUtils;
