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

import { PASSWORD_MAXIMUM_LENGTH, PASSWORD_MINIMUM_LENGTH } from '../../common/lengthConstraints.js';
import {
	PASSWORD_ALLOWED_CHARS_REGEX,
	PASSWORD_LOWERCASE_LETTERS_REGEX,
	PASSWORD_REGEX,
	PASSWORD_UPPERCASE_LETTERS_REGEX,
} from '../../common/regexes.js';

export const CharRequirement = z.string().regex(new RegExp(`^[${PASSWORD_ALLOWED_CHARS_REGEX}]+$`));
export type CharRequirement = z.infer<typeof CharRequirement>;

export const lowercase = new RegExp(PASSWORD_LOWERCASE_LETTERS_REGEX);
export const LowercaseRequirement = z.string().regex(lowercase);
export type LowercaseRequirement = z.infer<typeof LowercaseRequirement>;

export const uppercase = new RegExp(PASSWORD_UPPERCASE_LETTERS_REGEX);
export const UppercaseRequirement = z.string().regex(uppercase);
export type UppercaseRequirement = z.infer<typeof UppercaseRequirement>;

export const LengthRequirement = z.string().min(PASSWORD_MINIMUM_LENGTH).max(PASSWORD_MAXIMUM_LENGTH);
export type LengthRequirement = z.infer<typeof LengthRequirement>;

export const Password = z.string().regex(PASSWORD_REGEX);
export type Password = z.infer<typeof Password>;
