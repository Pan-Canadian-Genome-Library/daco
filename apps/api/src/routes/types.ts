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

import { type Response } from 'express';

import { type ApplicationsColumnName, type OrderBy } from '@/service/types.js';
import { type ApplicationStateValues } from '@pcgl-daco/data-model/src/types.js';
import type { ErrorResponse } from '@pcgl-daco/validation';

export type ApplicationListRequest = {
	userId?: string;
	state?: ApplicationStateValues[];
	sort?: Array<OrderBy<ApplicationsColumnName>>;
	page?: number;
	pageSize?: number;
	isDACMember?: boolean;
	isApplicantView?: boolean;
};

/**
 * Express Response type with response body data types specified. Use this in a route
 * handler to cause TS to validate that the data sent in responses match the data type
 * declared.
 *
 * This also accepts a list of error codes that the endpoint could return. This type will
 * specify a standard error format as defined by the `ErrorResponse` type. If you do not
 * specify any error codes, then by default the only acceptable error code is `SYSTEM_ERROR`.
 * You can provide an array of string literals that declare the error codes that this endpoint
 * could return.
 *
 * @example
 * someRouter.get('/example', async (request, response: ResponseWithData<ExampleResponse, ['INVALID_PARAMETERS']>) => {
 * 	if(!req.params.check) {
 * 		// TS will also allow an error message in this format, but only with an error code
 * 		//  specified in the ResponseWithData type.
 * 		res.status(400).json({
 * 			error: 'INVALID_PARAMETERS',
 * 			message: 'Missing some required parameter'
 * 		});
 * 	}
 * 	res.json({example: true}); // TS will validate this object matches the `ExampleResponse` type.
 * }
 */
export type ResponseWithData<
	TSuccessData,
	TErrorCodes extends readonly [string, ...string[]] = ['SYSTEM_ERROR'],
> = Response<TSuccessData | ErrorResponse<TErrorCodes>>;
