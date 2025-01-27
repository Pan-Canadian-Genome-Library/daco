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

import { type PostgresDb } from '@/db/index.js';
import { collaborators } from '@/db/schemas/collaborators.js';
import logger from '@/logger.js';
import { failure, success } from '@/utils/results.js';

const collaboratorsService = (db: PostgresDb) => ({
	createCollaborators: async ({
		first_name,
		middle_name,
		last_name,
		position_title,
		suffix,
		institutional_email,
	}: {
		first_name: string;
		middle_name?: string;
		last_name: string;
		position_title: string;
		suffix?: string;
		institutional_email: string;
	}) => {
		const newCollaborators: typeof collaborators.$inferInsert = {
			first_name,
			middle_name,
			last_name,
			position_title,
			suffix,
			institutional_email,
		};

		try {
			const collaboratorRecords = await db.transaction(async (transaction) => {
				// Create Collaborators
				const newCollaboratorRecords = await transaction.insert(collaborators).values(newCollaborators).returning();
				if (!newCollaboratorRecords[0]) throw new Error('Collaborator records are undefined');

				// Create associated ApplicationContents
				// const { id: application_id } = newApplicationRecord[0];

				// const newAppContents: typeof applicationContents.$inferInsert = {
				// 	application_id,
				// 	created_at: new Date(),
				// 	updated_at: new Date(),
				// };
				// const newAppContentsRecord = await transaction.insert(applicationContents).values(newAppContents).returning();
				// if (!newAppContentsRecord[0]) throw new Error('Application contents record is undefined');

				return newCollaboratorRecords;
			});
			return success(collaboratorRecords);
		} catch (err) {
			const message = `Error at createCollaborators`;

			logger.error(message);
			logger.error(err);

			return failure(message, err);
		}
	},
});

export { collaboratorsService };
