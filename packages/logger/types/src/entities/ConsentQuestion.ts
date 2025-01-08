/*
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
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
import { generateSchema } from '@anatine/zod-openapi';
import type { SchemaObject } from 'openapi3-ts/oas31';

import { ConsentCategory } from './fields/index.js';

const CONSENT_QUESTION_IDS = [
	'INFORMED_CONSENT__READ_AND_UNDERSTAND',
	'RECONTACT__FUTURE_RESEARCH',
	'RECONTACT__SECONDARY_CONTACT',
	'RELEASE_DATA__CLINICAL_AND_GENETIC',
	'RELEASE_DATA__DE_IDENTIFIED',
	'RESEARCH_PARTICIPATION__CONTACT_INFORMATION',
	'RESEARCH_PARTICIPATION__FUTURE_RESEARCH',
	'REVIEW_SIGN__SIGNED',
] as const;

export const ConsentQuestionId = z.enum(CONSENT_QUESTION_IDS);
export type ConsentQuestionId = z.infer<typeof ConsentQuestionId>;
export const ConsentQuestionIdSchema: SchemaObject = generateSchema(ConsentQuestionId);

export const ConsentQuestion = z.object({
	id: ConsentQuestionId,
	isActive: z.boolean(),
	category: ConsentCategory,
});

export type ConsentQuestion = z.infer<typeof ConsentQuestion>;
export const ConsentQuestionSchema: SchemaObject = generateSchema(ConsentQuestion);

export const ConsentQuestionArray = z.array(ConsentQuestion);
export type ConsentQuestionArray = z.infer<typeof ConsentQuestionArray>;
export const ConsentQuestionArraySchema: SchemaObject = generateSchema(ConsentQuestionArray);

export const ConsentQuestionsRequest = z.object({
	category: ConsentCategory.optional(),
});
export type ConsentQuestionsRequest = z.infer<typeof ConsentQuestionsRequest>;
