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

import { getDbInstance } from '@/db/index.js';
import BaseLogger from '@/logger.ts';
import { applicationSvc } from '@/service/applicationService.ts';
import { filesSvc } from '@/service/fileService.ts';
import {
	type ApplicationRecord,
	type ApplicationService,
	type FilesRecord,
	type FilesService,
} from '@/service/types.ts';
import { convertToFileRecord } from '@/utils/aliases.ts';
import { failure, success, type AsyncResult, type Result } from '@/utils/results.ts';
import { FilesDTO, FileTypes } from '@pcgl-daco/data-model';
import formidable from 'formidable';
import { ApplicationStateEvents, ApplicationStateManager } from './stateManager.ts';

const logger = BaseLogger.forModule('fileController');

/**
 * Upload a file with an associated application
 * @param applicationId - The target applicationId to associate the uploaded file
 * @param file - File blob
 * @returns Success with file data / Failure with Error.
 */
export const uploadEthicsFile = async ({
	applicationId,
	file,
}: {
	applicationId: number;
	file: formidable.File;
}): AsyncResult<FilesDTO, 'SYSTEM_ERROR' | 'NOT_FOUND' | 'INVALID_STATE_TRANSITION'> => {
	try {
		const database = getDbInstance();
		const filesService: FilesService = filesSvc(database);
		const applicationRepo: ApplicationService = applicationSvc(database);

		const applicationResult = await applicationRepo.getApplicationWithContents({ id: applicationId });

		if (!applicationResult.success) {
			return applicationResult;
		}

		const application = applicationResult.data;
		const { edit } = ApplicationStateEvents;

		const applicationRecord: ApplicationRecord = { ...application, contents: null };
		const canEditResult = new ApplicationStateManager(applicationRecord)._canPerformAction(edit);

		if (!canEditResult.success) {
			return canEditResult;
		}

		const ethicsLetterId = application.contents?.ethics_letter;

		const txResult = await database.transaction(async (tx) => {
			let result: Result<FilesRecord, 'SYSTEM_ERROR' | 'NOT_FOUND' | 'INVALID_STATE_TRANSITION'>;

			if (ethicsLetterId && ethicsLetterId !== null) {
				result = await filesService.updateFile({
					fileId: ethicsLetterId,
					file,
					application,
					type: 'ETHICS_LETTER',
					transaction: tx,
				});
			} else {
				result = await filesService.createFile({ file, transaction: tx, application, type: 'ETHICS_LETTER' });
			}

			if (!result.success) {
				return result;
			}

			const applicantResult = await applicationRepo.editApplication({
				id: applicationId,
				update: { ethics_letter: result.data.id },
				transaction: tx,
			});

			if (!applicantResult.success) {
				return applicantResult;
			}

			return result;
		});
		if (!txResult.success) {
			return txResult;
		}

		const fileRecord = convertToFileRecord(txResult.data);

		return fileRecord;
	} catch (error) {
		const message = `Unable to upload file to application with id: ${applicationId}`;
		logger.error(message, error);

		return failure('SYSTEM_ERROR', message);
	}
};

/**
 * Get a file by application
 * @param fileId - The target fileId to associate the uploaded file
 * @returns Success with file data / Failure with Error.
 */
export const getFile = async ({
	fileId,
	withBuffer = false,
}: {
	fileId: number;
	withBuffer?: boolean;
}): AsyncResult<FilesDTO, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const filesService: FilesService = filesSvc(database);

		const result = await filesService.getFileById({ fileId });

		if (!result.success) {
			return failure('NOT_FOUND', `Unable to retrieve file with id: ${fileId}`);
		}

		const aliasedFileRecord = convertToFileRecord(result.data);

		if (!aliasedFileRecord.success) {
			return aliasedFileRecord;
		}

		// Strip content
		if (!withBuffer) {
			return success({ ...aliasedFileRecord.data, content: null });
		}

		return aliasedFileRecord;
	} catch (error) {
		const message = `Unable to retrieve file with id: ${fileId}`;
		logger.error(message, error);

		return failure('SYSTEM_ERROR', message);
	}
};

/*
 * Delete a file with id
 * @param fileId - The target fileId to associate the uploaded file
 * @returns Success with file data / Failure with Error.
 */
export const deleteFile = async ({ fileId }: { fileId: number }) => {
	try {
		const database = getDbInstance();
		const filesService: FilesService = filesSvc(database);
		const applicationRepo: ApplicationService = applicationSvc(database);

		const txResult = await database.transaction(async (tx) => {
			const deleteResult = await filesService.deleteFileById({ fileId, transaction: tx });

			if (!deleteResult.success) {
				return deleteResult;
			}
			const { application_id, type } = deleteResult.data;

			// Check which field in ApplicationContents needs to be set to null
			let update = {};
			if (type === FileTypes.ETHICS_LETTER) {
				update = {
					ethics_letter: null,
				};
			} else {
				update = {
					signed_pdf: null,
				};
			}

			const editApplicationResult = await applicationRepo.editApplication({
				id: application_id,
				update,
				transaction: tx,
			});

			if (!editApplicationResult.success) {
				return editApplicationResult;
			}

			return deleteResult;
		});

		return txResult;
	} catch (error) {
		const message = `Unable to delete file with id: ${fileId}`;
		logger.error(message);
		logger.error(error);
		return failure('SYSTEM_ERROR', message);
	}
};
