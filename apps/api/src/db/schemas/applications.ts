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
import { bigint, foreignKey, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { applicationActions } from './applicationActions.ts';
import { applicationContents } from './applicationContents.ts';
import { applicationStatesEnum } from './common.ts';
import { dac } from './dac.ts';

export const applications = pgTable(
	'applications',
	{
		id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
		dac_id: text().notNull(),
		user_id: varchar({ length: 100 }).notNull(),
		state: applicationStatesEnum().notNull(),
		created_at: timestamp().notNull().defaultNow(),
		approved_at: timestamp(),
		updated_at: timestamp(),
		expires_at: timestamp(),
		contents: bigint({ mode: 'number' }),
	},
	(table) => [
		foreignKey({
			columns: [table.dac_id],
			foreignColumns: [dac.dac_id],
			name: 'dac_id_fk',
		}),
	],
);

export const applicationsRelations = relations(applications, ({ one, many }) => ({
	application_contents: one(applicationContents, {
		fields: [applications.contents],
		references: [applicationContents.id],
	}),
	dac_id: one(dac, {
		fields: [applications.dac_id],
		references: [dac.dac_id],
	}),
	actions: many(applicationActions),
}));
