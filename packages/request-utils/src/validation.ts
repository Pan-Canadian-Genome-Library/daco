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

import { RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ZodSchema } from 'zod';
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
 * @param handler RequestHandler to run once validation passes
 * @returns RequestHandler to be given to express router
 *
 * @example
 * ```
 * import withSchemaValidation from 'express-request-validation';
 *
 * router.post('/', withSchemaValidation(ExampleSchema, (request, response, next) => {
 * 	const { body } = request;
 * 	// TS knows the structure of `body` from `ExampleSchema`. It is already validated, you can use it immediately
 * 	const output = doSomethingWithBody(body);
 * 	res.json(output);
 * });
 * ```
 */
function withSchemaValidation<ReqBody>(
	bodySchema: ZodSchema<ReqBody>,
	handler: RequestHandler<ParamsDictionary, any, ReqBody>,
): RequestHandler {
	return async (request, response, next) => {
		try {
			const validationResult = bodySchema.safeParse(request.body);
			if (validationResult.success) {
				return await handler(request, response, next);
			}

			// Request body failed validation
			return response.status(400).json(RequestValidationErrorResponse(validationResult.error));
		} catch (err: unknown) {
			next(err);
		}
	};
}

export { withSchemaValidation };
