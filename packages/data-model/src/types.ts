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

// Constants

export const ApplicationStates = {
	DRAFT: 'DRAFT',
	INSTITUTIONAL_REP_REVIEW: 'INSTITUTIONAL_REP_REVIEW',
	INSTITUTIONAL_REP_REVISION_REQUESTED: 'INSTITUTIONAL_REP_REVISION_REQUESTED',
	DAC_REVIEW: 'DAC_REVIEW',
	DAC_REVISIONS_REQUESTED: 'DAC_REVISIONS_REQUESTED',
	REJECTED: 'REJECTED',
	APPROVED: 'APPROVED',
	CLOSED: 'CLOSED',
	REVOKED: 'REVOKED',
} as const;

export type ApplicationStateValues = (typeof ApplicationStates)[keyof typeof ApplicationStates];

export const FileTypes = {
	SIGNED_APPLICATION: 'SIGNED_APPLICATION',
	ETHICS_LETTER: 'ETHICS_LETTER',
} as const;

export type FileType = (typeof FileTypes)[keyof typeof FileTypes];

export const FileExtensionTypes = {
	PDF: 'application/pdf',
};

export type FileExtensionType = (typeof FileExtensionTypes)[keyof typeof FileExtensionTypes];

export const SignatureTypes = {
	APPLICANT: 'APPLICANT',
	INSTITUTIONAL_REP: 'INSTITUTIONAL_REP',
} as const;

export type SignatureType = (typeof SignatureTypes)[keyof typeof SignatureTypes];

export enum ApplicationReviewOutcomes {
	'APPROVED',
	'REJECTED',
	'REVISIONS_REQUESTED',
}

export const ApplicationActions = {
	CLOSE: 'CLOSE',
	INSTITUTIONAL_REP_REVISION_REQUEST: 'INSTITUTIONAL_REP_REVISION_REQUEST',
	INSTITUTIONAL_REP_SUBMIT: 'INSTITUTIONAL_REP_SUBMIT',
	INSTITUTIONAL_REP_APPROVED: 'INSTITUTIONAL_REP_APPROVED',
	DAC_REVIEW_APPROVED: 'DAC_REVIEW_APPROVED',
	DAC_REVIEW_SUBMIT: 'DAC_REVIEW_SUBMIT',
	DAC_REVIEW_REJECTED: 'DAC_REVIEW_REJECTED',
	DAC_REVIEW_REVISION_REQUEST: 'DAC_REVIEW_REVISION_REQUEST',
	REVOKE: 'REVOKE',
	SUBMIT_DRAFT: 'SUBMIT_DRAFT',
	WITHDRAW: 'WITHDRAW',
} as const;

export type ApplicationActionValues = (typeof ApplicationActions)[keyof typeof ApplicationActions];

export const ApplicationAgreements = {
	dac_agreement_software_updates: 'dac_agreement_software_updates',
	dac_agreement_non_disclosure: 'dac_agreement_non_disclosure',
	dac_agreement_monitor_individual_access: 'dac_agreement_monitor_individual_access',
	dac_agreement_destroy_data: 'dac_agreement_destroy_data',
	dac_agreement_familiarize_restrictions: 'dac_agreement_familiarize_restrictions',
	dac_agreement_provide_it_policy: 'dac_agreement_provide_it_policy',
	dac_agreement_notify_unauthorized_access: 'dac_agreement_notify_unauthorized_access',
	dac_agreement_certify_application: 'dac_agreement_certify_application',
	dac_agreement_read_and_agreed: 'dac_agreement_read_and_agreed',
} as const;

