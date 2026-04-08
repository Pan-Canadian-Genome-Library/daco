/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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

export const SupportedLangs = {
	ENGLISH: 'en',
	FRENCH: 'fr',
} as const;

export type SupportedLangsValues = (typeof SupportedLangs)[keyof typeof SupportedLangs];

export type LanguagProps = {
	lang?: SupportedLangsValues;
};

// Section translation Keys
export const SectionKeys = {
	COLLABORATORS: 'COLLABORATORS',
} as const;

export type SectionKeyValues = (typeof SectionKeys)[keyof typeof SectionKeys];

// Define the shape of translation objects
export type AppendicesTranslation = {
	TITLE: string;
	DESCRIPTION: string;
	PCGL_POLICIES_TITLE: string;
	APPENDIX_I: string;
	APPENDIX_II: string;
	APPENDIX_III: string;
};

export type ApplicantInformationTranslation = {
	TITLE: string;
	QUALIFIED_APPLICANTS_PARAGRAPH: string;
	INSTITUTIONAL_EMAIL_PARAGRAPH: string;
	PRINCIPAL_INVESTIGATOR_INFO_TITLE: string;
	INSTITUTION_MAILING_ADDRESS_TITLE: string;
	TITLE_LABEL: string;
	FIRST_NAME_LABEL: string;
	MIDDLE_NAME_LABEL: string;
	LAST_NAME_LABEL: string;
	SUFFIX_LABEL: string;
	PRIMARY_AFFILIATION_LABEL: string;
	INSTITUTIONAL_EMAIL_LABEL: string;
	RESEARCHER_PROFILE_LABEL: string;
	POSITION_TITLE_LABEL: string;
	COUNTRY_LABEL: string;
	STREET_ADDRESS_LABEL: string;
	BUILDING_LABEL: string;
	PROVINCE_LABEL: string;
	CITY_LABEL: string;
	POSTAL_CODE_LABEL: string;
};

export type CollaboratorsTranslation = {
	TITLE: string;
	DESCRIPTION: string;
	NOT_REQUIRED: string;
	NOTE: string;
};

export type EndOfDocumentTranslation = {
	TITLE: string;
	CLOSING_MESSAGE: string;
};

export type EthicsTranslation = {
	TITLE: string;
	ETHICS_AWARENESS_PARAGRAPH: string;
	DACO_RESPONSIBILITY_PARAGRAPH: string;
	ETHICS_APPROVAL_TITLE: string;
	NO_REVIEW_REQUIRED: string;
	REVIEW_REQUIRED: string;
	APPROVAL_LETTER_MESSAGE_APPROVAL: string;
	APPROVAL_LETTER_MESSAGE_EXEMPTION: string;
};

export type InstitutionalRepresentativeTranslation = {
	TITLE: string;
	DESCRIPTION: string;
	INSTITUTIONAL_REP_TITLE_LABEL: string;
	INSTITUTION_MAILING_ADDRESS_TITLE: string;
	TITLE_LABEL: string;
	FIRST_NAME_LABEL: string;
	MIDDLE_NAME_LABEL: string;
	LAST_NAME_LABEL: string;
	SUFFIX_LABEL: string;
	PRIMARY_AFFILIATION_LABEL: string;
	INSTITUTIONAL_EMAIL_LABEL: string;
	RESEARCHER_PROFILE_LABEL: string;
	POSITION_TITLE_LABEL: string;
	COUNTRY_LABEL: string;
	STREET_ADDRESS_LABEL: string;
	BUILDING_LABEL: string;
	PROVINCE_LABEL: string;
	CITY_LABEL: string;
	POSTAL_CODE_LABEL: string;
};

export type IntroductionTranslation = {
	TITLE: string;
	QUALIFICATION_INTRO: string;
	QUALIFICATION_ITEMS: string[];
	RECEIVE_ACCESS_INTRO: string;
	RECEIVE_ACCESS_ITEMS: string[];
	APPLICATION_REVIEW_PARAGRAPH: string;
	APPROVAL_AND_RENEWAL_PARAGRAPH: string;
};

export type ProjectInformationTranslation = {
	TITLE: string;
	DESCRIPTION: string;
	PROJECT_TITLE_LABEL: string;
	PROJECT_WEBSITE_LABEL: string;
	RESEARCH_SUMMARY_TITLE: string;
	RESEARCH_SUMMARY_DESCRIPTION: string;
	PROJECT_BACKGROUND_LABEL: string;
	USE_OF_DATA_METHODOLOGY_LABEL: string;
	AIMS_LABEL: string;
	LAY_SUMMARY_TITLE: string;
	LAY_SUMMARY_LABEL: string;
	PUBLICATIONS_TITLE: string;
	PUBLICATIONS_DESCRIPTION: string;
	PUBLICATION_LABEL: string;
};

export type RequestedStudyTranslation = {
	TITLE: string;
	DESCRIPTION: string;
	STUDY_NAME_LABEL: string;
};

export type SignSubmitTranslation = {
	TITLE: string;
	SIGNATURE_REQUIREMENT: string;
	APPLICANT_AUTHORIZATION_TITLE: string;
	INSTITUTIONAL_REP_AUTHORIZATION_TITLE: string;
	NAME_LABEL: string;
	PRIMARY_AFFILIATION_LABEL: string;
	POSITION_TITLE_LABEL: string;
};

export type TitlePageTranslation = {
	APPLICATION_NUMBER_LABEL: string;
	APPLICATION_NUMBER_PREFIX: string;
	PRINCIPAL_INVESTIGATOR_LABEL: string;
	INSTITUTION_LABEL: string;
	DOCUMENT_CREATED_ON_LABEL: string;
	FRENCH_VERSION: string;
};

export type DataAccessAgreementTranslation = {
	TITLE: string;
	APPLICATION_COMPLETION_PARAGRAPH: string;
	DACO_APPROVAL_PARAGRAPH: string;
	PUBLIC_REGISTRY_PARAGRAPH: string;
	AGREEMENT_ACKNOWLEDGEMENT_PARAGRAPH: string;
	DEFINITIONS_PARAGRAPH: string;
	DEFINITIONS_TITLE: string;
	DEFINITIONS_ITEMS: string[];
};

export type TermsAndConditionsTranslation = {
	TITLE: string;
	SIGNING_INTRO: string;
	TERMS_ITEMS: string[];
	AGREEMENTS_TITLE: string;
	AGREEMENTS_INTRO: string;
	SOFTWARE_UPDATES: string;
	NON_DISCLOSURE: string;
	MONITOR_INDIVIDUAL_ACCESS: string;
	DESTROY_DATA: string;
	FAMILIARIZE_RESTRICTIONS: string;
	PROVIDE_IT_POLICY: string;
	NOTIFY_UNAUTHORIZED_ACCESS: string;
	CERTIFY_APPLICATION: string;
	READ_AND_AGREED: string;
};
