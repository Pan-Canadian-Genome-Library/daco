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

import { z } from 'zod';

import { Date } from '../common/Date.js';
import { transformEmptyStringToUndefined } from '../common/utils/index.js';

import { ParticipantBaseOhipNameFields } from './Participant.js';
import {
	EmptyOrOptionalName,
	EmptyOrOptionalPhoneNumber,
	// OptionalEmail,
	OptionalNanoId,
} from './fields/index.js';

export const IsGuardianField = z.object({
	isGuardian: z.boolean(),
});
export type IsGuardianField = z.infer<typeof IsGuardianField>;
// only for UI validation. don't include in API POST request.
export const RegisterRequestIsInvitedField = z.object({
	isInvited: z.boolean().optional(),
});

export const RegisterRequestInviteIdField = z.object({
	inviteId: OptionalNanoId,
});

// STEP 1

export const RegisterRequestParticipantNameFields = ParticipantBaseOhipNameFields.and(
	z.object({
		participantPreferredName: EmptyOrOptionalName.transform(transformEmptyStringToUndefined),
	}),
);

// participant phone number - required for participants, not allowed for guardians
export const RegisterRequestParticipantPhoneNumberField = IsGuardianField.and(
	z.object({
		participantPhoneNumber: EmptyOrOptionalPhoneNumber,
	}),
);
export type RegisterRequestParticipantPhoneNumberField = z.infer<typeof RegisterRequestParticipantPhoneNumberField>;

export const RegisterRequestDateOfBirthField = z.object({
	dateOfBirth: Date,
});

// date of birth check - if user doesn't have an invite, they must be at least the minimum age
export const RegisterRequestAgeCheck = RegisterRequestIsInvitedField.and(RegisterRequestDateOfBirthField);
export type RegisterRequestAgeCheck = z.infer<typeof RegisterRequestAgeCheck>;

// guardian fields - required for guardians, not allowed for participants
export const RegisterRequestGuardianFields = IsGuardianField.and(
	z.object({
		guardianFirstName: EmptyOrOptionalName,
		guardianLastName: EmptyOrOptionalName,
		guardianPhoneNumber: EmptyOrOptionalPhoneNumber,
		guardianPreferredName: EmptyOrOptionalName.transform(transformEmptyStringToUndefined),
		guardianRelationship: EmptyOrOptionalName,
	}),
);
export type RegisterRequestGuardianFields = z.infer<typeof RegisterRequestGuardianFields>;
