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

import { relations } from 'drizzle-orm';
import { bigint, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { applications } from './applications.ts';
import { revisionRequests } from './revisionRequests.ts';
// TODO: Integrate w/ TS
// import { applicationActions } from 'pcgl-daco/packages/data-model/';

const actionsEnum = pgEnum('actions', [
	'CREATE',
	'WITHDRAW',
	'CLOSE',
	'REQUEST_INSTITUTIONAL_REP',
	'INSTITUTIONAL_REP_APPROVED',
	'INSTITUTIONAL_REP_REJECTED',
	'DAC_REVIEW_APPROVED',
	'DAC_REVIEW_REJECTED',
	'DAC_REVIEW_REVISIONS',
	'REVOKE',
]);

export const actions = pgTable('actions', {
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
	application_id: bigint({ mode: 'number' }).notNull(),
	created_at: timestamp().notNull().defaultNow(),
	user_id: varchar({ length: 100 }).notNull(),
	action: actionsEnum().notNull(),
	revisions_request_id: bigint({ mode: 'number' }),
	state_before: varchar({ length: 255 }).notNull(),
	state_after: varchar({ length: 255 }).notNull(),
});
// TODO: may need reference to a content diff

export const actionsRelations = relations(actions, ({ one }) => ({
	application_id: one(applications, {
		fields: [actions.application_id],
		references: [applications.id],
	}),
	revisions_request_id: one(revisionRequests, {
		fields: [actions.revisions_request_id],
		references: [revisionRequests.id],
	}),
}));
