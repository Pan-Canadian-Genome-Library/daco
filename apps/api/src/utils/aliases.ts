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

import {
	type ApplicationContentUpdates,
	type ApplicationSignatureUpdate,
	type CollaboratorRecord,
	type JoinedApplicationRecord,
} from '@/service/types.js';
import { ApplicationResponseData } from '@pcgl-daco/data-model';
import { type CollaboratorsResponse, type SignatureDTO } from '@pcgl-daco/data-model/src/types.js';
import {
	applicationResponseSchema,
	editSignatureRequestSchema,
	type UpdateEditApplicationRequest,
	updateEditApplicationRequestSchema,
} from '@pcgl-daco/validation';
import { type ObjectToCamel, objectToCamel, objectToSnake, type ObjectToSnake } from 'ts-case-convert';
import { type SafeParseReturnType } from 'zod';

/** Convenience function for specific alias utils input/output scenarios
 * @param data Joined Application Record - Snake case database Application / ApplicationContents record
 * @returns ApplicationResponseData - Application record with updated keys
 */
export const aliasApplicationRecord = (
	data: JoinedApplicationRecord,
): SafeParseReturnType<ObjectToCamel<JoinedApplicationRecord>, ApplicationResponseData> => {
	const aliasedRecord = objectToCamel(data);
	const validationResult = applicationResponseSchema.safeParse(aliasedRecord);
	return validationResult;
};

/** Convenience function for specific alias utils input/output scenarios
 * @param data type UpdateEditApplicationRequest application contents in camelCase
 * @returns  type ApplicationContentUpdates in snake_case
 */
export const aliasApplicationContentsRecord = (
	update: UpdateEditApplicationRequest,
): SafeParseReturnType<ObjectToSnake<UpdateEditApplicationRequest>, ApplicationContentUpdates> => {
	const snakeCaseRecord = objectToSnake(update);
	const validationResult = updateEditApplicationRequestSchema.safeParse(snakeCaseRecord);
	// TODO: Use correct schema
	return validationResult;
};

/**
 * Helper function to convert Postgres snake_case to FE camelCase for the Signature Service
 * @param data type `ApplicationSignatureUpdate` - Signature fields + application_id from the DB
 * @returns type `SignatureDTO` - camelCase variation of a Postgress success response.
 */
export const aliasSignatureRecord = (
	data: ApplicationSignatureUpdate,
): SafeParseReturnType<ObjectToCamel<ApplicationSignatureUpdate>, SignatureDTO> => {
	const camelCaseRecord = objectToCamel(data);
	const validationResult = editSignatureRequestSchema.safeParse(camelCaseRecord);

	return validationResult;
};

/**
 * Helper function to change CollaboratorRecord db keys to DTO Collaborator camelCase keys
 * @param data type CollaboratorRecord in snake_case
 * @returns  type GetCollaboratorsResponse in camelCase w/ Collaborator added
 */
export const aliasCollaboratorRecord = (data: CollaboratorRecord[]): CollaboratorsResponse[] => {
	const formattedUpdate: CollaboratorsResponse[] = [];

	data.forEach((value) => {
		formattedUpdate.push({
			id: value.id,
			applicationId: value.application_id,
			collaboratorFirstName: value.first_name,
			collaboratorMiddleName: value.middle_name,
			collaboratorLastName: value.last_name,
			collaboratorInstitutionalEmail: value.institutional_email,
			collaboratorPositionTitle: value.position_title,
			collaboratorPrimaryAffiliation: value.title,
			collaboratorResearcherProfileURL: value.profile_url,
			collaboratorSuffix: value.suffix,
			collaboratorType: value.collaborator_type,
		});
	});

	return formattedUpdate;
};
