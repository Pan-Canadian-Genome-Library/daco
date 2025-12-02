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

import express, { Request } from 'express';

import {
	createCollaborators,
	deleteCollaborator,
	listCollaborators,
	updateCollaborator,
} from '@/controllers/collaboratorsController.js';
import { apiZodErrorMapping } from '@/utils/validation.js';
import type { ListCollaboratorResponse } from '@pcgl-daco/data-model/src/types.ts';
import { withBodySchemaValidation, withParamsSchemaValidation } from '@pcgl-daco/request-utils';
import {
	collaboratorsCreateRequestSchema,
	collaboratorsDeleteParamsSchema,
	collaboratorsUpdateRequestSchema,
	isPositiveInteger,
} from '@pcgl-daco/validation';
import { getApplicationById } from '../controllers/applicationController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { getUserRole, isAssociatedRep } from '../service/authService.ts';
import type { ResponseWithData } from './types.ts';

const collaboratorsRouter = express.Router();

/**
 * Add Collaborator
 */
collaboratorsRouter.post(
	'/create',
	authMiddleware(),
	withBodySchemaValidation(
		collaboratorsCreateRequestSchema,
		apiZodErrorMapping,
		async (
			request,
			response: ResponseWithData<
				ListCollaboratorResponse,
				['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST', 'CONFLICT']
			>,
		) => {
			try {
				const { applicationId: application_id, collaborators } = request.body;

				const { userId } = request.session.user || {};
				if (!userId) {
					response.status(401).json({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
					return;
				}

				const result = await createCollaborators({
					application_id,
					user_id: userId,
					collaborators,
				});

				if (result.success) {
					response.status(201).json(result.data);
					return;
				}
				switch (result.error) {
					case 'DUPLICATE_RECORD': {
						response.status(409).json({ error: 'CONFLICT', message: result.message });
						return;
					}
					case 'INVALID_STATE_TRANSITION': {
						response.status(400).json({ error: 'INVALID_REQUEST', message: result.message });
						return;
					}
					case 'NOT_FOUND': {
						response.status(404).json({ error: result.error, message: result.message });
						return;
					}
					case 'SYSTEM_ERROR': {
						response.status(500).json({ error: result.error, message: result.message });
						return;
					}
					case 'UNAUTHORIZED': {
						response.status(403).json({ error: 'FORBIDDEN', message: result.message });
						return;
					}
				}
			} catch (error) {
				response.status(500).json({ error: 'SYSTEM_ERROR', message: 'Unexpected error.' });
			}
		},
	),
);

/**
 * List Collaborators
 */
collaboratorsRouter.get(
	'/:applicationId',
	authMiddleware(),
	async (
		request: Request,
		response: ResponseWithData<
			ListCollaboratorResponse,
			['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST']
		>,
	) => {
		try {
			const applicationId = Number(request.params.applicationId);

			if (!isPositiveInteger(applicationId)) {
				response.status(400).json({ error: 'INVALID_REQUEST', message: 'Application ID is not a valid number.' });
				return;
			}

			// TODO: auth check: application belongs to user, or is DAC ADMIN
			// TODO: Institutional Rep needs to be able to see the collaborators as well, but they don't have a user ID on the application to check...
			const { userId } = request.session.user || {};
			if (!userId) {
				response.status(401).json({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
				return;
			}
			const userRole = getUserRole(request.session);

			const applicationResult = await getApplicationById({ applicationId });
			if (!applicationResult.success) {
				switch (applicationResult.error) {
					case 'SYSTEM_ERROR': {
						response.status(500).json({ error: applicationResult.error, message: applicationResult.message });
						return;
					}
					case 'NOT_FOUND': {
						response.status(404).json({ error: applicationResult.error, message: applicationResult.message });
						return;
					}
				}
			}

			const isApplicationUser = applicationResult.data.userId === userId;
			// TODO: Identify if the user role is institutional rep and is the rep for this application
			const isApplicationInstitutionalRep = await isAssociatedRep(request.session, applicationId);

			const isDac = userRole === 'DAC_MEMBER' || userRole === 'DAC_CHAIR';

			if (!(isApplicationUser || isApplicationInstitutionalRep || isDac)) {
				response
					.status(403)
					.json({ error: 'FORBIDDEN', message: 'User does not have permission to access this application.' });
				return;
			}

			const result = await listCollaborators({
				applicationId,
			});

			if (result.success) {
				response.status(201).json(result.data);
				return;
			}
			switch (result.error) {
				case 'SYSTEM_ERROR': {
					response.status(500).json({ error: result.error, message: result.message });
					return;
				}
			}
		} catch (error) {
			response.status(500).json({ error: 'SYSTEM_ERROR', message: 'Unexpected error.' });
			return;
		}
	},
);

/**
 * Delete Collaborator
 */
collaboratorsRouter.delete(
	'/:applicationId/:collaboratorEmail',
	authMiddleware(),
	withParamsSchemaValidation(
		collaboratorsDeleteParamsSchema,
		apiZodErrorMapping,
		async (
			request,
			response: ResponseWithData<
				ListCollaboratorResponse,
				['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST']
			>,
		) => {
			try {
				const collaboratorEmail = request.params.collaboratorEmail;

				if (!collaboratorEmail) {
					response
						.status(400)
						.json({ error: 'INVALID_REQUEST', message: 'Collaborator Email must be included in delete request.' });
					return;
				}

				const applicationId = Number(request.params.applicationId);

				if (!isPositiveInteger(applicationId)) {
					response.status(400).json({ error: 'INVALID_REQUEST', message: 'Application ID is not a valid number.' });
					return;
				}

				const { userId } = request.session.user || {};
				if (!userId) {
					response.status(401).json({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
					return;
				}

				const applicationResult = await getApplicationById({ applicationId });
				if (!applicationResult.success) {
					switch (applicationResult.error) {
						case 'SYSTEM_ERROR': {
							response.status(500).json({ error: applicationResult.error, message: applicationResult.message });
							return;
						}
						case 'NOT_FOUND': {
							response.status(404).json({ error: applicationResult.error, message: applicationResult.message });
							return;
						}
					}
				}

				if (applicationResult.data.userId !== userId) {
					response.status(403).json({
						error: 'FORBIDDEN',
						message: 'User is not authorized to modify collaborators for this application.',
					});
					return;
				}

				const result = await deleteCollaborator({
					application_id: applicationId,
					collaborator_email: collaboratorEmail,
				});

				if (result.success) {
					response.status(201).json(result.data);
					return;
				}
				switch (result.error) {
					case 'INVALID_STATE_TRANSITION': {
						response.status(400).json({ error: 'INVALID_REQUEST', message: result.message });
						return;
					}
					case 'NOT_FOUND': {
						response.status(404).json({ error: result.error, message: result.message });
						return;
					}
					case 'SYSTEM_ERROR': {
						response.status(500).json({ error: result.error, message: result.message });
						return;
					}
				}
			} catch (error) {
				response.status(500).json({ error: 'SYSTEM_ERROR', message: 'Unexpected error.' });
			}
		},
	),
);

/**
 * Update Collaborator
 */
collaboratorsRouter.post(
	'/update',
	withBodySchemaValidation(
		collaboratorsUpdateRequestSchema,
		apiZodErrorMapping,
		async (
			request,
			response: ResponseWithData<
				ListCollaboratorResponse,
				['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST', 'CONFLICT']
			>,
		) => {
			try {
				const { applicationId: application_id, collaboratorEmail, collaboratorUpdates } = request.body;

				const { userId } = request.session.user || {};
				if (!userId) {
					response.status(401).json({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
					return;
				}

				const result = await updateCollaborator({
					application_id,
					institutional_email: collaboratorEmail,
					user_id: userId,
					collaboratorUpdates,
				});

				if (result.success) {
					response.status(201).json(result.data);
					return;
				}
				switch (result.error) {
					case 'INVALID_STATE_TRANSITION': {
						response.status(400).json({ error: 'INVALID_REQUEST', message: result.message });
						return;
					}
					case 'NOT_FOUND': {
						response.status(404).json({ error: result.error, message: result.message });
						return;
					}
					case 'SYSTEM_ERROR': {
						response.status(500).json({ error: result.error, message: result.message });
						return;
					}
					case 'FORBIDDEN': {
						response.status(403).json({ error: result.error, message: result.message });
						return;
					}
					case 'DUPLICATE_RECORD': {
						response.status(409).json({ error: 'CONFLICT', message: result.message });
						return;
					}
				}
			} catch (error) {
				response.status(500).json({ error: 'SYSTEM_ERROR', message: 'Unexpected error.' });
				return;
			}
		},
	),
);

export default collaboratorsRouter;
