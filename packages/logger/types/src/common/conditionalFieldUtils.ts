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

import { ConsentQuestionId } from '../entities/ConsentQuestion.js';
import {
	ConsentGroup,
	EmptyOrOptionalOhipNumber,
	Gender,
	HistoryOfCancer,
	PrimaryCancerDiagnosis,
} from '../entities/fields/index.js';
import { GuardianBaseFields, ParticipantContactFields, SecondaryContactInformation } from '../entities/index.js';

import { EmptyString, OptionalString } from './String.js';

const {
	GUARDIAN_CONSENT_OF_MINOR,
	GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT,
	ADULT_CONSENT_SUBSTITUTE_DECISION_MAKER,
	ADULT_CONSENT,
	YOUNG_ADULT_CONSENT,
} = ConsentGroup.enum;

const { RECONTACT__SECONDARY_CONTACT } = ConsentQuestionId.enum;

export const requiresGuardianInformation = (consentGroup: ConsentGroup) => {
	const consentOptions: ConsentGroup[] = [
		GUARDIAN_CONSENT_OF_MINOR,
		GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT,
		ADULT_CONSENT_SUBSTITUTE_DECISION_MAKER,
	];
	return consentOptions.includes(consentGroup);
};

const requiresParticipantContactInfo = (consentGroup: ConsentGroup) => {
	const consentOptions: ConsentGroup[] = [ADULT_CONSENT, YOUNG_ADULT_CONSENT];
	return consentOptions.includes(consentGroup);
};

const isUndefined = (arg: any): arg is undefined => arg === undefined;
const isEmptyString = (arg: any): arg is EmptyString => arg === ''; // empty HTML text inputs contain empty strings
export const isEmptyOrUndefined = (arg: any) => isUndefined(arg) || isEmptyString(arg);
export const hasValue = <T>(input: T | undefined): input is T => !isUndefined(input);

/**
 * Checks if a Participant schema object contains the appropriate data for the provided consent group,
 * and doesn't have data pertaining to other consent groups.
 * ADULT_CONSENT and YOUNG_ADULT_CONSENT must have participantEmailAddress and participantPhoneNumber. Guardian fields
 * (guardianFirstName, guardianLastName, guardianPreferredName, guardianPhoneNumber, guardianEmailAddress, and guardianRelationship) must be undefined.
 * GUARDIAN_CONSENT_OF_MINOR, GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT or ADULT_CONSENT_SUBSTITUTE_DECISION_MAKER must have
 * guardianFirstName, guardianLastName, guardianPhoneNumber, guardianEmailAddress, and guardianRelationship.
 * guardianPreferredName is optional. Participant contact fields (participantEmailAddress and participantPhoneNumber) must be undefined.
 * @param props consentGroup, guardianEmailAddress, guardianFirstName, guardianLastName, guardianPreferredName, guardianPhoneNumber, guardianRelationship, participantEmailAddress, participantPhoneNumber
 * @returns {boolean} returns true if all required fields are present, and non-required fields are undefined
 */

export const hasRequiredInfoForConsentGroup = (
	props: {
		consentGroup: ConsentGroup;
	} & ParticipantContactFields &
		GuardianBaseFields,
) => {
	const {
		consentGroup,
		guardianEmailAddress,
		guardianFirstName,
		guardianLastName,
		guardianPhoneNumber,
		guardianPreferredName,
		guardianRelationship,
		participantEmailAddress,
		participantPhoneNumber,
	} = props;

	const allParticipantContactFieldsProvided = [participantEmailAddress, participantPhoneNumber].every(hasValue);

	const allGuardianFieldsUndefined = [
		guardianEmailAddress,
		guardianFirstName,
		guardianLastName,
		guardianPhoneNumber,
		guardianPreferredName,
		guardianRelationship,
	].every(isUndefined);

	if (requiresParticipantContactInfo(consentGroup)) {
		return allParticipantContactFieldsProvided && allGuardianFieldsUndefined;
	}

	const allGuardianFieldsProvided = [
		guardianEmailAddress,
		guardianFirstName,
		guardianLastName,
		guardianPhoneNumber,
		guardianRelationship,
	].every(hasValue);

	const allParticipantContactFieldsUndefined = [participantEmailAddress, participantPhoneNumber].every(isUndefined);

	if (requiresGuardianInformation(consentGroup)) {
		return allGuardianFieldsProvided && allParticipantContactFieldsUndefined;
	}

	return true;
};

/**
 * Checks if OHIP information is present when required by the ConsentReleaseData schema object
 *
 * ohipNumber must be defined if hasOhip is true
 * @param props ohipNumber, hasOhip
 * @returns {boolean} returns true if all required fields are present
 */