// TODO: dedupe keys
export const ApplicationMessages = {
	dac_agreement_software_updates:
		'You will keep all computer systems on which PCGL Controlled Datea reside, or which provide accesss to such data, up-to-date with respect to software patches and antivirus file definitions (if applicable).',
	dac_agreement_non_disclosure:
		'You will protect ICGC Controlled Data against disclosure to and use by unauthorized individuals.',
	dac_agreement_monitor_individual_access:
		'You will monitor and control which individuals have access to ICGC controlled Data.',
	dac_agreement_destroy_data:
		'You will securely destroy all copies of ICGC Controlled Data in accordance with the terms and conditions of the Data Access Agreement.',
	dac_agreement_familiarize_restrictions:
		'You will familiarixe all individuals who have access to ICGC Controlled Data with the restrictions on its use.',
	dac_agreement_provide_it_policy:
		'You agree to swiftly provide a copy of both your institutional and Research Project related IT policy documents upon request from a DACO representative.',
	dac_agreement_notify_unauthorized_access:
		'You will notify the DACO immediately if you become aware or suspect that someone has gained unauthorized access to the ICGC Controlled Data.',
	dac_agreement_certify_application:
		'You certify that the contents in the application are ture and correct to the best of your knowledge and belief.',
	dac_agreement_read_and_agreed:
		'You have read and agree to abide by the terms and conditions outlined in the Data Access Agreement.',
};

// Data Types

export interface ApplicantDTO {
	applicantFirstName?: string | null;
	applicantLastName?: string | null;
	applicantMiddleName?: string | null;
	applicantTitle?: string | null;
	applicantSuffix?: string | null;
	applicantPrimaryAffiliation?: string | null;
	applicantPositionTitle?: string | null;
	applicantProfileUrl?: string | null;
	applicantInstitutionalEmail?: string | null;
	applicantInstitutionCountry?: string | null;
	applicantInstitutionState?: string | null;
	applicantInstitutionCity?: string | null;
	applicantInstitutionPostalCode?: string | null;
	applicantInstitutionStreetAddress?: string | null;
	applicantInstitutionBuilding?: string | null;
}

export type InstitutionalRepDTO = {
	institutionalRepTitle?: string | null;
	institutionalRepFirstName?: string | null;
	institutionalRepMiddleName?: string | null;
	institutionalRepLastName?: string | null;
	institutionalRepSuffix?: string | null;
	institutionalRepPrimaryAffiliation?: string | null;
	institutionalRepEmail?: string | null;
	institutionalRepProfileUrl?: string | null;
	institutionalRepPositionTitle?: string | null;
};

export type InstitutionDTO = {
	institutionCountry?: string | null;
	institutionState?: string | null;
	institutionStreetAddress?: string | null;
	institutionBuilding?: string | null;
	institutionCity?: string | null;
	institutionPostalCode?: string | null;
};

export type ProjectDTO = {
	projectTitle?: string | null;
	projectWebsite?: string | null;
	projectBackground?: string | null;
	projectAims?: string | null;
	projectMethodology?: string | null;
	projectSummary?: string | null;
	projectPublicationUrls?: string[] | null;
};

export type AgreementDTO = {
	acceptedAgreements?: string[] | null;
};

export type AppendicesDTO = {
	acceptedAppendices?: string[] | null;
};

export type EthicsLetterDTO = {
	ethicsLetter?: number | null;
	ethicsReviewRequired?: boolean | null;
	signedPdf?: number | null;
};

export interface RequestedStudiesDTO {
	requestedStudies?: string[] | null;
}

export type ApplicationDTO = {
	id: number;
	userId: string;
	state: ApplicationStateValues;
	createdAt: Date;
	approvedAt?: Date | null;
	updatedAt?: Date | null;
	expiresAt?: Date | null;
};

export interface ApplicationResponseData extends ApplicationDTO {
	contents: ApplicationContentsResponse | null;
}

export interface PagingMetadata {
	totalRecords: number;
	page: number;
	pageSize: number;
}

export interface ApplicantSummary {
	createdAt: Date;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	country: string | null;
	institution: string | null;
}

export interface ApplicationListSummary extends ApplicationDTO {
	applicant: ApplicantSummary | null;
}

export interface ApplicationListResponse {
	applications: ApplicationListSummary[];
	pagingMetadata: PagingMetadata;
}

export type ApplicationContentsResponse = {
	applicationId?: number;
	createdAt?: Date;
	updatedAt?: Date | null;
} & ApplicantDTO &
	InstitutionDTO &
	InstitutionalRepDTO &
	ProjectDTO &
	RequestedStudiesDTO &
	AgreementDTO &
	AppendicesDTO &
	EthicsLetterDTO;

