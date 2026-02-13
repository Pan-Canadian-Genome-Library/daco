/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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

import { sql } from 'drizzle-orm';

import { type PostgresDb } from '@/db/index.js';
import { dac } from '@/db/schemas/dac.ts';
import BaseLogger from '@/logger.ts';
import { failure, success, type AsyncResult } from '@/utils/results.js';

import { type DacModel, type DacRecord, type PostgresTransaction } from './types.ts';

const logger = BaseLogger.forModule('studyService');

/**
 * DAC service provides methods for dac DB access
 * @param db - Drizzle Postgres DB Instance
 */
const dacSvc = (db: PostgresDb) => ({
	createDacRecords: async ({
		dacGroups,
		transaction,
	}: {
		dacGroups: DacModel[];
		transaction?: PostgresTransaction;
	}): AsyncResult<DacRecord[], 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
		try {
			const dbTransaction = transaction ? transaction : db;
			const studyRecords = await dbTransaction
				.insert(dac)
				.values(dacGroups)
				.onConflictDoUpdate({
					target: dac.dac_id,
					set: {
						dac_name: sql`EXCLUDED.dac_name`,
						dac_description: sql`EXCLUDED.dac_description`,
						contact_name: sql`EXCLUDED.contact_name`,
						contact_email: sql`EXCLUDED.contact_email`,
						updated_at: sql`EXCLUDED.updated_at`,
					},
				})
				.returning();

			if (!studyRecords[0]) {
				return failure('NOT_FOUND', `Unable to update study records.`);
			}

			return success(studyRecords);
		} catch (error) {
			const message = 'Error at updateStudies';

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
});

export { dacSvc };
