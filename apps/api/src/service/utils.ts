/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import { asc, desc } from 'drizzle-orm';
import { type Request } from 'express';

import { applicationActions } from '@/db/schemas/applicationActions.js';
import { applications } from '@/db/schemas/applications.js';
import { type ResponseWithData } from '@/routes/types.ts';
import { type SessionUser } from '@/session/types.ts';
import { Result } from '@/utils/results.ts';
import {
	type ApplicationActionsColumnName,
	type ApplicationsColumnName,
	AuthorizedRequest,
	type OrderBy,
	type SessionType,
	UserSession,
} from './types.js';

export const applicationsQuery = (sort?: Array<OrderBy<ApplicationsColumnName>>) => {
	const orderByArguments =
		sort && sort.length
			? sort.map((sortBy) =>
					sortBy.direction === 'asc' ? asc(applications[sortBy.column]) : desc(applications[sortBy.column]),
				)
			: [desc(applications.state), asc(applications.id), asc(applications.created_at)];

	return orderByArguments;
};

export const applicationActionsQuery = (sort?: Array<OrderBy<ApplicationActionsColumnName>>) => {
	const orderByArguments = sort
		? sort.map((sortBy) =>
				sortBy.direction === 'asc' ? asc(applicationActions[sortBy.column]) : desc(applicationActions[sortBy.column]),
			)
		: [asc(applicationActions.created_at)];

	return orderByArguments;
};

/**
 * Type Guard to validate session contains user data with userId
 * @param session express-session session object / Express Request['session']
 * @returns boolean
 */
export const isSessionWithUser = (session: SessionType): session is UserSession => {
	return typeof session.user !== 'undefined' && !!session.user.userId;
};

/**
 * Type Guard to validate request contains session data
 * @param request Express request
 * @returns boolean
 */
export const isRequestWithSession = (request: Request): request is AuthorizedRequest => {
	return request.session && isSessionWithUser(request.session);
};

/**
 * Function to obtain standardized userName string from user data
 * userId is used as a default fallback value
 * @returns string
 */
export function getUserName(user: SessionUser): string {
	const { givenName, familyName, userId } = user;
	const userName = givenName || familyName ? `${givenName || ''} ${familyName || ''}` : userId;
	return userName.trim();
}

/**
 * Standardized handler for common Auth error cases
 * Insures Type safety for downstream Request Handler due to limitations with Express Type definitions
 * @param response Accepts any ResponseWithData
 * @returns boolean
 */
export const authErrorResponseHandler = (
	response: ResponseWithData<any, ['UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'SYSTEM_ERROR']>,
	isAuthenticated: boolean,
	canAccessResult?: Result<any, 'FORBIDDEN'>,
) => {
	if (!isAuthenticated) {
		response.status(401).send({
			error: 'UNAUTHORIZED',
			message: 'This resource is protected and requires authorization.',
		});
	}

	if (canAccessResult) {
		// if (!applicationResult.success) {
		// 	response.status(404).json({ error: applicationResult.error, message: applicationResult.message });
		// 	return;
		// }
		// if (!canAccess) {
		// response.status(403).json({ error: 'FORBIDDEN', message: 'User cannot access this application.' });
		// return false;
		// }
		// } else if !result {
		// switch (result.error) {
		// 	case 'NOT_FOUND':
		// 		response.status(404);
		// 		break;
		// 	case 'SYSTEM_ERROR':
		// 	default:
		// 		response.status(500);
		// 		break;
		// }
		// response.send({
		// 	error: result.error,
		// 	message: result.message,
		// });
		// }
	}

	return;
};
