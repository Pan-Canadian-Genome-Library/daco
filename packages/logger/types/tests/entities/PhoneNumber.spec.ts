/*
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
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

import { describe, expect, it } from 'vitest';

import {
	PhoneNumber,
	OptionalPhoneNumber,
	EmptyOrOptionalPhoneNumber,
} from '../../src/entities/fields/index.js';

describe('PhoneNumber', () => {
	it('Must be a string containing 10 digits', () => {
		expect(PhoneNumber.safeParse('1234567890').success).true;
	});

	it('Cannot be less than 10 digits', () => {
		expect(PhoneNumber.safeParse('12345').success).false;
	});

	it('Cannot be more than 10 digits', () => {
		expect(PhoneNumber.safeParse('1234567890123').success).false;
	});

	it('Cannot be 10 digits and whitespace', () => {
		expect(PhoneNumber.safeParse('1234567890  ').success).false;
	});

	it('Cannot be undefined', () => {
		expect(PhoneNumber.safeParse(undefined).success).false;
	});

	it('Cannot be null', () => {
		expect(PhoneNumber.safeParse(null).success).false;
	});

	it('Cannot be an empty string', () => {
		expect(PhoneNumber.safeParse('').success).false;
	});

	it('Cannot be a string containing only whitespace', () => {
		expect(PhoneNumber.safeParse(' ').success).false;
	});

	it('Cannot contain punctuation or letters', () => {
		expect(PhoneNumber.safeParse('123-456-78').success).false;
		expect(PhoneNumber.safeParse('+123A56789').success).false;
		expect(PhoneNumber.safeParse('123 4B6 78').success).false;
		expect(PhoneNumber.safeParse('+1 (234) 5').success).false;
		expect(PhoneNumber.safeParse('123456789.').success).false;
	});
});

describe('OptionalPhoneNumber', () => {
	it('Can be a string containing 10 digits', () => {
		expect(OptionalPhoneNumber.safeParse('1234567890').success).true;
	});

	it('Cannot be less than 10 digits', () => {
		expect(OptionalPhoneNumber.safeParse('12345').success).false;
	});

	it('Cannot be more than 10 digits', () => {
		expect(OptionalPhoneNumber.safeParse('1234567890123').success).false;
	});

	it('Cannot be 10 digits and whitespace', () => {
		expect(OptionalPhoneNumber.safeParse('1234567890 ').success).false;
	});

	it('Can be undefined', () => {
		expect(OptionalPhoneNumber.safeParse(undefined).success).true;
	});

	it('Cannot be an empty string', () => {
		expect(OptionalPhoneNumber.safeParse('').success).false;
	});

	it('Cannot be null', () => {
		expect(OptionalPhoneNumber.safeParse(null).success).false;
	});

	it('Cannot be a string containing only whitespace', () => {
		expect(OptionalPhoneNumber.safeParse(' ').success).false;
	});

	it('Cannot contain punctuation or letters', () => {
		expect(OptionalPhoneNumber.safeParse('123-456-78').success).false;
		expect(OptionalPhoneNumber.safeParse('+123A56789').success).false;
		expect(OptionalPhoneNumber.safeParse('123 4B6 78').success).false;
		expect(OptionalPhoneNumber.safeParse('+1 (234) 5').success).false;
		expect(OptionalPhoneNumber.safeParse('123456789.').success).false;
	});
});

describe('EmptyOrOptionalPhoneNumber', () => {
	it('Can be a string containing 10 digits', () => {
		expect(EmptyOrOptionalPhoneNumber.safeParse('1234567890').success).true;
	});

	it('Cannot be less than 10 digits', () => {
		expect(EmptyOrOptionalPhoneNumber.safeParse('12345').success).false;
	});

	it('Cannot be more than 10 digits', () => {
		expect(EmptyOrOptionalPhoneNumber.safeParse('1234567890123').success).false;
	});

	it('Can be 10 digits and whitespace', () => {
		expect(EmptyOrOptionalPhoneNumber.safeParse('1234567890 ').success).true;
	});

	it('Can be undefined', () => {
		expect(EmptyOrOptionalPhoneNumber.safeParse(undefined).success).true;
	});

	it('Can be an empty string', () => {
		expect(EmptyOrOptionalPhoneNumber.safeParse('').success).true;
	});

	it('Cannot be null', () => {
		expect(EmptyOrOptionalPhoneNumber.safeParse(null).success).false;
	});

	it('Can be a string containing only whitespace', () => {
		expect(EmptyOrOptionalPhoneNumber.safeParse(' ').success).true;
	});

	it('Cannot contain punctuation or letters', () => {
		expect(EmptyOrOptionalPhoneNumber.safeParse('123-456-78').success).false;
		expect(EmptyOrOptionalPhoneNumber.safeParse('+123A56789').success).false;
		expect(EmptyOrOptionalPhoneNumber.safeParse('123 4B6 78').success).false;
		expect(EmptyOrOptionalPhoneNumber.safeParse('+1 (234) 5').success).false;
		expect(EmptyOrOptionalPhoneNumber.safeParse('123456789.').success).false;
	});
});
