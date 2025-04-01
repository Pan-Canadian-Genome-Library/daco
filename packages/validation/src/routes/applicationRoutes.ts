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
import { BASE64_IMAGE } from '../utils/regex.js';

export type EditApplicationRequest = z.infer<typeof editApplicationRequestSchema>;
export type UpdateEditApplicationRequest = z.infer<typeof updateEditApplicationRequestSchema>;

export const updateEditApplicationRequestSchema = z
	.object({
		applicantFirstName: z.string(),
		applicantMiddleName: z.string(),
		applicantLastName: z.string(),
		applicantTitle: z.string(),
		applicantSuffix: z.string(),
		applicantPositionTitle: z.string(),
		applicantPrimaryAffiliation: z.string(),
		applicantInstitutionalEmail: z.string(),
		applicantProfileUrl: z.string(),
		institutionalRepTitle: z.string(),
		institutionalRepFirstName: z.string(),
		institutionalRepMiddleName: z.string(),
		institutionalRepLastName: z.string(),
		institutionalRepSuffix: z.string(),
		institutionalRepPrimaryAffiliation: z.string(),
		institutionalRepEmail: z.string(),
		institutionalRepProfileUrl: z.string(),
		institutionalRepPositionTitle: z.string(),
		institutionCountry: z.string(),
		institutionState: z.string(),
		institutionCity: z.string(),
		institutionStreetAddress: z.string(),
		institutionPostalCode: z.string(),
		institutionBuilding: z.string(),
		projectTitle: z.string(),
		projectWebsite: z.string(),
		projectAims: z.string(),
		projectMethodology: z.string(),
		projectSummary: z.string(),
		requestedStudies: z.array(z.string()),
		ethicsReviewRequired: z.boolean(),
		ethicsLetter: z.number(),
	})
	.partial();

export const editApplicationRequestSchema = z.object({
	id: z.number().nonnegative(),
	update: updateEditApplicationRequestSchema.strict().refine((updateObj) => Object.keys(updateObj).length !== 0, {
		params: { violation: 'noEmptyObject' },
	}),
});

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
