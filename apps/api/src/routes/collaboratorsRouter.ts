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

import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';

import { createCollaborators, deleteCollaborator, listCollaborators } from '@/controllers/collaboratorsController.js';
import { apiZodErrorMapping } from '@/utils/validation.js';
import { withBodySchemaValidation, withParamsSchemaValidation } from '@pcgl-daco/request-utils';
import {
	collaboratorsDeleteRequestSchema,
	collaboratorsListParamsSchema,
	collaboratorsRequestSchema,
} from '@pcgl-daco/validation';
import { testUserId } from '../../tests/testUtils.ts';

const collaboratorsRouter = express.Router();
const jsonParser = bodyParser.json();

/**
 * Add Collaborator
 */
collaboratorsRouter.post(
	'/create',
	jsonParser,
	withBodySchemaValidation(
		collaboratorsRequestSchema,
		apiZodErrorMapping,
		async (request: Request, response: Response) => {
			const { applicationId: application_id, userId: user_id, collaborators } = request.body;

			const result = await createCollaborators({
				application_id,
				user_id,
				collaborators,
			});

			if (result.success) {
				response.status(201).send(result.data);
				return;
			} else {
				const { message, errors } = result;

				if (errors === 'InvalidState' || errors === 'DuplicateRecords') {
					response.status(400);
				} else if (errors === 'Unauthorized') {
					response.status(401);
				} else {
					response.status(500);
				}

				response.send({ message, errors });
				return;
			}
		},
	),
);

/**
 * List Collaborators
 */
collaboratorsRouter.get(
	'/:applicationId',
	jsonParser,
	withParamsSchemaValidation(
		collaboratorsListParamsSchema,
		apiZodErrorMapping,
		async (request: Request, response: Response) => {
			const { applicationId } = request.params;
			console.log(applicationId);
			if (!applicationId) {
				response.status(404).send({ message: 'applicationId is missing, cannot list Collaborators' });
				return;
			}

			const application_id = parseInt(applicationId);
			const user_id = testUserId;

			const result = await listCollaborators({
				application_id,
				user_id,
			});

			if (result.success) {
				response.status(201).send(result.data);
				return;
			} else {
				const { message, errors } = result;

				if (errors === 'Unauthorized') {
					response.status(401);
				} else {
					response.status(500);
				}

				response.send({ message, errors });
				return;
			}
		},
	),
);

/**
 * Delete Collaborator
 */
collaboratorsRouter.post(
	'/collaborators/delete',
	jsonParser,
	withBodySchemaValidation(collaboratorsDeleteRequestSchema, apiZodErrorMapping, async (request, response) => {
		const { applicationId: application_id, userId: user_id, collaboratorId } = request.body;

		const result = await deleteCollaborator({
			application_id,
			user_id,
			id: collaboratorId,
		});

		if (result.success) {
			response.status(201).send(result.data);
			return;
		} else {
			const { message, errors } = result;

			if (errors === 'InvalidState') {
				response.status(400);
			} else if (errors === 'Unauthorized') {
				response.status(401);
			} else {
				response.status(500);
			}

			response.send({ message, errors });
			return;
		}
	}),
);

export default collaboratorsRouter;
