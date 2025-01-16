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
	REP_REVISION: 'REP_REVISION',
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

export enum ApplicationReviewOutcomes {
	'APPROVED',
	'REJECTED',
	'REVISIONS_REQUESTED',
}

export enum ApplicationActions {
	'CREATE',
	'WITHDRAW',
	'CLOSE',
	'REQUEST_INSTITUTIONAL_REP',
	'INSTITUTIONAL_REP_APPROVED',
	'INSTITUTIONAL_REP_REJECTED',
	'DAC_REVIEW_APPROVED',
	'DAC_REVIEW_REJECTED',
	'DAC_REVIEW_REVISIONS',
	'REVOKE',
}

export enum ApplicationAgreements {
	'dac_agreement_software_updates',
	'dac_agreement_non_disclosure',
	'dac_agreement_monitor_individual_access',
	'dac_agreement_destroy_data',
	'dac_agreement_familiarize_restrictions',
	'dac_agreement_provide_it_policy',
	'dac_agreement_notify_unauthorized_access',
	'dac_agreement_certify_application',
	'dac_agreement_read_and_agreed',
}
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
// TODO: Which fields are optional?

export type PersonalInfo = {
	userId: string;
	title: string;
	firstName: string;
	middleName: string;
	lastName: string;
	suffix: string;
	primaryAffiliation: string;
	institutionalEmail: string;
	researcherProfileURL: string;
	positionTitle: string;
};

export interface Applicant extends PersonalInfo {}

export interface Collaborator extends Applicant {
	collaboratorType: string;
}

export type Institution = {
	country: string;
	streetAddress: string;
	building?: string;
	suite?: string;
	city: string;
	province: string; // TODO: Handle Province or State?
	postalCode: string;
};

export type Project = {
	title: string;
	website: string;
	abstract: string;
	methodology: string;
	summary: string;
	publicationUrls: string[];
};

export type RevisionRequest = {
	id: number; // TODO: Implement BigInt
	applicationId: number; // TODO: Implement BigInt;
	createdAt: Date;
	createdBy: string;
	version: number;
	changes: {}[]; // TODO: Define structure, maybe ApplicationActionData[] ?
	comments?: string;
	applicantApproved: Boolean;
	applicantNotes?: string;
	institutionRepApproved: boolean;
	institutionRepNotes?: string;
	collaboratorsApproved: boolean;
	collaboratorsNotes?: string;
	projectApproved: boolean;
	projectNotes?: string;
	requestedStudiesApproved: boolean;
	requestedStudiesNotes?: string;
};

export type ApplicationActionData = {
	id: number; // TODO: Implement BigInt;
	applicationId: number; // TODO: Implement BigInt;
	createdAt: Date;
	userId: string;
	action: ApplicationActions;
	stateBefore: ApplicationStateValues;
	stateAfter: ApplicationStateValues;
	revisionsRequestId: number; // TODO: Implement BigInt
	// TODO: may need reference to a content diff
};

export type Agreements = {
	id: number; // TODO: Implement BigInt;
	userId: string;
	name: string;
	agreementText: string;
	agreementType: string; // enum, need to review possible agreements needed
	agreedAt: Date;
};

export type Files = {
	id: number; // TODO: Implement BigInt;
	applicationId: number; // TODO: Implement BigInt;
	type: FileType;
	SubmitterUserId: number; // TODO: Implement BigInt;
	submitted_at: Date;
	content: any; // TODO: Add correct type
	filename: string;
};

export type EthicsData = {
	ethicsReviewRequired: boolean;
	ethicsLetter?: number; // TODO: Implement BigInt;
	signedPdf?: number; // TODO: Implement BigInt;
};

export type ApplicationContents = {
	createdAt: Date;
	updatedAt: Date;
	applicant: Applicant;
	institution?: Institution;
	institutionalRepresentative?: {
		personalInformation: PersonalInfo;
		institution: Institution;
	};
	collaborators?: Collaborator[];
	projectInformation?: Project;
	requestedStudies?: {
		studyIds: string[]; //TODO: requested study information
	};
	ethics?: EthicsData;
	files?: Files[];
	dataAccessAgreements?: Agreements[];
	appendices?: {
		agreements: { name: string; agreement: boolean }[];
	};
	signatures?: Files[];
	revisions?: RevisionRequest[];
};

export type Application = {
	id: number; // TODO: Implement BigInt;
	userId: string;
	state: ApplicationStateValues;
	created_at: Date;
	approved_at: Date;
	expires_at: Date;
	contents: ApplicationContents;
};

export type ApproveApplication = {
	applicationId: number; // The ID of the application to be approved
	approverId: number; // The ID of the user approving the application
};
