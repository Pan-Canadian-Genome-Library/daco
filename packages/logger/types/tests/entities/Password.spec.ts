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

import { Password } from '../../src/entities/index.js';

describe('Password', () => {

	describe('Regex pattern matches', () => {

		it('Validates if containing at least one lowercase, one uppercase letter, and meets length requirements', () => {
			expect(Password.safeParse('lDpFymuoDGzPMMKhIuSa').success).true;
			expect(Password.safeParse('ulFITAmbMqanHhBOQrnyDkXyfxBZcZETZGOhfgGkvfaYoqVs').success).true;
			expect(Password.safeParse('EvhNLaYFBEMrsCUyMKyVWCSvraMlSPQqXTFUTWeVJwKlgdHB').success).true;
			expect(Password.safeParse('iWvjfs4uM4kyyFvcSGR').success).true;
			expect(Password.safeParse('FOOOOOOO barrr').success).true;
			expect(Password.safeParse('baaaaaaAcccccc').success).true;
		});

		it('Validates if it is exactly the minimum length', () => {
			expect(Password.safeParse('PUoJFmWlfyyX').success).true;
		});

		it('Validates if it is exactly the maximum length', () => {
			expect(Password.safeParse('wfinaWIBxHumkRGomtLgqWvauHxIiiGFtSDUPgUgvzdtjULquHxIiiGFtSDUPgUg').success).true;
		});

		it('Does not validate if missing at least one lowercase letter', () => {
			expect(Password.safeParse('LDFTTYODGPMMK').success).false;
			expect(Password.safeParse('LDFTTYO999432543').success).false;
			expect(Password.safeParse('9546985646HHHHN').success).false;
		});

		it('Does not validate if missing at least one uppercase letter', () => {
			expect(Password.safeParse('nnozbkflvkcggiuplmrcr').success).false;
			expect(Password.safeParse('l8ssl2if347o2quz2hr99').success).false;
			expect(Password.safeParse('5fm380f5jxbc4uew4retbmg9neqs8w4gdpubc3ywmzuoyf').success).false;
		});
		it('Validates if it contains numbers', () => {
			expect(Password.safeParse('lhmOe6l85Pw26HjBQ1HfO').success).true;
			expect(Password.safeParse('iWvjfs4uM4kyyFvcSG78').success).true;
			expect(Password.safeParse('45lFITAmbMqanHhBOQrnyDkXyfxBZcZETZGOhfgGkvfaYVs').success).true;
		});
		it('Does not validate if it contains only numbers', () => {
			expect(Password.safeParse('4369436894356897654').success).false;
			expect(Password.safeParse('54354223432').success).false;
		});
		it('Does not validate if it contains only special characters', () => {
			expect(Password.safeParse('$^@#%$^$%^^@#%$').success).false;
			expect(Password.safeParse('$$$$$$$$$$$$$').success).false
		})

		it('Validates if it contains a special character', () => {
			expect(Password.safeParse('LDpFymuoDGzPMMKhIuS@').success).true;
			expect(Password.safeParse('LDpFymuoDGzPM*KhIuS@').success).true;
			expect(Password.safeParse('LDpFymuoDGz.&!hIuS').success).true;
		});

		it('Validates if it contains whitespace', () => {
			expect(Password.safeParse('lhmOe6l85Pw2 jBQ1HfO').success).true;
			expect(Password.safeParse('lhm    Oe6l85Pw26H jBQ1HfO').success).true;
			expect(Password.safeParse('lhmOe6l85Pw26HjBQ1HfO  ').success).true;
			expect(Password.safeParse('  lhmOe6l85Pw26HjBQ1HfO').success).true;
		});

		it('Does not validate if it has more than the max length of characters', () => {
			expect(Password.safeParse('wfinaWIBxHumkRGomtLgqWvauHxIiiGFtSDUPgUgvzdtjULquHxIiiGFtSDUPgUgvzdtjULq').success).false;
			expect(Password.safeParse('3kK4aFH9gHP6KItfFPm40exzfH6Ne6UKMXv8cLsKn1VqU8Cjm9sdgjkdfgh33wfinaWIBxHumkRGomtLgqWvauHxIiiGFtSDUPgUgvzdtjULquHxIiiG').success).false;
		});

		it('Does not validate if it has less than the min length of characters', () => {
			expect(Password.safeParse('uiQeV6xABoc').success).false;
			expect(Password.safeParse('fGee').success).false;
		});

		it('Does not validate if it is an empty string', () => {
			expect(Password.safeParse('').success).false;
			expect(Password.safeParse('  ').success).false;
		});

		it('Does not validate if it is undefined', () => {
			expect(Password.safeParse(undefined).success).false;
		});

	});

});
