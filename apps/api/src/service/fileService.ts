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

import formidable from 'formidable';
import fs from 'fs';

import { type PostgresDb } from '@/db/index.js';
import { files } from '@/db/schemas/files.js';
import logger from '@/logger.ts';
import { type AsyncResult, failure, success } from '@/utils/results.js';
import { eq } from 'drizzle-orm';
import { type FilesModel, type JoinedApplicationRecord } from './types.ts';

/**
 * Upload service provides methods for file DB access
 * @param db - Drizzle Postgres DB Instance
 */
const filesSvc = (db: PostgresDb) => ({
	uploadEthicsFile: async ({
		application_id,
		file,
		application,
	}: {
		application_id: number;
		file: formidable.File;
		application: JoinedApplicationRecord;
	}): AsyncResult<FilesModel & { id: number }> => {
		try {
			const result = await db.transaction(async (transaction) => {
				const buffer = await fs.readFileSync(file.filepath);

				const newFiles: typeof files.$inferInsert = {
					application_id: application_id,
					filename: file.originalFilename,
					type: 'ETHICS_LETTER',
					submitted_at: new Date(),
					submitter_user_id: application.user_id,
					content: buffer,
				};

				// Create New File
				let newFileRecord;
				const ethicsLetterId = application.contents?.ethics_letter;

				if (ethicsLetterId && ethicsLetterId !== null) {
					newFileRecord = await transaction.update(files).set(newFiles).where(eq(files.id, ethicsLetterId)).returning();
				} else {
					newFileRecord = await transaction.insert(files).values(newFiles).returning();
				}

				if (!newFileRecord[0]) throw new Error('File record is undefined');

				return newFileRecord[0];
			});

			return success(result);
		} catch (err) {
			const message = `Error uploading file`;

			logger.error(message);
			logger.error(err);

			return failure(message, err);
		}
	},
});

export { filesSvc };
