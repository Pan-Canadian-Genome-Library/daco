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

import { FilesDTO } from '@pcgl-daco/data-model';
import { ErrorType, fileUploadValidation, withParamsSchemaValidation } from '@pcgl-daco/request-utils';
import { deleteFileByIdSchema, getFileByIdParamsSchema, isPositiveInteger } from '@pcgl-daco/validation';
import express, { type Request } from 'express';
import formidable from 'formidable';

import { deleteFile, getFile, uploadEthicsFile } from '@/controllers/fileController.ts';
import { authMiddleware } from '@/middleware/authMiddleware.ts';
import { canAccessRequest } from '@/service/authService.ts';
import { authErrorResponseHandler, authFailure, isRequestWithSession } from '@/service/utils.ts';
import { apiZodErrorMapping } from '@/utils/validation.ts';
import type { ResponseWithData } from './types.ts';

const fileRouter = express.Router();

/**
 * Creates a response for retrieving a file, this logic is the same whether we're including the download content
 * or not, so it's better to standardise this.
 * @param req The standard Express request object.
 * @param res A `ResponseWithData`, returns a `FilesDTO` object, containing the file response.
 * @param hasContent If set to `true` will include `content` into the `FilesDTO` object, if set to `false` it will be omitted
 * @returns a `TSuccessData` on success, `TErrorCodes` on failure.
 */
async function retrieveFile(
	req: Request,
	res: ResponseWithData<FilesDTO, ['NOT_FOUND', 'FORBIDDEN', 'INVALID_REQUEST', 'SYSTEM_ERROR']>,
	hasContent?: boolean,
) {
	if (isRequestWithSession(req)) {
		const { fileId } = req.params;
		const id = parseInt(fileId ? fileId : '');
		const requestAuthResult = await canAccessRequest(req.session, id);
		if (requestAuthResult.success) {
			if (!isPositiveInteger(id)) {
				res.status(400).send({ error: ErrorType.INVALID_REQUEST, message: 'Invalid fileId' });
				return;
			}

			const result = await getFile({ fileId: id, withBuffer: hasContent });
			if (!result.success) {
				switch (result.error) {
					case ErrorType.NOT_FOUND:
						res.status(404);
						break;
					case ErrorType.SYSTEM_ERROR:
						res.status(500);
						break;
					default:
						res.status(500);
				}
				res.send({
					error: result.error,
					message: result.message,
				});
				return;
			}

			res.status(200).send(result.data);
			return;
		} else {
			authErrorResponseHandler(res, requestAuthResult);
		}
	} else {
		authErrorResponseHandler(res, authFailure);
	}
}

fileRouter.get(
	'/:fileId',
	authMiddleware(),
	withParamsSchemaValidation(
		getFileByIdParamsSchema,
		apiZodErrorMapping,
		async (
			req: Request,
			res: ResponseWithData<FilesDTO, ['NOT_FOUND', 'FORBIDDEN', 'INVALID_REQUEST', 'SYSTEM_ERROR']>,
		) => {
			return retrieveFile(req, res, false);
		},
	),
);

fileRouter.get(
	'/:fileId/download',
	authMiddleware(),
	withParamsSchemaValidation(
		getFileByIdParamsSchema,
		apiZodErrorMapping,
		async (
			req: Request,
			res: ResponseWithData<FilesDTO, ['NOT_FOUND', 'FORBIDDEN', 'INVALID_REQUEST', 'SYSTEM_ERROR']>,
		) => {
			return retrieveFile(req, res, true);
		},
	),
);

fileRouter.post(
	'/ethics/:applicationId',
	authMiddleware({
		requiredRoles: ['APPLICANT'],
	}),
	fileUploadValidation(
		async (
			req: Request<any, { file: formidable.File }>,
			res: ResponseWithData<
				Pick<FilesDTO, 'filename' | 'id'>,
				['SYSTEM_ERROR', 'FORBIDDEN', 'NOT_FOUND', 'INVALID_REQUEST']
			>,
		) => {
			if (isRequestWithSession(req)) {
				const { applicationId } = req.params;
				const id = parseInt(applicationId ? applicationId : '');
				const requestAuthResult = await canAccessRequest(req.session, id);
				if (requestAuthResult.success) {
					const { file } = req.body;
					if (!isPositiveInteger(id)) {
						res.status(400).json({ error: ErrorType.INVALID_REQUEST, message: 'Invalid applicationId' });
						return;
					}

					const result = await uploadEthicsFile({ applicationId: id, file });
					if (result.success) {
						res.status(201).send({
							id: result.data.id,
							filename: result.data.filename,
						});
						return;
					} else {
						switch (result.error) {
							case 'INVALID_STATE_TRANSITION':
								res.status(400);
								break;
							case ErrorType.NOT_FOUND:
								res.status(404);
								break;
							case ErrorType.SYSTEM_ERROR:
								res.status(500);
								break;
						}
						res.json({
							message: result.message,
							error: result.error !== 'INVALID_STATE_TRANSITION' ? result.error : ErrorType.INVALID_REQUEST,
						});
						return;
					}
				} else {
					authErrorResponseHandler(res, requestAuthResult);
				}
			} else {
				authErrorResponseHandler(res, authFailure);
			}
		},
	),
);

fileRouter.delete(
	'/:fileId',
	authMiddleware({
		requiredRoles: ['APPLICANT'],
	}),
	withParamsSchemaValidation(
		deleteFileByIdSchema,
		apiZodErrorMapping,
		async (req: Request, res: ResponseWithData<void, ['FORBIDDEN', 'SYSTEM_ERROR', 'NOT_FOUND']>) => {
			const { fileId } = req.params;
			const id = parseInt(fileId ? fileId : '');
			const userSession = req.session;

			const file = await getFile({ fileId: id });

			if (!file.success) {
				if (file.error === ErrorType.NOT_FOUND) {
					res.status(404);
				} else {
					res.status(500);
				}
				res.send({
					error: file.error,
					message: file.message,
				});
				return;
			}

			if (file.data.submitterUserId !== userSession.user?.userId) {
				res.status(403).send({
					error: ErrorType.FORBIDDEN,
					message: 'Looks like you do not own, or have permissions to modify this file.',
				});
				return;
			}

			const result = await deleteFile({ fileId: id });

			if (!result.success) {
				res.status(500).json({
					error: ErrorType.SYSTEM_ERROR,
					message: result.message,
				});
				return;
			}

			res.status(204).send();
			return;
		},
	),
);

export default fileRouter;
