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

import { type Response } from 'express';

import { canAccessRequest } from '@/service/authService.ts';
import { authErrorResponseHandler } from '@/service/utils.ts';
import { AuthenticationErrorResponse, withAuthentication } from '@/utils/middleware.ts';
import { isPositiveInteger } from '@pcgl-daco/validation';

export const accessMiddleware = () =>
	withAuthentication(async (request, response: Response<AuthenticationErrorResponse>, next) => {
		const user = request.session.user;

		// The applicationId can be retrieved from the body or the params
		const applicationId = Number(request.params.applicationId) || Number(request.body.id);

		if (!isPositiveInteger(applicationId)) {
			response.status(400).json({ error: 'INVALID_REQUEST', message: 'Application ID is not a valid number.' });
			return;
		}

		if (!user) {
			return;
		}
		const requestAuthResult = await canAccessRequest(user, applicationId);

		if (!requestAuthResult.success) {
			authErrorResponseHandler(response, requestAuthResult);
			return;
		}
		return next();
	});
