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
import { isNull } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(dbConfig.connectionString);

const { email } = getEmailConfig;

try {
	await db.transaction(async (transaction) => {
		// Add Default DAC user
		await transaction.insert(dac).values({
			dac_id: dbConfig.PCGL_DACO_ID,
			dac_name: 'PCGL',
			contact_name: 'PCGL',
			contact_email: email.dacAddress,
			dac_description: 'Default for PCGL',
		});

		// Apply backfill with PCGL_DACO_ID
		await transaction
			.update(applications)
			.set({
				dac_id: `${dbConfig.PCGL_DACO_ID}`,
			})
			.where(isNull(applications.dac_id));

		// Alter dac_id column to be not nullable
		await transaction.execute('ALTER TABLE applications ALTER COLUMN dac_id SET NOT NULL;');
	});

	console.log('Successfully migrated dac_id with default DAC user');
	process.exit(0);
} catch (err) {
	console.log(err);

	process.exit(1);
}
