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
} from '@/controllers/applicationController.js';
import {
	RevisionRequestModel,
	type ApplicationRecord,
	type ApplicationStateTotals,
	type JoinedApplicationRecord,
} from '@/service/types.ts';
import { apiZodErrorMapping } from '@/utils/validation.js';
import type { ApplicationListResponse, ApplicationResponseData } from '@pcgl-daco/data-model';
import { withBodySchemaValidation, withParamsSchemaValidation } from '@pcgl-daco/request-utils';
import {
	applicationRevisionRequestSchema,
	collaboratorsListParamsSchema,
	editApplicationRequestSchema,
	isPositiveInteger,
	userRoleSchema,
} from '@pcgl-daco/validation';
import express, { type Request } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { getUserRole } from '../service/authService.ts';
import { failure, success, type AsyncResult } from '../utils/results.ts';
import type { ResponseWithData } from './types.ts';

const applicationRouter = express.Router();

/**
 * Ensure that the application requested is owned/created by the user making the request.
 * This will fetch the application from the database and check that the stored application's
 * user_id property matches the provided userId parameter, otherwise it will return a Result
 * of 'FORBIDDEN'.
 *
 * This function returns several error cases in order to handle cases where:
 * - NOT_FOUND: the application id was not found in the database
 * - SYSTEM_ERROR: somethign unexpected happened fetching the application
 * - FORBIDEN: the application does not belong to this user
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
			return failure('FORBIDDEN', 'User is not the creater of this application.');
		}

		return success(undefined);
	} catch (error) {
		return failure('SYSTEM_ERROR', 'Unexpected error.');
	}
}

/**
 * TODO:
 * 	- Validate request params using Zod.
 */
applicationRouter.post(
	'/create',
	authMiddleware(),
	async (request, response: ResponseWithData<ApplicationRecord, ['UNAUTHORIZED', 'SYSTEM_ERROR']>, next) => {
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
	authMiddleware(),
	withBodySchemaValidation(
		editApplicationRequestSchema,
		apiZodErrorMapping,
		async (
			request,
			response: ResponseWithData<
				JoinedApplicationRecord,
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
				}
			} catch (error) {
				response.status(500).json({ error: 'SYSTEM_ERROR', message: 'Unexpected error.' });
				return;
			}
		},
	),
);

// TODO: create a way for admin to fetch all applications, this is filtering by the requesting user's ID
// TODO: validate queryParam options using zod
applicationRouter.get(
	'/',
	authMiddleware(),
	async (
		request,
		response: ResponseWithData<ApplicationListResponse, ['INVALID_REQUEST', 'UNAUTHORIZED', 'SYSTEM_ERROR']>,
	) => {
		const { userId } = request.session.user || {};

		if (!userId) {
			response.status(400).json({ error: 'UNAUTHORIZED', message: 'User ID is required' });
			return;
		}

		const isDACMember = getUserRole(request.session) === userRoleSchema.Values.DAC_MEMBER;

		const { state: stateQuery, sort: sortQuery, page, pageSize } = request.query;

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

		try {
			sort = typeof sortQuery === 'string' ? JSON.parse(sortQuery) : [];
			state = typeof stateQuery === 'string' ? JSON.parse(stateQuery as any) : [];
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
			}
		}
	},
);

/**
 * TODO:
 * 	- Validate request params using Zod.
 * 	- Ideally we should also standardize errors eventually, so that we're not comparing strings.
 */