export const hasRequiredOhipInfo = (props: { ohipNumber?: EmptyOrOptionalOhipNumber; hasOhip: boolean }) => {
	const { ohipNumber, hasOhip } = props;
	return hasOhip ? !isEmptyOrUndefined(ohipNumber) : isEmptyOrUndefined(ohipNumber);
};
/**
 * Checks if assentFormIdentifier is present when required by the ConsentGroup
 * @param props assentFormIdentifier, consentGroup
 * @returns {boolean} returns true if all required fields are present
 */
export const hasRequiredAssentFormIdentifier = (props: {
	assentFormIdentifier?: OptionalString;
	consentGroup: ConsentGroup;
}) => {
	const { assentFormIdentifier, consentGroup } = props;
	if (consentGroup === GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT) {
		return hasValue(assentFormIdentifier);
	}

	return !hasValue(assentFormIdentifier);
};

/**
 * Checks if assentFormAcknowledged is true when required by the ConsentGroup
 * and undefined when not required by the ConsentGroup
 * @param props assentFormAcknowledged, consentGroup
 * @returns {boolean} returns true if assentFormAcknowledged condition is met
 */
export const hasRequiredAssentFormAcknowledgement = (props: {
	assentFormAcknowledged?: boolean;
	consentGroup: ConsentGroup;
}) => {
	const { assentFormAcknowledged, consentGroup } = props;
	if (consentGroup === GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT) {
		return assentFormAcknowledged === true;
	}

	return !hasValue(assentFormAcknowledged);
};

/**
 * Checks if selfReportedPrimaryCancerDiagnosis is present when historyOfCancer is YES
 * and undefined when the historyOfCancer response is NO or UNKNOWN
 * @param props historyOfCancer, selfReportedPrimaryCancerDiagnosis
 * @returns {boolean} returns true if selfReportedPrimaryCancerDiagnosis condition is met
 */
export const hasRequiredSelfReportedPrimaryCancerDiagnosis = (props: {
	historyOfCancer: HistoryOfCancer;
	selfReportedPrimaryCancerDiagnosis?: PrimaryCancerDiagnosis;
}): boolean => {
	const { historyOfCancer, selfReportedPrimaryCancerDiagnosis } = props;
	const { YES } = HistoryOfCancer.enum;
	if (historyOfCancer === YES) {
		return hasValue(selfReportedPrimaryCancerDiagnosis);
	}

	return !hasValue(selfReportedPrimaryCancerDiagnosis);
};

/**
 * Checks if selfIdentifiedGender is present when the genderIdentity is PREFER_TO_SELF_IDENTIFY
 * and undefined when genderIdentity is not PREFER_TO_SELF_IDENTIFY
 * @param props genderIdentity, selfIdentifiedGender
 * @returns {boolean} returns true if selfIdentifiedGender condition is met
 */
export const hasRequiredSelfIdentifiedGender = (props: { gender: Gender; selfIdentifiedGender?: string }): boolean => {
	const { gender, selfIdentifiedGender } = props;
	const { PREFER_TO_SELF_IDENTIFY } = Gender.enum;
	if (gender === PREFER_TO_SELF_IDENTIFY) {
		return !isEmptyOrUndefined(selfIdentifiedGender?.trim());
	}

	return isEmptyOrUndefined(selfIdentifiedGender?.trim());
};

/**
 * Checks if Secondary Contact Information is present when required by the ConsentRecontact schema object
 *
 * @param props RECONTACT__SECONDARY_CONTACT, SecondaryContactInformation
 * @returns {boolean} returns true if Secondary Contact Information is not required, or if all required fields are present
 */
export const hasRequiredSecondaryContactInfo = (
	props: {
		[RECONTACT__SECONDARY_CONTACT]?: boolean;
	} & SecondaryContactInformation,
) => {
	const allSecondaryContactInformationProvided = [
		props.secondaryContactFirstName,
		props.secondaryContactLastName,
		props.secondaryContactPhoneNumber,
	].every(hasValue);

	return props[RECONTACT__SECONDARY_CONTACT] ? allSecondaryContactInformationProvided : true;
};

export const hasRequiredContactInfoForReminderEmail = (props: {
	guardianEmailAddress?: string | undefined;
	guardianFirstName?: string | undefined;
	guardianLastName?: string | undefined;
	participantEmailAddress?: string | undefined;
	participantOhipFirstName?: string | undefined;
	participantOhipLastName?: string | undefined;
}) => {
	const participantInformationProvided = [
		props.participantOhipFirstName,
		props.participantOhipLastName,
		props.participantEmailAddress,
	].every(hasValue);

	const guardianInformationProvided = [
		props.guardianFirstName,
		props.guardianLastName,
		props.guardianEmailAddress,
	].every(hasValue);

	return props.participantEmailAddress ? participantInformationProvided : guardianInformationProvided;
};
