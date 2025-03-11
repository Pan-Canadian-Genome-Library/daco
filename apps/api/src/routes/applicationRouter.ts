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
	approveApplication,
	createApplication,
	editApplication,
	getAllApplications,
	getApplicationById,
	getApplicationStateTotals,
} from '@/controllers/applicationController.js';
import baseLogger from '@/logger.js';
import { isPositiveNumber } from '@/utils/routes.js';
import type { ApplicationListResponse, ApplicationResponseData } from '@pcgl-daco/data-model';
import { userRoleSchema } from '@pcgl-daco/validation';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getUserRole } from '../service/authService.js';
import type { ApplicationRecord, ApplicationStateTotals, JoinedApplicationRecord } from '../service/types.js';
import type { ResponseWithData } from './types.js';

const logger = baseLogger.forModule('applicationRouter');

const applicationRouter = express.Router();

/**
 * TODO:
 * 	- Validate request params using Zod.
 */
applicationRouter.post(
	'/create',
	authMiddleware(),
	async (request, response: ResponseWithData<ApplicationRecord, ['UNAUTHORIZED', 'SYSTEM_ERROR']>) => {
		const { user } = request.session;
		const { userId } = user || {};

		if (!userId) {
			response.status(401).send({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
			return;
		}

		const result = await createApplication({ user_id: userId });

		if (result.success) {
			response.status(201).send(result.data);
		} else {
			response.status(500).send({ error: 'SYSTEM_ERROR', message: result.message });
		}
	},
);

applicationRouter.post(
	'/edit',
	authMiddleware(),
	async (
		req,
		res: ResponseWithData<
			JoinedApplicationRecord,
			['NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'SYSTEM_ERROR', 'INVALID_REQUEST']
		>,
	) => {
		// TODO: Add Auth & Zod validation
		const data = req.body;
		const { id, update } = data;

		// Need user ID to validate the user has access to this app.
		const { user } = req.session;
		const { userId } = user || {};

		if (!userId) {
			res.status(401).send({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
			return;
		}

		// We need to get the application to validate that this user can edit it
		const applicationResult = await getApplicationById({ applicationId: id });
		if (!applicationResult.success) {
			switch (applicationResult.error) {
				case 'SYSTEM_ERROR': {
					res.status(500).json({ error: applicationResult.error, message: applicationResult.message });
					return;
				}
				case 'NOT_FOUND': {
					res.status(404).json({ error: applicationResult.error, message: applicationResult.message });
					return;
				}
			}
		}

		if (applicationResult.data.userId !== userId) {
			res.status(403).json({ error: 'FORBIDDEN', message: 'User cannot edit this application.' });
		}

		// TODO: Check if the user is allowed to edit this application before
		const result = await editApplication({ id, update });

		if (result.success) {
			res.send(result.data);
			return;
		}
		switch (result.error) {
			case 'SYSTEM_ERROR': {
				res.status(500).json({ error: result.error, message: result.message });
				return;
			}
			case 'INVALID_STATE_TRANSITION': {
				res.status(400).json({ error: 'INVALID_REQUEST', message: result.message });
				return;
			}
			case 'NOT_FOUND': {
				res.status(404).json({ error: result.error, message: result.message });
				return;
			}
		}
	},
);

// TODO: validate queryParam options using zod
applicationRouter.get(
	'/',
	authMiddleware(),
	async (req, res: ResponseWithData<ApplicationListResponse, ['INVALID_REQUEST', 'UNAUTHORIZED', 'SYSTEM_ERROR']>) => {
		const { userId } = req.session.user || {};

		if (!userId) {
			res.status(400).send({ error: 'UNAUTHORIZED', message: 'User ID is required' });
			return;
		}

		const { state: stateQuery, sort: sortQuery, page, pageSize } = req.query;

		const pageRequested = page ? parseInt(page as string) : undefined;
		const pageSizeRequested = pageSize ? parseInt(pageSize as string) : undefined;

		/**
		 * We need to ensure that the page size or page somehow passed into here is not negative or not a number.
		 * If it is, we need to throw a client error, warning them that that's a bad request.
		 */
		if (
			(pageRequested !== undefined && !isPositiveNumber(pageRequested)) ||
			(pageSizeRequested !== undefined && !isPositiveNumber(pageSizeRequested))
		) {
			res.status(400).send({ error: 'INVALID_REQUEST', message: 'Page and/or page size must be a positive integer.' });
			return;
		}

		let sort = [];
		let state = [];

		try {
			sort = sortQuery ? JSON.parse(sortQuery as any) : [];
			state = stateQuery ? JSON.parse(stateQuery as any) : [];
		} catch {
			res.status(400).send({
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
		});

		if (result.success) {
			res.status(200).send(result.data);
			return;
		} else {
			switch (result.error) {
				case 'SYSTEM_ERROR': {
					res.status(500).json({ error: result.error, message: result.message });
					return;
				}
				case 'INVALID_PARAMETERS': {
					res.status(400).json({ error: 'INVALID_REQUEST', message: result.message });
					return;
				}
			}
		}
	},
);

/**
 * TODO:
 *   - Currently no validation is done to ensure that the current logged in user can access the specified application. This should be done and refactored.
 *   - Validate request params using Zod.
 *   - Ideally we should also standardize errors eventually, so that we're not comparing strings.
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
			response.status(401).send({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
			return;
		}

		const applicationId = Number(request.params.applicationId);
		if (!isFinite(applicationId)) {
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

			response.status(200).send(data);
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
 * TODO:
 * 	- Currently no validation is done to ensure that the current logged in user can access the specified application. This should be done and refactored.
 * 	- Validate request params using Zod.
 */
applicationRouter.get(
	'/metadata/counts',
	authMiddleware(),
	async (
		req: Request<{}, {}, {}, any>,
		res: ResponseWithData<ApplicationStateTotals, ['UNAUTHORIZED', 'SYSTEM_ERROR']>,
	) => {
		const { userId } = req.query;

		if (!userId) {
			res.status(401).send({ error: 'UNAUTHORIZED', message: 'User is not authenticated.' });
			return;
		}

		const result = await getApplicationStateTotals({
			userId,
		});

		if (result.success) {
			res.status(200).send(result.data);
		} else {
			res.status(500).send({ error: 'SYSTEM_ERROR', message: result.message });
		}
	},
);
applicationRouter.post('/approve', authMiddleware({ requiredRoles: ['DAC_MEMBER'] }), async (req, res) => {
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
			return;
		}

		switch (result.error) {
			case 'INVALID_STATE_TRANSITION': {
				res.status(400).json({ error: result.error, message: result.message });
				return;
			}
			case 'SYSTEM_ERROR': {
				res.status(500).json({ error: 'SYSTEM_ERROR', message: result.message });
				return;
			}
			case 'NOT_FOUND': {
				res.status(404).json({ error: 'INVALID_REQUEST', message: 'Application not found.' });
				return;
			}
		}
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'SYSTEM_ERROR', message: `Unexpected error.` });
		return;
	}
});

export default applicationRouter;
