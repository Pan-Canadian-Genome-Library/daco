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
import {
	Concise200WordCountString,
	Concise250WordCountString,
	EmptyOrOptionalString,
	NonEmptyString,
	OptionalURLString,
} from '../common/strings.js';
import { ONLY_ALPHANUMERIC } from '../utils/regex.js';

export type EditApplicationRequest = z.infer<typeof editApplicationRequestSchema>;
export const editApplicationRequestSchema = z.object({
	id: z.number().nonnegative(),
	update: z
		.object({
			applicant_first_name: NonEmptyString,
			applicant_middle_name: EmptyOrOptionalString,
			applicant_last_name: NonEmptyString,
			applicant_title: NonEmptyString,
			applicant_suffix: EmptyOrOptionalString,
			applicant_position_title: NonEmptyString,
			applicant_primary_affiliation: NonEmptyString,
			applicant_institutional_email: NonEmptyString.email(),
			applicant_profile_url: NonEmptyString.url(),
			institutional_rep_title: NonEmptyString,
			institutional_rep_first_name: NonEmptyString,
			institutional_rep_middle_name: EmptyOrOptionalString,
			institutional_rep_last_name: NonEmptyString,
			institutional_rep_suffix: EmptyOrOptionalString,
			institutional_rep_primary_affiliation: NonEmptyString,
			institutional_rep_email: NonEmptyString.email(),
			institutional_rep_profile_url: NonEmptyString.url(),
			institutional_rep_position_title: NonEmptyString,
			institution_country: NonEmptyString,
			institution_state: NonEmptyString,
			institution_city: NonEmptyString,
			institution_street_address: NonEmptyString,
			institution_postal_code: NonEmptyString.regex(ONLY_ALPHANUMERIC),
			institution_building: NonEmptyString,
			project_title: NonEmptyString,
			project_website: OptionalURLString,
			project_abstract: Concise200WordCountString,
			project_methodology: Concise200WordCountString,
			project_summary: Concise250WordCountString,
		})
		.partial()
		.strict()
		.refine((updateObj) => Object.keys(updateObj).length !== 0, {
			params: { violation: 'noEmptyObject' },
		}),
});
