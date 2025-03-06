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

export type EditApplicationRequest = z.infer<typeof editApplicationRequestSchema>;
export type UpdateEditApplicationRequest = z.infer<typeof updateEditApplicationRequestSchema>;

export const updateEditApplicationRequestSchema = z
	.object({
		applicantFirstname: z.string(),
		applicantMiddlename: z.string(),
		applicantLastname: z.string(),
		applicantTitle: z.string(),
		applicantSuffix: z.string(),
		applicantPositionTitle: z.string(),
		applicantPrimaryAffiliation: z.string(),
		applicantInstitutionalEmail: z.string(),
		applicantProfileUrl: z.string(),
		institutionalRepTitle: z.string(),
		institutionalRepFirstname: z.string(),
		institutionalRepMiddlename: z.string(),
		institutionalRepLastname: z.string(),
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
	})
	.partial();

export const editApplicationRequestSchema = z.object({
	id: z.number().nonnegative(),
	update: updateEditApplicationRequestSchema.strict().refine((updateObj) => Object.keys(updateObj).length !== 0, {
		params: { violation: 'noEmptyObject' },
	}),
});

export const submitApplicationRequestSchema = z
	.object({
		applicationId:  z.string().min(1),
		role: z.enum(['APPLICANT', 'REP']),
		signature: z.string().min(1),
	})
	.strict();
