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

import { z } from 'zod';

type FieldErrors = {
	path: string;
	message: string;
}[];

/**
 * Format Zod errors for specific form fields, for easier testing.
 * @param result The object resulting from Zod SafeParse
 * @returns An array of objects: { path, message }
 */
export const formatZodFieldErrorsForTesting = (
	result: z.SafeParseReturnType<any, any>,
): FieldErrors => {
	const resultJsonParsed = JSON.parse((result as { error: Error }).error.message);
	return resultJsonParsed.map((item: z.CustomErrorParams) => ({
		path: (item.path && item.path[0]) || '',
		message: item.message,
	}));
};

/**
 * Finds error item in list of FieldErrors by matching a fieldname with the error path
 * @param fieldName string
 * @param fieldErrors FieldErrors
 * @returns custom error item, or undefined if no error exists with that path name
 */
export const findErrorByPath = (fieldName: string, fieldErrors: FieldErrors) => {
	return fieldErrors.find((err) => err.path === fieldName);
};
