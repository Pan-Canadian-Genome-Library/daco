import axios, { AxiosError } from 'axios';
import { Router } from 'express';
import urlJoin from 'url-join';
import { z as zod } from 'zod';

import { type UserResponse } from '@pcgl-daco/validation';

import { authConfig } from '@/config/authConfig.js';
import baseLogger from '@/logger.js';
import { serverConfig } from '../config/serverConfig.js';
import { resetSession } from '../session/index.js';
import { type ResponseWithData } from './types.js';

const logger = baseLogger.forModule(`authRouter`);

const getOauthRedirectUri = (host: string) => urlJoin(host, `/api/auth/token`);

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

	// Ensure the user has an active session.
	req.session.save();

	const params = new URLSearchParams({
		client_id: authConfig.AUTH_CLIENT_ID,
		response_type: `code`,
		scope: `openid profile email org.cilogon.userinfo`,
		redirect_uri: getOauthRedirectUri(serverConfig.UI_HOST),
	});
	const redirectUrl = urlJoin(authConfig.AUTH_PROVIDER_HOST, `/authorize`, `?${params.toString()}`);

	res.redirect(redirectUrl);
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
authRouter.get('/logout', async (req, res) => {
	if (!authConfig.enabled) {
		res.status(400).json({ error: 'AUTH_DISABLED', message: 'Authentication is disabled.' });
		return;
	}
	const logoutSuccessRedirectUrl = urlJoin(serverConfig.UI_HOST, '/');

	const { account } = req.session;
	if (!account) {
		logger.warn(`User with no valid session attempted to logout.`);

		// TODO: Where to redirect on logout failure.
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
const oidcTokenResponseSchema = zod.object({
	access_token: zod.string(),
	refresh_token: zod.string(),
	refresh_token_iat: zod.number(),
	id_token: zod.string(),
});

const oidcUserinfoResponseSchema = zod.object({
	sub: zod.string(),
	given_name: zod.string().optional(),
	family_name: zod.string().optional(),
	email: zod.string().optional(),
});

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
 * If Authorization fails, the response should be a redirection to an error page. This
 * page does not currently exist so we instead redirect to the homepage.
 */
authRouter.get('/token', async (req, res) => {
	if (!authConfig.enabled) {
		res.status(400).json({ error: 'AUTH_DISABLED', message: 'Authentication is disabled.' });
		return;
	}

	const { code } = req.query;

	try {
		// Fetch user tokens using authorization code
		const oauth2TokenUrl = urlJoin(authConfig.AUTH_PROVIDER_HOST, `/oauth2/token`);
		const params = {
			code,
			client_id: authConfig.AUTH_CLIENT_ID,
			client_secret: authConfig.AUTH_CLIENT_SECRET,
			grant_type: 'authorization_code',
			redirect_uri: getOauthRedirectUri(serverConfig.UI_HOST),
		};

		const tokenResponse = await axios.get(oauth2TokenUrl, { params });
		const parsedTokenResponse = oidcTokenResponseSchema.safeParse(tokenResponse.data);
		if (!parsedTokenResponse.success) {
			logger.debug(`Token response has unexpected format.`, parsedTokenResponse.error);
			throw new Error(`Token response has unexpected format.`);
		}

		const {
			access_token: accessToken,
			id_token: idToken,
			refresh_token: refreshToken,
			refresh_token_iat: refreshTokenIat,
		} = parsedTokenResponse.data;

		const userResponse = await axios.get(urlJoin(authConfig.AUTH_PROVIDER_HOST, `/oauth2/userinfo`), {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		const parsedUserinfoResponse = oidcUserinfoResponseSchema.safeParse(userResponse.data);
		if (!parsedUserinfoResponse.success) {
			logger.debug(`Userinfo response has unexpected format.`, parsedUserinfoResponse.error);
			throw new Error(`Userinfo response has unexpected format.`);
		}

		const { sub, family_name: familyName, given_name: givenName } = parsedUserinfoResponse.data;
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
