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
	approveApplication,
	closeApplication,
	createApplication,
	createApplicationPDF,
	dacRejectApplication,
	editApplication,
	getAllApplications,
	getApplicationById,
	getApplicationStateTotals,
	getRevisions,
	requestApplicationRevisionsByDac,
	requestApplicationRevisionsByInstitutionalRep,
	revokeApplication,
	submitApplication,
	submitRevision,
	withdrawApplication,
} from '@/controllers/applicationController.js';

import BaseLogger from '@/logger.js';
import { TrademarkEnum } from '@/service/pdf/pdfService.ts';
import { RevisionRequestModel, type ApplicationStateTotals } from '@/service/types.ts';
import { convertToBasicApplicationRecord } from '@/utils/aliases.ts';
import { apiZodErrorMapping } from '@/utils/validation.js';
import type {
	ApplicationDTO,
	ApplicationListResponse,
	ApplicationResponseData,
	RevisionsDTO,
} from '@pcgl-daco/data-model';
import { ErrorType, withBodySchemaValidation, withParamsSchemaValidation } from '@pcgl-daco/request-utils';
import {
	applicationRevisionRequestSchema,
	basicApplicationParamSchema,
	editApplicationRequestSchema,
	isPositiveInteger,
	rejectApplicationRequestSchema,
	revokeApplicationRequestSchema,
	userRoleSchema,
} from '@pcgl-daco/validation';
import express, { type Request } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { getUserRole, isAssociatedRep } from '../service/authService.ts';
import { failure, success, type AsyncResult } from '../utils/results.ts';
import type { ResponseWithData } from './types.ts';

const applicationRouter = express.Router();
const logger = BaseLogger.forModule('applicationRouter');
/**
 * Ensure that the application requested is owned/created by the user making the request.
 * This will fetch the application from the database and check that the stored application's
 * user_id property matches the provided userId parameter, otherwise it will return a Result
 * of 'FORBIDDEN'.
 *
 * This function returns several error cases in order to handle cases where:
 * - NOT_FOUND: the application id was not found in the database
 * - SYSTEM_ERROR: something unexpected happened fetching the application
 * - FORBIDDEN: the application does not belong to this user
 * @param param0
 * @returns
 */
async function validateUserPermissionForApplication({
	userId,
	applicationId,
}: {
	userId: string;
	applicationId: number;
}): AsyncResult<void, 'NOT_FOUND' | 'SYSTEM_ERROR' | 'FORBIDDEN'> {
	try {
		// We need to get the application to validate that this user can edit it
		const applicationResult = await getApplicationById({ applicationId });
		if (!applicationResult.success) {
			return applicationResult;
		}

		// ensure application has this user's ID
		if (applicationResult.data.userId !== userId) {
			return failure('FORBIDDEN', 'User is not the creator of this application.');
		}

		return success(undefined);
	} catch (error) {
		return failure('SYSTEM_ERROR', 'Unexpected error.');
	}
}

