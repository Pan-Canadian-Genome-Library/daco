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

import { NextFunction, Request, RequestHandler, Response } from 'express';

import { ParamsDictionary } from 'express-serve-static-core';
import formidable from 'formidable';
import { ZodErrorMap, ZodSchema } from 'zod';
import { RequestValidationErrorResponse } from './responses.js';

/**
 * Wrapper for express RequestHandler to provide request body validation using a Zod Schema.
 *
 * Provide the Zod Schema for the expected request structure as the first argument,
 * and the RequestHandler function as the second.
 *
 * The custom RequestHandler provided will only be executed once the request passes validation. As
 * an added bonus this means that TS will be aware of the structure of the request body as defined in
 * the Zod schema.
 *
 * @param bodySchema Zod Schema which will perform the request body validation
 * @param zodErrorMapping A `ZodErrorMap` object which can be used to translate or intercept the existing error / message mapping. If you don't have a custom one, you may pass in `defaultErrorMap` from the `zod` package, or `undefined`.
 * @param handler RequestHandler to run once validation passes
 * @returns RequestHandler to be given to express router
 *
 * @example
 * ```
 * import { withBodySchemaValidation } from '@pcgl-daco/request-utils';
 * import { defaultErrorMap } from 'zod';
 *
 * router.post('/', withBodySchemaValidation(ExampleSchema, defaultErrorMap, (request, response, next) => {
 * 	const { body } = request;
 * 	// TS knows the structure of `body` from `ExampleSchema`. It is already validated, you can use it immediately
 * 	const output = doSomethingWithBody(body);
 * 	res.json(output);
 * });
 * ```
 */
function withBodySchemaValidation<ReqBody>(
	bodySchema: ZodSchema<ReqBody>,
	zodErrorMapping: ZodErrorMap | undefined,
	handler: RequestHandler<ParamsDictionary, any, any, qs.ParsedQs>,
): RequestHandler {
	return async (request: Request, response: Response, next: NextFunction) => {
		try {
			const validationResult = bodySchema.safeParse(request.body, { errorMap: zodErrorMapping });
			if (validationResult.success) {
				return await handler(request, response, next);
			}

			// Request body failed validation
			response.status(400).json(RequestValidationErrorResponse(validationResult.error));
			return;
		} catch (err: unknown) {
			next(err);
		}
	};
}

/**
 * Wrapper for express RequestHandler to provide request parameter validation using a Zod Schema.
 *
 * @param paramsSchema Zod Schema which will perform the request parameter validation
 * @param zodErrorMapping A `ZodErrorMap` object which can be used to translate or intercept the existing error / message mapping. If you don't have a custom one, you may pass in `defaultErrorMap` from the `zod` package, or `undefined`.
 * @param handler RequestHandler to run once validation passes
 * @returns RequestHandler to be given to express router
 *
 */
function withParamsSchemaValidation<ReqParams>(
	paramsSchema: ZodSchema<ReqParams>,
	zodErrorMapping: ZodErrorMap | undefined,
	handler: RequestHandler<ParamsDictionary, any, any, qs.ParsedQs>,
): RequestHandler {
	return async (request: Request, response: Response, next: NextFunction) => {
		try {
			const validationResult = paramsSchema.safeParse(request.params, { errorMap: zodErrorMapping });
			if (validationResult.success) {
				return await handler(request, response, next);
			}

			// Request params failed validation
			response.status(400).json(RequestValidationErrorResponse(validationResult.error));
			return;
		} catch (err: unknown) {
			next(err);
		}
	};
}

const validFileTypes = [
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
/**
 * Wrapper for express RequestHandler to provide request parameter validation using a Zod Schema.
 *
 * @param paramsSchema Zod Schema which will perform the request parameter validation
 * @param zodErrorMapping A `ZodErrorMap` object which can be used to translate or intercept the existing error / message mapping. If you don't have a custom one, you may pass in `defaultErrorMap` from the `zod` package, or `undefined`.
 * @param handler RequestHandler to run once validation passes
 * @returns RequestHandler to be given to express router
 *
 */
function fileUploadValidation(handler: RequestHandler<ParamsDictionary, any, any, qs.ParsedQs>): RequestHandler {
	return async (request: Request, response: Response, next: NextFunction) => {
		try {
			const form = formidable({
				keepExtensions: true,
				maxFileSize: 5 * 1024 * 1024, // 5MB limit
				maxFiles: 1,
				allowEmptyFiles: false,
			});
			form.parse(request, async (err, _, files) => {
				if (err) {
					response.status(400).send({ message: 'Invalid file upload' });
					return;
				}

				if (!files.file || !files.file[0]) {
					response.status(400).send({ message: 'File does not exist' });
					return;
				}

				const uploadedFile = files.file[0];

				if (!uploadedFile.mimetype) {
					response.status(400).send({ message: 'File type was not specified' });
					return false;
				}

				if (!validFileTypes.includes(`${uploadedFile.mimetype}`)) {
					response.status(400).send({ message: 'Invalid file type' });
					return false;
				}

				request.body = { ...request.body, file: uploadedFile };

				return await handler(request, response, next);
			});

			return;
		} catch (err: unknown) {
			next(err);
		}
	};
}

export { fileUploadValidation, withBodySchemaValidation, withParamsSchemaValidation };
