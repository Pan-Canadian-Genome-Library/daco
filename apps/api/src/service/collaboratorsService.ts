/*
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
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
import BaseLogger from '@/logger.js';
import { type AsyncResult, failure, success } from '@/utils/results.js';
import { type MockDb } from '@tests/utils/mocks.ts';
import { and, eq } from 'drizzle-orm';
import { type CollaboratorModel, type CollaboratorRecord } from './types.js';

const logger = BaseLogger.forModule('collaboratorsService');

const collaboratorsSvc = (db: PostgresDb | MockDb) => ({
	createCollaborators: async ({
		newCollaborators,
	}: {
		newCollaborators: CollaboratorModel[];
	}): AsyncResult<CollaboratorRecord[], 'SYSTEM_ERROR' | 'DUPLICATE_RECORD'> => {
		try {
			// Check for Duplicates
			let hasDuplicateCollaborators = false;

			// TODO: Duplicate check needs to be on institutional_email + application_id as the primary identifier, not the entire record.
			//       This may be enforceable from the DB (composite PK).
			for await (const collaborator of newCollaborators) {
				const countExistingCollaborator = await db.$count(
					collaborators,
					and(
						eq(collaborators.first_name, collaborator.first_name),
						eq(collaborators.last_name, collaborator.last_name),
						eq(collaborators.institutional_email, collaborator.institutional_email),
						eq(collaborators.position_title, collaborator.position_title),
						eq(collaborators.application_id, collaborator.application_id),
					),
				);

				if (countExistingCollaborator > 0) {
					hasDuplicateCollaborators = true;
				}
			}

			if (hasDuplicateCollaborators) {
				// TODO: Duplicate record error message should inform which donors are duplicate.
				return failure('DUPLICATE_RECORD', `Cannot create duplicate collaborator records.`);
			}

			// Create Collaborators
			const collaboratorRecords = await db.transaction(async (transaction) => {
				const newRecords: CollaboratorRecord[] = [];

				for await (const collaborator of newCollaborators) {
					// TODO: Inserting multiple records as an array is not working despite Drizzle team saying the issue is resolved: https://github.com/drizzle-team/drizzle-orm/issues/2849
					const newCollaboratorRecord = await transaction.insert(collaborators).values(collaborator).returning();

					if (!newCollaboratorRecord[0]) {
						throw new Error(`Error creating new collaborators: ${collaborator}`);
					}

					newRecords.push(newCollaboratorRecord[0]);
				}

				return newRecords;
			});

			if (!(collaboratorRecords.length === newCollaborators.length)) {
				throw new Error(`Error creating new collaborators: ${collaboratorRecords}`);
			}

			return success(collaboratorRecords);
		} catch (error) {
			const message = `Error creating new collaborator records.`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	deleteCollaborator: async ({ id }: { id: number }): AsyncResult<CollaboratorRecord[], 'SYSTEM_ERROR'> => {
		try {
			const deletedRecord = await db.delete(collaborators).where(eq(collaborators.id, id)).returning();

			if (!deletedRecord[0]) {
				throw new Error(`Error deleting collaborator with ${id}, no record deleted`);
			}

			return success(deletedRecord);
		} catch (error) {
			const message = `Error deleting collaborator with id: ${id}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	updateCollaborator: async ({
		id,
		collaborator,
	}: {
		id: number;
		collaborator: Partial<CollaboratorModel>;
	}): AsyncResult<CollaboratorRecord[], 'SYSTEM_ERROR'> => {
		try {
			const updatedRecord = await db
				.update(collaborators)
				.set(collaborator)
				.where(eq(collaborators.id, id))
				.returning();

			if (!updatedRecord[0]) {
				throw new Error(`Error updating collaborator with ${id}, no record updated`);
			}

			return success(updatedRecord);
		} catch (error) {
			const message = `Error updating collaborator with id: ${id}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	listCollaborators: async (application_id: number): AsyncResult<CollaboratorRecord[], 'SYSTEM_ERROR'> => {
		try {
			const collaboratorRecords = await db
				.select()
				.from(collaborators)
				.where(eq(collaborators.application_id, application_id));

			return success(collaboratorRecords);
		} catch (error) {
			const message = `Error listing collaborators.`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
});

export { collaboratorsSvc };
