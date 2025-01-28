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

import { getApplicationById } from '@/api/application-api.js';

const collaboratorsRouter = express.Router();
const jsonParser = bodyParser.json();

/**
 * Add Collaborator
 */
collaboratorsRouter.post(
	'/collaborators/create',
	jsonParser,
	async (
		request: Request<
			{},
			{},
			{
				applicationId: number;
				firstName: string;
				middleName?: string;
				lastName: string;
				suffix?: string;
				positionTitle: string;
				institutionalEmail: string;
			},
			any
		>,
		response,
	) => {
		// TODO: Add Real Auth
		const { authorization } = request.headers;
		const {
			applicationId: application_id,
			firstName: first_name,
			middleName: middle_name,
			lastName: last_name,
			suffix,
			positionTitle: position_title,
			institutionalEmail: institutional_email,
		} = request.body;

		if (!authorization) {
			response.status(400).send({ message: 'Unauthorized, cannot create Collaborators' });
			return;
		}

		if (!application_id) {
			response.status(400).send({ message: 'applicationId is missing, cannot create Collaborators' });
			return;
		}

		if (!first_name || !last_name || !position_title || !institutional_email) {
			response.status(400).send({ message: 'Required Collaborator details are missing.' });
			return;
		}

		// TODO: Add Real Auth
		// Validate User is Applicant
		const parsedUser = { user_id: 'testUser@oicr.on.ca' };

		const applicationResult = await getApplicationById({ applicationId: application_id });

		if (!applicationResult.success) {
			return response
				.status(500)
				.send({ message: applicationResult.message, errors: String(applicationResult.errors) });
		}

		const application = applicationResult.data;

		if (!(parsedUser.user_id === application.user_id)) {
			return response.status(500).send({ message: 'Unauthorized, cannot create Collaborators' });
		}

		const result = await createCollaborators({
			application_id,
			first_name,
			middle_name,
			last_name,
			position_title,
			suffix,
			institutional_email,
		});

		if (result.success) {
			response.status(201).send(result.data);
			return;
		} else {
			response.status(500).send({ message: result.message, errors: String(result.errors) });
			return;
		}
	},
);

export default collaboratorsRouter;
