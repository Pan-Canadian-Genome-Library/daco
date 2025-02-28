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
 * import { withSchemaValidation } from '@pcgl-daco/request-utils';
 * import { defaultErrorMap } from 'zod';
 *
 * router.post('/', withSchemaValidation(ExampleSchema, defaultErrorMap, (request, response, next) => {
 * 	const { body } = request;
 * 	// TS knows the structure of `body` from `ExampleSchema`. It is already validated, you can use it immediately
 * 	const output = doSomethingWithBody(body);
 * 	res.json(output);
 * });
 * ```
 */
function withSchemaValidation<ReqBody>(
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

export { withSchemaValidation };
