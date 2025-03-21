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
	editApplication,
	getAllApplications,
	getApplicationById,
	getApplicationStateTotals,
	rejectApplication,
	submitApplication,
	requestApplicationRevisionsByDac,
	requestApplicationRevisionsByRep,
	submitRevision,
} from '@/controllers/applicationController.js';
import { RevisionRequestModel } from '@/service/types.ts';
import { apiZodErrorMapping } from '@/utils/validation.js';
import { withBodySchemaValidation, withParamsSchemaValidation } from '@pcgl-daco/request-utils';
import {
	applicationRevisionRequestSchema,
	collaboratorsListParamsSchema,
	editApplicationRequestSchema,
	isPositiveInteger,
	closeApplicationSchema,
} from '@pcgl-daco/validation';
import bodyParser from 'body-parser';
import express, { type Request, type Response } from 'express';

const applicationRouter = express.Router();
const jsonParser = bodyParser.json();

/**
 * TODO:
 * 	- Currently no validation is done to ensure that the current logged in user can create a application. This should be done and refactored.
 * 	- Validate request params using Zod.
 */
applicationRouter.post('/create', jsonParser, async (request: Request<{}, {}, { userId: string }, any>, response) => {
	const { userId } = request.body;

	/**
	 * TODO: Temporary userId check until validation/dto flow is confirmed.
	 * Reflect changes in swagger once refactored.
	 **/
	if (!userId) {
		response.status(400).send({ message: 'User ID is required.' });
		return;
	}

	const result = await createApplication({ user_id: userId });

	if (result.success) {
		response.status(201).send(result.data);
	} else {
		response.status(500).send({ message: result.message, errors: String(result.errors) });
	}
});

applicationRouter.post(
	'/edit',
	jsonParser,
	withBodySchemaValidation(
		editApplicationRequestSchema,
		apiZodErrorMapping,
		async (request: Request, response: Response) => {
			// TODO: Add Auth
			const data = request.body;
			const { id, update } = data;
			const result = await editApplication({ id, update });
			if (result.success) {
				response.send(result.data);
			} else {
				// TODO: System Error Handling
				if (String(result.errors) === 'Error: Application record is undefined') {
					response.status(404);
				} else {
					response.status(500);
				}
				response.send({ message: result.message, errors: String(result.errors) });
			}
		},
	),
);

// TODO: - Refactor endpoint logic once validation/dto flow is in place
//       - verify if user can access applications
//       - validate queryParam options using zod
applicationRouter.get('/', async (req: Request<{}, {}, {}, any>, res) => {
	const { userId, state: stateQuery, sort: sortQuery, page, pageSize } = req.query;

	//  Temporary userId check until validation/dto flow is confirmed
	//  - reflect changes in swagger once refactored
	if (!userId) {
		res.status(400).send({ message: 'User Id is required' });
		return;
	}

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
		res.status(400).send({ message: 'Page and/or page size must be a positive integer.' });
		return;
	}

	let sort = [];
	let state = [];

	try {
		sort = sortQuery ? JSON.parse(sortQuery) : [];
		state = stateQuery ? JSON.parse(stateQuery) : [];
	} catch {
		res.status(400).send({ message: 'Invalid formatting - sort and/or state parameters contain invalid JSON.' });
		return;
	}

	const result = await getAllApplications({
		userId,
		state,
		sort,
		page: pageRequested,
		pageSize: pageSizeRequested,
	});

	if (result.success) {
		res.status(200).send(result.data);
		return;
	} else {
		const errorReturn = { message: result.message, errors: String(result.errors) };
		res.status(500).send(errorReturn);
		return;
	}
});

/**
 * TODO:
 * 	- Currently no validation is done to ensure that the current logged in user can access the specified application. This should be done and refactored.
 * 	- Validate request params using Zod.
 * 	- Ideally we should also standardize errors eventually, so that we're not comparing strings.
 */
applicationRouter.get('/:applicationId', async (request: Request<{ applicationId: number }, {}, {}, any>, response) => {
	const { applicationId } = request.params;

	const result = await getApplicationById({ applicationId });

	if (result.success) {
		response.status(200).send(result.data);
	} else {
		const resultErrors = String(result.errors);

		if (resultErrors === 'Error: Application record is undefined') {
			response.status(404);
		} else {
			response.status(500);
		}

		response.send({ message: result.message, errors: resultErrors });
	}
});

