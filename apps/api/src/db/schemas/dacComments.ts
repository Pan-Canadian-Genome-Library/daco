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

import { SectionRoutes } from '@pcgl-daco/validation';
import { relations } from 'drizzle-orm';
import { bigint, boolean, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { applications } from './applications.ts';

export const sectionsEnum = pgEnum('sections', [
	SectionRoutes.INTRO.toUpperCase(),
	SectionRoutes.APPLICANT.toUpperCase(),
	SectionRoutes.INSTITUTIONAL.toLowerCase(),
	SectionRoutes.COLLABORATORS.toLowerCase(),
	SectionRoutes.PROJECT.toLowerCase(),
	SectionRoutes.STUDY.toLowerCase(),
	SectionRoutes.ETHICS.toLowerCase(),
	SectionRoutes.AGREEMENT.toLowerCase(),
	SectionRoutes.APPENDICES.toLowerCase(),
	SectionRoutes.SIGN.toLowerCase(),
]);

export const dacComments = pgTable('comments', {
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
	application_id: bigint({ mode: 'number' }).notNull(),
	user_id: varchar({ length: 255 }).notNull(),
	message: text().notNull(),
	user_name: varchar({ length: 255 }).notNull(),
	dac_chair_only: boolean().notNull(),
	section: sectionsEnum().notNull(),
	created_at: timestamp().notNull().defaultNow(),
});

export const dacCommentsRelations = relations(dacComments, ({ one }) => ({
	application_id: one(applications, {
		fields: [dacComments.application_id],
		references: [applications.id],
	}),
}));
