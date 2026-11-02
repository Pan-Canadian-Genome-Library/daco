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

import { getUserInformation } from '@/external/pcglAuthZClient.ts';
import BaseLogger from '@/logger.js';
import { convertToSessionDacAuthorizations } from '@/utils/aliases.ts';
import type { SessionUser } from '@pcgl-daco/validation';
import { type Request } from 'express';

const logger = BaseLogger.forModule('refreshSessionUser');

/**
 * Reloads the information of the logged in user (groups, dac_authorizations and other properties) from the AuthZ service
 * and updates the session.
 *
 * The session user is only populated at login, so changes made afterwards (e.g. dac_authorizations granted when an
 * application is approved, or group membership changes) are not visible until the user is refreshed.
 *
 * - Returns undefined when there is no logged in user.
 * - Skips AuthZ when the user was refreshed less than `refreshIntervalMs` ago.
 * - When AuthZ cannot be reached the session user is returned unchanged, to be retried on the next call.
 *
 * @param session - The request session
 * @param refreshIntervalMs - Minimum time between two reloads of the session user from the AuthZ service
 * @param now - Current time in milliseconds
 */
export const refreshSessionUser = async (
	session: Request['session'],
	refreshIntervalMs: number,
	now: number = Date.now(),
): Promise<SessionUser | undefined> => {
	const { user, account, userRefreshedAt } = session;

	if (!user || !account) {
		return undefined;
	}

	if (userRefreshedAt !== undefined && now - userRefreshedAt < refreshIntervalMs) {
		return user;
	}

	const pcglAuthzResponse = await getUserInformation(account.accessToken);

	if (!pcglAuthzResponse.success) {
		logger.error(`Unable to refresh the session user from the AuthZ service: ${pcglAuthzResponse.message}`);
		return user;
	}

	const refreshedUser: SessionUser = {
		...user,
		...pcglAuthzResponse.data,
		dacAuthorizations: convertToSessionDacAuthorizations(pcglAuthzResponse.data),
	};

	session.user = refreshedUser;
	session.userRefreshedAt = now;
	session.save();

	return refreshedUser;
};
