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

import { AuthenticationErrorResponse } from '@/utils/middleware.ts';

/**
 * Middleware that ensures the request is initiated by an authenticated user with site administrator privileges.
 *
 * This middleware checks the session for a user object.
 * - If no user is found, it sends a 401 Unauthorized response.
 * - If a user is found but lacks the `siteAdmin` flag, it sends a 403 Forbidden response.
 * - If the user is authenticated and is a site admin, control is passed to the next middleware or route handler.
 *
 * @returns {RequestHandler} An Express RequestHandler.
 *
 * @example
 * router.get(
 * 	'/admin/users',
 * 	adminMiddleware(),
 * 	(request, response) => {
 * 		// Only site admins can access this route
 * 	}
 * )
 */
export const adminMiddleware =
	(): RequestHandler => (request, response: Response<AuthenticationErrorResponse>, next) => {
		const { user } = request.session;

		if (!user) {
			response.status(401).send({
				error: 'UNAUTHORIZED',
				message: 'This resource is protected and requires authorization.',
			});

			return;
		}

		if (!user.siteAdmin) {
			response.status(403).send({
				error: 'FORBIDDEN',
				message: 'You do not have the proper permissions to access or modify this resource.',
			});
			return;
		}
		return next();
	};
