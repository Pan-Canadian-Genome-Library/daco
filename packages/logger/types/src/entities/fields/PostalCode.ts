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

import { EmptyString, EmptyWhiteSpace, TrimmedString } from '../../common/String.js';
import { POSTAL_CODE_REGEX } from '../../common/regexes.js';

export const PostalCode = z
	.string()
	.regex(POSTAL_CODE_REGEX)
	.transform((data) => data.toUpperCase());
export type PostalCode = z.infer<typeof PostalCode>;

export const OptionalPostalCode = PostalCode.optional();
export type OptionalPostalCode = z.infer<typeof OptionalPostalCode>;

export const EmptyOrOptionalPostalCode = TrimmedString.regex(POSTAL_CODE_REGEX)
	.transform((data) => data.toUpperCase())
	.optional()
	.or(EmptyString)
	.or(EmptyWhiteSpace);
export type EmptyOrOptionalPostalCode = z.infer<typeof EmptyOrOptionalPostalCode>;
