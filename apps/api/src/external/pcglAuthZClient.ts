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
import { serverConfig } from '@/config/serverConfig.ts';
import BaseLogger from '@/logger.ts';
import { AsyncResult, failure, success } from '@/utils/results.ts';
import urlJoin from 'url-join';
import { fetchWithRetry } from './fetchWithRetry.ts';
import {
	addUserToStudyPermissionResponse,
	authZUserInfo,
	lookupUserResponse,
	ServiceTokenResponse,
	type PCGLAddUserToStudyPermissionResponse,
	type PCGLAuthzLookupUserResponse,
	type PCGLAuthZUserInfoResponse,
} from './types.ts';

const logger = BaseLogger.forModule('authZClient');

let serviceToken: string | undefined = undefined;

const today = new Date().toISOString();

const addDaysToDateString = (dateString: string, days: number) => {
	const date = new Date(dateString);
	date.setDate(date.getDate() + days);
	return date.toISOString();
};

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Function to fetch AuthZ serviceToken to append to header requirement X-Service-Token
 */
export const refreshAuthZServiceToken = async () => {
	const { AUTHZ_ENDPOINT, AUTHZ_SERVICE_UUID, AUTHZ_SERVICE_ID } = authConfig;

	try {
		const url = urlJoin(AUTHZ_ENDPOINT, `/service/${AUTHZ_SERVICE_ID}/verify`);

		const response = await fetchWithRetry(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				service_uuid: AUTHZ_SERVICE_UUID,
			}),
		});
		if (!response.ok) {
			throw new Error(`Failed to fetch service token with status ${response.status}`);
		}
		const tokenResponse = await response.json();

		const validatedAuthZData = ServiceTokenResponse.safeParse(tokenResponse);
		if (!validatedAuthZData.success) {
			throw new Error(`Malformed token response`);
		}

		serviceToken = validatedAuthZData.data.token;
	} catch (error) {
		throw new Error(`${error}`);
	}
};

/**
 * Function to perform fetch requests to AUTHZ service.
 * It uses a retry mechanishm
 *
 * @param resource endpoint to query from authz
 * @param token authorization token
 * @param options optional additional request configurations for the fetch call
 *
 */
export const fetchAuthZResource = async (resource: string, token: string, options?: RequestInit) => {
	/**
	 * Internal function that does the work of fetching the resource from AuthZ.
	 * We will need to retry this if this is rejected due to an expired serviceToken.
	 */
	async function _fetchFromAuthZ() {
		const { AUTHZ_ENDPOINT, AUTHZ_SERVICE_ID } = authConfig;

		const url = urlJoin(AUTHZ_ENDPOINT, resource);
		const headers = new Headers({
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			'X-Service-ID': `${AUTHZ_SERVICE_ID}`,
			'X-Service-Token': `${serviceToken}`,
		});

		try {
			// We do not require to retry automatically the fetch here, since the request depends on refreshing the service token before retrying.
			return await fetch(url, { headers, ...options });
		} catch (error) {
			throw new Error(`Something went wrong fetching authz service. ${error}`);
		}
	}

	// If the serviceToken doesn't exist, then call refresh service token
	if (serviceToken === undefined) {
		await refreshAuthZServiceToken();
	}

	// Retry mechanism for authz requires to refresh service token before retying fetch call
	const { FETCH_RETRIES, FETCH_RETRY_DELAY_MS } = serverConfig;
	let attempt = 0;
	while (true) {
		try {
			const response = await _fetchFromAuthZ();

			if (!response.ok && attempt < FETCH_RETRIES) {
				// Refresh Service token when Bearer is invalid
				if (response.status === 401 || response.status === 403) {
					await refreshAuthZServiceToken();
				}

				attempt++;
				await sleep(FETCH_RETRY_DELAY_MS);
				continue;
			}

			return response;
		} catch (error) {
			if (attempt >= FETCH_RETRIES) {
				throw new Error(`Something went wrong fetching AuthZ service: ${String(error)}`);
			}

			attempt++;
			await sleep(FETCH_RETRY_DELAY_MS);
		}
	}
};

