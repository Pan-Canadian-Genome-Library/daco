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

import {
	type ApplicationContentUpdates,
	type ApplicationSignatureUpdate,
	type CollaboratorRecord,
	type JoinedApplicationRecord,
} from '@/service/types.js';
import {
	type ApplicationContentsResponse,
	type ApplicationResponseData,
	type CollaboratorsResponseDTO,
	type SignatureDTO,
} from '@pcgl-daco/data-model';
import { type UpdateEditApplicationRequest } from '@pcgl-daco/validation';

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
				// Applicant information
				applicantFirstName: applicationContents.applicant_first_name,
				applicantLastName: applicationContents.applicant_last_name,
				applicantMiddleName: applicationContents.applicant_middle_name,
				applicantTitle: applicationContents.applicant_title,
				applicantSuffix: applicationContents.applicant_suffix,
				applicantPositionTitle: applicationContents.applicant_position_title,
				applicantPrimaryAffiliation: applicationContents.applicant_primary_affiliation,
				applicantInstitutionalEmail: applicationContents.applicant_institutional_email,
				applicantProfileUrl: applicationContents.applicant_profile_url,
				applicantInstituteCountry: applicationContents.applicant_institution_country,
				applicantInstituteState: applicationContents.applicant_institution_state,
				applicantInstituteCity: applicationContents.applicant_institution_city,
				applicantInstitutePostalCode: applicationContents.applicant_institution_postal_code,
				applicantInstituteStreetAddress: applicationContents.applicant_institution_street_address,
				applicantInstituteBuilding: applicationContents.applicant_institution_building,
				//Institutional Representative
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
				// Project
				projectTitle: applicationContents.project_title,
				projectWebsite: applicationContents.project_website,
				projectBackground: applicationContents.project_background,
				projectMethodology: applicationContents.project_methodology,
				projectAims: applicationContents.project_aims,
				projectSummary: applicationContents.project_summary,
				projectPublicationUrls: applicationContents.project_publication_urls,
				requestedStudies: applicationContents.requested_studies,
				ethicsReviewRequired: applicationContents.ethics_review_required,
				ethicsLetter: applicationContents.ethics_letter,
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

/**
 * Helper function to convert FE camelCase to snake_case for applicationContents
 * @param data type UpdateEditApplicationRequest application contents in camelCase
 * @returns  type ApplicationContentUpdates in snake_case
 */
export const aliasApplicationContentsRecord = (update: UpdateEditApplicationRequest): ApplicationContentUpdates => {
	const formattedUpdate: ApplicationContentUpdates = {
		// Applicant
		applicant_first_name: update.applicantFirstName,
		applicant_middle_name: update.applicantMiddleName,
		applicant_last_name: update.applicantLastName,
		applicant_institutional_email: update.applicantInstitutionalEmail,
		applicant_position_title: update.applicantPositionTitle,
		applicant_primary_affiliation: update.applicantPrimaryAffiliation,
		applicant_profile_url: update.applicantProfileUrl,
		applicant_suffix: update.applicantSuffix,
		applicant_title: update.applicantTitle,
		applicant_institution_country: update.applicantInstituteCountry,
		applicant_institution_state: update.applicantInstituteState,
		applicant_institution_city: update.applicantInstituteCity,
		applicant_institution_postal_code: update.applicantInstitutePostalCode,
		applicant_institution_street_address: update.applicantInstituteStreetAddress,
		applicant_institution_building: update.applicantInstituteBuilding,
		// Institutional
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
		// Project
		project_aims: update.projectAims,
		project_methodology: update.projectMethodology,
		project_background: update.projectBackground,
		project_summary: update.projectSummary,
		project_title: update.projectTitle,
		project_website: update.projectWebsite,
		project_publication_urls: update.projectPublicationUrls,
		ethics_review_required: update.ethicsReviewRequired,
	};

	return formattedUpdate;
};

/**
 * Helper function to convert Postgres snake_case to FE camelCase for the Signature Service
 * @param data type `ApplicationSignatureUpdate` - Signature fields + application_id from the DB
 * @returns type `SignatureDTO` - camelCase variation of a Postgress success response.
 */
export const aliasSignatureRecord = (data: ApplicationSignatureUpdate): SignatureDTO => {
	const {
		application_id,
		applicant_signature,
		applicant_signed_at,
		institutional_rep_signature,
		institutional_rep_signed_at,
	} = data;

	return {
		applicationId: application_id,
		applicantSignature: applicant_signature,
		applicantSignedAt: applicant_signed_at,
		institutionalRepSignature: institutional_rep_signature,
		institutionalRepSignedAt: institutional_rep_signed_at,
	};
};

/**
 * Helper function to convert Postgres snake_case to FE camelCase for CollaboratorRecord
 * @param data type CollaboratorRecord in snake_case
 * @returns  type CollaboratorsResponseDTO in camelcase
 */

export const aliasCollaboratorRecord = (data: CollaboratorRecord): CollaboratorsResponseDTO => {
	return {
		id: data.id,
		applicationId: data.application_id,
		collaboratorFirstName: data.first_name,
		collaboratorMiddleName: data.middle_name,
		collaboratorLastName: data.last_name,
		collaboratorInstitutionalEmail: data.institutional_email,
		collaboratorPositionTitle: data.position_title,
		collaboratorPrimaryAffiliation: data.title,
		collaboratorResearcherProfileURL: data.profile_url,
		collaboratorSuffix: data.suffix,
		collaboratorType: data.collaborator_type,
	};
};

export const aliasCollaboratorRecords = (data: CollaboratorRecord[]): CollaboratorsResponseDTO[] =>
	data.map(aliasCollaboratorRecord);
