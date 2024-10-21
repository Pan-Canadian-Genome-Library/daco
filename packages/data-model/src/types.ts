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

export type PersonalInfo = {
	userId: string;
	title: string;
	first: string;
	middle: string;
	last: string;
	suffix: string;
	primaryAffiliation: string;
	institutionalEmail: string;
	researcherProfileURL: string;
	positionTitle: string;
};

export interface Applicant extends PersonalInfo {
	applicationID: string;
}

export interface Collaborator extends Applicant {
	collaboratorType: string;
}

export type Institution = {
	country: string;
	streetAddress: string;
	building?: string;
	suite?: string;
	city: string;
	province: string;
	postalCode: string;
};

export type Project = {
	title: string;
	website: string;
	background: string;
	methodology: string;
	summary: string;
	relevantPublications: string;
};

export type Revisions = {
	createdAt: Date;
	createdBy: 'string';
	version: number;
	changes: {}[];
};

export enum Status {
	'DRAFT',
	'INSTITUTIONAL_REP_REVIEW',
	'DAC_REVIEW',
	'DAC_REVISIONS_REQUESTED',
	'REJECTED',
	'APPROVED',
	'CLOSED',
	'REVOKED',
}

export enum file_type {
	'SIGNED_APPLICATION',
	'ETHICS_LETTER',
}

export type Application = {
	status: keyof typeof Status;
	applicant: Applicant;
	institution: Institution;

	institutional_representative: {
		applicant: Applicant;
		institution: Institution;
	};

	collaborators: Collaborator[];

	projectInformation: Project;

	requestedStudies: {
		studyIds: string[];
	};

	ethics: {
		accepted: boolean;
		ethicsLetter?: File;
	};

	files: File[];

	dataAccessAgreement: {
		agreements: boolean;
	};

	appendices: {
		agreements: { name: string; agreement: boolean }[];
	};

	signatures: File[];

	revisions: Revisions[];
};

// enum application_review_outcome {
//   approved
//   rejected
//   revisions_requested
// }

// enum application_action {
//   create
//   withdraw
//   close
//   request_institutional_rep
//   institutional_rep_approve
//   institutional_rep_reject
//   dac_review_approve
//   dac_review_reject
//   dac_review_revisions
//   revoke
// }

// Table applications {
//   id bigint [pk, increment]

//   user_id varchar(100) [not null] // User ID set to a string since we don't have details atm about how this will be communicated. This will either be email address or a unique token from the auth system

//   state application_state [not null]

//   created_at timestamp [not null]

//   approved_at timestamp
//   expires_at timestamp
// }

// Table application_contents {
//   Note: '''
//     All fields here are nullable as this allows us to store partially complete
//     applications as the user is working through the submission form.

//     Validation rules for the application content needs to be implemented in the
//     software, not at the database level.
//   '''

//   application_id bigint [not null, ref: - applications.id]

// 	created_at timestamp [not null]
// 	updated_at timestamp [not null]

//   applicant_first_name varchar(255)
//   applicant_middle_name varchar(255)
//   applicant_last_name varchar(255)
//   applicant_title varchar(255)
//   applicant_suffix varchar(255)
//   applicant_position_title varchar(255)

//   applicant_primary_affiliation varchar(500)
//   applicant_institutional_email varchar(320) // emails addresses cannot be longer than 320

//   applicant_profile_url text // no length restriciton on url, application should validate its properly formed url

// 	institutional_rep_title varchar(255)
// 	institutional_rep_first_name varchar(255)
//   institutional_rep_middle_name varchar(255)
//   institutional_rep_last_name varchar(255)
//   institutional_rep_suffix varchar(255)
// 	institutional_rep_primary_affiliation varchar(255)
// 	institutional_rep_email varchar(255)
// 	institutional_rep_profile_url varchar(255)
// 	institutional_rep_position_title varchar(255)

//   institution_country vachar(255)
//   institution_state vachar(255)
//   institution_city vachar(255)
//   institution_street_address text
//   institution_postal_code varchar(255) // postal codes globally may be longer, might as well not constrain it
//   institution_building varchar(255)

