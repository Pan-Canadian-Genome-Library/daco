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
import { bigint, pgTable, primaryKey, text, varchar } from 'drizzle-orm/pg-core';
import { applicationContents } from './applicationContents.ts';

export const collaborators = pgTable(
	'collaborators',
	{
		application_id: bigint({ mode: 'number' }).notNull(),
		first_name: varchar({ length: 255 }).notNull(),
		middle_name: varchar({ length: 255 }),
		last_name: varchar({ length: 255 }).notNull(),
		title: varchar({ length: 255 }),
		suffix: varchar({ length: 255 }),
		position_title: varchar({ length: 255 }),
		institutional_email: varchar({ length: 320 }).notNull(),
		profile_url: text(),
		collaborator_type: text(),
	},
	(table) => [primaryKey({ columns: [table.application_id, table.institutional_email] })],
);

export const collaboratorsRelations = relations(collaborators, ({ one }) => ({
	application_id: one(applicationContents, {
		fields: [collaborators.application_id],
		references: [applicationContents.application_id],
	}),
}));
