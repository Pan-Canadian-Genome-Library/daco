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

import { type NextFunction } from 'express';
import ExpressRequestLogger from 'express-requests-logger';

import { LogLevel, LogLevels, LoggerType } from '../client/index.js';
import { MiddlewareData } from './dependencyDataTypes.js';

export type ExpressLoggerConfig = {
	logger: LoggerType;
	excludeURLs?: string[];
};

/**
 * We want to log at an appropriate level for the error code returned.
 * System errors are logged as ERROR.
 * Auth errors from the user are logged as WARN, this includes Forbidden and Unauthorized requests.
 * Everything else is logged as INFO
 * @param maybeResponse
 */
const selectLevelForResponse = (maybeResponse: { response?: { status_code?: unknown } }): LogLevel => {
	const statusCode = maybeResponse?.response?.status_code;

	if (statusCode === undefined || typeof statusCode !== 'number') {
		return LogLevels.INFO;
	}

	if (statusCode >= 500) {
		return LogLevels.ERROR;
	}

	const authErrorCodes = [401, 403];
	if (authErrorCodes.includes(statusCode)) {
		return LogLevels.WARN;
	}

	return LogLevels.INFO;
};

// Disabling eslint unused variable - We are passed params from the middleware but we don't use them. Leaving them in the function signature unused, just for awareness.
/* eslint-disable @typescript-eslint/no-unused-vars */
const formatLogMessage = (data?: MiddlewareData, ...params: any[]): object => {
	const response = data?.response;
	const request = data?.request;

	const output: any = {
		method: request?.method,
		path: request?.url_route,
		url: request?.url,
		query: request?.query,
		status: response?.status_code,
		duration: response?.elapsed,
	};

	return output;
};

/**
 * Give the middleware our custom logger to use.
 *
 * Note that the exported types for the express-requests-logger only declare the info method,
 * but in fact they use all of debug, info, warn, and error. So we return an untyped object
 * with each of those methods pointing to our own handler.
 *  */
const transformLogger = (original: LoggerType) => {
	const namedLogger = original.forModule('ExpressLogger');

	const replacementLogFunction = (data: object, ...inputs: any[]) => {
		const responseLevel = selectLevelForResponse(data);
		return namedLogger.log(responseLevel, formatLogMessage(data, ...inputs));
	};

	return {
		debug: replacementLogFunction,
		info: replacementLogFunction,
		warn: replacementLogFunction,
		error: replacementLogFunction,
	};
};

const swaggerUiPaths = ['api-docs', 'swagger-ui', 'favicon'];

/**
 * Creates an express middleware that will log all incoming requests using the provided logger.
 *
 * By default, all paths associated with swagger API docs at path `api-docs` will be excluded from logging.
 *
 * The middleware can be configured to:
 * 1. Exclude URLs: provide an array of strings to `{excludeUrls: ['example']}`, any request to a route
 *    that includes the given string in its path will not be logged.
 *
 * @example
 * ```
 * import express from 'express';
 * import ExpressLogger from 'express-logger';
 * import logger from './logger';
 *
 * const app = express();
 * app.use(ExpressLogger({ logger, excludeUrls: ['health'] }));
 * ```
 *
 * @param config
 */
export const ExpressLogger = (config: ExpressLoggerConfig): NextFunction => {
	const { logger } = config;

	return ExpressRequestLogger({
		doubleAudit: false,
		logger: transformLogger(logger),

		excludeURLs: [...(config.excludeURLs || []), ...swaggerUiPaths],
	});
};
