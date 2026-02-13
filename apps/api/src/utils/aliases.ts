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

import { authConfig } from '@/config/authConfig.ts';
import { OIDCTokenResponse, OIDCUserInfoResponse, PCGLAuthZUserInfoResponse } from '@/external/types.ts';
import {
	type ApplicationActionRecord,
	type ApplicationContentUpdates,
	type ApplicationRecord,
	type ApplicationSignatureUpdate,
	type CollaboratorRecord,
	type FilesRecordOptionalContents,
	type JoinedApplicationRecord,
} from '@/service/types.js';
import {
	type ApplicationDTO,
	type ApplicationHistoryResponseData,
	type ApplicationResponseData,
	type CollaboratorsResponseDTO,
	type FilesDTO,
	type SignatureDTO,
} from '@pcgl-daco/data-model';
import {
	applicationHistoryResponseSchema,
	applicationResponseSchema,
	basicApplicationResponseSchema,
	fileResponseSchema,
	sessionAccount,
	type SessionAccount,
	sessionUser,
	type SessionUser,
	signatureResponseSchema,
	type UpdateEditApplicationRequest,
} from '@pcgl-daco/validation';
import { objectToCamel, objectToSnake } from 'ts-case-convert';
import { failure, Result, success } from './results.ts';
import { applicationContentUpdateSchema } from './schemas.ts';

export const convertToSessionAccount = (data: OIDCTokenResponse): Result<SessionAccount, 'SYSTEM_ERROR'> => {
	const aliasedTokenResponse = objectToCamel(data);
	const validationResult = sessionAccount.safeParse(aliasedTokenResponse);
	const result = validationResult.success
		? success(validationResult.data)
		: failure(
				'SYSTEM_ERROR',
				`Validation Error while aliasing data at convertToSessionAccount: \n${validationResult.error.issues[0]?.message || ''}`,
			);
	return result;
};

export const convertToSessionUser = (
	oidcData: OIDCUserInfoResponse,
	pcglData: PCGLAuthZUserInfoResponse,
): Result<SessionUser, 'SYSTEM_ERROR'> => {
	const aliasedOIDCResponse = objectToCamel(oidcData);

	const aliasedPCGLResponse = objectToCamel(pcglData);

	let aliasedGroup = aliasedPCGLResponse.groups || [];

	const finalizedUserObject: SessionUser = {
		sub: aliasedOIDCResponse.sub,
		userId: aliasedPCGLResponse.userinfo.pcglId,
		emails: aliasedPCGLResponse.userinfo.emails,
		givenName: aliasedOIDCResponse.givenName,
		familyName: aliasedOIDCResponse.familyName,
		siteAdmin: aliasedPCGLResponse.userinfo.siteAdmin,
		siteCurator: aliasedPCGLResponse.userinfo.siteCurator,
		studyAuthorizations: aliasedPCGLResponse.studyAuthorizations,
		dacAuthorizations: aliasedPCGLResponse.dacAuthorizations,
		groups: aliasedGroup,

		// DACO generated values
		dacoAdmin:
			aliasedGroup.length > 0 ? aliasedGroup.some((group) => group.name === authConfig.AUTHZ_GROUP_ADMIN) : false,
		dacChair: aliasedGroup
			.filter((group) => group.name.startsWith(authConfig.AUTHZ_GROUP_PREFIX_DAC_CHAIR))
			.map((group) => {
				return group.name.slice(authConfig.AUTHZ_GROUP_PREFIX_DAC_CHAIR.length);
			}),
		dacMember: aliasedGroup
			.filter((group) => group.name.startsWith(authConfig.AUTHZ_GROUP_PREFIX_DAC_MEMBER))
			.map((group) => {
				return group.name.slice(authConfig.AUTHZ_GROUP_PREFIX_DAC_MEMBER.length);
			}),
	};

	const userAccountValidation = sessionUser.safeParse(finalizedUserObject);

	const result = userAccountValidation.success
		? success(userAccountValidation.data)
		: failure(
				'SYSTEM_ERROR',
				`Validation Error while aliasing data at convertToSessionUser: \n${userAccountValidation.error.issues[0]?.message || ''}`,
			);
	return result;
};

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

/** Converts database Application Action Records into camelCase response records
 * @param data ApplicationActionRecord - Snake case database Application Action record array
 * @returns ApplicationHistoryResponseData - Array of Action records with updated keys
 */
export const convertToApplicationHistoryRecord = (
	data: ApplicationActionRecord[],
): Result<ApplicationHistoryResponseData, 'SYSTEM_ERROR'> => {
	const aliasedRecords = data.map((action) => objectToCamel(action));
	const validationResults = aliasedRecords.map((record) => applicationHistoryResponseSchema.safeParse(record));
	const successResults: ApplicationHistoryResponseData = validationResults
		.filter((item) => item.success)
		.map((item) => item.data);
	const failedResult = validationResults.find((result) => !result.success);
	const result = !failedResult
		? success(successResults)
		: failure(
				'SYSTEM_ERROR',
				`Validation Error while aliasing data at convertToApplicationHistoryRecord: \n${failedResult.error.issues[0]?.message || ''}`,
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
export const convertToFileRecord = (data: FilesRecordOptionalContents): Result<FilesDTO, 'SYSTEM_ERROR'> => {
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
