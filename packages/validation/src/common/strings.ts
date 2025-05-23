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

import { z } from 'zod';
import { WORDS } from '../utils/regex.js';

export const TrimmedString = z.string().trim();
export type TrimmedString = z.infer<typeof TrimmedString>;

// string with at least 2 non-whitespace character
export const NonEmptyString = TrimmedString.min(2).max(200);
export type NonEmptyString = z.infer<typeof NonEmptyString>;

// string with at least 2 non-whitespace character, or undefined
export const OptionalString = NonEmptyString.optional().or(z.literal(''));
export type OptionalString = z.infer<typeof OptionalString>;

export const EmptyString = z.literal('');
export type EmptyString = z.infer<typeof EmptyString>;

export const EmptyWhiteSpace = TrimmedString.max(0);
export type EmptyWhiteSpace = z.infer<typeof EmptyWhiteSpace>;

export const EmptyOrOptionalString = OptionalString.or(EmptyString).or(EmptyWhiteSpace);
export type EmptyOrOptionalString = z.infer<typeof EmptyOrOptionalString>;

export const OptionalURLString = TrimmedString.url().optional().or(EmptyWhiteSpace);
export type OptionalURLString = z.infer<typeof OptionalURLString>;

export const MinimumWordCountString = TrimmedString.refine((value) => value.split(WORDS).length >= 100, {
	params: { violation: 'tooFewWords', length: 100 },
});
export type MinimumWordCountString = z.infer<typeof MinimumWordCountString>;

export const Maximum200WordsString = TrimmedString.refine((value) => value.split(WORDS).length <= 200, {
	params: { violation: 'tooManyWords', length: 200 },
});
export type Maximum200WordsString = z.infer<typeof Maximum200WordsString>;

export const Maximum250WordsString = TrimmedString.refine((value) => value.split(WORDS).length <= 250, {
	params: { violation: 'tooManyWords', length: 250 },
});
export type Maximum250WordsString = z.infer<typeof Maximum250WordsString>;

export const Maximum300WordsString = TrimmedString.refine((value) => value.split(WORDS).length <= 300, {
	params: { violation: 'tooManyWords', length: 300 },
});
export type Maximum300WordsString = z.infer<typeof Maximum300WordsString>;

export const Concise200WordCountString = MinimumWordCountString.and(Maximum200WordsString);
export type Concise200WordCountString = z.infer<typeof Concise200WordCountString>;

export const Concise250WordCountString = MinimumWordCountString.and(Maximum250WordsString);
export type Concise250WordCountString = z.infer<typeof Concise250WordCountString>;
