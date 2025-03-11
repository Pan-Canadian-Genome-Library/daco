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

import { type ApplicationContentUpdates, type JoinedApplicationRecord } from '@/service/types.js';
import { type ApplicationContentsResponse, type ApplicationResponseData } from '@pcgl-daco/data-model/src/types.js';
import { type UpdateEditApplicationRequest } from '@pcgl-daco/validation';
import lodash from 'lodash';

const filterOmittedKeys = (key: string, omittedKeys: string[]) => !(omittedKeys.includes(key) || key === 'id');

export const aliasToResponseData = <
	DatabaseRecord extends Record<string, any>,
	ResponseRecord extends Record<string, any>,
>(
	data: DatabaseRecord,
	omittedKeys: string[] = [],
): ResponseRecord => {
	type snakeCaseKey = string & keyof DatabaseRecord;
	const allKeys = Object.keys(data).map((key): snakeCaseKey => key);

	const filteredKeys = allKeys.filter((key) => {
		return filterOmittedKeys(String(key), omittedKeys);
	});

	const responseData = filteredKeys.reduce((acc, key) => {
		const aliasedKey = lodash.camelCase(key);
		const value = data[key];
		const accumulator = { ...acc, [aliasedKey]: value };
		return accumulator;
	}, {}) as ResponseRecord;

	return responseData;
};

export const aliasToDatabaseData = <
	ResponseRecord extends Record<string, any>,
	DatabaseRecord extends Record<string, any>,
>(
	data: ResponseRecord,
	omittedKeys: string[] = [],
): DatabaseRecord => {
	type camelCaseKey = string & keyof ResponseRecord;
	const allKeys = Object.keys(data).map((key): camelCaseKey => key);

	const filteredKeys = allKeys.filter((key) => {
		return filterOmittedKeys(String(key), omittedKeys);
	});

	const databaseData = filteredKeys.reduce((acc, key) => {
		const aliasedKey = lodash.snakeCase(key);
		const value = data[key];
		const accumulator = { ...acc, [aliasedKey]: value };
		return accumulator;
	}, {}) as DatabaseRecord;

	return databaseData;
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

	const omittedKeys = [
		'id',
		'applicant_signature',
		'applicant_signed_at',
		'institutional_rep_signature',
		'institutional_rep_signed_at',
		'ethics_review_required',
		'ethics_letter',
		'signed_pdf',
	];
	const contents = applicationContents
		? aliasToResponseData<ApplicationContentUpdates, ApplicationContentsResponse>(applicationContents, omittedKeys)
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

/**
 * Helper function to convert Postgres snake_case to FE camelCase for applicationContents
 * @param data type UpdateEditApplicationRequest application contents in camelCase
 * @returns  type ApplicationContentUpdates in snake_case
 */
export const aliasApplicationContentsRecord = (update: UpdateEditApplicationRequest): ApplicationContentUpdates => {
	const formatedUpdate: ApplicationContentUpdates = {
		applicant_first_name: update.applicantFirstName,
		applicant_middle_name: update.applicantMiddleName,
		applicant_last_name: update.applicantLastName,
		applicant_institutional_email: update.applicantInstitutionalEmail,
		applicant_position_title: update.applicantPositionTitle,
		applicant_primary_affiliation: update.applicantPrimaryAffiliation,
		applicant_profile_url: update.applicantProfileUrl,
		applicant_suffix: update.applicantSuffix,
		applicant_title: update.applicantTitle,
		institutional_rep_first_name: update.institutionalRepFirstName,
		institutional_rep_middle_name: update.institutionalRepMiddleName,
		institutional_rep_last_name: update.institutionalRepLastName,
		institutional_rep_title: update.institutionalRepTitle,
		institutional_rep_position_title: update.institutionalRepPositionTitle,
		institutional_rep_suffix: update.institutionalRepSuffix,
		institutional_rep_email: update.institutionalRepEmail,
		institutional_rep_primary_affiliation: update.institutionalRepPrimaryAffiliation,
		institutional_rep_profile_url: update.institutionalRepProfileUrl,
		institution_building: update.institutionBuilding,
		institution_city: update.institutionCity,
		institution_country: update.institutionCountry,
		institution_postal_code: update.institutionPostalCode,
		institution_state: update.institutionState,
		institution_street_address: update.institutionStreetAddress,
		project_aims: update.projectAims,
		project_methodology: update.projectMethodology,
		project_summary: update.projectSummary,
		project_title: update.projectTitle,
		project_website: update.projectWebsite,
	};

	return formatedUpdate;
};