applicationRouter.get(
	'/:applicationId',
	authMiddleware(),
	async (
		request,
		response: ResponseWithData<
			ApplicationResponseData,
			['INVALID_REQUEST', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR']
		>,
	) => {
		const { user } = request.session;
		const { userId } = user || {};

		if (!userId) {
			response.status(401).json({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
			return;
		}

		const applicationId = Number(request.params.applicationId);
		if (!isPositiveInteger(applicationId)) {
			response
				.status(400)
				.json({ error: 'INVALID_REQUEST', message: 'Application ID parameter is not a valid number.' });
			return;
		}

		const result = await getApplicationById({ applicationId });

		if (result.success) {
			const { data } = result;

			// Only return application if either it belongs to the requesting user, or the user is a DAC_MEMBER
			if (data.userId !== userId || getUserRole(request.session) === userRoleSchema.Values.DAC_MEMBER) {
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
				response.status(404).json({ error: 'INVALID_REQUEST', message: 'Application not found.' });
				return;
			}
		}
	},
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
	async (request, response: ResponseWithData<ApplicationStateTotals, ['SYSTEM_ERROR']>) => {
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
	'/approve',
	authMiddleware({ requiredRoles: ['DAC_MEMBER'] }),
	async (
		request,
		response: ResponseWithData<{ message: string; data: ApplicationRecord }, ['INVALID_REQUEST', 'SYSTEM_ERROR']>,
	) => {
		const { applicationId }: { applicationId: unknown } = request.body;

		if (!(typeof applicationId === 'number' && isPositiveInteger(applicationId))) {
			response.status(400).json({
				error: 'INVALID_REQUEST',
				message: 'ApplicationId must be a valid number and is required.',
			});
			return;
		}

		try {
			const result = await approveApplication({ applicationId });

			if (result.success) {
				response.status(200).json({
					message: 'Application approved successfully.',
					data: result.data,
				});
				return;
			}
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
					response.status(404).json({ error: 'INVALID_REQUEST', message: 'Application not found.' });
					return;
				}
			}
		} catch (error) {
			response.status(500).json({ error: 'SYSTEM_ERROR', message: `Unexpected error.` });
		}
	},
);

applicationRouter.post(
	'/reject',
	authMiddleware({ requiredRoles: ['DAC_MEMBER'] }),
	async (
		request,
		response: ResponseWithData<
			{ message: string; data: ApplicationRecord },
			['INVALID_REQUEST', 'SYSTEM_ERROR', 'UNAUTHORIZED']
		>,
	) => {
		const { applicationId }: { applicationId: unknown } = request.body;

		if (!(typeof applicationId === 'number' && isPositiveInteger(applicationId))) {
			response.status(400).json({
				error: 'INVALID_REQUEST',
				message: 'Invalid request. ApplicationId is required and must be a valid number.',
			});
			return;
		}

		try {
			const result = await dacRejectApplication({ applicationId });

			if (result.success) {
				response.status(200).json({
					message: 'Application rejected successfully.',
					data: result.data,
				});
				return;
			}
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
					response.status(404).json({ error: 'INVALID_REQUEST', message: result.message });
					return;
				}
			}
		} catch (error) {
			response.status(500).json({ error: 'SYSTEM_ERROR', message: `Unexpected error.` });
		}
	},
);

