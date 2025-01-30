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

import { createCollaborators } from '@/api/collaboratorsController.js';
import { CollaboratorDTO } from '@pcgl-daco/data-model';

const collaboratorsRouter = express.Router();
const jsonParser = bodyParser.json();

type CollaboratorRequest = {
	applicationId: number;
	userId: string;
	collaborators: CollaboratorDTO[];
};

/**
 * Add Collaborator
 */
collaboratorsRouter.post(
	'/collaborators/create',
	jsonParser,
	async (request: Request<{}, {}, CollaboratorRequest, any>, response) => {
		const { applicationId: application_id, userId: user_id, collaborators } = request.body;

		// TODO: Add Real Auth
		if (!user_id) {
			response.status(401).send({ message: 'Unauthorized, cannot create Collaborators' });
			return;
		}

		if (!application_id) {
			response.status(404).send({ message: 'applicationId is missing, cannot create Collaborators' });
			return;
		}

		const result = await createCollaborators({
			application_id,
			user_id,
			collaborators,
		});

		if (result.success) {
			response.status(201).send(result.data);
			return;
		} else {
			if (
				result.message === 'Required Collaborator details are missing.' ||
				result.message === 'Can only add Collaborators when Application is in state DRAFT'
			) {
				response.status(400);
			} else if (result.message === 'Unauthorized, cannot create Collaborators') {
				response.status(401);
			} else {
				response.status(500);
			}
			response.send({ message: result.message, errors: String(result.errors) });
			return;
		}
	},
);

export default collaboratorsRouter;
