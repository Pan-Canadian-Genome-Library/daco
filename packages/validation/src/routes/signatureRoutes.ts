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

import { SignatureTypes } from '@pcgl-daco/data-model';
import { z } from 'zod';
import { BASE64_IMAGE } from '../utils/regex.js';

export const editSignatureRequestSchema = z.object({
	applicationId: z.number().nonnegative().positive(),
	signature: z.string().regex(BASE64_IMAGE),
	signee: z.nativeEnum(SignatureTypes),
});
export type EditSignatureRequest = z.infer<typeof editSignatureRequestSchema>;

export const applicationSignatureDTOSchema = z.object({
	id: z.number().nonnegative().positive(),
	signature: z.string().regex(BASE64_IMAGE),
	signedAt: z.string().datetime().optional(),
});
export type ApplicationSignatureDTO = z.infer<typeof editSignatureResponseSchema>;

export const editSignatureResponseSchema = applicationSignatureDTOSchema;
export type EditSignatureResponse = z.infer<typeof editSignatureResponseSchema>;

export const getSignatureParamsSchema = z
	.object({
		applicationId: z.coerce.number().int().gt(0),
	})
	.required();

export const deleteSignatureParamsSchema = z.object({
	applicationId: z.coerce.number().int().gt(0),
});

export const deleteSignatureQuerySchema = z.object({
	signee: z.literal('APPLICANT').or(z.literal('INSTITUTIONAL_REP')),
});

export const signatureResponseSchema = z.object({
	applicationId: z.number(),
	applicantSignature: z.string().nullable().optional(),
	applicantSignedAt: z.date().nullable().optional(),
	institutionalRepSignature: z.string().nullable().optional(),
	institutionalRepSignedAt: z.date().nullable().optional(),
});
