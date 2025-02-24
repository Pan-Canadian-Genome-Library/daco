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
import { type AsyncResult, failure, success } from '@/utils/results.js';
import { and, eq } from 'drizzle-orm';
import { type CollaboratorModel, type CollaboratorRecord } from './types.js';

const collaboratorsSvc = (db: PostgresDb) => ({
	createCollaborators: async ({
		newCollaborators,
	}: {
		newCollaborators: CollaboratorModel[];
	}): AsyncResult<CollaboratorRecord[]> => {
		try {
			// Check for Duplicates
			let hasDuplicateCollaborators = false;

			for await (const collaborator of newCollaborators) {
				const existingCollaborator = await db
					.select()
					.from(collaborators)
					.where(
						and(
							eq(collaborators.first_name, collaborator.first_name),
							eq(collaborators.last_name, collaborator.last_name),
							eq(collaborators.institutional_email, collaborator.institutional_email),
							eq(collaborators.position_title, collaborator.position_title),
							eq(collaborators.application_id, collaborator.application_id),
						),
					);

				if (existingCollaborator.length > 0) hasDuplicateCollaborators = true;
			}

			if (hasDuplicateCollaborators) {
				return failure(`Cannot create duplicate collaborator records`, 'DuplicateRecords');
			}

			// Create Collaborators
			const collaboratorRecords = await db.transaction(async (transaction) => {
				const newRecords: CollaboratorRecord[] = [];

				newCollaborators.forEach(async (collaborator) => {
					// TODO: Inserting multiple records as an array is not working despite Drizzle team saying the issue is resolved: https://github.com/drizzle-team/drizzle-orm/issues/2849
					const newCollaboratorRecord = await transaction.insert(collaborators).values(collaborator).returning();

					if (!newCollaboratorRecord[0]) {
						throw new Error(`Error creating new collaborators: ${collaborator}, no record created`);
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
	deleteCollaborator: async ({ id }: { id: number }): AsyncResult<CollaboratorRecord> => {
		try {
			const deletedRecord = await db.delete(collaborators).where(eq(collaborators.id, id)).returning();

			if (!deletedRecord[0]) {
				throw new Error(`Error deleting collaborator with ${id}, no record deleted`);
			}

			return success(deletedRecord[0]);
		} catch (err) {
			const message = `Error at deleteCollaborators`;

			logger.error(message);
			logger.error(err);

			return failure(message, err);
		}
	},
});

export { collaboratorsSvc };
