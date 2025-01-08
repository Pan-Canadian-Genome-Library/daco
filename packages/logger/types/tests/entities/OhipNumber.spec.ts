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
	EmptyOrOptionalOhipNumber,
	OhipNumber,
	OptionalOhipNumber,
} from '../../src/entities/fields/index.js';

describe('OhipNumber', () => {
	it('Must be a string of 10 digits', () => {
		expect(OhipNumber.safeParse('1234567890').success).true;
	});

	it('Cannot be more than 10 digits', () => {
		expect(OhipNumber.safeParse('1234567890123').success).false;
	});

	it('Cannot be less than 10 digits', () => {
		expect(OhipNumber.safeParse('1234').success).false;
	});

	it('Cannot contain letters or symbols', () => {
		expect(OhipNumber.safeParse('123456789A').success).false;
		expect(OhipNumber.safeParse('123-456-78').success).false;
		expect(OhipNumber.safeParse('123 456 78').success).false;
		expect(OhipNumber.safeParse('#123456789').success).false;
		expect(OhipNumber.safeParse('123456789.').success).false;
	});

	it('Cannot be a string of 10 digits and whitespace', () => {
		expect(OhipNumber.safeParse('1234567890  ').success).false;
	});

	it('Cannot be undefined', () => {
		expect(OhipNumber.safeParse(undefined).success).false;
	});

	it('Cannot be an empty string', () => {
		expect(OhipNumber.safeParse('').success).false;
	});

	it('Cannot be null', () => {
		expect(OhipNumber.safeParse(null).success).false;
	});

	it('Cannot contain only whitespace', () => {
		expect(OhipNumber.safeParse(' ').success).false;
	});
});

describe('OptionalOhipNumber', () => {
	it('Can be a string of 10 digits', () => {
		expect(OptionalOhipNumber.safeParse('1234567890').success).true;
	});

	it('Cannot be more than 10 digits', () => {
		expect(OptionalOhipNumber.safeParse('1234567890123').success).false;
	});

	it('Cannot be less than 10 digits', () => {
		expect(OptionalOhipNumber.safeParse('1234').success).false;
	});

	it('Cannot contain letters or symbols', () => {
		expect(OptionalOhipNumber.safeParse('123456789A').success).false;
		expect(OptionalOhipNumber.safeParse('123-456-78').success).false;
		expect(OptionalOhipNumber.safeParse('123 456 78').success).false;
		expect(OptionalOhipNumber.safeParse('#123456789').success).false;
		expect(OptionalOhipNumber.safeParse('123456789.').success).false;
	});

	it('Cannot be a string of 10 digits and whitespace', () => {
		expect(OptionalOhipNumber.safeParse('1234567890  ').success).false;
	});

	it('Can be undefined', () => {
		expect(OptionalOhipNumber.safeParse(undefined).success).true;
	});

	it('Cannot be an empty string', () => {
		expect(OptionalOhipNumber.safeParse('').success).false;
	});

	it('Cannot be null', () => {
		expect(OptionalOhipNumber.safeParse(null).success).false;
	});

	it('Cannot contain only whitespace', () => {
		expect(OptionalOhipNumber.safeParse(' ').success).false;
	});
});

describe('EmptyOrOptionalOhipNumber', () => {
	it('Can be a string of 10 digits', () => {
		expect(EmptyOrOptionalOhipNumber.safeParse('1234567890').success).true;
	});

	it('Cannot be more than 10 digits', () => {
		expect(EmptyOrOptionalOhipNumber.safeParse('1234567890123').success).false;
	});

	it('Cannot be less than 10 digits', () => {
		expect(EmptyOrOptionalOhipNumber.safeParse('1234').success).false;
	});

	it('Cannot contain letters or symbols', () => {
		expect(EmptyOrOptionalOhipNumber.safeParse('123456789A').success).false;
		expect(EmptyOrOptionalOhipNumber.safeParse('123-456-78').success).false;
		expect(EmptyOrOptionalOhipNumber.safeParse('123 456 78').success).false;
		expect(EmptyOrOptionalOhipNumber.safeParse('#123456789').success).false;
		expect(EmptyOrOptionalOhipNumber.safeParse('123456789.').success).false;
	});

	it('Can be a string of 10 digits and whitespace', () => {
		expect(EmptyOrOptionalOhipNumber.safeParse('1234567890 ').success).true;
	});

	it('Can be undefined', () => {
		expect(EmptyOrOptionalOhipNumber.safeParse(undefined).success).true;
	});

	it('Can be an empty string', () => {
		expect(EmptyOrOptionalOhipNumber.safeParse('').success).true;
	});

	it('Cannot be null', () => {
		expect(EmptyOrOptionalOhipNumber.safeParse(null).success).false;
	});

	it('Can contain only whitespace', () => {
		expect(EmptyOrOptionalOhipNumber.safeParse(' ').success).true;
	});
});
