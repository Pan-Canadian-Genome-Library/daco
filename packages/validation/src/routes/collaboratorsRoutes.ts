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
import { EmptyOrOptionalString, NonEmptyString } from '../common/strings.js';

export const collaboratorsSchema = z.object({
	collaboratorFirstName: NonEmptyString,
	collaboratorMiddleName: EmptyOrOptionalString,
	collaboratorLastName: NonEmptyString,
	collaboratorSuffix: EmptyOrOptionalString,
	collaboratorInstitutionalEmail: NonEmptyString.email(),
	collaboratorPositionTitle: EmptyOrOptionalString,
	collaboratorPrimaryAffiliation: EmptyOrOptionalString,
	collaboratorResearcherProfileURL: EmptyOrOptionalString,
	collaboratorType: EmptyOrOptionalString,
});

export type CollaboratorsSchemaType = z.infer<typeof collaboratorsSchema>;

export const baseCollaboratorsRequestSchema = z.object({
	applicationId: z.number(),
});

export const collaboratorsCreateRequestSchema = baseCollaboratorsRequestSchema.extend({
	collaborators: z.array(collaboratorsSchema).nonempty(),
});

export const collaboratorsDeleteRequestSchema = baseCollaboratorsRequestSchema.extend({
	collaboratorId: z.number(),
});

export const collaboratorsUpdateRequestSchema = baseCollaboratorsRequestSchema.extend({
	collaboratorUpdates: collaboratorsSchema,
});

export const collaboratorsListParamsSchema = z
	.object({
		applicationId: z.coerce.number().int().gt(0),
	})
	.required();

export const collaboratorsDeleteParamsSchema = z
	.object({
		applicationId: z.coerce.number().int().gt(0),
		collaboratorId: z.coerce.number().int().gt(0),
	})
	.required();
