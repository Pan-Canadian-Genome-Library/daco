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

import { dbConfig } from '@/config/dbConfig.ts';
import { getEmailConfig } from '@/config/emailConfig.ts';
import { applications } from '@/db/schemas/applications.ts';
import { dac } from '@/db/schemas/dac.ts';
import { and, eq, isNull, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(dbConfig.connectionString);
const { email } = getEmailConfig;

/**
 * Script to backfill existing applications field dac_id with default DAC user
 */
const dacIdMigration = async () => {
	try {
		await db.transaction(async (transaction) => {
			// Get default dac user if exists
			const defaultDacUser = await transaction.select().from(dac).where(eq(dac.dac_id, dbConfig.PCGL_DACO_ID));

			// If it doesnt exist, insert default DAC user into dac table
			if (defaultDacUser.length === 0) {
				console.log('Adding default DAC user into dac table...');
				await transaction.insert(dac).values({
					dac_id: dbConfig.PCGL_DACO_ID,
					dac_name: 'PCGL',
					contact_name: 'PCGL',
					contact_email: email.dacAddress,
					dac_description: 'Default for PCGL',
				});
			} else {
				console.log('Skipping default DAC user migration, user already exists');
			}

			// Apply backfill with PCGL_DACO_ID
			await transaction
				.update(applications)
				.set({
					dac_id: `${dbConfig.PCGL_DACO_ID}`,
				})
				.where(
					and(
						isNull(applications.dac_id),
						or(
							eq(applications.state, 'APPROVED'),
							eq(applications.state, 'REVOKED'),
							eq(applications.state, 'REJECTED'),
							eq(applications.state, 'DAC_REVIEW'),
							eq(applications.state, 'DAC_REVISIONS_REQUESTED'),
							eq(applications.state, 'INSTITUTIONAL_REP_REVIEW'),
							eq(applications.state, 'INSTITUTIONAL_REP_REVISION_REQUESTED'),
						),
					),
				);
		});

		console.log('Successfully migrated dac_id with default DAC user');
		process.exit(0);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

export default dacIdMigration;
