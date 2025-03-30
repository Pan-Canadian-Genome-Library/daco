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
import formidable from 'formidable';
import fs from 'fs';

import { type PostgresDb } from '@/db/index.js';
import { files } from '@/db/schemas/files.js';
import BaseLogger from '@/logger.ts';
import { failure, success, type AsyncResult } from '@/utils/results.js';
import { type FileType } from '@pcgl-daco/data-model';
import { type FilesModel, type FilesRecord, type JoinedApplicationRecord, type PostgresTransaction } from './types.ts';

const logger = BaseLogger.forModule('fileService');

/**
 * Upload service provides methods for file DB access
 * @param db - Drizzle Postgres DB Instance
 */
const filesSvc = (db: PostgresDb) => ({
	createFile: async ({
		file,
		application,
		type,
		transaction,
	}: {
		file: formidable.File;
		application: JoinedApplicationRecord;
		type: FileType;
		transaction?: PostgresTransaction;
	}): AsyncResult<FilesRecord, 'SYSTEM_ERROR'> => {
		// TODO: Files should only be added to an applciation if the associated application is in an editable (draft) state
		// TODO: File Service should enforce rules about only one EthicsLetter per application.
		try {
			const dbTransaction = transaction ? transaction : db;
			const buffer = fs.readFileSync(file.filepath);

			const result = await dbTransaction.transaction(async (transaction) => {
				const newFiles: typeof files.$inferInsert = {
					application_id: application.id,
					filename: file.originalFilename,
					type,
					submitted_at: new Date(),
					submitter_user_id: application.user_id,
					content: buffer,
				};

				const newFileRecord = await transaction.insert(files).values(newFiles).returning();

				if (!newFileRecord[0]) throw new Error('File record is undefined');

				return newFileRecord[0];
			});

			return success(result);
		} catch (error) {
			const message = `Error creating file record.`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},

	updateFile: async ({
		fileId,
		file,
		application,
		type,
		transaction,
	}: {
		fileId: number;
		file: formidable.File;
		application: JoinedApplicationRecord;
		type: FileType;
		transaction?: PostgresTransaction;
	}): AsyncResult<FilesRecord, 'SYSTEM_ERROR' | 'NOT_FOUND'> => {
		// TODO: Files should only be updated if the associated application is in an editable (draft) state
		try {
			const dbTransaction = transaction ? transaction : db;
			const buffer = await fs.readFileSync(file.filepath);

			const result = await dbTransaction.transaction(async (transaction) => {
				const newFiles: typeof files.$inferInsert = {
					application_id: application.id,
					filename: file.originalFilename,
					type,
					submitted_at: new Date(),
					submitter_user_id: application.user_id,
					content: buffer,
				};

				const updatedFiles = await transaction.update(files).set(newFiles).where(eq(files.id, fileId)).returning();
				const updatedFileRecord = updatedFiles[0];

				if (!updatedFileRecord) {
					return failure('NOT_FOUND', 'File record is undefined.');
				}

				return success(updatedFileRecord);
			});

			return result;
		} catch (error) {
			const message = `Error uploading file`;
			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	deleteFileById: async ({
		fileId,
		transaction,
	}: {
		fileId: number;
		transaction?: PostgresTransaction;
	}): AsyncResult<FilesModel & { id: number }, 'SYSTEM_ERROR'> => {
		// TODO: Files should only be deleted if the associated application is in an editable (draft) state
		// TODO: Currently this does not differentiate a file not found vs unexpected system error
		try {
			const dbTransaction = transaction ? transaction : db;

			const deletedResult = await dbTransaction.transaction(async (transaction) => {
				const deletedRecord = await transaction.delete(files).where(eq(files.id, fileId)).returning();

				if (!deletedRecord[0]) {
					throw new Error('Error: deleting file record has failed');
				}

				return deletedRecord[0];
			});

			return success(deletedResult);
		} catch (error) {
			const message = `Error deleting file.`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
});

export { filesSvc };
