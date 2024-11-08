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

import { and, eq } from 'drizzle-orm';
import { applications } from '../db/schemas/applications.ts';
import { db } from '../main.ts';

type statesEnumValues =
	| 'DRAFT'
	| 'INSTITUTIONAL_REP_REVIEW'
	| 'DAC_REVIEW'
	| 'DAC_REVISIONS_REQUESTED'
	| 'REJECTED'
	| 'APPROVED'
	| 'CLOSED'
	| 'REVOKED';

export const applicationService = {
	createApplication: async ({ user_id }: { user_id: string }) => {
		const newApplication: typeof applications.$inferInsert = {
			user_id,
			state: 'DRAFT',
		};

		await db.insert(applications).values(newApplication);
	},
	getApplicationById: async ({ id }: { id: number }) => {
		const application = await db.select().from(applications).where(eq(applications.id, id));

		return application;
	},
	listApplications: async ({ user_id, state }: { user_id?: number; state?: statesEnumValues }) => {
		const allApplications = await db
			.select()
			.from(applications)
			.where(
				and(
					user_id ? eq(applications.user_id, String(user_id)) : undefined,
					state ? eq(applications.state, state) : undefined,
				),
			);
		// orderBy
		return allApplications;
	},
};
