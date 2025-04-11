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

import { ZodError } from 'zod';
import { type ErrorResponse, ErrorType, type RequestValidationError } from './types.js';

/**
 * Convert a ZodError from ZodSchema validation into an HTTP Error response message
 * of type `INVALID_REQUEST`.
 * @param error Zod Error from parse
 * @returns
 */
export const RequestValidationErrorResponse = <T>(
	error: ZodError<T>,
	customMessage?: string,
): RequestValidationError => ({
	error: ErrorType.INVALID_REQUEST,
	message:
		customMessage ??
		'Sorry, looks like you sent a bad request. Please double check the request and try again, or refer to our API documentation.',
	details: error.issues,
});

/**
 * Creates a ServerError Response containing a message detailing the problem.
 * @returns A `Response` letting the user know of the error
 */
export const UnhandledServerErrorResponse = (): ErrorResponse => ({
	error: ErrorType.SYSTEM_ERROR,
	message: "Sorry, something went wrong. We're unable to process your request, please try again later.",
});
