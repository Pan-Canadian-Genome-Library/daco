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
import express, { Request } from 'express';

import { createCollaborators } from '@/controllers/collaboratorsController.js';
import { type CollaboratorRequest } from '@pcgl-daco/data-model';
import { collaboratorsRequestSchema } from '@pcgl-daco/validation';

const collaboratorsRouter = express.Router();
const jsonParser = bodyParser.json();

/**
 * Add Collaborator
 */
collaboratorsRouter.post(
	'/collaborators/create',
	jsonParser,
	async (request: Request<{}, {}, CollaboratorRequest, any>, response) => {
		const validatedPayload = collaboratorsRequestSchema.safeParse(request.body);

		if (validatedPayload.success) {
			const { applicationId: application_id, userId: user_id, collaborators } = validatedPayload.data;

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
		} else {
			const { issues } = validatedPayload.error;
			const errorField = issues[0]?.path[0];

			if (errorField === 'collaborators') {
				response.status(400).send({ message: 'Required Collaborator details are missing.' });
			}

			if (errorField === 'userId') {
				// TODO: Add Real Auth
				response.status(401).send({ message: 'Unauthorized, cannot create Collaborators' });
				return;
			}

			if (errorField === 'applicationId') {
				response.status(404).send({ message: 'applicationId is missing, cannot create Collaborators' });
				return;
			}
		}
	},
);

export default collaboratorsRouter;
