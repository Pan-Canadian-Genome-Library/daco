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
import { failure, success } from '@/utils/results.ts';
import { authZUserInfo } from '@pcgl-daco/validation';
import axios from 'axios';

export const getUserInformation = async (accessToken: string) => {
	if (!authConfig.enabled) {
		return failure('AUTH_DISABLED', 'Authentication is disabled, authorization cannot continue.');
	}

	const request = await axios.get(`${authConfig.AUTHZ_ENDPOINT}/users/me`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (request.status !== 200) {
		return failure('BAD_TOKEN', 'Access token is invalid, expired?');
	}

	const validatedAuthZData = authZUserInfo.safeParse(request.data);

	if (!validatedAuthZData.success) {
		logger.error(`PCGL AuthZ service returned unexpected, or malformed data. ${validatedAuthZData.error}`);
		return failure('SYSTEM_ERROR', 'Unable to retrieve user information from the PCGL AuthZ service.');
	}

	return success(validatedAuthZData.data);
};
