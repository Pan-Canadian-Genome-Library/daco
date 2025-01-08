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

import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

import { EmptyString, EmptyWhiteSpace, TrimmedString } from '../../common/String.js';
import { NAME_REGEX } from '../../common/regexes.js';

// trim the string for Name & OptionalName so that whitespace-only strings
// do not pass NAME_REGEX validation.

export const Name = extendApi(TrimmedString.regex(NAME_REGEX), { example: 'string' });
export type Name = z.infer<typeof Name>;

export const OptionalName = Name.optional();
export type OptionalName = z.infer<typeof OptionalName>;

export const EmptyOrOptionalName = OptionalName.or(EmptyString).or(EmptyWhiteSpace);
export type EmptyOrOptionalName = z.infer<typeof EmptyOrOptionalName>;
