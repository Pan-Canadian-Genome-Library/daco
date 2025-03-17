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
} from '@pcgl-daco/validation';
import bodyParser from 'body-parser';
import express, { type Request, type Response } from 'express';

import {
	deleteApplicationSignature,
	getApplicationSignature,
	updateApplicationSignature,
} from '@/controllers/signatureController.ts';
import { apiZodErrorMapping } from '@/utils/validation.js';

const signatureRouter = express.Router();
const jsonParser = bodyParser.json();

signatureRouter.get(
	'/:applicationId',
	withParamsSchemaValidation(
		getSignatureParamsSchema,
		apiZodErrorMapping,
		async (request: Request, response: Response) => {
			const { applicationId } = request.params;

			if (!applicationId) {
				response.status(400).send({ message: 'Application ID MUST be a positive number greater than or equal to 1.' });
				return;
			}

			const result = await getApplicationSignature({ applicationId: Number(applicationId) });

			if (result.success) {
				response.status(200).send(result.data);
				return;
			}

			switch (String(result.errors)) {
				case 'Error: Application record is undefined':
					response.status(404);
					break;
				case 'Error: Application ID MUST be a positive number greater than or equal to 1.':
					response.status(400);
					break;
				default:
					response.status(500);
					break;
			}

			response.send({ message: result.message, errors: String(result.errors) });
		},
	),
);

/**
 * TODO:
 * 	- Currently no validation is done to ensure that the current logged in user can create a application. This should be done and refactored.
 */
signatureRouter.get(
	'/:applicationId',
	withParamsSchemaValidation(
		getSignatureParamsSchema,
		apiZodErrorMapping,
		async (request: Request, response: Response) => {
			const { applicationId } = request.params;

			if (!applicationId) {
				response.status(400).send({ message: 'Application ID MUST be a positive number greater than or equal to 1.' });
				return;
			}

			const result = await getApplicationSignature({ applicationId: Number(applicationId) });

			if (result.success) {
				response.status(200).send(result.data);
				return;
			}

			switch (String(result.errors)) {
				case 'Error: Application record is undefined':
					response.status(404);
					break;
				case 'Error: Application ID MUST be a positive number greater than or equal to 1.':
					response.status(400);
					break;
				default:
					response.status(500);
					break;
			}

			response.send({ message: result.message, errors: String(result.errors) });
		},
	),
);
/**
 * TODO:
 * 	- Currently no validation is done to ensure that the current logged in user can create a application. This should be done and refactored.
 */
signatureRouter.post(
	'/sign',
	jsonParser,
	withBodySchemaValidation(editSignatureRequestSchema, apiZodErrorMapping, async (req, res) => {
		const data = req.body;
		const { applicationId, signature, signee } = data;

		const result = await updateApplicationSignature({
			applicationId,
			signature,
			signee,
		});

		if (result.success) {
			if (signee === 'APPLICANT') {
				res.send({
					id: result.data.application_id,
					signature: result.data.applicant_signature,
					signedAt: result.data.applicant_signed_at,
				});
				return;
			}

			res.send({
				id: result.data.application_id,
				signature: result.data.institutional_rep_signature,
				signedAt: result.data.institutional_rep_signed_at,
			});

			return;
		}

		if (String(result.errors) === 'Error: Application contents record is undefined') {
			res.status(404);
		} else {
			res.status(500);
		}

		res.send({ message: result.message, errors: String(result.errors) });
	}),
);

/**
 * TODO:
 * 	- Currently no validation is done to ensure that the current logged in user can create a application. This should be done and refactored.
 */
signatureRouter.delete(
	'/:applicationId',
	withParamsSchemaValidation(
		deleteSignatureParamsSchema,
		apiZodErrorMapping,
		withQuerySchemaValidation(
			deleteSignatureQuerySchema,
			apiZodErrorMapping,
			async (request: Request, response: Response) => {
				const { applicationId } = request.params;
				const { signee } = request.query;

				if (!applicationId || !signee || (signee !== 'APPLICANT' && signee !== 'INSTITUTIONAL_REP')) {
					response.status(400).send({ message: 'Missing Required Parameters.' });
					return;
				}

				const result = await deleteApplicationSignature({
					applicationId: Number(applicationId),
					signee: signee,
				});

				if (result.success) {
					/**
					 * Since we've deleted the signature, we can return back a 204 and no content to indicate its success.
					 */
					response.status(204).send();
					return;
				}

				if (
					String(result.errors) === 'Error: Application contents record is undefined' ||
					'Application record is undefined'
				) {
					response.status(404);
				} else {
					response.status(500);
				}
			},
		),
	),
);

export default signatureRouter;
