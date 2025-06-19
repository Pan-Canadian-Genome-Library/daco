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

import { serverConfig } from '@/config/serverConfig.ts';
import express from 'express';
import swaggerJSDoc, { SwaggerDefinition } from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

const DESCRIPTION_EN =
	'The PCGL Data Access Compliance Office (PCGL DACO) handles requests from scientists, researchers, and commercial teams for access to PCGL Controlled Data.<br/><br/>Additional information related to PCGL and the DACO can be found at: [genomelibrary.ca](https://genomelibrary.ca/).';

const DESCRIPTION_FR =
	"<p>Le Bureau de conformité pour l’accès aux données de la BGP (BCAD de la BGP) traite les demandes d’accès aux données contrôlées de la BGP émanant de scientifiques, de chercheurs et chercheuses et d’équipes commerciales.<br/><br/>Des informations supplémentaires sur la BGP et le BCAD sont disponibles à l'adresse suivante: [genomelibrary.ca/fr](https://genomelibrary.ca/fr).</p>";

const SWAGGER_OPTIONS: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'PCGL DACO API',
		description: `${DESCRIPTION_EN}<hr/>${DESCRIPTION_FR}`,
		version: serverConfig.npm_package_version,
	},
};

const SWAGGER_JS_DOC_OPTIONS: swaggerJSDoc.Options = {
	swaggerDefinition: SWAGGER_OPTIONS,
	failOnErrors: true, //Like the previous YAML parser, this setting ensures the server fails on start up if any YAML is malformed.
	apis: ['./src/docs/**/*.yaml'],
};

const swaggerRouter = express.Router();

swaggerRouter.use('/', swaggerUi.serve);
swaggerRouter.get('/', swaggerUi.setup(swaggerJSDoc(SWAGGER_JS_DOC_OPTIONS)));

export default swaggerRouter;
