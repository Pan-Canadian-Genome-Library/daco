import axios, { AxiosError } from 'axios';
import { Router, type Response } from 'express';
import urlJoin from 'url-join';
import { z as zod } from 'zod';

import { authConfig } from '@/config/authConfig.js';
import baseLogger from '@/logger.js';
import { buildQueryParams } from '@/utils/buildQueryParams.js';
import { type ErrorResponse, type UserResponse } from '@pcgl-daco/validation';

const logger = baseLogger.forModule(`authRouter`);

const getOauthRedirectUri = (host: string) => urlJoin(host, `/api/auth/token`);

const authRouter = Router();

// ##############
//   GET /logon
// ##############
authRouter.get('/logon', (req, res) => {
	if (!authConfig.enabled) {
		res.status(400).json({ error: 'AUTH_DISABLED', message: 'Authentication is disabled for this server.' });
		return;
	}

	// Ensure the user has an active session.
	req.session.save();

	const params = {
		client_id: authConfig.AUTH_CLIENT_ID,
		response_type: `code`,
		scope: `openid profile email org.cilogon.userinfo`,
		redirect_uri: getOauthRedirectUri(authConfig.AUTH_UI_HOST),
	};
	const redirectUrl = urlJoin(authConfig.AUTH_PROVIDER_HOST, `/authorize`, buildQueryParams(params));

	res.redirect(redirectUrl);
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

authRouter.get('/token', async (req, res) => {
	if (!authConfig.enabled) {
		res.status(400).json({ error: 'AUTH_DISABLED', message: 'Authentication is disabled for this server.' });
		return;
	}

	const { code } = req.query;

	// Fetch token from oidc server
	try {
		const oauth2TokenUrl = urlJoin(authConfig.AUTH_PROVIDER_HOST, `/oauth2/token`);
		const params = {
			code,
			client_id: authConfig.AUTH_CLIENT_ID,
			client_secret: authConfig.AUTH_CLIENT_SECRET,
			grant_type: 'authorization_code',
			redirect_uri: getOauthRedirectUri(authConfig.AUTH_UI_HOST),
		};

		const tokenResponse = await axios.get(oauth2TokenUrl, { params });
		const parsedTokenResponse = oidcTokenResponseSchema.safeParse(tokenResponse.data);
		if (!parsedTokenResponse.success) {
			logger.debug(`Token response has unexpected format.`, parsedTokenResponse.error);
			throw new Error(`Token response has unexpected format.`);
		}
		logger.info(`Token Response:`, parsedTokenResponse.data);

		const {
			access_token: accessToken,
			id_token: idToken,
			refresh_token: refreshToken,
			refresh_token_iat: refreshTokenIat,
		} = parsedTokenResponse.data;
		req.session.account = {
			accessToken,
			idToken,
			refreshToken,
			refreshTokenIat,
		};

		const userResponse = await axios.get(urlJoin(authConfig.AUTH_PROVIDER_HOST, `/oauth2/userinfo`), {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		const parsedUserinfoResponse = oidcUserinfoResponseSchema.safeParse(userResponse.data);
		if (!parsedUserinfoResponse.success) {
			logger.debug(`Userinfo response has unexpected format.`, parsedUserinfoResponse.error);
			throw new Error(`Userinfo response has unexpected format.`);
		}

		const { sub, family_name: familyName, given_name: givenName } = parsedUserinfoResponse.data;
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
		res.redirect(urlJoin(authConfig.AUTH_UI_HOST, '/asdf'));
		return;
	}

	// Auth success! User info saved to session!
	res.redirect(urlJoin(authConfig.AUTH_UI_HOST, authConfig.AUTH_UI_REDIRECT_PATH));
	return;
});

authRouter.get('/user', async (req, res: Response<UserResponse | ErrorResponse<['AUTH_DISABLED']>>) => {
	if (!authConfig.enabled) {
		res.status(400).json({ error: 'AUTH_DISABLED', message: 'Authentication is disabled for this server.' });
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
