/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import { ExpressLogger } from '@pcgl-daco/logger';
import express, { Request, Response } from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import applicationRouter from '@/routes/applicationRouter.js';
import collaboratorsRouter from '@/routes/collaboratorsRouter.js';

import { errorHandler } from '@pcgl-daco/request-utils';
import urlJoin from 'url-join';
import { serverConfig } from './config/serverConfig.js';
import BaseLogger from './logger.js';
import authRouter from './routes/authRouter.js';
import fileRouter from './routes/fileRouter.ts';
import healthRouter from './routes/healthRouter.ts';
import signatureRouter from './routes/signatureRouter.ts';
import swaggerRouter from './routes/swaggerRouter.ts';
import scheduler from './scheduler.ts';
import sessionMiddleware from './session/sessionMiddleware.js';

const logger = BaseLogger.forModule('server');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_PATH_DOCS = `/api-docs`;

const startServer = async () => {
	const app = express();
	scheduler();

	app.use(ExpressLogger({ logger, excludeURLs: ['/auth/token'] }));

	app.use(express.json());
	app.use(sessionMiddleware);

	app.use(`${API_PATH_DOCS}`, swaggerRouter);
	app.use('/applications', applicationRouter);
	app.use('/auth', authRouter);
	app.use('/assets', express.static(path.join(__dirname, 'public')));
	app.use('/collaborators', collaboratorsRouter);
	app.use('/file', fileRouter);
	app.use('/health', healthRouter);
	app.use('/signature', signatureRouter);

	app.get('/', async (req: Request, res: Response) => {
		res.send();
	});

	app.listen(serverConfig.PORT, () => {
		logger.info(`Server started - listening on port ${serverConfig.PORT}.`);
		if (!serverConfig.isProduction) {
			logger.info(
				`-\n\nRunning alongside the UI? API docs are available at: ${urlJoin([`${serverConfig.UI_HOST}/api`, API_PATH_DOCS, '#'])}\nRunning standalone? API docs are available at: ${urlJoin([`http://localhost:${serverConfig.PORT}`, API_PATH_DOCS])}`,
			);
		}
	});
	app.use(errorHandler({ logger }));
};

export default startServer;
