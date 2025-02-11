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

import { type JoinedApplicationRecord } from '@/service/types.js';
import { type ApplicationContentsResponse, type ApplicationResponseData } from '@pcgl-daco/data-model/src/types.js';

/**
 * Helper function to determine if value is a valid number and is positive.
 * @param num Any integer value
 * @returns True if the value is a valid number and is positive, false otherwise.
 */
export const isPositiveNumber = (num: number) => {
	if (Number.isNaN(num) === false && num >= 0) {
		return true;
	}
	return false;
};

/**
 * Helper function to convert Postgres snake_case to FE camelCase
 * @param data Database Application Record
 * @returns ApplicationResponseData - Application record with updated keys
 */
export const aliasApplicationRecord = (data: JoinedApplicationRecord): ApplicationResponseData => {
	const {
		id,
		user_id: userId,
		state,
		created_at: createdAt,
		approved_at: approvedAt,
		updated_at: updatedAt,
		expires_at: expiresAt,
		contents: applicationContents,
	} = data;

	const contents: ApplicationContentsResponse | null = applicationContents
		? {
				applicationId: applicationContents.application_id,
				createdAt: applicationContents.created_at,
				updatedAt: applicationContents.updated_at,
				applicantFirstName: applicationContents.applicant_first_name,
				applicantLastName: applicationContents.applicant_last_name,
				applicantMiddleName: applicationContents.applicant_middle_name,
				applicantTitle: applicationContents.applicant_title,
				applicantSuffix: applicationContents.applicant_suffix,
				applicantPositionTitle: applicationContents.applicant_position_title,
				applicantPrimaryAffiliation: applicationContents.applicant_primary_affiliation,
				applicantInstitutionalEmail: applicationContents.applicant_institutional_email,
				applicantProfileUrl: applicationContents.applicant_profile_url,
				institutionalRepTitle: applicationContents.institutional_rep_title,
				institutionalRepFirstName: applicationContents.institutional_rep_first_name,
				institutionalRepMiddleName: applicationContents.institutional_rep_middle_name,
				institutionalRepLastName: applicationContents.institutional_rep_last_name,
				institutionalRepSuffix: applicationContents.institutional_rep_suffix,
				institutionalRepPrimaryAffiliation: applicationContents.institutional_rep_primary_affiliation,
				institutionalRepEmail: applicationContents.institutional_rep_email,
				institutionalRepProfileUrl: applicationContents.institutional_rep_profile_url,
				institutionalRepPositionTitle: applicationContents.institutional_rep_position_title,
				institutionCountry: applicationContents.institution_country,
				institutionState: applicationContents.institution_state,
				institutionCity: applicationContents.institution_city,
				institutionStreetAddress: applicationContents.institution_street_address,
				institutionPostalCode: applicationContents.institution_postal_code,
				institutionBuilding: applicationContents.institution_building,
				projectTitle: applicationContents.project_title,
				projectWebsite: applicationContents.project_website,
				projectBackground: applicationContents.project_background,
				projectMethodology: applicationContents.project_methodology,
				projectAims: applicationContents.project_aims,
				projectSummary: applicationContents.project_summary,
				projectPublicationUrls: applicationContents.project_publication_urls,
				requestedStudies: applicationContents.requested_studies,
			}
		: null;

	return {
		id,
		userId,
		state,
		createdAt,
		approvedAt,
		updatedAt,
		expiresAt,
		contents,
	};
};
