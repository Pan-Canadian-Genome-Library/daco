import { userRoleSchema, type UserRole } from '@pcgl-daco/validation';
import type { SessionData } from 'express-session';

/**
 * Based on user data stored in session data, determine the user's role.
 * TODO: Use actual permissions stored in session to determine user role
 *
 * This is temporarily returning only `APPLICANT` or `ANONYMOUS`
 */
export function getUserRole(session: Partial<SessionData>): UserRole {
	return session.user ? userRoleSchema.Values.APPLICANT : userRoleSchema.Values.ANONYMOUS;
}
