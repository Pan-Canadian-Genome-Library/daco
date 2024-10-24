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

import { bigint, boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const revisionRequests = pgTable('revisionRequests', {
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
	application_id: bigint({ mode: 'number' }).notNull(), // [ref: <> applications.id]
	created_at: timestamp().notNull(),
	comments: text(),
	applicant_notes: text(),
	applicant_approved: boolean().notNull(),
	institution_rep_approved: boolean().notNull(),
	institution_rep_notes: boolean().notNull(),
	collaborators_approved: boolean().notNull(),
	collaborators_notes: text(),
	project_approved: boolean().notNull(),
	project_notes: text(),
	requested_studies_approved: boolean().notNull(),
	requested_studies_notes: text(),
});
