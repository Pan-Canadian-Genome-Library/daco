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

import { getDbInstance } from '@/db/index.ts';
import logger from '@/logger.ts';
import { userRoleSchema, type UserRole } from '@pcgl-daco/validation';
import type { SessionData } from 'express-session';
import { applicationSvc } from './applicationService.ts';
import type { ApplicationService } from './types.ts';

/**
 * Based on user data stored in session data, determine the user's role.
 * TODO: Use actual permissions stored in session to determine user role
 *
 * This is temporarily returning only `APPLICANT` or `ANONYMOUS`
 */
export function getUserRole(session: Partial<SessionData>): UserRole {
	return session.user ? userRoleSchema.Values.APPLICANT : userRoleSchema.Values.ANONYMOUS;
}

/**
 * Based on user data stored in session data, determine the user's role & if the application is associated with them.
 * TODO: Use actual permissions stored in session to determine user role
 *
 * This is temporarily returning `true` for all applications.
 */
export async function isAssociatedRep(session: Partial<SessionData>, applicationId: number): Promise<Boolean> {
	const database = getDbInstance();
	const applicationService: ApplicationService = applicationSvc(database);

	const app = await applicationService.getApplicationWithContents({ id: applicationId });

	if (!app.success) {
		logger.error('Look up for validating isAssociatedRep failed! Returning false. - Application ID: ', applicationId);
		return false;
	}

	if (getUserRole(session) === userRoleSchema.Values.INSTITUTIONAL_REP) {
		/**
		 * FIXME: This is a TEMPORARY logic, this **MUST** be fixed once we figure out how Inst. Reps are being stored
		 * in auth. This will auto validate all reps as being associated with every applications.
		 *
		 * something like: `return app.data.instRep === session.user.id;`
		 **/

		return true;
	}
	return false;
}
