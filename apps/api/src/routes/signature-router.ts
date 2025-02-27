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

import { withSchemaValidation } from '@pcgl-daco/request-utils';
import { editSignatureRequestSchema } from '@pcgl-daco/validation';
import bodyParser from 'body-parser';
import express from 'express';

import { updateApplicationSignature } from '@/controllers/signatureController.ts';
import { ApplicationSignatureUpdate } from '@/service/types.ts';
import { apiZodErrorMapping } from '@/utils/validation.js';

const signatureRouter = express.Router();
const jsonParser = bodyParser.json();

/**
 * TODO:
 * 	- Currently no validation is done to ensure that the current logged in user can create a application. This should be done and refactored.
 */
signatureRouter.post(
	'/sign',
	jsonParser,
	withSchemaValidation(editSignatureRequestSchema, apiZodErrorMapping, async (req, res) => {
		const data = req.body;

		const { id, signature, signee, signed_at } = data;

		const update: ApplicationSignatureUpdate = {};

		if (signee === 'APPLICANT') {
			(update.applicant_signature = signature), (update.applicant_signed_at = new Date(signed_at));
		} else {
			(update.institutional_rep_signature = signature), (update.institutional_rep_signed_at = new Date(signed_at));
		}

		const result = await updateApplicationSignature({
			id,
			...update,
		});

		if (result.success) {
			if (signee === 'APPLICANT') {
				res.send({
					signature: result.data.applicant_signature,
					signed_at: result.data.applicant_signed_at,
				});
			} else {
				res.send({
					signature: result.data.institutional_rep_signature,
					signed_at: result.data.institutional_rep_signed_at,
				});
			}
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

export default signatureRouter;
