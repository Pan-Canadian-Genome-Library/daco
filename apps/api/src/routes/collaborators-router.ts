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

import { createCollaborators } from '@/api/collaborators-api.js';

const collaboratorsRouter = express.Router();
const jsonParser = bodyParser.json();

/**
 * Add Collaborator
 */
collaboratorsRouter.post(
	'/collaborators',
	jsonParser,
	async (
		request: Request<
			{},
			{},
			{ first_name: string; last_name: string; position_title: string; institutional_email: string },
			any
		>,
		response,
	) => {
		const { first_name, last_name, position_title, institutional_email } = request.body;

		if (!first_name || !last_name || !position_title || !institutional_email) {
			response.status(400).send({ message: 'User ID is required.' });
			return;
		}

		const result = await createCollaborators({ first_name, last_name, position_title, institutional_email });

		if (result.success) {
			response.status(201).send(result.data);
		} else {
			response.status(500).send({ message: result.message, errors: String(result.errors) });
		}
	},
);

export default collaboratorsRouter;
