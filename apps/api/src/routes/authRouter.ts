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

import axios, { AxiosError } from 'axios';
import { Router } from 'express';
import urlJoin from 'url-join';

import { type UserResponse } from '@pcgl-daco/validation';

import { authConfig } from '@/config/authConfig.js';
import { serverConfig } from '@/config/serverConfig.js';
import ExternalAuthError from '@/external/AuthenticationError.ts';
import * as oidcAuthClient from '@/external/oidcAuthNClient.ts';
import * as pcglAuthZClient from '@/external/pcglAuthZClient.ts';
import BaseLogger from '@/logger.js';
import { type ResponseWithData } from '@/routes/types.ts';
import { getUserRole } from '@/service/authService.ts';
import { resetSession } from '@/session/index.js';
import { convertToSessionAccount, convertToSessionUser } from '@/utils/aliases.ts';

const logger = BaseLogger.forModule(`authRouter`);

const getOauthRedirectUri = (host: string) => urlJoin(host, `/api/auth/token`);

const authRouter = Router();

/**
 * Initiate login process.
 *
 * This will redirect the user-agent to the OIDC Provider authorization URL.
 */
authRouter.get('/login', (request, response) => {
	if (!authConfig.enabled) {
		response.status(400).json({ error: 'AUTH_DISABLED', message: 'Authentication is disabled.' });
		return;
	}

	// Ensure the user has an active session.
	request.session.save();

	const onSuccessRedirect = getOauthRedirectUri(serverConfig.UI_HOST);

	const redirectUrl = oidcAuthClient.getOidcAuthorizeUrl(authConfig, onSuccessRedirect);

	response.redirect(redirectUrl);
	return;
});

/**
 * User logout.
 *
 * This will revoke all access and refresh tokens for this session's user, and will then
 * remove account and user information from the current session.
 *
 * On success it will redirect the user agent to the root path for the UI.
 */
authRouter.get('/logout', async (request, response) => {
	if (!authConfig.enabled) {
		response.status(400).json({ error: 'AUTH_DISABLED', message: 'Authentication is disabled.' });
		return;
	}
	const logoutSuccessRedirectUrl = urlJoin(serverConfig.UI_HOST, authConfig.logoutRedirectPath);

	const { account } = request.session;
	if (!account) {
		logger.warn(`User with no valid session attempted to logout.`);

		// TODO: Where to redirect on logout failure.
		response.redirect(logoutSuccessRedirectUrl);
		return;
	}

	try {
		// TODO: move this request to the oidc provider
		const params = new URLSearchParams({ token: account.accessToken });
		await axios({
			url: urlJoin(authConfig.AUTH_PROVIDER_HOST, `/oauth2/revoke`),
			method: 'POST',
			headers: {
				Authorization: `Bearer ${account.accessToken}`,
				'content-type': 'application/x-www-form-urlencoded',
			},
			params,
		});

		// On logout success we can clear the session data.
		resetSession(request.session);
	} catch (error) {
		logger.error(`Failure sending token revoke request to OIDC Provider.`, error);
		if (error instanceof AxiosError) {
			logger.error(error.response?.data);
		}

		response
			.status(500)
			.json({ error: 'SYSTEM_ERROR', message: 'Failed to revoke user session: Network failure with auth provider.' });
		return;
	}

	response.redirect(logoutSuccessRedirectUrl);
	return;
});

// ##############
//   GET /token
// ##############

/**
 * This is the callback that the OIDC Provider will redirect the user agent to after
 * they have successfully authenticated. The URL to this endpoint must be set in the
 * OIDC Client as a Redirect URL.
 *
 * This route will validate the Authorization Code provided as a search parameter by
 * calling the OIDC Token endpoint. This will return the authenticated user's tokens
 * (ID, Access, refresh) and information on when these tokens will expire.
 *
 * Then, the access token will be used to call the OIDC User Info endpoint to retrieve
 * the available information for this user.
 *
 * All of this information will be stored in the user session.
 *
 * Finally, if everything is successful, the response will redirect the user agent to
 * the correct UI page for their role:
 *   - Applicant: /dashboard
 *   - Institutional Rep: ?
 *   - DAC Member: /manage/applications
 *
 * If Authentication or Authorization fails, we redirect to: /login/error with an
 * errorCode associated from failure. This error code is then used to generate error
 * messages on the frontend with clarification on why the auth process failed & what
 * the user can do about it.
 */
authRouter.get('/token', async (request, response) => {
	if (!authConfig.enabled) {
		response.status(400).json({ error: 'AUTH_DISABLED', message: 'Authentication is disabled.' });
		return;
	}

	const { code } = request.query;

	if (typeof code !== 'string') {
		throw new Error('Invalid Request. Must contain query parameter `code` with a single string value.');
	}

	try {
		const tokenResponse = await oidcAuthClient.exchangeCodeForTokens(authConfig, {
			code,
			redirectUrl: getOauthRedirectUri(serverConfig.UI_HOST),
		});

		if (!tokenResponse.success) {
			throw new ExternalAuthError(tokenResponse.error, tokenResponse.message);
		}

		const pcglAuthzResponse = await pcglAuthZClient.getUserInformation(tokenResponse.data.access_token);

		if (!pcglAuthzResponse.success) {
			throw new ExternalAuthError(pcglAuthzResponse.error, pcglAuthzResponse.message);
		}

		const oidcDataResponse = await oidcAuthClient.getUserInfo(authConfig, tokenResponse.data.access_token);
		if (!oidcDataResponse.success) {
			throw new ExternalAuthError(oidcDataResponse.error, oidcDataResponse.message);
		}

		const userAccountAliasing = convertToSessionAccount(tokenResponse.data);
		if (!userAccountAliasing.success) {
			throw new Error(userAccountAliasing.message);
		}
		const sessionUserAliasing = convertToSessionUser(oidcDataResponse.data, pcglAuthzResponse.data);
		if (!sessionUserAliasing.success) {
			throw new Error(sessionUserAliasing.message);
		}

		const groups = sessionUserAliasing.data.groups;

		request.session.account = userAccountAliasing.data;
		request.session.user = {
			...sessionUserAliasing.data,
			dacoAdmin: groups ? groups.some((group) => group.name === authConfig.AUTHZ_GROUP_ADMIN) : false,
		};

		request.session.save();
	} catch (error) {
		logger.error(`Error thrown while going through authentication and authorization flow: `, error);

		const redirectURL = urlJoin(serverConfig.UI_HOST, authConfig.loginErrorPath);
		const errorCode = error instanceof ExternalAuthError ? error.code : 'SYSTEM_ERROR';

		const errorParams = new URLSearchParams({
			code: errorCode,
		});

		response.redirect(`${redirectURL}/?${errorParams.toString()}`);
		return;
	}

	// Auth success! User info saved to session!
	response.redirect(urlJoin(serverConfig.UI_HOST, authConfig.loginRedirectPath));
	return;
});

/**
 * Retrieve user information stored in session. This can be used by the UI to determine
 * if a user is logged in and what type of user they are (which role they have). This will
 * let the UI determine which routes to allow to the user.
 */
authRouter.get('/user', async (request, response: ResponseWithData<UserResponse, ['AUTH_DISABLED']>) => {
	if (!authConfig.enabled) {
		response.status(400).json({ error: 'AUTH_DISABLED', message: 'Authentication is disabled.' });
		return;
	}

	const { user } = request.session;

	const output: UserResponse = {
		role: getUserRole(user),
		user,
	};

	response.json(output);
	return;
});
export default authRouter;
