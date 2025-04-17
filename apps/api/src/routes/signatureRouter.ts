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

import {
	withBodySchemaValidation,
	withParamsSchemaValidation,
	withQuerySchemaValidation,
} from '@pcgl-daco/request-utils';
import {
	deleteSignatureParamsSchema,
	deleteSignatureQuerySchema,
	editSignatureRequestSchema,
	getSignatureParamsSchema,
	isPositiveInteger,
	userRoleSchema,
	type EditSignatureResponse,
} from '@pcgl-daco/validation';
import express, { type Request } from 'express';

import {
	deleteApplicationSignature,
	getApplicationSignature,
	updateApplicationSignature,
} from '@/controllers/signatureController.ts';
import { apiZodErrorMapping } from '@/utils/validation.js';
import type { SignatureDTO } from '@pcgl-daco/data-model';
import { getApplicationById } from '../controllers/applicationController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { getUserRole, isAssociatedRep } from '../service/authService.ts';
import type { ResponseWithData } from './types.ts';

const signatureRouter = express.Router();

/**
 * Get the Signature for an application by application ID
 */
signatureRouter.get(
	'/:applicationId',
	authMiddleware(),
	withParamsSchemaValidation(
		getSignatureParamsSchema,
		apiZodErrorMapping,
		async (
			request,
			response: ResponseWithData<
				SignatureDTO,
				['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST']
			>,
		) => {
			try {
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
				const isDacMember = userRole === 'DAC_MEMBER';

				if (!(isApplicationUser || isDacMember)) {
					response
						.status(403)
						.json({ error: 'FORBIDDEN', message: `User does not have permission to access this application.` });
					return;
				}

				const result = await getApplicationSignature({ applicationId: Number(applicationId) });

				if (result.success) {
					response.status(200).json(result.data);
					return;
				}

				switch (result.error) {
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
				return;
			}
		},
	),
);

/**
 * Add a signature to an application for a user.
 *
 * The body of the request will indicate if the signature is from the applicant or the institutional representative.
 *
 * To sign an application, the user must be the author of the application, or be the institutional rep assigned to the application.
 */
signatureRouter.post(
	'/sign',
	authMiddleware(),
	withBodySchemaValidation(
		editSignatureRequestSchema,
		apiZodErrorMapping,
		async (
			request,
			response: ResponseWithData<
				EditSignatureResponse,
				['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST']
			>,
		) => {
			try {
				const data = request.body;
				const { applicationId, signature } = data;
				const role = getUserRole(request.session);

				if (role !== userRoleSchema.Values.APPLICANT && role !== userRoleSchema.Values.INSTITUTIONAL_REP) {
					response.status(401).json({
						error: 'FORBIDDEN',
						message: 'User role is not allowed to create a signature for this application',
					});
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

				const isApplicationUser = role === userRoleSchema.Values.APPLICANT && applicationResult.data.userId === userId;

				const isApplicationInstitutionalRep =
					role === userRoleSchema.Values.INSTITUTIONAL_REP && (await isAssociatedRep(request.session, applicationId));

				if (!(isApplicationUser || isApplicationInstitutionalRep)) {
					response
						.status(403)
						.json({ error: 'FORBIDDEN', message: `User does not have permission to access this application.` });
					return;
				}

				const result = await updateApplicationSignature({
					applicationId,
					signature,
					signee: role,
				});

				if (result.success) {
					response.json(result.data);
					return;
				}

				switch (result.error) {
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
				return;
			}
		},
	),
);

signatureRouter.delete(
	'/:applicationId',
	authMiddleware(),
	withParamsSchemaValidation(
		deleteSignatureParamsSchema,
		apiZodErrorMapping,
		withQuerySchemaValidation(
			deleteSignatureQuerySchema,
			apiZodErrorMapping,
			async (
				request: Request,
				response: ResponseWithData<void, ['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST']>,
			) => {
				try {
					// Validate Parameter
					const applicationId = Number(request.params.applicationId);

					if (!isPositiveInteger(applicationId)) {
						response.status(400).json({ error: 'INVALID_REQUEST', message: 'Application ID is not a valid number.' });
						return;
					}

					// Validate Query Params
					const queryValidationResult = deleteSignatureQuerySchema.safeParse(request.query);
					if (!queryValidationResult.success) {
						response.status(400).json({
							error: 'INVALID_REQUEST',
							message: `Signee parameter must be either 'APPLICANT' or 'INSTITUTIONAL_REP'.`,
						});
						return;
					}
					const { signee } = queryValidationResult.data;

					// Get user from session and validate that they can act on this application
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

					const isApplicationUser = signee === 'APPLICANT' && applicationResult.data.userId === userId;

					const isApplicationInstitutionalRep =
						signee === 'INSTITUTIONAL_REP' && (await isAssociatedRep(request.session, applicationId));

					if (!(isApplicationUser || isApplicationInstitutionalRep)) {
						response
							.status(403)
							.json({ error: 'FORBIDDEN', message: `User does not have permission to access this application.` });
						return;
					}

					// Perform deletion
					const result = await deleteApplicationSignature({
						applicationId: Number(applicationId),
						signee: signee,
					});

					if (result.success) {
						/**
						 * Since we've deleted the signature, we can return back a 204 and no content to indicate its success.
						 */
						response.status(204).json();
						return;
					}

					switch (result.error) {
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
					return;
				}
			},
		),
	),
);

export default signatureRouter;
