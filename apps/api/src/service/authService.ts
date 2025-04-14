import dbUtils from '@/db/index.ts';
import logger from '@/logger.ts';
import { userRoleSchema, type UserRole } from '@pcgl-daco/validation';
import type { SessionData } from 'express-session';
import service from './applicationService.ts';
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
	const database = dbUtils.getDbInstance();
	const applicationService: ApplicationService = service.applicationSvc(database);

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
