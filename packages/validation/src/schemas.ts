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

import { z } from 'zod';

import { ApplicationAgreements } from '@pcgl-daco/data-model';

import { EthicsEnum } from './common/enums.js';
import { ConciseWordCountString, EmptyOrOptionalString, NonEmptyString, OptionalURLString } from './common/strings.js';
import { ONLY_ALPHANUMERIC } from './utils/regex.js';

export const applicantInformationSchema = z.object({
	applicantTitle: NonEmptyString,
	applicantFirstName: NonEmptyString,
	applicantMiddleName: EmptyOrOptionalString,
	applicantLastName: NonEmptyString,
	applicantSuffix: EmptyOrOptionalString,
	applicantPrimaryAffiliation: NonEmptyString,
	applicantInstituteEmail: NonEmptyString.email(),
	applicantProfileUrl: NonEmptyString.url(),
	applicantPositionTitle: NonEmptyString,
	applicantInstituteCountry: NonEmptyString,
	applicantInstituteState: NonEmptyString,
	applicantInstituteCity: NonEmptyString,
	applicantInstitutePostalCode: NonEmptyString.regex(ONLY_ALPHANUMERIC),
	applicantInstituteStreetAddress: NonEmptyString,
	applicantInstituteBuilding: EmptyOrOptionalString,
});
export type ApplicantInformationSchemaType = z.infer<typeof applicantInformationSchema>;

export const collaboratorsSchema = z.object({
	collaboratorFirstName: NonEmptyString,
	collaboratorMiddleName: EmptyOrOptionalString,
	collaboratorLastName: NonEmptyString,
	collaboratorSuffix: EmptyOrOptionalString,
	collaboratorInstitutionalEmail: NonEmptyString.email(),
	collaboratorPositionTitle: NonEmptyString,
	collaboratorPrimaryAffiliation: EmptyOrOptionalString,
	collaboratorResearcherProfileURL: EmptyOrOptionalString,
	collaboratorType: EmptyOrOptionalString,
});

export const collaboratorsRequestSchema = z.object({
	applicationId: z.number(),
	userId: NonEmptyString,
	collaborators: z.array(collaboratorsSchema).nonempty(),
});

export const collaboratorsRecordSchema = collaboratorsSchema.extend({
	id: z.number(),
});

export const collaboratorsDeleteRequestSchema = z.object({
	applicationId: z.number(),
	userId: NonEmptyString,
	collaboratorId: z.number(),
});

export type CollaboratorsSchemaType = z.infer<typeof collaboratorsSchema>;

export const institutionalRepSchema = z.object({
	institutionalTitle: NonEmptyString,
	institutionalFirstName: NonEmptyString,
	institutionalMiddleName: EmptyOrOptionalString,
	institutionalLastName: NonEmptyString,
	institutionalSuffix: EmptyOrOptionalString,
	institutionalPrimaryAffiliation: NonEmptyString,
	institutionalInstituteAffiliation: NonEmptyString.email(),
	institutionalProfileUrl: NonEmptyString.url(),
	institutionalPositionTitle: NonEmptyString,
	institutionCountry: NonEmptyString,
	institutionState: NonEmptyString,
	institutionCity: NonEmptyString,
	institutionStreetAddress: NonEmptyString,
	institutionPostalCode: NonEmptyString.regex(ONLY_ALPHANUMERIC),
	institutionBuilding: EmptyOrOptionalString,
});
export type InstitutionalRepSchemaType = z.infer<typeof institutionalRepSchema>;

export const projectInformationSchema = z.object({
	projectTitle: NonEmptyString,
	projectWebsite: OptionalURLString,
	projectBackground: ConciseWordCountString,
	projectAims: ConciseWordCountString,
	projectDataUse: ConciseWordCountString,
	projectMethodology: ConciseWordCountString,
	projectLaySummary: ConciseWordCountString,
	relevantPublicationURL1: NonEmptyString.url(),
	relevantPublicationURL2: NonEmptyString.url(),
	relevantPublicationURL3: NonEmptyString.url(),
});
export type ProjectInformationSchemaType = z.infer<typeof projectInformationSchema>;

export const ethicsSchema = z.object({
	ethicsApproval: EthicsEnum,
});
export type EthicsSchemaType = z.infer<typeof ethicsSchema>;

export const requestedStudySchema = z.object({
	requestedStudy: NonEmptyString,
});
export type RequestedStudySchemaType = z.infer<typeof requestedStudySchema>;

export const agreementsSchema = z.object({
	agreements: z.array(z.string()).superRefine((allAgreements, context) => {
		if (allAgreements.length > 9) {
			context.addIssue({
				code: z.ZodIssueCode.too_big,
				maximum: 9,
				type: 'array',
				inclusive: true,
			});
		}

		if (allAgreements.length < 9) {
			context.addIssue({
				code: z.ZodIssueCode.too_small,
				minimum: 9,
				type: 'array',
				inclusive: true,
			});
		}

		if (allAgreements.length !== new Set(allAgreements).size) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				params: { violation: 'duplicateAgreementItems' },
			});
		}

		if (allAgreements.filter((agreement) => !Object.keys(ApplicationAgreements).includes(agreement)).length !== 0) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				params: { violation: 'invalidAgreementItem' },
			});
		}
	}),
});
export type AgreementsSchemaType = z.infer<typeof agreementsSchema>;

export const appendicesSchema = z.object({
	appendices: z.array(z.string()).superRefine((policies, context) => {
		if (policies.length !== 3) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				params: { violation: 'checkboxesNotFilledOut' },
			});
		}
	}),
});
export type AppendicesSchemaType = z.infer<typeof appendicesSchema>;
