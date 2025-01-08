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

import { getISODate } from '../../src/common/utils/dateOfBirth.js';
import { ParticipantIdentification } from '../../src/entities/index.js';
import { formatZodFieldErrorsForTesting } from '../utils/zodUtils.js';
import { ConsentGroup, LifecycleState, Province } from '../../src/entities/fields/index.js';

const mockGuardianData = {
	guardianEmailAddress: 'marge@example.com',
	guardianFirstName: 'Marjorie',
	guardianLastName: 'Simpson',
	guardianPhoneNumber: '6471234567',
	guardianPreferredName: 'Marge',
	guardianRelationship: 'Wife',
};

const mockParticipantData = {
	dateOfBirth: getISODate(new Date()),
	hasOhip: true,
	id: 'CVCFbeKH2Njl1G41vCQme',
	keycloakId: '7327526f-a873-40eb-9c17-13ee7e5cb0db',
	mailingAddressCity: 'Springfield',
	mailingAddressPostalCode: 'M1M3M4',
	mailingAddressProvince: Province.enum.ONTARIO,
	mailingAddressStreet: 'Evergreen Terrace',
	ohipNumber: '1234567890',
	participantOhipFirstName: 'Homer',
	participantOhipLastName: 'Simpson',
	participantOhipMiddleName: 'J',
	participantPreferredName: 'Homer',
	residentialPostalCode: 'M1M3M4',
};

describe('ParticipantIdentification', () => {
	it('should validate if ALL optional fields and ALL required guardian fields are present for a guardian-specific ConsentGroup', () => {
		// Participant contact info and assentFormAcknowledged are NOT present
		const result = ParticipantIdentification.safeParse({
			...mockGuardianData,
			...mockParticipantData,
			consentGroup: ConsentGroup.enum.ADULT_CONSENT_SUBSTITUTE_DECISION_MAKER,
			currentLifecycleState: LifecycleState.enum.REGISTERED,
			inviteId: 'CVCFbeKH2Njl1G41vCQre',
			previousLifecycleState: LifecycleState.enum.IN_PROCESSING,
		});
		expect(result.success).true;
	});
	it('Should validate if ALL guardian fields are present for a guardian-specific ConsentGroup', () => {
		// participant contact info and assentFormAcknowledged are NOT present
		const result = ParticipantIdentification.safeParse({
			...mockGuardianData,
			...mockParticipantData,
			consentGroup: ConsentGroup.enum.GUARDIAN_CONSENT_OF_MINOR,
			currentLifecycleState: LifecycleState.enum.REGISTERED,
		});
		expect(result.success).true;
	});
	it('Should fail to validate if all guardian fields are NOT present for a guardian-specific ConsentGroup', () => {
		const result = ParticipantIdentification.safeParse({
			...mockGuardianData,
			...mockParticipantData,
			assentFormAcknowledged: true,
			consentGroup: ConsentGroup.enum.GUARDIAN_CONSENT_OF_MINOR, // missing all guardian contact fields
			currentLifecycleState: LifecycleState.enum.REGISTERED,
		});
		expect(result.success).false;
	});
	it('Should fail to validate if ONE guardian field is NOT present for a guardian-specific ConsentGroup', () => {
		const result = ParticipantIdentification.safeParse({
			...mockGuardianData,
			...mockParticipantData,
			assentFormAcknowledged: true,
			consentGroup: ConsentGroup.enum.GUARDIAN_CONSENT_OF_MINOR,
			currentLifecycleState: LifecycleState.enum.REGISTERED,
			guardianEmailAddress: undefined,
		});
		expect(result.success).false;
	});
	it('Should fail to validate if SOME guardian fields are NOT present for a guardian-specific ConsentGroup', () => {
		const result = ParticipantIdentification.safeParse({
			...mockGuardianData,
			...mockParticipantData,
			assentFormAcknowledged: true,
			consentGroup: ConsentGroup.enum.GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT,
			currentLifecycleState: LifecycleState.enum.REGISTERED,
			guardianEmailAddress: undefined,
			guardianPhoneNumber: undefined,
		});
		expect(result.success).false;
	});
	it('Should fail to validate if ALL participant contact fields are present for a guardian-specific ConsentGroup', () => {
		const result = ParticipantIdentification.safeParse({
			...mockGuardianData,
			...mockParticipantData,
			consentGroup: ConsentGroup.enum.GUARDIAN_CONSENT_OF_MINOR,
			currentLifecycleState: LifecycleState.enum.REGISTERED,
			guardianEmailAddress: 'marge.simpson@example.com',
			participantEmailAddress: 'homer.simpson@example.com',
			participantPhoneNumber: '1234567890',
		});
		expect(result.success).false;
	});
	it('Should fail to validate if ONE participant contact field is present for a guardian-specific ConsentGroup', () => {
		const result = ParticipantIdentification.safeParse({
			...mockGuardianData,
			...mockParticipantData,
			consentGroup: ConsentGroup.enum.GUARDIAN_CONSENT_OF_MINOR,
			currentLifecycleState: LifecycleState.enum.REGISTERED,
			guardianEmailAddress: 'marge.simpson@example.com',
			guardianPhoneNumber: '1234567890',
			participantEmailAddress: 'homer.simpson@example.com',
		});
		expect(result.success).false;
	});
	it('Should fail to validate if assentFormAcknowledged is NOT present when consentGroup is GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT', () => {
		const result = ParticipantIdentification.safeParse({
			...mockGuardianData,
			...mockParticipantData,
			assentFormAcknowledged: undefined,
			consentGroup: ConsentGroup.enum.GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT,
			currentLifecycleState: LifecycleState.enum.REGISTERED,
			guardianEmailAddress: 'marge.simpson@example.com',
			guardianPhoneNumber: '1234567890',
		});
		expect(result.success).false;

		const errors = formatZodFieldErrorsForTesting(result);
		expect(errors[0].message).toBe('Invalid assentFormAcknowledged value for consentGroup');
	});
	it('Should validate if assentFormAcknowledged is present when consentGroup is GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT', () => {
		const result = ParticipantIdentification.safeParse({
			...mockGuardianData,
			...mockParticipantData,
			assentFormAcknowledged: true,
			consentGroup: ConsentGroup.enum.GUARDIAN_CONSENT_OF_MINOR_INCLUDING_ASSENT,
			currentLifecycleState: LifecycleState.enum.REGISTERED,
			guardianEmailAddress: 'marge.simpson@example.com',
			guardianPhoneNumber: '1234567890',
		});
		expect(result.success).true;
	});
});
