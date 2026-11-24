/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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
import { subContractorsStorageLocation } from './subContractorsStorageLocation.ts';

export const subContractors = pgTable(
	'sub_contractors',
	{
		id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
		application_id: bigint({ mode: 'number' }).notNull(),
		legal_name: varchar({ length: 255 }).notNull(),
		country: varchar({ length: 255 }).notNull(),
		address: varchar({ length: 255 }).notNull(),
		building: varchar({ length: 320 }),
		state: varchar({ length: 320 }).notNull(),
		postal: varchar({ length: 320 }).notNull(),
		collaborator_type: text().notNull(),
	},
	(table) => [primaryKey({ columns: [table.application_id] })],
);

export const subContractorsRelations = relations(subContractors, ({ one, many }) => ({
	application_id: one(applicationContents, {
		fields: [subContractors.application_id],
		references: [applicationContents.application_id],
	}),
	storageLocations: many(subContractorsStorageLocation),
}));
