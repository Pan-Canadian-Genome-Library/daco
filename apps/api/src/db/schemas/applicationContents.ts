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
import { bigint, boolean, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { agreements } from './agreements.ts';
import { applications } from './applications.ts';
import { collaborators } from './collaborators.ts';
import { files } from './files.ts';
import { revisionRequests } from './revisionRequests.ts';

export const applicationContents = pgTable('application_contents', {
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
	application_id: bigint({ mode: 'number' }).notNull(),
	created_at: timestamp().notNull().defaultNow(),
	updated_at: timestamp().notNull(),
	// Applicant
	applicant_first_name: varchar({ length: 255 }),
	applicant_middle_name: varchar({ length: 255 }),
	applicant_last_name: varchar({ length: 255 }),
	applicant_title: varchar({ length: 255 }),
	applicant_suffix: varchar({ length: 255 }),
	applicant_position_title: varchar({ length: 255 }),
	applicant_primary_affiliation: varchar({ length: 500 }),
	applicant_institutional_email: varchar({ length: 320 }),
	applicant_profile_url: text(),
	// Institutional Rep
	institutional_rep_title: varchar({ length: 255 }),
	institutional_rep_first_name: varchar({ length: 255 }),
	institutional_rep_middle_name: varchar({ length: 255 }),
	institutional_rep_last_name: varchar({ length: 255 }),
	institutional_rep_suffix: varchar({ length: 255 }),
	institutional_rep_primary_affiliation: varchar({ length: 255 }),
	institutional_rep_email: varchar({ length: 255 }),
	institutional_rep_profile_url: varchar({ length: 255 }),
	institutional_rep_position_title: varchar({ length: 255 }),
	// Institution
	institution_country: varchar({ length: 255 }),
	institution_state: varchar({ length: 255 }),
	institution_city: varchar({ length: 255 }),
	institution_street_address: text(),
	institution_postal_code: varchar({ length: 255 }),
	institution_building: varchar({ length: 255 }),
	// Project
	project_title: text(),
	project_website: text(),
	project_background: text(),
	project_methodology: text(),
	project_aims: text(),
	project_summary: text(),
	project_publication_urls: text().array(),
	// Signature for Sign & Submit
	// Studies
	// TODO: requested study information
	requested_studies: text().array(),
	// Agreements & Ethics
	ethics_review_required: boolean(),
	ethics_letter: bigint({ mode: 'number' }),
	signed_pdf: bigint({ mode: 'number' }),
});

export const applicationContentsRelations = relations(applicationContents, ({ many, one }) => ({
	application_id: one(applications, {
		fields: [applicationContents.application_id],
		references: [applications.id],
	}),
	agreements: many(agreements),
	collaborators: many(collaborators),
	revisions: many(revisionRequests),
	ethics_letter: one(files, {
		fields: [applicationContents.ethics_letter],
		references: [files.id],
	}),
	signed_pdf: one(files, {
		fields: [applicationContents.signed_pdf],
		references: [files.id],
	}),
}));
