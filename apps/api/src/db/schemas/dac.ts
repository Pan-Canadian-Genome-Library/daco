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

import { sql } from 'drizzle-orm';
import { boolean, pgSequence, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

const DAC_ID_PADDING = 4 as const;
const DAC_ID_PREFIX = 'PCGLDA' as const;
const DAC_ID_SEQUENCE_NAME = 'dac_id_seq' as const;

export const dacIdSequence = pgSequence(DAC_ID_SEQUENCE_NAME, {
	startWith: 1,
	increment: 1,
	maxValue: 9999,
});

export const dacIdDefault = sql.raw(`
	'${DAC_ID_PREFIX}' || lpad(
		nextval('${DAC_ID_SEQUENCE_NAME}')::text,
		${DAC_ID_PADDING},
		'0'
	)
`);

export const dac = pgTable('dac', {
	dac_id: text().primaryKey().default(dacIdDefault),
	dac_name: varchar({ length: 255 }).notNull(),
	dac_description: text().notNull(),
	contact_name: varchar({ length: 255 }).notNull(),
	contact_email: varchar({ length: 255 }).notNull(),
	is_pcgl_dac: boolean().notNull().default(false),
	created_at: timestamp().notNull().defaultNow(),
	updated_at: timestamp(),
});
