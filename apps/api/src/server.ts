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
import * as swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import yaml from 'yamljs';

import { getHealth, Status } from '@/app-health.js';
import applicationRouter from '@/routes/applicationRouter.js';
import collaboratorsRouter from '@/routes/collaboratorsRouter.js';

import { errorHandler } from '@pcgl-daco/request-utils';
import urlJoin from 'url-join';
import { serverConfig } from './config/serverConfig.js';
import BaseLogger from './logger.js';
import authRouter from './routes/authRouter.js';
import fileRouter from './routes/fileRouter.ts';
import signatureRouter from './routes/signatureRouter.ts';
import sessionMiddleware from './session/sessionMiddleware.js';

const logger = BaseLogger.forModule('server');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_PATH_DOCS = `/api-docs`;

const startServer = async () => {
	const app = express();

	app.use(ExpressLogger({ logger, excludeURLs: ['/auth/token'] }));

	app.use(express.json());
	app.use(sessionMiddleware);

	app.use('/collaborators', collaboratorsRouter);
	app.use('/applications', applicationRouter);
	app.use('/signature', signatureRouter);
	app.use('/auth', authRouter);
	app.use('/file', fileRouter);
	app.use('/assets', express.static(path.join(__dirname, 'public')));

	app.use(
		`${API_PATH_DOCS}`,
		swaggerUi.serve,
		swaggerUi.setup(yaml.load(path.join(__dirname, './resources/swagger.yaml'))),
	);

	app.get('/', async (req: Request, res: Response) => {
		res.send();
	});

	app.get('/health', (_req: Request, res: Response) => {
		const health = getHealth();

		const resBody = {
			version: serverConfig.npm_package_version,
			health,
		};

		if (health.all.status != Status.OK) {
			res.status(500).json(resBody);
			return;
		}

		res.status(200).json(resBody);
	});

	app.listen(serverConfig.PORT, () => {
		logger.info(`Server started - listening on port ${serverConfig.PORT}.`);
		if (!serverConfig.isProduction) {
			logger.info(`API Docs available at: ${urlJoin([`http://localhost:${serverConfig.PORT}`, API_PATH_DOCS])}`);
		}
	});
	app.use(errorHandler({ logger }));
};

export default startServer;
