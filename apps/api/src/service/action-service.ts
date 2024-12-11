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

import { ApplicationActions, ApplicationStates } from '@pcgl-daco/data-model/src/types.js';
import { type PostgresDb } from '../db/index.js';
import { actions } from '../db/schemas/actions.js';
import { failure, success } from '../utils/results.js';

const actionService = (db: PostgresDb) => ({
	createAction: async ({ application_id, user_id }: { application_id: number; user_id: string }) => {
		const action = ApplicationActions.CREATE;
		const newAction: typeof actions.$inferInsert = {
			application_id,
			user_id,
			action,
			state_before: ApplicationStates.DRAFT,
			state_after: ApplicationStates.DRAFT,
		};

		try {
			// Create Action
			const newActionRecord = await db.insert(actions).values(newAction).returning();
			if (!newActionRecord[0]) throw new Error('Application record is undefined');

			return success(newActionRecord[0]);
		} catch (err) {
			const message = `Error at createAction with user_id: ${user_id}`;
			console.error(message);
			console.error(err);
			return failure(message, err);
		}
	},
});

export default actionService;
