/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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

import { RequestHandler, type Response } from 'express';

import BaseLogger from '@/logger.js';
import { AccessConfig, AuthenticationErrorResponse } from '@/middleware/utils/middleware.ts';
import { canAccessRequest } from '@/service/authService.ts';
import { authErrorResponseHandler } from '@/service/utils.ts';
import { isPositiveInteger } from '@pcgl-daco/validation';

const logger = BaseLogger.forModule('applicationController');

/**
 * Access middleware for API routes to check if the user has access to the requested resource.
 *
 * IMPORTANT Must be used for middlewares providing params or a body containing the id of the application to check access for.
 * @params :applicationId
 * @body :applicationId - from `POST /collaborator/create` and `POST /collaborator/edit` and `POST /sign`
 *
 * @prop {AccessConfig} - accessConfig - Configuration object for access control. Target the specific roles that the user must have to access the resource.
 *                                       If not provided, the middleware will allow access users with at least one of roles are true.
 */
export const accessMiddleware =
	(accessConfig: AccessConfig = {}): RequestHandler =>
	async (request, response: Response<AuthenticationErrorResponse>, next) => {
		const user = request.session.user;

		if (!user) {
			response.status(401).send({
				error: 'UNAUTHORIZED',
				message: 'This resource is protected and requires authorization.',
			});
			return;
		}

		/**
		 * Check if the middleware is retrieving proper header params :applicationId  or body params of :applicationId
		 */
		if (request.params.applicationId === undefined && request.body.applicationId === undefined) {
			logger.error(`accessMiddleware failed to retrieve the required applicationId`);
			response.status(500).json({ error: 'SYSTEM_ERROR', message: 'Something went wrong retrieving this resource' });
			return;
		}

		// The applicationId can be retrieved from the body or the params
		const applicationId =
			Number(request.params.applicationId) || Number(request.body.id) || Number(request.body.applicationId);

		if (!isPositiveInteger(applicationId)) {
			response.status(400).json({ error: 'INVALID_REQUEST', message: 'Application id is not valid' });
			return;
		}

		const requestAuthResult = await canAccessRequest(user, applicationId, accessConfig);

		if (!requestAuthResult.success) {
			authErrorResponseHandler(response, requestAuthResult);
			return;
		}
		return next();
	};