//   project_title text
//   project_website text
//   project_abstract text
//   project_methodology text
//   project_summary text
//   project_publication_urls text[]

//TODO: requested study information
// requested_studies text[]

// TODO: need to store user agreement to terms

// 	ethics_review_required boolean
//   ethics_letter bigint [ref: - files.id]

// 	dac_agreement_software_updates boolean [Note: "You will keep all computer systems on which PCGL Controlled Datea reside, or which provide accesss to such data, up-to-date with respect to software patches and antivirus file definitions (if applicable)."]
// 	dac_agreement_non_disclosure boolean [Note: "You will protect ICGC Controlled Data against disclosure to and use by unauthorized individuals."]
// 	dac_agreement_monitor_individual_access boolean [Note: "You will monitor and control which individuals have access to ICGC controlled Data."]
// 	dac_agreement_destroy_data boolean [Note: "You will securely destroy all copies of ICGC Controlled Data in accordance with the terms and conditions of the Data Access Agreement."]
// 	dac_agreement_familiarize_restrictions boolean [Note: "You will familiarixe all individuals who have access to ICGC Controlled Data with the restrictions on its use."]
// 	dac_agreement_provide_it_policy boolean [Note: "You agree to swiftly provide a copy of both your institutional and Research Project related IT policy documents upon request from a DACO representative."]
// 	dac_agreement_notify_unauthorized_access boolean [Note: "You will notify the DACO immediately if you become aware or suspect that someone has gained unauthorized access to the ICGC Controlled Data."]
// 	dac_agreement_certify_application boolean [Note: "You certify that the contents in the application are ture and correct to the best of your knowledge and belief."]
// 	dac_agreement_read_and_agreed boolean [Note: "You have read and agree to abide by the terms and conditions outlined in the Data Access Agreement."]

//   signed_pdf bigint [ref: -files.id]
// }

// Table application_actions {
//   id bigint [pk, increment]

//   application_id bigint [not null, ref: <> applications.id]

//   created_at timestamp [not null]

//   user_id varchar(100) [not null]

//   action application_action [not null]
//   state_before varchar(255) [not null]
//   state_after varchar(255) [not null]

//   revisions_request_id bigint [ref: - revision_requests.id]

//   // TODO: may need reference to a content diff
// }

// Table revision_requests {
//   id bigint [pk, increment]
//   application_id bigint [not null, ref: <> applications.id]

//   created_at timestamp [not null]

//   comments text

//   applicant_approved boolean [not null]
//   applicant_notes text

//   institution_rep_approved boolean [not null]
//   institution_rep_notes text

//   collaborators_approved boolean [not null]
//   collaborators_notes text

//   project_approved boolean [not null]
//   project_notes text

//   requested_studies_approved boolean [not null]
//   requested_studies_notes text
// }

// TODO: Might need to track user agreements separate from the application content, This could model this
// Table agreements {
//   id bigint [not null]
//   user_id varchar(100) [not null]
//   name text [not null]
//   agreement_text text [not null]

//   agreement_type agreement_type [not null] // enum, need to review possible agreements needed
//   agreed_at timestamp [not null] // with timezone, seconds precision = 0
// }

// Table collaborators {
//   id bigint [pk, increment]
//   application_id bigint [ref: - applications.id]

//   first_name varchar(255) [not null]
//   middle_name varchar(255)
//   last_name varchar(255) [not null]
//   title varchar(255)
//   suffix varchar(255)
//   position_title varchar(255) [not null]
//   institutional_email varchar(320) [not null]
//   profile_url text

//   // TODO: need email? how do we connect this
// }

// Table files {
//   id bigint [pk, increment]

//   application_id bigint [not null, ref: <> applications.id]

//   type file_type [not null]

//   submitter_user_id varchar(100) [not null]
//   submitted_at timestamp [not null]

//   content bytea [not null]
//   filename varchar(255)

// }
