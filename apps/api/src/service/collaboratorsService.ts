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
import { type CollaboratorModel, type CollaboratorRecord } from './types.js';

const collaboratorsSvc = (db: PostgresDb) => ({
	createCollaborators: async ({ newCollaborators }: { newCollaborators: CollaboratorModel[] }) => {
		try {
			// Create Collaborators
			const collaboratorRecords = await db.transaction(async (transaction) => {
				const newRecords: CollaboratorRecord[] = [];

				// TODO: Inserting multiple records as an array is not working despite Drizzle team saying the issue is resolved: https://github.com/drizzle-team/drizzle-orm/issues/2849
				newCollaborators.forEach(async (collaborator) => {
					const newCollaboratorRecord = await transaction.insert(collaborators).values(collaborator).returning();

					if (!newCollaboratorRecord[0]) {
						throw new Error(`Error creating new collaborators: ${collaborator}`);
					}

					newRecords.push(newCollaboratorRecord[0]);
				});
				return newRecords;
			});

			if (!(collaboratorRecords.length === newCollaborators.length)) {
				throw new Error(`Error creating new collaborators: ${collaboratorRecords}`);
			}
			return success(collaboratorRecords);
		} catch (err) {
			const message = `Error at createCollaborators`;

			logger.error(message);
			logger.error(err);

			return failure(message, err);
		}
	},
});

export { collaboratorsSvc };
