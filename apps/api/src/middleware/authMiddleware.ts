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

import { getApplicationById } from '@/controllers/applicationController.ts';
import { userRoleSchema, type ErrorResponse, type UserRole } from '@pcgl-daco/validation';
import { RequestHandler, type Response } from 'express';
import { getUserRole, isAssociatedRep } from '../service/authService.js';

export type UserRoleOmitRep = Exclude<UserRole, 'INSTITUTIONAL_REP'>;

export type AuthMiddlewareConfig = {
	requiredRoles?: [UserRoleOmitRep, ...UserRoleOmitRep[]];
};

type AuthenticationErrorResponse = ErrorResponse<['FORBIDDEN', 'UNAUTHORIZED']>;

/**
 * Auth Middleware will check that the request is being made by an authenticated user.
 *
 * This will check that the request session has authenticated user information.
 *
 * Optionally, you can provide a list of required roles. This will require that the user
 * has one of the required roles to access the endpoint. If this config is omitted, any role
 * other than 'ANONYMOUS' is accepted.
 *
 * If a request is rejected by this middleware it will return a response of:
 *   - http 401 (session has no authenticated user)
 *   - http 403 (missing required role)
 *
 * @example
 * router.get(
 * 	'/path',
 * 	authMiddleware({requiredRoles: ['DAC_MEMBER']}),
 * 	(request, response) => {
 * 		// Only DAC_MEMBERS will get here.
 * 	}
 * )
 */
export const authMiddleware =
	(config: AuthMiddlewareConfig = {}): RequestHandler =>
	async (
		request,
		response: Response<AuthenticationErrorResponse | ErrorResponse<['NOT_FOUND', 'SYSTEM_ERROR']>>,
		next,
	) => {
		const { requiredRoles } = config;
		const { user } = request.session;
		const { userId } = user || {};

		if (!user || !userId) {
			response.status(401).send({
				error: 'UNAUTHORIZED',
				message: 'This resource is protected and requires authorization.',
			});
			return;
		}

		const userRole = getUserRole(request.session);

		if (requiredRoles) {
			if (!requiredRoles.includes(userRole)) {
				response.status(403).send({
					error: 'FORBIDDEN',
					message: 'You do not have the proper permissions to access or modify this resource.',
				});
				return;
			}
		}

		console.log('request.params', request.params);
		if (request.params.applicationId) {
			// Validate User is allowed access to this specific Application
			const applicationId = Number(request.params.applicationId);
			const hasSpecialAccess =
				userRole === userRoleSchema.Values.DAC_MEMBER ||
				userRole === userRoleSchema.Values.DAC_CHAIR ||
				isAssociatedRep(request.session, applicationId);

			const result = await getApplicationById({ applicationId });
			if (result.success) {
				const { data } = result;
				const canAccess = data.userId === userId || hasSpecialAccess;
				if (!canAccess) {
					response.status(403).json({ error: 'FORBIDDEN', message: 'User cannot access this application.' });
					return;
				}
			} else {
				switch (result.error) {
					case 'NOT_FOUND':
						response.status(404);
						break;
					case 'SYSTEM_ERROR':
					default:
						response.status(500);
						break;
				}
				response.send({
					error: result.error,
					message: result.message,
				});
				return;
			}
		}

		return next();
	};
