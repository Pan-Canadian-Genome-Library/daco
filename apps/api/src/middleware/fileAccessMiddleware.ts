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

import { getFile } from '@/controllers/fileController.ts';
import { AuthenticationErrorResponse } from '@/middleware/utils/middleware.ts';
import { canAccessRequest } from '@/service/authService.ts';
import { authErrorResponseHandler } from '@/service/utils.ts';
import { ErrorType } from '@pcgl-daco/request-utils';

export type AccessConfig = {
	accessConfig?: {
		applicant?: boolean;
		dacChair?: boolean;
		dacMember?: boolean;
		dacoAdmin?: boolean;
		institutionalRep?: boolean;
	};
};

/**
 * Access middleware for file API routes. To determine if a user has access to a file,
 * we also need to check if the user has accessto the application that the file belongs to.
 * @params :fileId
 */
export const fileAccessMiddleware =
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

		const { fileId } = request.params;
		const id = parseInt(fileId ? fileId : '');

		// Grab application id that fileId belongs
		const fileResult = await getFile({ fileId: id, withBuffer: false });

		if (!fileResult.success) {
			response.status(404).send({ error: ErrorType.NOT_FOUND, message: `Cannot find file with id: ${id}` });
			return;
		}

		const requestAuthResult = await canAccessRequest(user, fileResult.data.applicationId, accessConfig);

		if (!requestAuthResult.success) {
			authErrorResponseHandler(response, requestAuthResult);
			return;
		}
		return next();
	};
