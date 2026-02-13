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
import { z } from 'zod';

export const userResponseSchema = z.object({
	user: z
		.object({
			userId: z.string(),
			givenName: z.string().optional(),
			familyName: z.string().optional(),
		})
		.optional(),
});
export type UserResponse = z.infer<typeof userResponseSchema>;

export const oidcTokenResponseSchema = z.object({
	access_token: z.string(),
	refresh_token: z.string(),
	refresh_token_iat: z.number(),
	id_token: z.string(),
});
export type OIDCTokenResponse = z.infer<typeof oidcTokenResponseSchema>;

export const oidcUserInfoResponseSchema = z.object({
	sub: z.string(),
	given_name: z.string().optional(),
	family_name: z.string().optional(),
	email: z.string().optional(),
});
export type OIDCUserInfoResponse = z.infer<typeof oidcUserInfoResponseSchema>;

export const authZUserInfo = z.object({
	userinfo: z.object({
		emails: z.array(
			z.object({
				address: z.string().email(),
				type: z
					.literal('official')
					.or(z.literal('delivery').or(z.literal('forwarding').or(z.literal('personal'))))
					.optional(),
			}),
		),
		pcgl_id: z.string(),
		site_admin: z.boolean(),
		site_curator: z.boolean(),
	}),
	study_authorizations: z.object({
		editable_studies: z.array(z.string()).optional(),
		readable_studies: z.array(z.string()).optional(),
	}),
	dac_authorizations: z.array(
		z
			.object({
				study_id: z.string(),
				start_date: z.string(),
				end_date: z.string(),
			})
			.optional(),
	),
	groups: z
		.array(
			z.object({
				description: z.string(),
				id: z.number().int(),
				name: z.string(),
			}),
		)
		.optional(),
});
export type PCGLAuthZUserInfoResponse = z.infer<typeof authZUserInfo>;

// Session values calculated in DACO services
const dacoGeneratedSessionValues = z.object({
	dacoAdmin: z.boolean().default(false),
	dacChair: z.array(z.string()).default([]),
	dacMember: z.array(z.string()).default([]),
});

// Session values retrieved from Authz and Auth services
const authGeneratedSessionValues = z.object({
	userId: z.string(),
	sub: z.string(),
	givenName: z.string().optional(),
	familyName: z.string().optional(),
	emails: authZUserInfo.pick({ userinfo: true }).shape.userinfo.pick({ emails: true }).shape.emails,
	siteAdmin: authZUserInfo.pick({ userinfo: true }).shape.userinfo.pick({ site_admin: true }).shape.site_admin,
	siteCurator: authZUserInfo.pick({ userinfo: true }).shape.userinfo.pick({ site_curator: true }).shape.site_curator,
	studyAuthorizations: z.object({
		editableStudies: authZUserInfo
			.pick({ study_authorizations: true })
			.shape.study_authorizations.pick({ editable_studies: true }).shape.editable_studies,
		readableStudies: authZUserInfo
			.pick({ study_authorizations: true })
			.shape.study_authorizations.pick({ readable_studies: true }).shape.readable_studies,
	}),
	dacAuthorizations: z.array(
		z
			.object({
				studyId: z.string(),
				startDate: z.string(),
				endDate: z.string(),
			})
			.optional(),
	),
	groups: authZUserInfo.pick({ groups: true }).shape.groups,
});

export const sessionUser = authGeneratedSessionValues.merge(dacoGeneratedSessionValues);

export type SessionUser = z.infer<typeof sessionUser>;

export const SessionUserResponse = sessionUser.pick({
	userId: true,
	givenName: true,
	familyName: true,
	emails: true,
	dacChair: true,
	dacMember: true,
	dacoAdmin: true,
});

export type SessionUserResponseType = z.infer<typeof SessionUserResponse>;

export const sessionAccount = z.object({
	idToken: z.string(),
	accessToken: z.string(),
	refreshToken: z.string(),
	refreshTokenIat: z.number().int(),
});
export type SessionAccount = z.infer<typeof sessionAccount>;
