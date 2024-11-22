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
import { bigint, customType, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { applications } from './applications.ts';
// TODO: Integrate w/ TS
// import { FileTypes } from 'pcgl-daco/packages/data-model/';

export const fileTypesEnum = pgEnum('file_types', ['SIGNED_APPLICATION', 'ETHICS_LETTER']);

// https://stackoverflow.com/questions/76399047/how-to-represent-bytea-datatype-from-pg-inside-new-drizzle-orm
const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
	dataType() {
		return 'bytea';
	},
});

export const files = pgTable('files', {
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
	application_id: bigint({ mode: 'number' }).notNull(),
	type: fileTypesEnum().notNull(),
	submitter_user_id: varchar({ length: 100 }).notNull(),
	submitted_at: timestamp().notNull(),
	// TODO: This is producing an error between drizzle-kit and generate-DBML
	content: bytea().notNull(),
	filename: varchar({ length: 255 }),
});

export const filesRelations = relations(files, ({ one }) => ({
	application_id: one(applications, {
		fields: [files.application_id],
		references: [applications.id],
	}),
}));
