import axios, { AxiosError } from 'axios';
import { Router } from 'express';
import urlJoin from 'url-join';

import { type UserResponse } from '@pcgl-daco/validation';

import { authConfig } from '@/config/authConfig.js';
import baseLogger from '@/logger.js';
import { serverConfig } from '../config/serverConfig.js';
import * as oidcClient from '../external/oidcAuthClient.js';
import { resetSession } from '../session/index.js';
import type { ResponseWithData } from './types.js';

const logger = baseLogger.forModule(`authRouter`);

const authorizeRedirectUri = urlJoin(serverConfig.UI_HOST, `/api/auth/token`);

const authRouter = Router();

/**
 * Initiate login process.
 *
 * This will redirect the user-agent to the OIDC Provider authorization URL.
 */
authRouter.get('/login', (req, res) => {
	if (!authConfig.enabled) {
		res.status(400).json({ error: 'AUTH_DISABLED', message: 'Authentication is disabled.' });
		return;
	}

	const oidcAuthorizeUrl = oidcClient.getOidcAuthorizeUrl(authConfig, authorizeRedirectUri);

	res.redirect(oidcAuthorizeUrl);
	return;
});

/**
 * User logout.
 *
 * This will revoke all access and refresh tokens for this session's user, and will then
 * remove account and user information from the current session.
 *
 * On success it will redirect the user agent to the root path for the UI.
 *
 * TODO: Where to redirect on logout failure.
 */
authRouter.get('/logout', async (req, res) => {
	if (!authConfig.enabled) {
		res.status(400).json({ error: 'AUTH_DISABLED', message: 'Authentication is disabled.' });
		return;
	}
	const logoutSuccessRedirectUrl = urlJoin(serverConfig.UI_HOST, '/');

	const { account } = req.session;
	if (!account) {
		logger.warn(`User with no valid session attempted to logout.`);
		res.redirect(logoutSuccessRedirectUrl);
		return;
	}

	try {
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
		resetSession(req.session);
	} catch (error) {
		logger.error(`Failure sending token revoke request to OIDC Provider.`, error);
		if (error instanceof AxiosError) {
			logger.error(error.response?.data);
		}

		res
			.status(500)
			.json({ error: 'SYSTEM_ERROR', message: 'Failed to revoke user session: Network failure with auth provider.' });
		return;
	}

	res.redirect(logoutSuccessRedirectUrl);
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
 * ALl of this information will be stored in the user session.
 *
 * Finally, if everything is successful, the response will redirect the user agent to
 * the correct UI page for their role:
 *   - Applicant: /dashboard
 *   - Institutional Rep: ?
 *   - DAC Member: /manage/applications
 *
 * If Authorization fails, the response should be a redirection to an error page. This
 * page does not currently exist so we instead redirect to the homepage.
 */
authRouter.get('/token', async (req, res) => {
	if (!authConfig.enabled) {
		res.status(400).json({ error: 'AUTH_DISABLED', message: 'Authentication is disabled.' });
		return;
	}

	// TODO: seperate page to redirect to on failure
	const errorRedirectUrl = serverConfig.UI_HOST;

	const { code } = req.query;
	if (typeof code !== 'string') {
		res.redirect(errorRedirectUrl);
		return;
	}

	try {
		// Fetch user tokens using authorization code
		const oidcTokenResult = await oidcClient.exchangeCodeForTokens(authConfig, {
			code,
			redirectUrl: authorizeRedirectUri,
		});
		if (!oidcTokenResult.success) {
			res.redirect(errorRedirectUrl);
			return;
		}

		const {
			access_token: accessToken,
			id_token: idToken,
			refresh_token: refreshToken,
			refresh_token_iat: refreshTokenIat,
		} = oidcTokenResult.data;

		// Fetch user info using access token
		const userInfoResult = await oidcClient.getUserInfo(authConfig, accessToken);
		if (!userInfoResult.success) {
			res.redirect(errorRedirectUrl);
			return;
		}

		const { sub, family_name: familyName, given_name: givenName } = userInfoResult.data;

		// Update session with all user information retrieved from OIDC Provider
		req.session.account = {
			accessToken,
			idToken,
			refreshToken,
			refreshTokenIat,
		};
		req.session.user = {
			userId: sub,
			familyName,
			givenName,
		};
		req.session.save();
	} catch (error) {
		logger.error(`Error thrown retrieving tokens from OIDC Provider`, error);
		if (error instanceof AxiosError) {
			const errorResponse = error.response?.data;
			if (errorResponse) {
				logger.error(errorResponse);
			}
		}
		// TODO: Redirect failed /token request to an error page.
		// There should be communication to the user that an error occurred during the
		//  login process. An error page, or error code in query parameter that can
		//  trigger an error message are possible solutions.
		res.redirect(urlJoin(serverConfig.UI_HOST, '/'));
		return;
	}

	// Auth success! User info saved to session!
	res.redirect(urlJoin(serverConfig.UI_HOST, authConfig.AUTH_UI_REDIRECT_PATH));
	return;
});

/**
 * Retrieve user information stored in session. This can be used by the UI to determine
 * if a user is logged in and what type of user they are (which role they have). This will
 * let the UI determine which routes to allow to the user.
 */
authRouter.get('/user', async (req, res: ResponseWithData<UserResponse, ['AUTH_DISABLED']>) => {
	if (!authConfig.enabled) {
		res.status(400).json({ error: 'AUTH_DISABLED', message: 'Authentication is disabled.' });
		return;
	}

	const { user } = req.session;

	const output: UserResponse = {
		role: user ? 'APPLICANT' : 'ANONYMOUS',
		user,
	};

	res.json(output);
	return;
});
export default authRouter;