/**
 * Gets the total of how many applications are in each state type (APPROVED, REJECTED, etc...),
 * including a TOTAL count.
 *
 * TODO:
 * 	- Currently no validation is done to ensure that the current logged in user can access the specified application. This should be done and refactored.
 * 	- Validate request params using Zod.
 */
applicationRouter.get('/metadata/counts', async (req: Request<{}, {}, {}, any>, res) => {
	const { userId } = req.query;

	if (!userId) {
		res.status(400).send({ message: 'User Id is Required' });
		return;
	}

	const result = await getApplicationStateTotals({
		userId,
	});

	if (result.success) {
		res.status(200).send(result.data);
	} else {
		res.status(500).send({ message: result.message, errors: String(result.errors) });
	}
});

applicationRouter.post('/approve', jsonParser, async (req, res) => {
	const { applicationId }: { applicationId?: number } = req.body;

	if (typeof applicationId !== 'number' || !applicationId) {
		res.status(400).send({
			message: 'Invalid request. ApplicationId must be a valid number and is required.',
			errors: 'MissingOrInvalidParameters',
		});
		return;
	}

	try {
		const result = await approveApplication({ applicationId });

		if (result.success) {
			res.status(200).send({
				message: 'Application approved successfully.',
				data: result.data,
			});
		} else {
			let status = 500;
			let message = result.message || 'An unexpected error occurred.';
			let errors = result.errors;

			if (errors === 'ApplicationNotFound' || errors === 'Application record is undefined') {
				status = 404;
				message = 'Application not found.';
			} else if (errors === 'ApprovalConflict') {
				status = 409;
				message = 'Approval conflict detected.';
			} else if (errors === 'InvalidState') {
				status = 400;
				message = 'Invalid application state.';
			}

			res.status(status).send({ message, errors });
		}
	} catch (error) {
		res.status(500).send({
			message: 'Internal server error.',
			errors: String(error),
		});
	}
});

applicationRouter.post('/reject', jsonParser, async (req, res) => {
	const { applicationId } = req.body;

	if (!applicationId || !isPositiveInteger(applicationId)) {
		res.status(400).json({
			message: 'Invalid request. ApplicationId is required and must be a valid number.',
			errors: 'MissingOrInvalidParameters',
		});
	}

	try {
		const result = await rejectApplication({ applicationId });

		if (result.success) {
			res.status(200).send({
				message: 'Application rejected successfully.',
				data: result.data,
			});
		} else {
			let status = 500;
			let message = result.message || 'An unexpected error occurred.';
			let errors = result.errors;

			if (errors === 'ApplicationNotFound' || errors === 'Application record is undefined') {
				status = 404;
				message = 'Application not found.';
			} else if (errors === 'RejectionConflict') {
				status = 409;
				message = 'Rejection conflict detected.';
			} else if (errors === 'InvalidState') {
				status = 400;
				message = 'Invalid application state.';
			}

			res.status(status).send({ message, errors });
		}
	} catch (error) {
		res.status(500).send({
			message: 'Internal server error.',
			errors: String(error),
		});
	}
});

/**
 * TODO: NO current Auth rules implemented
 */
// POST: Submit revisions
applicationRouter.post(
	'/:applicationId/submit-revision',
	jsonParser,
	withParamsSchemaValidation(
		collaboratorsListParamsSchema,
		apiZodErrorMapping,
		async (request: Request, response: Response) => {
			const { applicationId } = request.params;

			if (!applicationId || !isPositiveInteger(Number(applicationId))) {
				response.status(400).json({
					message: 'Invalid request. ApplicationId is required and must be a valid number.',
					errors: 'MissingOrInvalidParameters',
				});
			}

			try {
				const applicationIdNum = Number(applicationId);
				const result = await submitRevision({ applicationId: applicationIdNum });

				if (result.success) {
					response.status(200).send({
						message: 'Application review submitted successfully.',
						data: result.data,
					});
				} else {
					let status = 500;
					let message = result.message || 'An unexpected error occurred.';
					let errors = result.errors;

					if (errors === 'ApplicationNotFound' || errors === 'Application record is undefined') {
						status = 404;
						message = 'Application not found.';
					} else if (errors === 'RevisionConflict') {
						status = 409;
						message = 'Revision conflict detected.';
					} else if (errors === 'InvalidState') {
						status = 400;
						message = 'Invalid application state.';
					}

					response.status(status).send({ message, errors });
				}
			} catch (error) {
				response.status(500).send({
					message: 'Internal server error.',
					errors: String(error),
				});
			}
		},
	),
);

