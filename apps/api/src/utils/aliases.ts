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
import {
	type ApplicationContentsResponse,
	type ApplicationResponseData,
	type GetCollaboratorsResponse,
	type SignatureDTO,
} from '@pcgl-daco/data-model/src/types.js';
import { type UpdateEditApplicationRequest } from '@pcgl-daco/validation';
import { camelCase, snakeCase } from 'lodash';

type inputKey = string & keyof Record<string, any>;

/** Used in filter functions for alias utilities below
 * @param key Current key to validate
 * @param omittedKeys List of keys to remove from output
 */
const filterOmittedKeys = (omittedKeys: string[]) => (key: string) => !omittedKeys.includes(key);

/**
 * Helper function to convert Postgres snake_case to FE camelCase
 * Generics allow usage w/ multiple input/output combinations
 * @param data Original Database record with snake case keys to convert
 * @param omittedKeys List of keys to remove from output for cases where a partial record is returned
 * @returns ResponseRecord - Generic type representing new record with updated camelCase keys
 */
export const aliasToResponseData = <
	DatabaseRecord extends Record<string, any>,
	ResponseRecord extends Record<string, any>,
>(
	data: DatabaseRecord,
	omittedKeys: string[] = [],
): ResponseRecord => {
	const allKeys: inputKey[] = Object.keys(data);

	const filteredKeys = allKeys.filter(filterOmittedKeys(omittedKeys));

	const responseData = filteredKeys.reduce((acc, key) => {
		const aliasedKey = camelCase(key);
		const value = data[key];
		const accumulator = { ...acc, [aliasedKey]: value };
		return accumulator;
	}, {}) as ResponseRecord;

	return responseData;
};

/**
 * Helper function to convert FE camelCase to Postgres snake_case
 * Generics allow usage w/ multiple input/output combinations
 * @param data Original Request record with camelCase keys to convert
 * @param omittedKeys List of keys to remove from output for cases where a partial record is returned
 * @returns DatabaseRecord - Generic type representing new record with updated snake_case keys
 */
export const aliasToDatabaseData = <
	RequestRecord extends Record<string, any>,
	DatabaseRecord extends Record<string, any>,
>(
	data: RequestRecord,
	omittedKeys: string[] = [],
): DatabaseRecord => {
	const allKeys: inputKey[] = Object.keys(data);

	const filteredKeys = allKeys.filter(filterOmittedKeys(omittedKeys));

	const databaseData = filteredKeys.reduce((acc, key) => {
		const aliasedKey = snakeCase(key);
		const value = data[key];
		const accumulator = { ...acc, [aliasedKey]: value };
		return accumulator;
	}, {}) as DatabaseRecord;

	return databaseData;
};

/** Convenience function for specific alias utils input/output scenarios
 * @param data Joined Application Record - Snake case database Application / ApplicationContents record
 * @returns ApplicationResponseData - Application record with updated keys
 */
export const aliasApplicationRecord = (data: JoinedApplicationRecord): ApplicationResponseData => {
	const {
		id,
		user_id: userId,
		state,
		created_at: createdAt,
		approved_at: approvedAt,
		updated_at: updatedAt,
		expires_at: expiresAt,
		contents: applicationContents,
	} = data;

	const omittedKeys = [
		'id',
		'applicant_signature',
		'applicant_signed_at',
		'institutional_rep_signature',
		'institutional_rep_signed_at',
		'ethics_review_required',
		'ethics_letter',
		'signed_pdf',
	];

	const contents = applicationContents
		? aliasToResponseData<ApplicationContentUpdates, ApplicationContentsResponse>(applicationContents, omittedKeys)
		: null;

	return {
		id,
		userId,
		state,
		createdAt,
		approvedAt,
		updatedAt,
		expiresAt,
		contents,
	};
};

/** Convenience function for specific alias utils input/output scenarios
 * @param data type UpdateEditApplicationRequest application contents in camelCase
 * @returns  type ApplicationContentUpdates in snake_case
 */
export const aliasApplicationContentsRecord = (update: UpdateEditApplicationRequest): ApplicationContentUpdates => {
	const omitKeys = [
		'id',
		'applicantSignature',
		'applicantSignedAt',
		'institutionalRepSignature',
		'institutionalRepSignedAt',
	];
	const formattedUpdate = aliasToDatabaseData<UpdateEditApplicationRequest, ApplicationContentUpdates>(
		update,
		omitKeys,
	);

	return formattedUpdate;
};

/**
 * Helper function to convert Postgres snake_case to FE camelCase for the Signature Service
 * @param data type `ApplicationSignatureUpdate` - Signature fields + application_id from the DB
 * @returns type `SignatureDTO` - camelCase variation of a Postgress success response.
 */
export const aliasSignatureRecord = (data: ApplicationSignatureUpdate): SignatureDTO => {
	const responseData = aliasToResponseData<ApplicationSignatureUpdate, SignatureDTO>(data);

	return responseData;
};

/**
 * Helper function to change CollaboratorRecord db keys to DTO Collaborator camelCase keys
 * @param data type CollaboratorRecord in snake_case
 * @returns  type GetCollaboratorsResponse in camelCase w/ Collaborator added
 */
export const aliasCollaboratorRecord = (data: CollaboratorRecord[]): GetCollaboratorsResponse[] => {
	const formattedUpdate: GetCollaboratorsResponse[] = [];

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
