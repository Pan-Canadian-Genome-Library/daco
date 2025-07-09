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

import { authZUserInfo } from '@/external/types.ts';
import { z } from 'zod';

export const sessionUser = z.object({
	userId: z.string(),
	sub: z.string(),
	givenName: z.string().optional(),
	familyName: z.string().optional(),
	...authZUserInfo.pick({ emails: true }).shape,
	studyAuthorizations: z
		.object({
			teamMember: z.array(z.string()).optional(),
			studyCurator: z.array(z.string()).optional(),
			dacAuthorizations: z
				.array(
					z.object({
						studyId: z.string(),
						startDate: z.string(),
						endDate: z.string(),
					}),
				)
				.optional(),
		})
		.optional(),
	...authZUserInfo.pick({ groups: true }).shape,
});

export type SessionUser = z.infer<typeof sessionUser>;

export const sessionAccount = z.object({
	idToken: z.string(),
	accessToken: z.string(),
	refreshToken: z.string(),
	refreshTokenIat: z.number().int(),
});
export type SessionAccount = z.infer<typeof sessionAccount>;
