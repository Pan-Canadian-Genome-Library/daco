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

import { z as zod } from 'zod';

export const errorResponseSchema = <TEnum extends readonly [string, ...string[]]>(errorCodes: TEnum) =>
	zod.object({ error: zod.enum(errorCodes), message: zod.string() });

/**
 * This is a standardized object defining the response body for error cases.
 *
 * Errors are structured as:
 * ```ts
 * {
 *   "error": string;
 *   "message": string;
 * }
 * ```
 * The `error` property should be a short string, typically in upper snake case.
 * This can be used by the UI to determine which error case has occurred, and to
 * map the error to a translatable error message.
 *
 * The `message` property is meant to explain the error for troubleshooting purposes.
 * It is not meant to be presented in the UI to a user, and so does not need to be translatable.
 *
 * @example
 * type SomeResponseErrors = ErrorResponse<['FORBIDDEN', 'SYSTEM_ERROR']>;
 * // {
 * //   error: "FORBIDDEN" | "SYSTEM_ERROR";
 * //   message: string;
 * // }
 */
export type ErrorResponse<ErrorCodes extends readonly [string, ...string[]]> = zod.infer<
	ReturnType<typeof errorResponseSchema<ErrorCodes>>
>;
