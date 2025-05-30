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
	type ApplicationRecord,
	type ApplicationSignatureUpdate,
	type CollaboratorRecord,
	type FilesRecord,
	type JoinedApplicationRecord,
	type RevisionRequestModel,
} from '@/service/types.js';
import {
	type ApplicationDTO,
	type ApplicationResponseData,
	type CollaboratorsResponseDTO,
	type FilesDTO,
	type RevisionsDTO,
	type SignatureDTO,
} from '@pcgl-daco/data-model';
import {
	applicationResponseSchema,
	basicApplicationResponseSchema,
	fileResponseSchema,
	revisionDataResponseSchema,
	signatureResponseSchema,
	type UpdateEditApplicationRequest,
} from '@pcgl-daco/validation';
import { objectToCamel, objectToSnake } from 'ts-case-convert';
import { failure, Result, success } from './results.ts';
import { applicationContentUpdateSchema } from './schemas.ts';

/** Converts database Application Record into camelCase response record
 * @param data Joined Application Record - Snake case database Application / ApplicationContents record
 * @returns ApplicationResponseData - Application record with updated keys
 */
export const convertToBasicApplicationRecord = (data: ApplicationRecord): Result<ApplicationDTO, 'SYSTEM_ERROR'> => {
	const aliasedRecord = objectToCamel(data);
	const validationResult = basicApplicationResponseSchema.safeParse(aliasedRecord);
	const result = validationResult.success
		? success(validationResult.data)
		: failure(
				'SYSTEM_ERROR',
				`Validation Error while aliasing data at convertToBasicApplicationRecord: \n${validationResult.error.issues[0]?.message || ''}`,
			);
	return result;
};

/** Converts database Application Record + Contents into camelCase response record
 * @param data Joined Application Record - Snake case database Application / ApplicationContents record
 * @returns ApplicationResponseData - Application record with updated keys
 */
export const convertToApplicationRecord = (
	data: JoinedApplicationRecord,
): Result<ApplicationResponseData, 'SYSTEM_ERROR'> => {
	const aliasedRecord = objectToCamel(data);
	const validationResult = applicationResponseSchema.safeParse(aliasedRecord);
	const result = validationResult.success
		? success(validationResult.data)
		: failure(
				'SYSTEM_ERROR',
				`Validation Error while aliasing data at convertToApplicationRecord: \n${validationResult.error.issues[0]?.message || ''}`,
			);
	return result;
};

/** Converts partial Application Content update into database insert snake_case model format
 * @param data type UpdateEditApplicationRequest application contents in camelCase
 * @returns  type ApplicationContentUpdates in snake_case
 */
export const convertToApplicationContentsRecord = (
	update: UpdateEditApplicationRequest,
): Result<ApplicationContentUpdates, 'SYSTEM_ERROR'> => {
	const snakeCaseRecord = objectToSnake(update);
	const validationResult = applicationContentUpdateSchema.safeParse(snakeCaseRecord);
	const result = validationResult.success
		? success(validationResult.data)
		: failure(
				'SYSTEM_ERROR',
				`Validation Error while aliasing data at convertToApplicationContentsRecord: \n${validationResult.error.issues[0]?.message || ''}`,
			);
	return result;
};

/**
 * Helper function to convert Postgres snake_case to FE camelCase for the Signature Service
 * @param data type `ApplicationSignatureUpdate` - Signature fields + application_id from the DB
 * @returns type `SignatureDTO` - camelCase variation of a Postgres success response.
 */
export const convertToSignatureRecord = (data: ApplicationSignatureUpdate): Result<SignatureDTO, 'SYSTEM_ERROR'> => {
	const camelCaseRecord = objectToCamel(data);
	const validationResult = signatureResponseSchema.safeParse(camelCaseRecord);
	const result = validationResult.success
		? success(validationResult.data)
		: failure(
				'SYSTEM_ERROR',
				`Validation Error while aliasing data at convertToSignatureRecord: \n${validationResult.error.issues[0]?.message || ''}`,
			);
	return result;
};

/**
 * Helper function to convert Postgres snake_case to FE camelCase for the File Service
 * @param data type `FileRecord` - File fields from the DB
 * @returns type `FileDTO` - camelCase variation of a Postgres success response.
 */
export const convertToFileRecord = (data: FilesRecord): Result<FilesDTO, 'SYSTEM_ERROR'> => {
	const camelCaseRecord = objectToCamel(data);
	const validationResult = fileResponseSchema.safeParse(camelCaseRecord);
	const result = validationResult.success
		? success(validationResult.data)
		: failure(
				'SYSTEM_ERROR',
				`Validation Error while aliasing data at convertToFileRecord: \n${validationResult.error.issues[0]?.message || ''}`,
			);
	return result;
};

/**
 * Helper function to change CollaboratorRecord db keys to DTO Collaborator camelCase keys
 * @param data type CollaboratorRecord in snake_case
 * @returns  type GetCollaboratorsResponse in camelCase w/ Collaborator added
 */
export const convertToCollaboratorRecords = (data: CollaboratorRecord[]): CollaboratorsResponseDTO[] => {
	const formattedUpdate: CollaboratorsResponseDTO[] = [];

	data.forEach((value) => {
		formattedUpdate.push({
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

/**
 * Helper function to convert Postgres snake_case to FE camelCase for the Revisions Service
 * @param data type `RevisionRequestModel` - File fields from the DB
 * @returns type `RevisionsDTO` - camelCase variation of a Postgres success response.
 */
export const convertToRevisionsRecord = (data: RevisionRequestModel): Result<RevisionsDTO, 'SYSTEM_ERROR'> => {
	const camelCaseRecord = objectToCamel(data);
	const validationResult = revisionDataResponseSchema.safeParse(camelCaseRecord);
	const result = validationResult.success
		? success(validationResult.data)
		: failure(
				'SYSTEM_ERROR',
				`Validation Error while aliasing data at convertToRevisionRecord: \n${validationResult.error.issues[0]?.message || ''}`,
			);
	return result;
};
