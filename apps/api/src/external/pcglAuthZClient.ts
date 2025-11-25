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
import logger from '@/logger.ts';
import { AsyncResult, failure, success } from '@/utils/results.ts';
import urlJoin from 'url-join';
import { authZUserInfo, ServiceTokenResponse, type PCGLAuthZUserInfoResponse } from './types.ts';

let serviceToken: string | undefined = undefined;

/**
 * Function to fetch AuthZ serviceToken to append to header requirement X-Service-Token
 */
export const refreshAuthZServiceToken = async () => {
	const { AUTHZ_ENDPOINT, AUTHZ_SERVICE_UUID, AUTHZ_SERVICE_ID } = authConfig;

	try {
		const url = urlJoin(AUTHZ_ENDPOINT, `/service/${AUTHZ_SERVICE_ID}/verify`);

		const response = await fetch(url, {
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

		console.log('test---', tokenResponse);

		if (!validatedAuthZData.success) {
			throw new Error(`Malformed token response`);
		}

		serviceToken = validatedAuthZData.data.token;
	} catch (error) {
		throw new Error(`${error}`);
	}
};

/**
 *  Function to perform fetch requests to AUTHZ service
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
			return await fetch(url, { headers, ...options });
		} catch (error) {
			throw new Error(`Something went wrong fetching authz service. ${error}`);
		}
	}

	// If the serviceToken doesn't exist, then call refresh service token
	if (serviceToken === undefined) {
		await refreshAuthZServiceToken();
	}

	const firstResponse = await _fetchFromAuthZ();

	// CASE-1: Bad bearer token
	if (!firstResponse.ok && firstResponse.status === 401) {
		throw new Error(`Bearer token is invalid`);
	}
	// CASE-2: Bad serviceToken
	// Trigger refresh service token and recall with the new token
	if (!firstResponse.ok && firstResponse.status === 403) {
		await refreshAuthZServiceToken();
		return await _fetchFromAuthZ();
	}

	return firstResponse;
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
