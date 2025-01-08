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
	EmptyOrOptionalPostalCode,
	OptionalPostalCode,
	PostalCode,
} from '../../src/entities/fields/index.js';

describe('PostalCode', () => {
	it('Must be 6 characters long and in postal code format', () => {
		expect(PostalCode.safeParse('T4B0V7').success).true;
		expect(PostalCode.safeParse('TBV407').success).false;
	});

	it('Cannot be undefined', () => {
		expect(PostalCode.safeParse(undefined).success).false;
	});

	it('Cannot be an empty string', () => {
		expect(PostalCode.safeParse('').success).false;
	});

	it('Cannot be a string containing only whitespace', () => {
		expect(OptionalPostalCode.safeParse(' ').success).false;
	});

	it('Cannot be null', () => {
		expect(PostalCode.safeParse(null).success).false;
	});

	it('Can only contain letters and numbers', () => {
		expect(PostalCode.safeParse('T4B 0V').success).false;
		expect(PostalCode.safeParse('T4B-0V').success).false;
	});

	it('Cannot have 6 characters in postal code format, and whitespace', () => {
		expect(PostalCode.safeParse('T4B0V7 ').success).false;
	});

	it('Can contain lowercase letters and transforms all letters to uppercase', () => {
		expect(PostalCode.safeParse('t4b0v7').success).true;
		expect(PostalCode.parse('t4b0v7')).to.equal('T4B0V7');

		expect(PostalCode.safeParse('T4B0v7').success).true;
		expect(PostalCode.parse('T4B0v7')).to.equal('T4B0V7');
	});

	it('Must contain characters in the correct order', () => {
		expect(PostalCode.safeParse('T4B0V7').success).true;
		expect(PostalCode.safeParse('T4B07V').success).false;
		expect(PostalCode.safeParse('4B7O7V').success).false;
		expect(PostalCode.safeParse('ABC123').success).false;
	});
});

describe('OptionalPostalCode', () => {
	it('Can be 6 characters long and in postal code format', () => {
		expect(OptionalPostalCode.safeParse('T4B0V7').success).true;
		expect(OptionalPostalCode.safeParse('TBV407').success).false;
	});

	it('Can be undefined', () => {
		expect(OptionalPostalCode.safeParse(undefined).success).true;
	});

	it('Cannot be an empty string', () => {
		expect(OptionalPostalCode.safeParse('').success).false;
	});

	it('Cannot be null', () => {
		expect(OptionalPostalCode.safeParse(null).success).false;
	});

	it('Cannot be a string containing only whitespace', () => {
		expect(OptionalPostalCode.safeParse(' ').success).false;
	});

	it('Can only contain letters and numbers', () => {
		expect(OptionalPostalCode.safeParse('T4B 0V').success).false;
		expect(OptionalPostalCode.safeParse('T4B-0V').success).false;
	});

	it('Cannot have 6 characters in postal code format, and whitespace', () => {
		expect(OptionalPostalCode.safeParse('T4B0V7 ').success).false;
	});

	it('Can contain lowercase letters and transforms all letters to uppercase', () => {
		expect(OptionalPostalCode.safeParse('t4b0v7').success).true;
		expect(OptionalPostalCode.parse('t4b0v7')).to.equal('T4B0V7');

		expect(OptionalPostalCode.safeParse('T4B0v7').success).true;
		expect(OptionalPostalCode.parse('T4B0v7')).to.equal('T4B0V7');
	});

	it('Must contain characters in the correct order', () => {
		expect(OptionalPostalCode.safeParse('T4B0V7').success).true;
		expect(OptionalPostalCode.safeParse('T4B07V').success).false;
		expect(OptionalPostalCode.safeParse('4B7O7V').success).false;
		expect(OptionalPostalCode.safeParse('ABC123').success).false;
	});
});

describe('EmptyOrOptionalPostalCode', () => {
	it('Can be 6 characters long and in postal code format', () => {
		expect(EmptyOrOptionalPostalCode.safeParse('T4B0V7').success).true;
		expect(EmptyOrOptionalPostalCode.safeParse('TBV407').success).false;
	});

	it('Can be undefined', () => {
		expect(EmptyOrOptionalPostalCode.safeParse(undefined).success).true;
	});

	it('Can be an empty string', () => {
		expect(EmptyOrOptionalPostalCode.safeParse('').success).true;
	});

	it('Can be a string containing only whitespace', () => {
		expect(EmptyOrOptionalPostalCode.safeParse(' ').success).true;
	});

	it('Cannot be null', () => {
		expect(EmptyOrOptionalPostalCode.safeParse(null).success).false;
	});

	it('Can have 6 characters in postal code format, and whitespace', () => {
		expect(EmptyOrOptionalPostalCode.safeParse('T4B0V7 ').success).true;
	});

	it('Can only contain letters and numbers', () => {
		expect(EmptyOrOptionalPostalCode.safeParse('T4B 0V').success).false;
		expect(EmptyOrOptionalPostalCode.safeParse('T4B-0V').success).false;
	});

	it('Can contain lowercase letters and transforms all letters to uppercase', () => {
		expect(EmptyOrOptionalPostalCode.safeParse('t4b0v7').success).true;
		expect(EmptyOrOptionalPostalCode.parse('t4b0v7')).to.equal('T4B0V7');

		expect(EmptyOrOptionalPostalCode.safeParse('T4B0v7').success).true;
		expect(EmptyOrOptionalPostalCode.parse('T4B0v7')).to.equal('T4B0V7');
	});

	it('Must contain characters in the correct order', () => {
		expect(EmptyOrOptionalPostalCode.safeParse('T4B0V7').success).true;
		expect(EmptyOrOptionalPostalCode.safeParse('T4B07V').success).false;
		expect(EmptyOrOptionalPostalCode.safeParse('4B7O7V').success).false;
		expect(EmptyOrOptionalPostalCode.safeParse('ABC123').success).false;
	});
});
