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
import logger from '@/logger.ts';
import { applicationSvc } from '@/service/applicationService.ts';
import { filesSvc } from '@/service/fileService.ts';
import { type ApplicationRecord, type ApplicationService, type FilesService } from '@/service/types.ts';
import { failure } from '@/utils/results.ts';
import formidable from 'formidable';
import { ApplicationStateEvents, ApplicationStateManager } from './stateManager.ts';

/**
 * Upload a file with an associated application
 * @param applicationId - The target applicationId to associate the uploaded file
 * @param file - File blob
 * @returns Success with file data / Failure with Error.
 */
export const uploadEthicsFile = async ({ applicationId, file }: { applicationId: number; file: formidable.File }) => {
	try {
		const database = getDbInstance();
		const filesService: FilesService = filesSvc(database);
		const applicationRepo: ApplicationService = applicationSvc(database);

		const applicationResult = await applicationRepo.getApplicationWithContents({ id: applicationId });

		if (!applicationResult.success) {
			return failure('Failed getting application information');
		}

		const application = applicationResult.data;
		const { edit } = ApplicationStateEvents;

		const applicationRecord: ApplicationRecord = { ...application, contents: null };
		const canEditResult = new ApplicationStateManager(applicationRecord)._canPerformAction(edit);

		if (!canEditResult) {
			return failure('Invalid action, must be in a draft state', 'Invalid action');
		}

		const ethicsLetterId = application.contents?.ethics_letter;

		const txResult = await database.transaction(async (tx) => {
			let result;

			if (ethicsLetterId && ethicsLetterId !== null) {
				result = await filesService.updateFile({
					fileId: ethicsLetterId,
					file,
					application,
					type: 'ETHICS_LETTER',
					transaction: tx,
				});
			} else {
				result = await filesService.createFile({ file, application, type: 'ETHICS_LETTER' });
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
		return txResult;
	} catch (error) {
		const message = `Unable to upload file to application with id: ${applicationId}`;
		logger.error(message);
		logger.error(error);
		return failure(message, error);
	}
};

/**
 * Delete a file with id
 * @param fileId - The target fileId to associate the uploaded file
 * @returns Success with file data / Failure with Error.
 */
export const deleteFile = async ({ fileId }: { fileId: number }) => {
	try {
		const database = getDbInstance();
		const filesService: FilesService = filesSvc(database);

		await filesService.deleteFileById({ fileId });
	} catch (error) {
		const message = `Unable to delete file with id: ${fileId}`;
		logger.error(message);
		logger.error(error);
		return failure(message, error);
	}
};
