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

import { relations } from 'drizzle-orm';
import { boolean, foreignKey, integer, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { dac } from './dac.ts';

export const studyStatus = pgEnum('study_status', ['Ongoing', 'Completed']);
export const studyContext = pgEnum('study_context', ['Clinical', 'Research']);

export const study = pgTable(
	'study',
	{
		study_id: text().primaryKey().notNull(),
		dac_id: text().notNull(),
		study_name: varchar({ length: 255 }).notNull(),
		study_description: text().notNull(), // Assuming the description is large
		dac_name: varchar({ length: 255 }),
		program_name: varchar({ length: 255 }),
		keywords: text().array(),
		status: studyStatus().notNull(),
		context: studyContext().notNull(),
		domain: text().array().notNull(),
		participant_criteria: text(),
		principal_investigators: text().array().notNull(),
		lead_organizations: text().array().notNull(),
		collaborators: text().array(),
		funding_sources: text().array().notNull(),
		publication_links: text().array(),
		created_at: timestamp().notNull().defaultNow(),
		updated_at: timestamp(),
		category_id: integer().unique(),
		accepting_applications: boolean().default(false),
	},
	(table) => [
		foreignKey({
			columns: [table.dac_id],
			foreignColumns: [dac.dac_id],
			name: 'dac_id_fk',
		}),
	],
);

export const studyRelations = relations(study, ({ one }) => ({
	dac_id: one(dac, {
		fields: [study.dac_id],
		references: [dac.dac_id],
	}),
}));
