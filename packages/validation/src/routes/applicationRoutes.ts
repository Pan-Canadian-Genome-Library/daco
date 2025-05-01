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

import { agreementEnum, appendicesEnum, ApplicationStates } from '@pcgl-daco/data-model';
import { z } from 'zod';
import { BASE64_IMAGE } from '../utils/regex.js';

export type EditApplicationRequest = z.infer<typeof editApplicationRequestSchema>;
export type UpdateEditApplicationRequest = z.infer<typeof updateEditApplicationRequestSchema>;

export const applicationContentsSchema = z
	.object({
		applicantFirstName: z.string().nullable(),
		applicantMiddleName: z.string().nullable(),
		applicantLastName: z.string().nullable(),
		applicantTitle: z.string().nullable(),
		applicantSuffix: z.string().nullable(),
		applicantPositionTitle: z.string().nullable(),
		applicantPrimaryAffiliation: z.string().nullable(),
		applicantInstitutionalEmail: z.string().nullable(),
		applicantProfileUrl: z.string().nullable(),
		applicantInstitutionCountry: z.string().nullable(),
		applicantInstitutionStreetAddress: z.string().nullable(),
		applicantInstitutionState: z.string().nullable(),
		applicantInstitutionCity: z.string().nullable(),
		applicantInstitutionPostalCode: z.string().nullable(),
		applicantInstitutionBuilding: z.string().nullable(),
		institutionalRepTitle: z.string().nullable(),
		institutionalRepFirstName: z.string().nullable(),
		institutionalRepMiddleName: z.string().nullable(),
		institutionalRepLastName: z.string().nullable(),
		institutionalRepSuffix: z.string().nullable(),
		institutionalRepPrimaryAffiliation: z.string().nullable(),
		institutionalRepEmail: z.string().nullable(),
		institutionalRepProfileUrl: z.string().nullable(),
		institutionalRepPositionTitle: z.string().nullable(),
		institutionCountry: z.string().nullable(),
		institutionState: z.string().nullable(),
		institutionCity: z.string().nullable(),
		institutionStreetAddress: z.string().nullable(),
		institutionPostalCode: z.string().nullable(),
		institutionBuilding: z.string().nullable(),
		projectTitle: z.string().nullable(),
		projectWebsite: z.string().nullable(),
		projectAims: z.string().nullable(),
		projectMethodology: z.string().nullable(),
		projectBackground: z.string().nullable(),
		projectSummary: z.string().nullable(),
		projectPublicationUrls: z.array(z.string()).nullable(),
		ethicsReviewRequired: z.boolean().nullable(),
		ethicsLetter: z.number().nullable(),
		acceptedAgreements: z.array(z.enum(agreementEnum)).nullable(),
		acceptedAppendices: z.array(z.enum(appendicesEnum)).nullable(),
		requestedStudies: z.array(z.string()).nullable(),
	})
	.partial();

export const updateEditApplicationRequestSchema = applicationContentsSchema;

export const applicationContentsResponseSchema = applicationContentsSchema
	.extend({
		applicationId: z.number(),
		createdAt: z.date(),
		updatedAt: z.date(),
	})
	.partial();

export const editApplicationRequestSchema = z.object({
	id: z.number().nonnegative(),
	update: updateEditApplicationRequestSchema.strict().refine((updateObj) => Object.keys(updateObj).length !== 0, {
		params: { violation: 'noEmptyObject' },
	}),
});

export const applicationResponseSchema = z.object({
	id: z.number(),
	userId: z.string(),
	state: z.nativeEnum(ApplicationStates),
	createdAt: z.date(),
	approvedAt: z.date().nullable(),
	updatedAt: z.date().nullable(),
	expiresAt: z.date().nullable(),
	contents: applicationContentsResponseSchema.nullable(),
});

export const basicApplicationResponseSchema = applicationResponseSchema.omit({ contents: true });

export const revisionDataSchema = z
	.object({
		comments: z.string().optional(),
		applicantNotes: z.string().optional(),
		applicantApproved: z.boolean(),
		institutionRepApproved: z.boolean(),
		institutionRepNotes: z.string().optional(),
		collaboratorsApproved: z.boolean(),
		collaboratorsNotes: z.string().optional(),
		projectApproved: z.boolean(),
		projectNotes: z.string().optional(),
		requestedStudiesApproved: z.boolean(),
		requestedStudiesNotes: z.string().optional(),
		ethicsApproved: z.boolean(),
		ethicsNotes: z.string().optional(),
		agreementsApproved: z.boolean(),
		agreementsNotes: z.string().optional(),
		appendicesApproved: z.boolean(),
		appendicesNotes: z.string().optional(),
		signAndSubmitApproved: z.boolean(),
		signAndSubmitNotes: z.string().optional(),
	})
	.strict();

export const applicationRevisionRequestSchema = revisionDataSchema.refine((data) => Object.keys(data).length !== 0, {
	message: 'revisionData cannot be empty',
});

export const submitApplicationRequestSchema = z
	.object({
		applicationId: z.number().nonnegative().min(1),
		role: z.literal('APPLICANT').or(z.literal('INSTITUTIONAL_REP')),
		signature: z.string().regex(BASE64_IMAGE),
	})
	.strict();