applicationRouter.post(
	'/create',
	authMiddleware({ requiredRoles: ['APPLICANT'] }),
	async (request: Request, response: ResponseWithData<ApplicationDTO, ['UNAUTHORIZED', 'SYSTEM_ERROR']>) => {
		const { user } = request.session;
		const { userId } = user || {};

		if (!userId) {
			response.status(401).json({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
			return;
		}

		const result = await createApplication({ user_id: userId });

		if (result.success) {
			response.status(201).json(result.data);
		} else {
			response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
		}
	},
);

applicationRouter.post(
	'/edit',
	authMiddleware({ requiredRoles: ['APPLICANT'] }),
	withBodySchemaValidation(
		editApplicationRequestSchema,
		apiZodErrorMapping,
		async (
			request: Request,
			response: ResponseWithData<
				ApplicationResponseData,
				['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST']
			>,
		) => {
			const data = request.body;
			const { id, update } = data;

			// Need user ID to validate the user has access to this app.
			const { user } = request.session;
			const { userId } = user || {};

			if (!userId) {
				response.status(401).json({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
				return;
			}
			try {
				const userMayEditResult = await validateUserPermissionForApplication({ userId, applicationId: id });
				if (!userMayEditResult.success) {
					switch (userMayEditResult.error) {
						case 'SYSTEM_ERROR': {
							response.status(500).json({ error: userMayEditResult.error, message: userMayEditResult.message });
							return;
						}
						case 'NOT_FOUND': {
							response.status(404).json({ error: userMayEditResult.error, message: userMayEditResult.message });
							return;
						}
						case 'FORBIDDEN': {
							response.status(403).json({ error: userMayEditResult.error, message: userMayEditResult.message });
							return;
						}
						default: {
							response.status(500).json({ error: 'SYSTEM_ERROR', message: userMayEditResult.message });
							return;
						}
					}
				}

				const result = await editApplication({ id, update });
				if (result.success) {
					response.json(result.data);
					return;
				}
				switch (result.error) {
					case 'SYSTEM_ERROR': {
						response.status(500).json({ error: result.error, message: result.message });
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
					default: {
						response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
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
 * TODO: validate queryParam options using zod
 */
applicationRouter.get(
	'/',
	authMiddleware({ requiredRoles: ['APPLICANT', 'DAC_MEMBER'] }),
	async (
		request: Request,
		response: ResponseWithData<ApplicationListResponse, ['INVALID_REQUEST', 'UNAUTHORIZED', 'SYSTEM_ERROR']>,
	) => {
		const { userId } = request.session.user || {};

		if (!userId) {
			response.status(400).json({ error: 'UNAUTHORIZED', message: 'User ID is required' });
			return;
		}

		const isDACMember = getUserRole(request.session) === userRoleSchema.Values.DAC_MEMBER;

		const { state: stateQuery, sort: sortQuery, page, pageSize, isApplicantView: isApplicantViewQuery } = request.query;

		const pageRequested = page ? Number(page) : undefined;
		const pageSizeRequested = pageSize ? Number(pageSize) : undefined;

		/**
		 * We need to ensure that the page size or page somehow passed into here is not negative or not a number.
		 * If it is, we need to throw a client error, warning them that that's a bad request.
		 */
		if (
			(pageRequested !== undefined && pageRequested !== 0 && !isPositiveInteger(pageRequested)) ||
			(pageSizeRequested !== undefined && !isPositiveInteger(pageSizeRequested))
		) {
			response
				.status(400)
				.json({ error: 'INVALID_REQUEST', message: 'Page and/or page size must be a positive integer.' });
			return;
		}

		let sort = [];
		let state = [];
		let isApplicantView;

		try {
			sort = typeof sortQuery === 'string' ? JSON.parse(sortQuery) : [];
			state = typeof stateQuery === 'string' ? JSON.parse(stateQuery as any) : [];
			isApplicantView = typeof isApplicantViewQuery === 'string' ? isApplicantViewQuery === 'true' : undefined;
		} catch {
			response.status(400).json({
				error: 'INVALID_REQUEST',
				message: 'Invalid formatting - sort and/or state parameters contain invalid JSON.',
			});
			return;
		}

		const result = await getAllApplications({
			userId,
			state,
			sort,
			page: pageRequested,
			pageSize: pageSizeRequested,
			isDACMember,
			isApplicantView,
		});

		if (result.success) {
			response.status(200).json(result.data);
			return;
		} else {
			switch (result.error) {
				case 'SYSTEM_ERROR': {
					response.status(500).json({ error: result.error, message: result.message });
					return;
				}
				case 'INVALID_PARAMETERS': {
					response.status(400).json({ error: 'INVALID_REQUEST', message: result.message });
					return;
				}
				default: {
					response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
					return;
				}
			}
		}
	},
);

applicationRouter.get(
	'/:applicationId',
	authMiddleware(),
	withParamsSchemaValidation(
		basicApplicationParamSchema,
		apiZodErrorMapping,
		async (
			request: Request,
			response: ResponseWithData<
				ApplicationResponseData,
				['INVALID_REQUEST', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'NOT_FOUND']
			>,
		) => {
			const { user } = request.session;
			const { userId } = user || {};

			if (!userId) {
				response.status(401).json({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
				return;
			}

			const applicationId = Number(request.params.applicationId);

			const result = await getApplicationById({ applicationId });

			if (result.success) {
				const { data } = result;

				// TODO: Only return application if either it belongs to the requesting user, or the user is a DAC_MEMBER of if they're an associated inst-rep
				const hasSpecialAccess =
					getUserRole(request.session) === userRoleSchema.Values.DAC_MEMBER ||
					isAssociatedRep(request.session, applicationId);

				const canAccess = data.userId === userId || hasSpecialAccess;

				if (!canAccess) {
					response.status(403).json({ error: 'FORBIDDEN', message: 'User cannot access this application.' });
					return;
				}

				response.status(200).json(data);
				return;
			}
			switch (result.error) {
				case 'SYSTEM_ERROR': {
					response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
					return;
				}
				case 'NOT_FOUND': {
					response.status(404).json({ error: 'NOT_FOUND', message: result.message });
					return;
				}
				default: {
					response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
					return;
				}
			}
		},
	),
);

/**
 * Gets the total of how many applications are in each state type (APPROVED, REJECTED, etc...),
 * including a TOTAL count.
 *
 * Auth:
 * - only accessible by DAC members
 */
applicationRouter.get(
	'/metadata/counts',
	authMiddleware({ requiredRoles: ['DAC_MEMBER'] }),
	async (request: Request, response: ResponseWithData<ApplicationStateTotals, ['SYSTEM_ERROR']>) => {
		const result = await getApplicationStateTotals();

		if (result.success) {
			response.status(200).json(result.data);
			return;
		} else {
			response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
			return;
		}
	},
);

applicationRouter.post(
	'/:applicationId/approve',
	authMiddleware({ requiredRoles: ['DAC_MEMBER'] }),
	withParamsSchemaValidation(
		basicApplicationParamSchema,
		apiZodErrorMapping,
		async (
			request: Request,
			response: ResponseWithData<ApplicationDTO, ['NOT_FOUND', 'INVALID_REQUEST', 'SYSTEM_ERROR']>,
		) => {
			const applicationId = Number(request.params.applicationId);

			try {
				const approvalResult = await approveApplication({ applicationId });

				if (approvalResult.success) {
					/**
					 * We want to auto generate a PDF on successful approval, as such call the local createApplicationPDF function.
					 */
					const pdfGenerate = await createApplicationPDF({ applicationId, trademark: TrademarkEnum.APPROVED });
					if (pdfGenerate.success) {
						response.status(200).json(approvalResult.data);
						return;
					}

					switch (pdfGenerate.error) {
						case 'NOT_FOUND': {
							logger.error(
								`Application ${approvalResult.data.id} was approved, however, PDF was unable to be generated because required data was not found.`,
							);

							response.status(404).json({
								error: 'NOT_FOUND',
								message:
									'Application was approved, but PDF was unable to be generated because required data was not found.',
							});
							return;
						}
						case 'SYSTEM_ERROR': {
							logger.error(
								`Application ${approvalResult.data.id} was approved, however, PDF was unable to be generated. ${pdfGenerate.message}`,
							);

							response.status(500).json({
								error: 'SYSTEM_ERROR',
								message: `Application was successfully approved, however, a PDF generation error occurred.`,
							});
							return;
						}
					}
				}

				switch (approvalResult.error) {
					case 'INVALID_STATE_TRANSITION': {
						response.status(400).json({ error: 'INVALID_REQUEST', message: approvalResult.message });
						return;
					}
					case 'SYSTEM_ERROR': {
						response.status(500).json({ error: approvalResult.error, message: approvalResult.message });
						return;
					}
					case 'NOT_FOUND': {
						response.status(404).json({ error: approvalResult.error, message: 'Application not found.' });
						return;
					}
					default: {
						response.status(500).json({ error: 'SYSTEM_ERROR', message: approvalResult.message });
						return;
					}
				}
			} catch (error) {
				response.status(500).json({ error: 'SYSTEM_ERROR', message: `Something went wrong, please try again later.` });
			}
		},
	),
);

applicationRouter.post(
	'/:applicationId/reject',
	authMiddleware({ requiredRoles: ['DAC_MEMBER'] }),
	withParamsSchemaValidation(
		basicApplicationParamSchema,
		apiZodErrorMapping,
		withBodySchemaValidation(
			rejectApplicationRequestSchema,
			apiZodErrorMapping,
			async (
				request: Request,
				response: ResponseWithData<ApplicationDTO, ['INVALID_REQUEST', 'NOT_FOUND', 'SYSTEM_ERROR', 'UNAUTHORIZED']>,
			) => {
				const { rejectionReason } = request.body;
				const applicationId = Number(request.params.applicationId);

				try {
					const result = await dacRejectApplication({ applicationId, rejectionReason });

					if (!result.success) {
						switch (result.error) {
							case 'INVALID_STATE_TRANSITION': {
								response.status(400).json({ error: 'INVALID_REQUEST', message: result.message });
								return;
							}
							case 'SYSTEM_ERROR': {
								response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
								return;
							}
							case 'NOT_FOUND': {
								response.status(404).json({ error: 'NOT_FOUND', message: result.message });
								return;
							}
							default: {
								response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
								return;
							}
						}
					}

					const pdfGenerate = await createApplicationPDF({ applicationId, trademark: TrademarkEnum.REJECTED });

					if (!pdfGenerate.success) {
						logger.error(`Application ${applicationId} failed to generate REJECTION Application PDF.`);
						return;
					}
					response.status(200).json(result.data);
					return;
				} catch (error) {
					response.status(500).json({ error: 'SYSTEM_ERROR', message: `Unexpected error.` });
				}
			},
		),
	),
);

applicationRouter.post(
	'/:applicationId/submit-revisions',
	authMiddleware(),
	withParamsSchemaValidation(
		basicApplicationParamSchema,
		apiZodErrorMapping,
		async (
			request: Request,
			response: ResponseWithData<
				ApplicationDTO,
				['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST']
			>,
		) => {
			const applicationId = Number(request.params.applicationId);

			// Need user ID to validate the user has access to this app.
			const { user } = request.session;
			const { userId } = user || {};

			if (!userId) {
				response.status(401).json({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
				return;
			}

			try {
				const userMayEditResult = await validateUserPermissionForApplication({ userId, applicationId });
				if (!userMayEditResult.success) {
					switch (userMayEditResult.error) {
						case 'SYSTEM_ERROR': {
							response.status(500).json({ error: userMayEditResult.error, message: userMayEditResult.message });
							return;
						}
						case 'NOT_FOUND': {
							response.status(404).json({ error: userMayEditResult.error, message: userMayEditResult.message });
							return;
						}
						case 'FORBIDDEN': {
							response.status(403).json({ error: userMayEditResult.error, message: userMayEditResult.message });
							return;
						}
						default: {
							response.status(500).json({ error: userMayEditResult.error, message: userMayEditResult.message });
							return;
						}
					}
				}

				const result = await submitRevision({ applicationId });

				if (!result.success) {
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
						default: {
							response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
							return;
						}
					}
				}

				const aliasedResponse = convertToBasicApplicationRecord(result.data);

				if (!aliasedResponse.success) {
					response.status(500).json({ error: 'SYSTEM_ERROR', message: aliasedResponse.message });
					return;
				}

				response.status(200).json(aliasedResponse.data);
				return;
			} catch (error) {
				response.status(500).json({
					error: 'SYSTEM_ERROR',
					message: 'Sorry something went wrong, please try again later.',
				});
			}
		},
	),
);

applicationRouter.post(
	'/:applicationId/revoke',
	authMiddleware(),
	withParamsSchemaValidation(
		basicApplicationParamSchema,
		apiZodErrorMapping,
		withBodySchemaValidation(
			revokeApplicationRequestSchema,
			apiZodErrorMapping,
			async (
				request: Request,
				response: ResponseWithData<
					ApplicationDTO,
					['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST']
				>,
			) => {
				const applicationId = Number(request.params.applicationId);
				const { revokeReason } = request.body;
				const { user } = request.session;
				const { userId } = user || {};

				const isDACMember = getUserRole(request.session) === userRoleSchema.Values.DAC_MEMBER;

				if (!userId) {
					response.status(401).json({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
					return;
				}

				const userMayEditResult = await validateUserPermissionForApplication({ userId, applicationId });

				if (!userMayEditResult.success) {
					switch (userMayEditResult.error) {
						case 'SYSTEM_ERROR': {
							response.status(500).json({ error: userMayEditResult.error, message: userMayEditResult.message });
							return;
						}
						case 'NOT_FOUND': {
							response.status(404).json({ error: userMayEditResult.error, message: userMayEditResult.message });
							return;
						}
						case 'FORBIDDEN': {
							response.status(403).json({ error: userMayEditResult.error, message: userMayEditResult.message });
							return;
						}
						default: {
							response.status(500).json({ error: 'SYSTEM_ERROR', message: userMayEditResult.message });
							return;
						}
					}
				}

				const result = await revokeApplication(applicationId, isDACMember, revokeReason);

				if (!result.success) {
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
						default: {
							response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
							return;
						}
					}
				}
				const pdfGenerate = await createApplicationPDF({ applicationId, trademark: TrademarkEnum.REVOKED });

				if (!pdfGenerate.success) {
					logger.error(`Application ${applicationId} failed to generate REVOKED Application PDF.`);
					response.status(500).json({ error: pdfGenerate.error, message: pdfGenerate.message });
					return;
				}
				response.status(200).json(result.data);
				return;
			},
		),
	),
);

applicationRouter.post(
	'/:applicationId/close',
	authMiddleware({ requiredRoles: ['DAC_MEMBER', 'APPLICANT'] }),
	withParamsSchemaValidation(
		basicApplicationParamSchema,
		apiZodErrorMapping,
		async (
			request: Request,
			response: ResponseWithData<ApplicationDTO, ['INVALID_REQUEST', 'NOT_FOUND', 'SYSTEM_ERROR']>,
		) => {
			const applicationId = Number(request.params.applicationId);

			try {
				const result = await closeApplication({ applicationId });

				if (!result.success) {
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
						default: {
							response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
							return;
						}
					}
				}

				const pdfGenerate = await createApplicationPDF({ applicationId, trademark: TrademarkEnum.CLOSED });

				if (!pdfGenerate.success) {
					logger.error(`Application ${applicationId} failed to generate CLOSED Application PDF.`);
				}

				response.status(200).json(result.data);
				return;
			} catch (error) {
				response.status(500).json({
					error: 'SYSTEM_ERROR',
					message: 'Unexpected error.',
				});
			}
		},
	),
);

applicationRouter.post(
	'/:applicationId/withdraw',
	authMiddleware({ requiredRoles: ['APPLICANT'] }),
	withParamsSchemaValidation(
		basicApplicationParamSchema,
		apiZodErrorMapping,
		async (
			request: Request,
			response: ResponseWithData<
				ApplicationDTO,
				['INVALID_REQUEST', 'FORBIDDEN', 'UNAUTHORIZED', 'NOT_FOUND', 'SYSTEM_ERROR']
			>,
		) => {
			const applicationId = Number(request.params.applicationId);

			const { user } = request.session;
			const { userId } = user || {};

			if (!userId) {
				response.status(401).json({ error: ErrorType.UNAUTHORIZED, message: 'User is not authenticated.' });
				return;
			}

			try {
				const application = await getApplicationById({ applicationId });

				if (!application.success) {
					switch (application.error) {
						case 'NOT_FOUND':
							response.status(404);
							break;
						case 'SYSTEM_ERROR':
							response.status(500);
							break;
						default:
							response.status(500);
					}

					response.send({
						error: application.error,
						message: application.message,
					});
					return;
				}

				if (application.data.userId !== userId) {
					response.status(403).send({
						error: ErrorType.FORBIDDEN,
						message: 'User does not have permission to access or modify this application.',
					});
				}

				const result = await withdrawApplication({ applicationId });

				if (result.success) {
					response.status(200).json(result.data);
					return;
				}

				switch (result.error) {
					case 'INVALID_STATE_TRANSITION':
						response.status(400);
						break;
					case 'NOT_FOUND':
						response.status(404);
						break;
					default:
						response.status(500);
				}

				response.send({
					error: result.error === 'INVALID_STATE_TRANSITION' ? 'INVALID_REQUEST' : result.error,
					message: result.message,
				});
			} catch (error) {
				response.status(500).json({
					error: 'SYSTEM_ERROR',
					message: 'Something went wrong, please try again later.',
				});
			}
		},
	),
);

applicationRouter.post(
	'/:applicationId/submit',
	authMiddleware(),
	withParamsSchemaValidation(
		basicApplicationParamSchema,
		apiZodErrorMapping,
		async (
			request: Request,
			response: ResponseWithData<
				ApplicationDTO,
				['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST']
			>,
		) => {
			try {
				const applicationId = Number(request.params.applicationId);

				const { userId } = request.session.user || {};
				if (!userId) {
					response.status(401).json({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
					return;
				}

				const userMayEditResult = await validateUserPermissionForApplication({ userId, applicationId });
				if (!userMayEditResult.success) {
					switch (userMayEditResult.error) {
						case 'SYSTEM_ERROR': {
							response.status(500).json({ error: userMayEditResult.error, message: userMayEditResult.message });
							return;
						}
						case 'NOT_FOUND': {
							response.status(404).json({ error: userMayEditResult.error, message: userMayEditResult.message });
							return;
						}
						case 'FORBIDDEN': {
							response.status(403).json({ error: userMayEditResult.error, message: userMayEditResult.message });
							return;
						}
						default: {
							response.status(500).json({ error: 'SYSTEM_ERROR', message: userMayEditResult.message });
							return;
						}
					}
				}

				const result = await submitApplication({ applicationId });

				if (!result.success) {
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
						default: {
							response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
							return;
						}
					}
				}
				const pdfGenerate = await createApplicationPDF({ applicationId, trademark: TrademarkEnum.NOT_APPROVED });

				if (!pdfGenerate.success) {
					logger.error(`Application ${applicationId} failed to generate NOT APPROVED Application PDF.`);
				}

				response.status(200).json(result.data);
				return;
			} catch (error) {
				response.status(500).json({
					error: 'SYSTEM_ERROR',
					message: 'Unexpected error.',
				});
			}
		},
	),

	// Endpoint for reps to request revisions
	applicationRouter.post(
		'/:applicationId/dac/request-revisions',
		authMiddleware({ requiredRoles: ['DAC_MEMBER'] }),
		withBodySchemaValidation(
			applicationRevisionRequestSchema,
			apiZodErrorMapping,
			async (
				request: Request,
				response: ResponseWithData<ApplicationDTO, ['INVALID_REQUEST', 'NOT_FOUND', 'SYSTEM_ERROR']>,
			) => {
				try {
					const applicationId = Number(request.params.applicationId);

					if (!isPositiveInteger(applicationId)) {
						response.status(400).json({
							error: 'INVALID_REQUEST',
							message: 'Invalid request. ApplicationId is required and must be a valid number.',
						});
						return;
					}

					const revisions = request.body;

					const updatedRevisionData: RevisionRequestModel = {
						application_id: applicationId,
						comments: revisions.comments,
						applicant_approved: revisions.applicantApproved,
						applicant_notes: revisions.applicantNotes,
						institution_rep_approved: revisions.institutionRepApproved,
						institution_rep_notes: revisions.institutionRepNotes,
						collaborators_approved: revisions.collaboratorsApproved,
						collaborators_notes: revisions.collaboratorsNotes,
						project_approved: revisions.projectApproved,
						project_notes: revisions.projectNotes,
						requested_studies_approved: revisions.requestedStudiesApproved,
						requested_studies_notes: revisions.requestedStudiesNotes,
						ethics_approved: revisions.ethicsApproved,
						ethics_notes: revisions.ethicsNotes,
						agreements_approved: revisions.agreementsApproved,
						agreements_notes: revisions.agreementsNotes,
						appendices_approved: revisions.appendicesApproved,
						appendices_notes: revisions.appendicesNotes,
						sign_and_submit_approved: revisions.signAndSubmitApproved,
						sign_and_submit_notes: revisions.signAndSubmitNotes,
					};

					// Call service method to handle request
					const updatedApplication = await requestApplicationRevisionsByDac({
						applicationId,
						revisionData: updatedRevisionData,
					});
					if (updatedApplication.success) {
						response.status(200).json(updatedApplication.data);
						return;
					}

					switch (updatedApplication.error) {
						case 'INVALID_STATE_TRANSITION': {
							response.status(400).json({ error: 'INVALID_REQUEST', message: updatedApplication.message });
							return;
						}
						case 'NOT_FOUND': {
							response.status(404).json({ error: updatedApplication.error, message: updatedApplication.message });
							return;
						}
						case 'SYSTEM_ERROR': {
							response.status(500).json({ error: updatedApplication.error, message: updatedApplication.message });
							return;
						}
						default: {
							response.status(500).json({ error: 'SYSTEM_ERROR', message: updatedApplication.message });
							return;
						}
					}
				} catch (error) {
					response.status(500).json({
						error: 'SYSTEM_ERROR',
						message: 'Unexpected error.',
					});
				}
			},
		),
	),
);

// Endpoint for reps to request revisions
applicationRouter.post(
	'/:applicationId/rep/request-revisions',
	authMiddleware(),
	withParamsSchemaValidation(
		basicApplicationParamSchema,
		apiZodErrorMapping,
		withBodySchemaValidation(
			applicationRevisionRequestSchema,
			apiZodErrorMapping,
			async (
				request: Request,
				response: ResponseWithData<
					ApplicationDTO,
					['NOT_FOUND', 'SYSTEM_ERROR', 'INVALID_REQUEST', 'INVALID_STATE_TRANSITION', 'FORBIDDEN']
				>,
			) => {
				try {
					const applicationId = Number(request.params.applicationId);

					const revisionData = request.body;

					const updatedRevisionData: RevisionRequestModel = {
						application_id: applicationId,
						comments: revisionData.comments,
						applicant_approved: revisionData.applicantApproved,
						applicant_notes: revisionData.applicantNotes,
						institution_rep_approved: revisionData.institutionRepApproved,
						institution_rep_notes: revisionData.institutionRepNotes,
						collaborators_approved: revisionData.collaboratorsApproved,
						collaborators_notes: revisionData.collaboratorsNotes,
						project_approved: revisionData.projectApproved,
						project_notes: revisionData.projectNotes,
						requested_studies_approved: revisionData.requestedStudiesApproved,
						requested_studies_notes: revisionData.requestedStudiesNotes,
						ethics_approved: revisionData.ethicsApproved,
						ethics_notes: revisionData.ethicsNotes,
						agreements_approved: revisionData.agreementsApproved,
						agreements_notes: revisionData.agreementsNotes,
						appendices_approved: revisionData.appendicesApproved,
						appendices_notes: revisionData.appendicesNotes,
						sign_and_submit_approved: revisionData.signAndSubmitApproved,
						sign_and_submit_notes: revisionData.signAndSubmitNotes,
					};

					const result = await isAssociatedRep(request.session, applicationId);

					if (!result) {
						response.status(403).json({
							error: 'FORBIDDEN',
							message: 'You do not have permission to request revisions on this application.',
						});
						return;
					}

					// Call service method to handle request
					const updatedApplication = await requestApplicationRevisionsByInstitutionalRep({
						applicationId,
						revisionData: updatedRevisionData,
					});
					if (updatedApplication.success) {
						response.status(200).json(updatedApplication.data);
						return;
					}
					switch (updatedApplication.error) {
						case 'INVALID_STATE_TRANSITION': {
							response.status(400).json({ error: 'INVALID_REQUEST', message: updatedApplication.message });
							return;
						}
						case 'NOT_FOUND': {
							response.status(404).json({ error: updatedApplication.error, message: updatedApplication.message });
							return;
						}
						case 'SYSTEM_ERROR': {
							response.status(500).json({ error: updatedApplication.error, message: updatedApplication.message });
							return;
						}
						default: {
							response.status(500).json({ error: 'SYSTEM_ERROR', message: updatedApplication.message });
							return;
						}
					}
				} catch (error) {
					response.status(500).json({
						error: 'SYSTEM_ERROR',
						message: 'Unexpected error.',
					});
				}
			},
		),
	),
);

applicationRouter.get(
	'/:applicationId/revisions',
	authMiddleware(),
	withParamsSchemaValidation(
		basicApplicationParamSchema,
		apiZodErrorMapping,
		async (
			request: Request,
			response: ResponseWithData<RevisionsDTO[], ['FORBIDDEN', 'INVALID_REQUEST', 'NOT_FOUND', 'SYSTEM_ERROR']>,
		) => {
			const { applicationId } = request.params;
			const userSession = request.session;

			try {
				const applicationInfo = await getApplicationById({ applicationId: Number(applicationId) });

				if (!applicationInfo.success) {
					switch (applicationInfo.error) {
						case 'NOT_FOUND':
							response.status(404);
							break;
						case 'SYSTEM_ERROR':
						default:
							response.status(500);
							break;
					}
					response.send({
						error: applicationInfo.error,
						message: applicationInfo.message,
					});

					return;
				}

				if (getUserRole(userSession) === 'APPLICANT' && applicationInfo.data.userId !== userSession.user?.userId) {
					response.status(403).send({
						error: 'FORBIDDEN',
						message: 'User does not have permission to access or modify this application.',
					});
					return;
				}

				const result = await getRevisions({ applicationId: Number(applicationId) });

				//Service only returns this if a SYSTEM_ERROR occurs, set to HTTP code 500 and bail if this is the case.
				if (!result.success) {
					response.status(500).json({ error: result.error, message: result.message });
					return;
				}

				response.status(200).json(result.data);
				return;
			} catch (error) {
				response.status(500).json({
					error: 'SYSTEM_ERROR',
					message: "We're sorry, an unexpected error occurred. Please try again later.",
				});
				return;
			}
		},
	),
);

export default applicationRouter;
