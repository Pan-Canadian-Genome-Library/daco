/*
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
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

import { LoggerOptions, createLogger, format, transports } from 'winston';
import { RecursivePartial } from '../types/recursivePartial.js';

import { LogLevel, LogLevels } from './LogLevel.js';
import { LoggerConfig } from './config.js';
import { unknownToString } from './utils/stringUtils.js';

const { combine, timestamp, colorize, printf } = format;

export type LogFunction = (...messages: any[]) => void;
export type LoggerType = {
	debug: LogFunction;
	info: LogFunction;
	warn: LogFunction;
	error: LogFunction;
	log: (level: LogLevel, ...args: Parameters<LogFunction>) => ReturnType<LogFunction>;

	forModule: (...moduleNames: string[]) => LoggerType;
};

export const Logger = (config?: RecursivePartial<LoggerConfig>) => {
	const logLevel = config?.level ?? LogLevels.DEBUG;

	/* ===== Transports ===== */
	const loggerTransports: LoggerOptions['transports'] = [];

	const consoleTransport = new transports.Console({
		level: logLevel,
		format: combine(
			colorize(),
			timestamp(),
			printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
		),
	});
	loggerTransports.push(consoleTransport);

	if (config?.logFile) {
		const debugFileTransport = new transports.File({
			filename: 'debug.log',
			level: 'debug',
			format: combine(
				timestamp(),
				printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
			),
		});
		loggerTransports.push(debugFileTransport);
	}

	/* ===== Config ===== */
	const options: LoggerOptions = {
		silent: config?.silent ?? false,

		transports: loggerTransports,
	};
	const logger = createLogger(options);

	/**
	 * Generates the logger object with the expected Logger type above.
	 *
	 * Accepts any number of strings which will be printed as a label for logger messages.
	 * These are used to indicate which module is generating the log message.
	 *
	 * @param moduleNames
	 * @returns
	 */
	const createNamedLogger = (...moduleNames: string[]): LoggerType => {
		/* ===== Logging ===== */
		const formatMessage = (message: any) => {
			const messageAsString = unknownToString(message, { space: 2 });
			return typeof message === 'object' && message !== null ? `\n${messageAsString}\n` : messageAsString;
		};

		const buildServiceMessage = (...messages: any[]) => {
			const combinedMessages: string = messages.map(formatMessage).join(' - ');
			const moduleLabel = moduleNames.length > 0 ? `[${[...moduleNames].join('.')}]` : '';
			return [moduleLabel, combinedMessages].join(' ');
		};

		const debug = (...messages: any[]) => {
			logger.debug(buildServiceMessage(...messages));
		};
		const info = (...messages: any[]) => {
			logger.info(buildServiceMessage(...messages));
		};
		const warn = (...messages: any[]) => {
			logger.warn(buildServiceMessage(...messages));
		};
		const error = (...messages: any[]) => {
			logger.error(buildServiceMessage(...messages));
		};

		return {
			debug,
			info,
			warn,
			error,
			log: (level: LogLevel, ...messages: any[]) => {
				switch (level) {
					case LogLevels.DEBUG:
						return debug(...messages);
					case LogLevels.INFO:
						return info(...messages);
					case LogLevels.WARN:
						return warn(...messages);
					case LogLevels.ERROR:
						return error(...messages);
				}
			},

			/**
			 * Create a new instance of this logger for a sub-module. Provide the name of the module
			 * this will log for
			 *
			 * This will use the same logger instance, but log statements will include the sub module names
			 * in their message.
			 * @param subServices
			 * @returns
			 *
			 * @example
			 * ```
			 * import Logger from 'logger';
			 *
			 * const logger = Logger('ServiceName');
			 * logger.info('service message'); // "[ServiceName] service message"
			 *
			 * // When re-using this logger in another module within the service:
			 * const moduleLogger = logger.forModule('ModuleName');
			 * moduleLogger.info('log messages from the module'); // "[ServiceName.ModuleName] log messages from the module"
			 * ```
			 */
			forModule: (...subModuleNames: string[]): LoggerType => {
				return createNamedLogger(...moduleNames, ...subModuleNames);
			},
		};
	};

	// Return a logger with no module names
	return createNamedLogger();
};
