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

import { checkIsMinimumAgeOrGreater, getISODate, MINIMUM_AGE_IN_YEARS } from '../../src/common/utils/index.js';

export const setupDateOfBirthTest = () => {
	const mockDate = new Date('02/28/2024');
	const month = mockDate.getMonth() + 1;
	const day = mockDate.getDate();
	const year = mockDate.getFullYear();

	const monthDay = `${month}/${day}/`;
	const exactlyMinimumAgeDateOfBirth = getISODate(new Date(`${monthDay}${year - MINIMUM_AGE_IN_YEARS}`));
	const olderThanMinimumAgeDateOfBirth = getISODate(
		new Date(`${monthDay}${year - Math.floor(MINIMUM_AGE_IN_YEARS * 1.5)}`),
	);
	const lessThanMinimumAgeDateOfBirth = getISODate(
		new Date(`${monthDay}${year - Math.ceil(MINIMUM_AGE_IN_YEARS / 2)}`),
	);
	const futureDateOfBirth = getISODate(new Date(`${monthDay}${year + MINIMUM_AGE_IN_YEARS}`));

	return {
		exactlyMinimumAgeDateOfBirth,
		futureDateOfBirth,
		lessThanMinimumAgeDateOfBirth,
		mockDate,
		olderThanMinimumAgeDateOfBirth,
	};
};

describe('Date of Birth', () => {
	const {
		exactlyMinimumAgeDateOfBirth,
		futureDateOfBirth,
		lessThanMinimumAgeDateOfBirth,
		mockDate,
		olderThanMinimumAgeDateOfBirth,
	} = setupDateOfBirthTest();

	it("must return true if user's age is greater than or equal to the minimum", () => {
		expect(checkIsMinimumAgeOrGreater(mockDate, new Date(olderThanMinimumAgeDateOfBirth))).true;
		expect(checkIsMinimumAgeOrGreater(mockDate, new Date(exactlyMinimumAgeDateOfBirth))).true;
	});

	it("must return false if user's age is less than the minimum", () => {
		expect(checkIsMinimumAgeOrGreater(mockDate, mockDate)).false;
		expect(checkIsMinimumAgeOrGreater(mockDate, new Date(lessThanMinimumAgeDateOfBirth))).false;
		expect(checkIsMinimumAgeOrGreater(mockDate, new Date(futureDateOfBirth))).false;
	});
});
