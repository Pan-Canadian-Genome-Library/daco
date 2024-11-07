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
import { bigint, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { applications } from './applications.ts';
// TODO: Integrate w/ TS
// import { ApplicationAgreements } from 'pcgl-daco/packages/data-model/';

export const agreementEnum = pgEnum('agreement_types', [
	'dac_agreement_software_updates',
	'dac_agreement_non_disclosure',
	'dac_agreement_monitor_individual_access',
	'dac_agreement_destroy_data',
	'dac_agreement_familiarize_restrictions',
	'dac_agreement_provide_it_policy',
	'dac_agreement_notify_unauthorized_access',
	'dac_agreement_certify_application',
	'dac_agreement_read_and_agreed',
]);

export const agreements = pgTable('agreements', {
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
	application_id: bigint({ mode: 'number' }),
	user_id: varchar({ length: 100 }).notNull(),
	name: text().notNull(),
	agreement_text: text().notNull(),
	agreement_type: agreementEnum().notNull(),
	agreed_at: timestamp().notNull(),
});

export const agreementsRelations = relations(agreements, ({ one }) => ({
	application_id: one(applications, {
		fields: [agreements.application_id],
		references: [applications.id],
	}),
}));
