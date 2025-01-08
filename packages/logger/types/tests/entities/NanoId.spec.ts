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

import { describe, expect, it } from 'vitest';

import { NanoId, OptionalNanoId } from '../../src/entities/fields/index.js';

describe('NanoId', () => {
	it('Must be a string containing 21 alphanumeric characters', () => {
		expect(NanoId.safeParse('YNrYyf9a739F9VxeMB8G8').success).true;
	});

	it('Cannot be more than 21 characters', () => {
		expect(NanoId.safeParse('VcEL9afAcEg2z8Aqh6MfQ5fb7').success).false;
	});

	it('Cannot be less than 21 characters', () => {
		expect(NanoId.safeParse('F2rDTcUTaqFNFic').success).false;
	});

	it('Cannot contain symbols', () => {
		expect(NanoId.safeParse('EeyGrbmXyty9egJeW_nJx').success).false;
		expect(NanoId.safeParse('yEjfm_j-Eq9gkdXLna3yw').success).false;
	});

	it('Cannot be a string containing 21 alphanumeric characters and whitespace', () => {
		expect(NanoId.safeParse('YNrYyf9a739F9VxeMB8G8  ').success).false;
	});

	it('Cannot be undefined', () => {
		expect(NanoId.safeParse(undefined).success).false;
	});

	it('Cannot be an empty string', () => {
		expect(NanoId.safeParse('').success).false;
	});

	it('Cannot be null', () => {
		expect(NanoId.safeParse(null).success).false;
	});

	it('Cannot contain only whitespace', () => {
		expect(NanoId.safeParse(' ').success).false;
	});
});

describe('OptionalNanoId', () => {
	it('Can be a string containing 21 alphanumeric characters', () => {
		expect(OptionalNanoId.safeParse('YNrYyf9a739F9VxeMB8G8').success).true;
	});

	it('Cannot be more than 21 characters', () => {
		expect(OptionalNanoId.safeParse('VcEL9afAcEg2z8Aqh6MfQ5fb7').success).false;
	});

	it('Cannot be less than 21 characters', () => {
		expect(OptionalNanoId.safeParse('F2rDTcUTaqFNFic').success).false;
	});

	it('Cannot contain symbols', () => {
		expect(OptionalNanoId.safeParse('EeyGrbmXyty9egJeW_nJx').success).false;
		expect(OptionalNanoId.safeParse('yEjfm_j-Eq9gkdXLna3yw').success).false;
	});

	it('Cannot be a string containing 21 alphanumeric characters and whitespace', () => {
		expect(NanoId.safeParse('YNrYyf9a739F9VxeMB8G8  ').success).false;
	});

	it('Can be undefined', () => {
		expect(OptionalNanoId.safeParse(undefined).success).true;
	});

	it('Cannot be an empty string', () => {
		expect(OptionalNanoId.safeParse('').success).false;
	});

	it('Cannot be null', () => {
		expect(OptionalNanoId.safeParse(null).success).false;
	});

	it('Cannot contain only whitespace', () => {
		expect(OptionalNanoId.safeParse(' ').success).false;
	});
});
