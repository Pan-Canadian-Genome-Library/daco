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

import { describe, expect, it } from 'vitest';

import {
	hasRequiredAssentFormAcknowledgement,
	hasRequiredAssentFormIdentifier,
	hasRequiredInfoForConsentGroup,
	hasRequiredOhipInfo,
	hasRequiredSelfIdentifiedGender,
	hasRequiredSelfReportedPrimaryCancerDiagnosis,
} from '../../src/common/index.js';
import { ConsentGroup, Gender, HistoryOfCancer, PrimaryCancerDiagnosis } from '../../src/entities/index.js';
import { hasRequiredOhipFormInfo } from '../../src/services/consentUi/utils/index.js';

const mockCompleteGuardianFields = {
	guardianFirstName: 'Gina',
	guardianLastName: 'Guardian',
	guardianEmailAddress: 'gina_g@example.com',
	guardianPhoneNumber: '0123456789',
	guardianRelationship: 'Mother',
};

const mockCompleteParticipantContactFields = {
	participantEmailAddress: 'patti@example.com',
	participantPhoneNumber: '1112223334',
};

describe('Conditional fields utility functions', () => {
	const {
		GUARDIAN_CONSENT_OF_MINOR, // guardian group
		GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT, // guardian group
		ADULT_CONSENT_SUBSTITUTE_DECISION_MAKER, // guardian group
		ADULT_CONSENT, // non-guardian group
		YOUNG_ADULT_CONSENT, // non-guardian group
	} = ConsentGroup.enum;
	describe('hasRequiredInfoForConsentGroup', () => {
		describe('guardian consent groups', () => {
			it('returns TRUE if all guardian fields and no participant contact fields are provided', () => {
				const testSchemaObj = {
					...mockCompleteGuardianFields,
					consentGroup: GUARDIAN_CONSENT_OF_MINOR,
				};
				const result = hasRequiredInfoForConsentGroup(testSchemaObj);
				expect(result).true;
			});
			it('returns FALSE if one guardian field is not provided and no participant contact fields are provided', () => {
				const testSchemaObj = {
					...mockCompleteGuardianFields,
					guardianPhoneNumber: undefined,
					consentGroup: GUARDIAN_CONSENT_OF_MINOR,
				};
				const result = hasRequiredInfoForConsentGroup(testSchemaObj);
				expect(result).false;
			});
			it('returns FALSE if one guardian field and no participant contact fields are provided', () => {
				const testSchemaObj = {
					...mockCompleteGuardianFields,
					guardianPhoneNumber: undefined,
					guardianRelationship: undefined,
					guardianFirstName: undefined,
					guardianLastName: undefined,
					consentGroup: ADULT_CONSENT_SUBSTITUTE_DECISION_MAKER,
				};
				const result = hasRequiredInfoForConsentGroup(testSchemaObj);
				expect(result).false;
			});
			it('returns FALSE if no guardian fields or participant contact fields are provided', () => {
				const testSchemaObj = {
					consentGroup: GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT,
				};
				const result = hasRequiredInfoForConsentGroup(testSchemaObj);
				expect(result).false;
			});
			it('returns FALSE if all guardian fields and all participant contact fields are provided', () => {
				const testSchemaObj = {
					...mockCompleteGuardianFields,
					...mockCompleteParticipantContactFields,
					consentGroup: GUARDIAN_CONSENT_OF_MINOR,
				};
				const result = hasRequiredInfoForConsentGroup(testSchemaObj);
				expect(result).false;
			});
			it('returns FALSE if some guardian fields and some participant contact fields are provided', () => {
				const testSchemaObj = {
					...mockCompleteGuardianFields,
					guardianFirstName: undefined,
					guardianLastName: undefined,
					...mockCompleteParticipantContactFields,
					participantEmailAddress: undefined,
					consentGroup: ADULT_CONSENT_SUBSTITUTE_DECISION_MAKER,
				};
				const result = hasRequiredInfoForConsentGroup(testSchemaObj);
				expect(result).false;
			});
		});
		describe('non-guardian consent groups', () => {
			it('returns TRUE if all participant contact fields and no guardian fields are provided', () => {
				const testSchemaObj = {
					...mockCompleteParticipantContactFields,
					consentGroup: ADULT_CONSENT,
				};
				const result = hasRequiredInfoForConsentGroup(testSchemaObj);
				expect(result).true;
			});
			it('returns FALSE if one participant contact field is not provided and no guardian fields are provided', () => {
				const testSchemaObj = {
					...mockCompleteParticipantContactFields,
					participantEmailAddress: undefined,
					consentGroup: YOUNG_ADULT_CONSENT,
				};
				const result = hasRequiredInfoForConsentGroup(testSchemaObj);
				expect(result).false;
			});
			it('returns FALSE if one participant contact field and no guardian fields are provided', () => {
				const testSchemaObj = {
					participantEmailAddress: 'patti@example.com',
					consentGroup: ADULT_CONSENT,
				};
				const result = hasRequiredInfoForConsentGroup(testSchemaObj);
				expect(result).false;
			});
			it('returns FALSE if no guardian fields or participant contact fields are provided', () => {
				const testSchemaObj = {
					consentGroup: YOUNG_ADULT_CONSENT,
				};
				const result = hasRequiredInfoForConsentGroup(testSchemaObj);
				expect(result).false;
			});
			it('returns FALSE if all guardian fields and all participant contact fields are provided', () => {
				const testSchemaObj = {
					...mockCompleteGuardianFields,
					...mockCompleteParticipantContactFields,
					consentGroup: ADULT_CONSENT,
				};
				const result = hasRequiredInfoForConsentGroup(testSchemaObj);
				expect(result).false;
			});
			it('returns FALSE if some guardian fields and some participant contact fields are provided', () => {
				const testSchemaObj = {
					...mockCompleteParticipantContactFields,
					participantPhoneNumber: undefined,
					...mockCompleteGuardianFields,
					guardianEmailAddress: undefined,
					consentGroup: YOUNG_ADULT_CONSENT,
				};
				const result = hasRequiredInfoForConsentGroup(testSchemaObj);
				expect(result).false;
			});
		});
	});

	describe('hasRequiredOhipFormInfo', () => {
		it('returns TRUE if ohipDisabled is false and ohipNumber is provided', () => {
			const testSchemaObj = {
				ohipNumber: '1234567890',
				ohipDisabled: false,
			};
			const result = hasRequiredOhipFormInfo(testSchemaObj);
			expect(result).true;
		});

		it('returns FALSE if ohipDisabled is false and ohipNumber is NOT provided', () => {
			const testSchemaObj = {
				ohipNumber: undefined,
				ohipDisabled: false,
			};
			const result = hasRequiredOhipFormInfo(testSchemaObj);
			expect(result).false;
		});

		it('returns TRUE if ohipDisabled is true and ohipNumber is NOT provided', () => {
			const testSchemaObj = {
				ohipNumber: undefined,
				ohipDisabled: true,
			};
			const result = hasRequiredOhipFormInfo(testSchemaObj);
			expect(result).true;
		});

		it('returns FALSE if ohipDisabled is true and ohipNumber is provided', () => {
			const testSchemaObj = {
				ohipNumber: '1234567890',
				ohipDisabled: true,
			};
			const result = hasRequiredOhipFormInfo(testSchemaObj);
			expect(result).false;
		});
	});

	describe('hasRequiredOhipInfo', () => {
		it('returns TRUE if hasOhip is true and ohipNumber is provided', () => {
			const testSchemaObj = {
				ohipNumber: '1234567890',
				hasOhip: true,
			};
			const result = hasRequiredOhipInfo(testSchemaObj);
			expect(result).true;
		});

		it('returns FALSE if hasOhip is true and ohipNumber is NOT provided', () => {
			const testSchemaObj = {
				ohipNumber: undefined,
				hasOhip: true,
			};
			const result = hasRequiredOhipInfo(testSchemaObj);
			expect(result).false;
		});

		it('returns TRUE if hasOhip is false and ohipNumber is NOT provided', () => {
			const testSchemaObj = {
				ohipNumber: undefined,
				hasOhip: false,
			};
			const result = hasRequiredOhipInfo(testSchemaObj);
			expect(result).true;
		});

		it('returns FALSE if hasOhip is false and ohipNumber is provided', () => {
			const testSchemaObj = {
				ohipNumber: '1234567890',
				hasOhip: false,
			};
			const result = hasRequiredOhipInfo(testSchemaObj);
			expect(result).false;
		});
	});

	describe('hasRequiredAssentFormIdentifier', () => {
		it('returns TRUE if consent group includes assent and assentFormIdentifier is provided', () => {
			const testSchemaObj = {
				assentFormIdentifier: 'form123',
				consentGroup: GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT,
			};
			const result = hasRequiredAssentFormIdentifier(testSchemaObj);
			expect(result).true;
		});

		it('returns FALSE if consent group includes assent and assentFormIdentifier is NOT provided', () => {
			const testSchemaObj = {
				assentFormIdentifier: undefined,
				consentGroup: GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT,
			};
			const result = hasRequiredAssentFormIdentifier(testSchemaObj);
			expect(result).false;
		});

		it('returns TRUE if consent group does not include assent and assentFormIdentifier is NOT provided', () => {
			const testSchemaObj = {
				assentFormIdentifier: undefined,
				consentGroup: GUARDIAN_CONSENT_OF_MINOR,
			};
			const result = hasRequiredAssentFormIdentifier(testSchemaObj);
			expect(result).true;
		});

		it('returns FALSE if consent group does not include and assentFormIdentifier is provided', () => {
			const testSchemaObj = {
				assentFormIdentifier: 'form123',
				consentGroup: GUARDIAN_CONSENT_OF_MINOR,
			};
			const result = hasRequiredAssentFormIdentifier(testSchemaObj);
			expect(result).false;
		});
	});

	describe('hasRequiredAssentFormAcknowledgement', () => {
		it('returns TRUE if consent group includes assent and assentFormAcknowledged is true', () => {
			const testSchemaObj = {
				assentFormAcknowledged: true,
				consentGroup: GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT,
			};
			const result = hasRequiredAssentFormAcknowledgement(testSchemaObj);
			expect(result).true;
		});

		it('returns FALSE if consent group includes assent and assentFormAcknowledged is NOT provided', () => {
			const testSchemaObj = {
				assentFormAcknowledged: undefined,
				consentGroup: GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT,
			};
			const result = hasRequiredAssentFormAcknowledgement(testSchemaObj);
			expect(result).false;
		});

		it('returns FALSE if consent group includes assent and assentFormAcknowledged is false', () => {
			const testSchemaObj = {
				assentFormAcknowledged: false,
				consentGroup: GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT,
			};
			const result = hasRequiredAssentFormAcknowledgement(testSchemaObj);
			expect(result).false;
		});

		it('returns TRUE if consent group does not include assent and assentFormAcknowledged is NOT provided', () => {
			const testSchemaObj = {
				assentFormAcknowledged: undefined,
				consentGroup: GUARDIAN_CONSENT_OF_MINOR,
			};
			const result = hasRequiredAssentFormAcknowledgement(testSchemaObj);
			expect(result).true;
		});

		it('returns FALSE if consent group does not include and assentFormAcknowledged is true', () => {
			const testSchemaObj = {
				assentFormAcknowledged: true,
				consentGroup: GUARDIAN_CONSENT_OF_MINOR,
			};
			const result = hasRequiredAssentFormAcknowledgement(testSchemaObj);
			expect(result).false;
		});

		it('returns FALSE if consent group does not include and assentFormAcknowledged is false', () => {
			const testSchemaObj = {
				assentFormAcknowledged: false,
				consentGroup: GUARDIAN_CONSENT_OF_MINOR,
			};
			const result = hasRequiredAssentFormAcknowledgement(testSchemaObj);
			expect(result).false;
		});
	});

	describe('hasRequiredSelfReportedPrimaryCancerDiagnosis', () => {
		const { YES, NO, UNKNOWN } = HistoryOfCancer.enum;
		it('returns true if historyOfCancer is YES and selfReportedPrimaryCancerDiagnosis is present', () => {
			const testObj = {
				historyOfCancer: YES,
				selfReportedPrimaryCancerDiagnosis: PrimaryCancerDiagnosis.enum.ADRENAL_GLAND,
			};
			const result = hasRequiredSelfReportedPrimaryCancerDiagnosis(testObj);
			expect(result).true;
		});

		it('returns true if historyOfCancer is NO and selfReportedPrimaryCancerDiagnosis is NOT present', () => {
			const testObj = {
				historyOfCancer: NO,
				selfReportedPrimaryCancerDiagnosis: undefined,
			};
			const result = hasRequiredSelfReportedPrimaryCancerDiagnosis(testObj);
			expect(result).true;
		});

		it('returns true if historyOfCancer is UNKNOWN and selfReportedPrimaryCancerDiagnosis is NOT present', () => {
			const testObj = {
				historyOfCancer: UNKNOWN,
				selfReportedPrimaryCancerDiagnosis: undefined,
			};
			const result = hasRequiredSelfReportedPrimaryCancerDiagnosis(testObj);
			expect(result).true;
		});

		it('returns false if historyOfCancer is YES and selfReportedPrimaryCancerDiagnosis is NOT present', () => {
			const testObj = {
				historyOfCancer: YES,
				selfReportedPrimaryCancerDiagnosis: undefined,
			};
			const result = hasRequiredSelfReportedPrimaryCancerDiagnosis(testObj);
			expect(result).false;
		});

		it('returns false if historyOfCancer is NO and selfReportedPrimaryCancerDiagnosis is present', () => {
			const testObj = {
				historyOfCancer: NO,
				selfReportedPrimaryCancerDiagnosis: PrimaryCancerDiagnosis.enum.BLADDER,
			};
			const result = hasRequiredSelfReportedPrimaryCancerDiagnosis(testObj);
			expect(result).false;
		});

		it('returns false if historyOfCancer is UNKNOWN and selfReportedPrimaryCancerDiagnosis is present', () => {
			const testObj = {
				historyOfCancer: UNKNOWN,
				selfReportedPrimaryCancerDiagnosis: PrimaryCancerDiagnosis.enum.ACCESSORY_SINUSES,
			};
			const result = hasRequiredSelfReportedPrimaryCancerDiagnosis(testObj);
			expect(result).false;
		});
	});
	describe('hasRequiredSelfIdentifiedGender', () => {
		const { PREFER_TO_SELF_IDENTIFY, MAN, TRANSGENDER_MAN_TRANSMAN } = Gender.enum;
		it('returns true if gender is PREFER_TO_SELF_IDENTIFY and selfIdentifiedGender is present', () => {
			const testObj = {
				gender: PREFER_TO_SELF_IDENTIFY,
				selfIdentifiedGender: 'Other',
			};
			const result = hasRequiredSelfIdentifiedGender(testObj);
			expect(result).true;
		});

		it('returns true if gender is not PREFER_TO_SELF_IDENTIFY and selfIdentifiedGender is NOT present', () => {
			const testObj = {
				gender: MAN,
				selfIdentifiedGender: undefined,
			};
			const result = hasRequiredSelfIdentifiedGender(testObj);
			expect(result).true;
		});

		it('returns true if gender is PREFER_TO_SELF_IDENTIFY and selfIdentifiedGender is NOT present', () => {
			const testObj = {
				gender: PREFER_TO_SELF_IDENTIFY,
				selfIdentifiedGender: undefined,
			};
			const result = hasRequiredSelfIdentifiedGender(testObj);
			expect(result).false;
		});

		it('returns false if gender is not PREFER_TO_SELF_IDENTIFY and selfIdentifiedGender is present', () => {
			const testObj = {
				gender: TRANSGENDER_MAN_TRANSMAN,
				selfIdentifiedGender: 'Other',
			};
			const result = hasRequiredSelfIdentifiedGender(testObj);
			expect(result).false;
		});
	});
});
