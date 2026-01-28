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
import { bigint, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { applicationActions } from './applicationActions.ts';
import { applications } from './applications.ts';

export const emailTypesEnum = pgEnum('email_types', [
	'NOTIFY_APPLICANT_WITHDRAW',
	'NOTIFY_APPLICANT_CLOSE',
	'NOTIFY_APPLICANT_REVOKE',
	'NOTIFY_APPLICANT_DAC_REVIEW_REJECTED',
	'NOTIFY_APPLICANT_DAC_APPROVAL',
	'NOTIFY_COLLABORATORS_DAC_APPROVAL',
	'NOTIFY_APPLICANT_REP_REVISIONS',
	'NOTIFY_APPLICANT_DAC_REVISIONS',
	'REMINDER_SUBMIT_DRAFT',
	'REMINDER_SUBMIT_INSTITUTIONAL_REP_REVIEW',
	'REMINDER_SUBMIT_REVISIONS_INSTITUTIONAL_REP',
	'REMINDER_SUBMIT_DAC_REVIEW',
	'REMINDER_SUBMIT_REVISIONS_DAC_REVIEW',
	'REMINDER_REQUEST_REVISIONS_INSTITUTIONAL_REP',
	'REMINDER_REQUEST_REVISIONS_DAC_REVIEW',
	'REQUEST_REVISIONS_INSTITUTIONAL_REP',
	'REQUEST_REVISIONS_DAC_REVIEW',
	'REMINDER_REVIEW_SUBMITTED_REVISIONS',
	'SUBMIT_DRAFT',
	'SUBMIT_REVISIONS_INSTITUTIONAL_REP',
	'SUBMIT_INSTITUTIONAL_REP_REVIEW',
	'SUBMIT_REVISIONS_DAC_REVIEW',
	'SUBMIT_DAC_REVIEW',
]);

export const sentEmails = pgTable('emails', {
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
	application_id: bigint({ mode: 'number' })
		.notNull()
		.references(() => applications.id),
	application_action_id: bigint({ mode: 'number' }).references(() => applicationActions.id),
	created_at: timestamp().notNull().defaultNow(),
	email_type: emailTypesEnum().notNull(),
	recipient_emails: varchar({ length: 320 }).array().notNull(),
});

export const emailsRelations = relations(sentEmails, ({ one }) => ({
	application_id: one(applications, {
		fields: [sentEmails.application_id],
		references: [applications.id],
	}),
	application_action_id: one(applicationActions, {
		fields: [sentEmails.application_action_id],
		references: [applicationActions.id],
	}),
}));