applicationRouter.post(
	'/applications/:applicationId/close',
	jsonParser,
	withParamsSchemaValidation(
		closeApplicationSchema,
		apiZodErrorMapping,
		async (request: Request, response: Response) => {
			const { applicationId } = request.params;
			const { requesterId, isDacMember } = request.body;

			if (!applicationId || isNaN(parseInt(applicationId))) {
				response.status(400).json({
					message: 'Invalid request. ApplicationId is required and must be a valid number.',
					errors: 'MissingOrInvalidParameters',
				});
			}

			if (!requesterId) {
				response.status(401).json({ message: 'Unauthorized: Requester ID is required.' });
			}

			try {
				const applicationIdNum = Number(applicationId);
				const result = await closeApplication({ applicationId: applicationIdNum, requesterId, isDacMember });

				if (result.success) {
					response.status(200).send({
						message: 'Application closed successfully.',
						data: result.data,
					});
				} else {
					let status = 500;
					let message = result.message || 'An unexpected error occurred.';
					let errors = result.errors;

					if (errors === 'ApplicationNotFound' || errors === 'Application record is undefined') {
						status = 404;
						message = 'Application not found.';
					} else if (errors === 'StateConflict') {
						status = 409;
						message = 'Application is already closed.';
					} else if (errors === 'Unauthorized') {
						status = 403;
						message = 'Unauthorized to close this application.';
					} else if (errors === 'InvalidState') {
						status = 400;
						message = 'Cannot close application in its current state.';
					}

					response.status(status).send({ message, errors });
				}
			} catch (error) {
				response.status(500).send({
					message: 'Internal server error.',
					errors: String(error),
				});
			}
		},
	),
);

applicationRouter.post(
	'/:applicationId/submit',
	jsonParser,
		async (request: Request, response: Response) => {
			const { applicationId } = request.params;

			if (!applicationId || !isPositiveInteger(parseInt(applicationId))) {
				response.status(400).send({
					message: 'Invalid request. ApplicationId is required and must be a valid number.',
					errors: 'MissingOrInvalidParameters',
				});
				return;
			}

			try {
				const result = await submitApplication({ applicationId: parseInt(applicationId) });

				if (result.success) {
					response.status(200).send({
						message: 'Application rejected successfully.',
						data: result.data,
					});
				} else {
					let status = 500;
					let message = result.message || 'An unexpected error occurred.';
					let errors = result.errors;

					if (errors === 'ApplicationNotFound' || errors === 'Application record is undefined') {
						status = 404;
						message = 'Application not found.';
					} else if (errors === 'RejectionConflict') {
						status = 409;
						message = 'Rejection conflict detected.';
					} else if (errors === 'InvalidState') {
						status = 400;
						message = 'Invalid application state.';
					}

					response.status(status).send({ message, errors });
					return;
				}
			} catch (error) {
				response.status(500).send({
					message: 'Internal server error.',
					errors: String(error),
				});
			}
		},

// Endpoint for reps to request revisions
applicationRouter.post(
	'/dac/request-revisions',
	jsonParser,
	withBodySchemaValidation(applicationRevisionRequestSchema, apiZodErrorMapping, async (req, res) => {
		const { applicationId, revisionData, role } = req.body;

		if (!role && role !== 'DAC_MEMBER') {
			res.status(400).json({ message: 'Invalid request: Invalid role' });
		}

		// Validate input
		if (!revisionData) {
			res.status(400).json({ message: 'Invalid request: revisionData are required' });
		}

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
		};

		// Call service method to handle request
		const updatedApplication = await requestApplicationRevisionsByDac({
			applicationId,
			role,
			revisionData: updatedRevisionData,
		});

		res.status(200).json(updatedApplication);
	}),
));

// Endpoint for reps to request revisions
applicationRouter.post(
	'/rep/request-revisions',
	jsonParser,
	withBodySchemaValidation(applicationRevisionRequestSchema, apiZodErrorMapping, async (req, res) => {
		const { applicationId, revisionData, role } = req.body;

		if (!role && role !== 'INSTITUTIONAL_REP') {
			res.status(400).json({ message: 'Invalid request: Invalid role' });
		}

		// Validate input
		if (!revisionData) {
			res.status(400).json({ message: 'Invalid request: revisionData are required' });
		}

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
		};

		// Call service method to handle request
		const updatedApplication = await requestApplicationRevisionsByRep({
			applicationId,
			role,
			revisionData: updatedRevisionData,
		});

		res.status(200).json(updatedApplication);
	}),
);
export default applicationRouter;
