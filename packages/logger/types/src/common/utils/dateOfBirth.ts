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

import dayjs from 'dayjs';
import { z } from 'zod';

import { RegisterRequestAgeCheck } from '../../entities/Register.js';
import { addZodCustomError } from './zodUtils.js';

export const MINIMUM_AGE_IN_YEARS = 18;
/**
 * Check if age is at least MINIMUM_AGE_IN_YEARS
 * @param comparisonDate: date to compare the dateOfBirth to
 * @returns {boolean} returns true if age is greater than or equal to MINIMUM_AGE_IN_YEARS
 */
export const checkIsMinimumAgeOrGreater = (comparisonDate: Date, dateOfBirth: Date): boolean => {
	const comparision = dayjs(comparisonDate);
	const birthdate = dayjs(dateOfBirth);
	const age = comparision.diff(birthdate, 'year');
	return age >= MINIMUM_AGE_IN_YEARS;
};

/**
 * Check if user has the minimum required age for registration, or has been invited.
 * Adds a custom error to the date of birth field if user is below minimum age and
 * isn't registering from a clinician invite.
 * @param props RegisterRequestAgeCheck
 * @param ctx Zod refinement context
 * @param comparisonDate date to compare date of birth to
 * @returns void
 */
export const hasMinimumAgeForRegistration = (
	props: RegisterRequestAgeCheck,
	ctx: z.RefinementCtx,
	comparisonDate: Date,
): void => {
	const { dateOfBirth, isInvited } = props;
	if (!(isInvited || checkIsMinimumAgeOrGreater(comparisonDate, dateOfBirth))) {
		addZodCustomError(ctx, 'dateOfBirth', 'participantLessThanMinimumAge');
	}
};

/**
 * Returns the date in ISO 8601 format (`YYYY-MM-DD` in UTC).
 * @param {date} date - Date
 * @returns {string} ISO 8601 Date string, ex. 2024-11-15
 */
export const getISODate = (date?: Date): string => {
	if (!date) return '';
	// Date.toISOString() returns a UTC date string in the format "YYYY-MM-DDTHH:mm:ss.sssZ"
	// We only want the "YYYY-MM-DD" date, so we split the string at the 'T' character and take the first part
	return date.toISOString().split('T')[0] || '';
};