export const getUserInformation = async (
	accessToken: string,
): AsyncResult<PCGLAuthZUserInfoResponse, 'SYSTEM_ERROR' | 'FORBIDDEN' | 'NOT_FOUND'> => {
	try {
		const response = await fetchAuthZResource('/user/me', accessToken);

		if (response.status === 204) {
			// A "204 No content" response is returned when the user is not registered.
			return failure('NOT_FOUND', 'Unable to retrieve user information from the PCGL AuthZ service.');
		}

		const res = await response.json();

		const validatedAuthZData = authZUserInfo.safeParse(res);

		if (!validatedAuthZData.success) {
			logger.error(`[AUTHZ]: AuthZ service returned unexpected, or malformed data.`, validatedAuthZData.error);
			return failure('SYSTEM_ERROR', 'Unable to retrieve user information from the PCGL AuthZ service.');
		}

		return success(validatedAuthZData.data);
	} catch (error) {
		logger.error(`[AUTHZ]: Unexpected error while getting user info from the AuthZ service.`, error);
		return failure('SYSTEM_ERROR', `Error contacting the PCGL Authorization Service.`);
	}
};

/**
 * Function to lookup a user by their email address in the AuthZ service
 * @param emailAddress
 * @param accessToken
 * @returns a list of PCGL IDs that match the email provided
 */
export const lookupUserByEmail = async (
	emailAddress: string,
	accessToken: string,
): AsyncResult<PCGLAuthzLookupUserResponse, 'SYSTEM_ERROR' | 'NOT_FOUND'> => {
	try {
		const queryParams = new URLSearchParams();
		queryParams.set('email', emailAddress);
		const response = await fetchAuthZResource(`/user/lookup?${queryParams.toString()}`, accessToken);

		if (response.status === 404) {
			const message = `No user found with email ${emailAddress}.`;
			logger.info('[AUTHZ]:', message);
			return failure('NOT_FOUND', message);
		}

		const res = await response.json();

		const resultLookUpUser = lookupUserResponse.safeParse(res);

		if (!resultLookUpUser.success) {
			const message = `AuthZ service returned unexpected data to find user with email ${emailAddress}`;
			logger.error(`[AUTHZ]: ${message}`, resultLookUpUser.error);
			return failure('SYSTEM_ERROR', message);
		}

		return success(resultLookUpUser.data);
	} catch (error) {
		const message = `Unexpected error while getting user with email ${emailAddress}`;
		logger.error('[AUTHZ]:', message, error);
		return failure('SYSTEM_ERROR', message);
	}
};

/**
 * Function to Add user to study permission in the AuthZ service
 * @param studyId
 * @param userPcglId
 * @param accessToken
 * @returns a list of study permissions for the user, otherwise returns failure with SYSTEM_ERROR
 */
export const addUserToStudyPermission = async (
	studyId: string,
	userPcglId: string,
	accessToken: string,
): AsyncResult<PCGLAddUserToStudyPermissionResponse, 'SYSTEM_ERROR'> => {
	const { APPROVED_PERMISSION_EXPIRES_IN_DAYS } = authConfig;
	try {
		const response = await fetchAuthZResource(`/user/${userPcglId}`, accessToken, {
			method: 'POST',
			body: JSON.stringify({
				study_id: studyId,
				start_date: today,
				end_date: addDaysToDateString(today, APPROVED_PERMISSION_EXPIRES_IN_DAYS),
			}),
		});

		if (!response.ok) {
			const message = `Failed to add user '${userPcglId}' to study '${studyId}'`;
			logger.error('[AUTHZ]:', message, `Status: ${response.status}, Message: ${await response.text()}`);
			return failure('SYSTEM_ERROR', message);
		}

		const res = await response.json();

		const resultAddPermission = addUserToStudyPermissionResponse.safeParse(res);

		if (!resultAddPermission.success) {
			const message = `AuthZ service returned unexpected data to add user to study permission`;
			logger.error(`[AUTHZ]: ${message}`, resultAddPermission.error);
			return failure('SYSTEM_ERROR', message);
		}

		return success(resultAddPermission.data);
	} catch (error) {
		const message = `Unexpected error while adding ${userPcglId} to study ${studyId}`;
		logger.error('[AUTHZ]:', message, error);
		return failure('SYSTEM_ERROR', message);
	}
};
