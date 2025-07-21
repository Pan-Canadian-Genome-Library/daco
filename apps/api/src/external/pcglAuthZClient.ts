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

import axios, { isAxiosError, type AxiosRequestConfig } from 'axios';

import { type AuthConfig } from '@/config/authConfig.ts';
import { serverConfig } from '@/config/serverConfig.ts';
import logger from '@/logger.ts';
import { AsyncResult, failure, success } from '@/utils/results.ts';
import { authZUserInfo, type PCGLAuthZUserInfoResponse } from './types.ts';

const authZClient = async ({
	authConfig,
	httpMethod = 'GET',
	endpointURL,
	accessToken,
	body,
}: {
	authConfig: AuthConfig;
	httpMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	endpointURL: string;
	accessToken?: string;
	body?: any;
}) => {
	const axiosOptions: AxiosRequestConfig = {
		headers: {
			Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
			'User-Agent': `PCGL DACO Service / ${serverConfig.npm_package_version}`,
			'Content-Type': `application/json`,
		},
		data: body ? body : undefined,
	};

	switch (httpMethod) {
		case 'GET':
			return await axios.get(`${authConfig.AUTHZ_ENDPOINT}${endpointURL}`, axiosOptions);
		case 'POST':
			return await axios.post(`${authConfig.AUTHZ_ENDPOINT}${endpointURL}`, axiosOptions);
		case 'DELETE':
			return await axios.delete(`${authConfig.AUTHZ_ENDPOINT}${endpointURL}`, axiosOptions);
		case 'PATCH':
			return await axios.patch(`${authConfig.AUTHZ_ENDPOINT}${endpointURL}`, axiosOptions);
		case 'PUT':
			return await axios.put(`${authConfig.AUTHZ_ENDPOINT}${endpointURL}`, axiosOptions);
	}
};

export const getUserInformation = async (
	authConfig: AuthConfig,
	accessToken: string,
): AsyncResult<PCGLAuthZUserInfoResponse, 'SYSTEM_ERROR' | 'FORBIDDEN' | 'NOT_FOUND'> => {
	try {
		const request = await authZClient({ authConfig, endpointURL: '/user/me', accessToken });
		const validatedAuthZData = authZUserInfo.safeParse(request.data);

		if (!validatedAuthZData.success) {
			logger.error(`PCGL AuthZ service returned unexpected, or malformed data. ${validatedAuthZData.error}`);
			return failure('SYSTEM_ERROR', 'Unable to retrieve user information from the PCGL AuthZ service.');
		}

		return success(validatedAuthZData.data);
	} catch (error) {
		if (!isAxiosError(error)) {
			logger.error(`Unexpected error while getting user info from the AuthZ service.`, error);
			return failure('SYSTEM_ERROR', `Error contacting the PCGL Authorization Service.`);
		}

		switch (error.status) {
			case 401:
			case 403:
				return failure('FORBIDDEN', 'Access token is invalid, it may be expired.');
			case 404:
				return failure(
					'NOT_FOUND',
					'User does not exist within PCGL. They are not yet authorized to access the PCGL service.',
				);
			default:
				logger.error(
					`PCGL Authorization service returned an unexpected response.\n\t${error.response?.status} - ${error.response?.data}`,
				);
				return failure('SYSTEM_ERROR', 'Error contacting the PCGL Authorization Service.');
		}
	}
};