applicationRouter.post(
	'/:applicationId/submit-revision',
	authMiddleware(),
	withParamsSchemaValidation(
		collaboratorsListParamsSchema,
		apiZodErrorMapping,
		async (
			request: Request,
			response: ResponseWithData<
				{ message: string; data: ApplicationRecord },
				['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST']
			>,
		) => {
			const applicationId = Number(request.params.applicationId);

			if (!isPositiveInteger(applicationId)) {
				response
					.status(400)
					.json({ error: 'INVALID_REQUEST', message: 'Application ID parameter is not a valid number.' });
				return;
			}

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
					}
				}

				const result = await submitRevision({ applicationId });

				if (result.success) {
					response.status(200).json({
						message: 'Application review submitted successfully.',
						data: result.data,
					});
					return;
				}
				switch (result.error) {
					case 'INVALID_STATE_TRANSITION': {
						response.status(400).json({ error: 'INVALID_REQUEST', message: result.message });
						return;
					}
					case 'NOT_FOUND': {
						response.status(404).json({ error: 'INVALID_REQUEST', message: result.message });
						return;
					}
					case 'SYSTEM_ERROR': {
						response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
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
);

applicationRouter.post(
	'/:applicationId/revoke',
	authMiddleware(),
	withParamsSchemaValidation(
		collaboratorsListParamsSchema,
		apiZodErrorMapping,
		async (
			request,
			response: ResponseWithData<
				{ message: string; data: ApplicationRecord },
				['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST']
			>,
		) => {
			const applicationId = Number(request.params.applicationId);

			if (!isPositiveInteger(applicationId)) {
				response
					.status(400)
					.json({ error: 'INVALID_REQUEST', message: 'Application ID parameter is not a valid number.' });
				return;
			}

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
					}
				}

				const result = await revokeApplication(applicationId);

				if (result.success) {
					response.status(200).json({
						message: 'Application revoked successfully.',
						data: result.data,
					});
					return;
				}
				switch (result.error) {
					case 'INVALID_STATE_TRANSITION': {
						response.status(400).json({ error: 'INVALID_REQUEST', message: result.message });
						return;
					}
					case 'NOT_FOUND': {
						response.status(404).json({ error: 'INVALID_REQUEST', message: result.message });
						return;
					}
					case 'SYSTEM_ERROR': {
						response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
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
);

applicationRouter.post(
	'/:applicationId/close',
	authMiddleware({ requiredRoles: ['DAC_MEMBER'] }),
	async (
		request: Request,
		response: ResponseWithData<{ message: string; data: ApplicationRecord }, ['INVALID_REQUEST', 'SYSTEM_ERROR']>,
	) => {
		const applicationId = Number(request.params.applicationId);

		if (!isPositiveInteger(applicationId)) {
			response
				.status(400)
				.json({ error: 'INVALID_REQUEST', message: 'Application ID parameter is not a valid number.' });
			return;
		}

		try {
			const result = await closeApplication({ applicationId });

			if (result.success) {
				response.status(200).json({
					message: 'Application closed successfully.',
					data: result.data,
				});
				return;
			}
			switch (result.error) {
				case 'INVALID_STATE_TRANSITION': {
					response.status(400).json({ error: 'INVALID_REQUEST', message: result.message });
					return;
				}
				case 'NOT_FOUND': {
					response.status(404).json({ error: 'INVALID_REQUEST', message: result.message });
					return;
				}
				case 'SYSTEM_ERROR': {
					response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
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
);

applicationRouter.post(
	'/:applicationId/submit',
	authMiddleware(),
	async (
		request: Request,
		response: ResponseWithData<
			ApplicationRecord,
			['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST']
		>,
	) => {
		try {
			const applicationId = Number(request.params.applicationId);

			if (!isPositiveInteger(applicationId)) {
				response.status(400).json({
					error: 'INVALID_REQUEST',
					message: 'ApplicationId is required and must be a valid number.',
				});
				return;
			}

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
				}
			}

			const result = await submitApplication({ applicationId });

			if (result.success) {
				response.status(200).json(result.data);
				return;
			}

			switch (result.error) {
				case 'INVALID_STATE_TRANSITION': {
					response.status(400).json({ error: 'INVALID_REQUEST', message: result.message });
					return;
				}
				case 'NOT_FOUND': {
					response.status(404).json({ error: 'INVALID_REQUEST', message: result.message });
					return;
				}
				case 'SYSTEM_ERROR': {
					response.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
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

	// Endpoint for reps to request revisions
	applicationRouter.post(
		'/dac/:applicationId/request-revisions',
		authMiddleware({ requiredRoles: ['DAC_MEMBER'] }),
		withBodySchemaValidation(
			applicationRevisionRequestSchema,
			apiZodErrorMapping,
			async (request, response: ResponseWithData<JoinedApplicationRecord, ['INVALID_REQUEST', 'SYSTEM_ERROR']>) => {
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
							response.status(404).json({ error: 'INVALID_REQUEST', message: updatedApplication.message });
							return;
						}
						case 'SYSTEM_ERROR': {
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
	'/rep/:applicationId/request-revisions',
	authMiddleware({ requiredRoles: ['INSTITUTIONAL_REP'] }),
	withBodySchemaValidation(
		applicationRevisionRequestSchema,
		apiZodErrorMapping,
		async (
			request,
			response: ResponseWithData<
				JoinedApplicationRecord,
				['NOT_FOUND', 'SYSTEM_ERROR', 'INVALID_REQUEST', 'INVALID_STATE_TRANSITION']
			>,
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

				// TODO: Check that the institutional rep is the correct rep for this application

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
						response.status(404).json({ error: 'INVALID_REQUEST', message: updatedApplication.message });
						return;
					}
					case 'SYSTEM_ERROR': {
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
);

applicationRouter.get(
	'/:applicationId/revisions',
	withParamsSchemaValidation(
		collaboratorsListParamsSchema,
		apiZodErrorMapping,
		async (
			request,
			response: ResponseWithData<
				{ message: string; data: RevisionRequestModel[] },
				['UNAUTHORIZED', 'INVALID_REQUEST', 'SYSTEM_ERROR']
			>,
		) => {
			const { applicationId } = request.params;

			if (!applicationId || isNaN(Number(applicationId))) {
				response.status(400).json({
					error: 'INVALID_REQUEST',
					message: 'ApplicationId is required and must be a valid number.',
				});
				return;
			}

			try {
				// Fetch all revisions for the application
				const result = await getRevisions({ applicationId: Number(applicationId) });

				if (result.success) {
					response.status(200).json({
						message: 'Revisions fetched successfully.',
						data: result.data,
					});
					return;
				}

				response.status(500).json({ error: result.error, message: result.message });
				return;
			} catch (error) {
				response.status(500).json({ error: 'SYSTEM_ERROR', message: 'Unexpected error.' });
				return;
			}
		},
	),
);

export default applicationRouter;
