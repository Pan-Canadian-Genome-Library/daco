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

import {
	createApplication,
	editApplication,
	getAllApplications,
	getApplicationById,
	getApplicationStateTotals,
} from '@/api/applicationController.js';
import { isPositiveNumber } from '@/utils/routes.js';

const applicationRouter = express.Router();
const jsonParser = bodyParser.json();

/**
 * TODO:
 * 	- Currently no validation is done to ensure that the current logged in user can create a application. This should be done and refactored.
 * 	- Validate request params using Zod.
 */
applicationRouter.post(
	'/applications/create',
	jsonParser,
	async (request: Request<{}, {}, { userId: string }, any>, response) => {
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
	},
);

applicationRouter.post('/applications/edit', jsonParser, async (req, res) => {
	// TODO: Add Auth & Zod validation
	const data = req.body;
	const { id, update } = data;
	const result = await editApplication({ id, update });

	if (result.success) {
		res.send(result.data);
	} else {
		// TODO: System Error Handling
		if (String(result.errors) === 'Error: Application record not found') {
			res.status(404);
		} else {
			res.status(500);
		}

		res.send({ message: result.message, errors: String(result.errors) });
	}
});

// TODO: - Refactor endpoint logic once validation/dto flow is in place
//       - verify if user can access applications
//       - validate queryParam options using zod
applicationRouter.get('/applications', async (req: Request<{}, {}, {}, any>, res) => {
	const { userId, state: stateQuery, sort: sortQuery, page, pageSize } = req.query;

	//  Temporary userId check until validation/dto flow is confirmed
	//  - reflect changes in swagger once refactored
	if (!userId) {
		res.status(400).send({ message: 'User Id is required' });
		return;
	}

	const pageRequested = page ? parseInt(page) : undefined;
	const pageSizeRequested = pageSize ? parseInt(pageSize) : undefined;

	/**
	 * We need to ensure that the page size or page somehow passed into here is not negative or not a number.
	 * If it is, we need to throw a client error, warning them that that's a bad request.
	 */
	if (
		(pageRequested !== undefined && !isPositiveNumber(pageRequested)) ||
		(pageSizeRequested !== undefined && !isPositiveNumber(pageSizeRequested))
	) {
		res.status(400).send({ message: 'Page and/or page size must be a positive integer.' });
		return;
	}

	// Check if sort exists and parse it if true
	const sort = !!sortQuery ? JSON.parse(sortQuery) : [];
	const state = !!stateQuery ? JSON.parse(stateQuery) : [];

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
applicationRouter.get(
	'/applications/:applicationId',
	async (request: Request<{ applicationId: number }, {}, {}, any>, response) => {
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
applicationRouter.get('/applications/metadata/counts', async (req: Request<{}, {}, {}, any>, res) => {
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

export default applicationRouter;
