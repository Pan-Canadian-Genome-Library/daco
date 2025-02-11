import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { serverConfig } from './config/serverConfig.js';
import valkeyClient from './valkey.js';

declare module 'express-session' {
	interface SessionData {
		// example: string;
	}
}

const sessionStore = new RedisStore({
	client: valkeyClient,
	prefix: 'daco-api:',
});

const sessionMiddleware = session({
	store: sessionStore,

	secret: serverConfig.sessionKeys,
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: serverConfig.SESSION_MAX_AGE },
});

export default sessionMiddleware;