export interface ApplicationResponseData extends ApplicationDTO {
	contents: ApplicationContentsResponse | null;
}

export interface PagingMetadata {
	totalRecords: number;
	page: number;
	pageSize: number;
}

export interface ApplicantSummary {
	createdAt: Date;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	country: string | null;
	institution: string | null;
}

export interface ApplicationListSummary extends ApplicationDTO {
	applicant: ApplicantSummary | null;
}

export interface ApplicationListResponse {
	applications: ApplicationListSummary[];
	pagingMetadata: PagingMetadata;
}

export type ApproveApplication = {
	applicationId: number; // The ID of the application to be approved
};

export interface CollaboratorDTO {
	collaboratorFirstName: string;
	collaboratorInstitutionalEmail: string;
	collaboratorLastName: string;
	collaboratorMiddleName?: string | null;
	collaboratorPositionTitle?: string | null;
	collaboratorPrimaryAffiliation?: string | null;
	collaboratorResearcherProfileURL?: string | null;
	collaboratorSuffix?: string | null;
	collaboratorType?: string | null;
}

export interface CollaboratorsResponseDTO extends CollaboratorDTO {
	applicationId: number;
}
export type ListCollaboratorResponse = CollaboratorsResponseDTO[];

export type BaseCollaboratorRequest = {
	applicationId: number;
	userId: string;
};

export interface ListCollaboratorRequest extends BaseCollaboratorRequest {
	collaborators: CollaboratorDTO[];
}

export interface UpdateCollaboratorRequest extends BaseCollaboratorRequest {
	collaborators: CollaboratorDTO;
}

export interface DeleteCollaboratorRequest {
	applicationId: number;
	userId: string;
	collaboratorId: number;
}

// TODO: Additional Types to be updated
export interface EthicsDataDTO {
	ethicsReviewRequired?: boolean | null;
	ethicsLetter?: number | null;
	signedPdf?: number | null;
}

export type ApplicationActionDTO = {
	id: number;
	applicationId: number;
	createdAt: Date;
	userId: string;
	action: ApplicationActionValues;
	stateBefore: ApplicationStateValues;
	stateAfter: ApplicationStateValues;
	revisionsRequestId: number;
};

export interface AgreementsDTO {
	id: number;
	userId: string;
	name: string;
	agreementText: string;
	agreementType: string;
	agreedAt: Date;
}

export interface FilesDTO {
	id: number;
	applicationId: number;
	type: FileType;
	submitterUserId: string;
	submittedAt: Date;
	content: any;
	filename: string | null;
}

export interface SignatureDTO {
	applicationId: number;
	applicantSignature?: string | null;
	applicantSignedAt?: Date | null;
	institutionalRepSignature?: string | null;
	institutionalRepSignedAt?: Date | null;
}

export const agreementEnum = [
	'dac_agreement_software_updates',
	'dac_agreement_non_disclosure',
	'dac_agreement_monitor_individual_access',
	'dac_agreement_destroy_data',
	'dac_agreement_familiarize_restrictions',
	'dac_agreement_provide_it_policy',
	'dac_agreement_notify_unauthorized_access',
	'dac_agreement_certify_application',
	'dac_agreement_read_and_agreed',
] as const;

export const appendicesEnum = ['appendix_1', 'appendix_2', 'appendix_3'] as const;
export interface RevisionsDTO {
	id: number;
	applicationId: number;
	createdAt?: Date;
	comments?: String | null;
	applicantApproved: boolean;
	applicantNotes?: string | null;
	institutionRepApproved: boolean;
	institutionRepNotes?: string | null;
	collaboratorsApproved: boolean;
	collaboratorsNotes?: string | null;
	projectApproved: boolean;
	projectNotes?: string | null;
	requestedStudiesApproved: boolean;
	requestedStudiesNotes?: string | null;
	ethicsApproved: boolean;
	ethicsNotes?: string | null;
	agreementsApproved: boolean;
	agreementsNotes?: string | null;
	appendicesApproved: boolean;
	appendicesNotes?: string | null;
	signAndSubmitApproved: boolean;
	signAndSubmitNotes?: string | null;
}
