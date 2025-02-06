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

import { applicationActions } from '@/db/schemas/applicationActions.js';
import { applicationContents } from '@/db/schemas/applicationContents.js';
import { applications } from '@/db/schemas/applications.js';
import { collaborators } from '@/db/schemas/collaborators.js';
import * as schema from '@/db/schemas/index.js';
import { applicationActionSvc } from '@/service/applicationActionService.js';
import { applicationSvc } from '@/service/applicationService.js';
import { collaboratorsSvc } from '@/service/collaboratorsService.js';
import { type ExtractTablesWithRelations } from 'drizzle-orm';
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { PgTransaction } from 'drizzle-orm/pg-core';

export type ApplicationsColumnName = keyof typeof applications.$inferSelect;
export type ApplicationActionsColumnName = keyof typeof applicationActions.$inferSelect;
export type SchemaKeys = ApplicationsColumnName | ApplicationActionsColumnName;

export type ApplicationModel = typeof applications.$inferInsert;
export type ApplicationRecord = typeof applications.$inferSelect;
export type ApplicationUpdates = Partial<ApplicationModel>;
export type ApplicationService = ReturnType<typeof applicationSvc>;

export type ApplicationContentModel = typeof applicationContents.$inferInsert;
export type ApplicationContentUpdates = Partial<ApplicationContentModel>;

export type ApplicationActionModel = typeof applicationActions.$inferSelect;
export type ApplicationActionRecord = typeof applicationActions.$inferSelect;
export type ApplicationActionService = ReturnType<typeof applicationActionSvc>;

export type CollaboratorModel = typeof collaborators.$inferInsert;
export type CollaboratorRecord = typeof collaborators.$inferSelect;
export type CollaboratorsService = ReturnType<typeof collaboratorsSvc>;

export type AddActionMethods = Exclude<keyof ReturnType<typeof applicationActionSvc>, 'listActions'>;
export interface JoinedApplicationRecord extends Omit<ApplicationRecord, 'contents'> {
	contents: ApplicationContentUpdates | null;
}

export type ApplicationStateTotals = {
	APPROVED: number;
	CLOSED: number;
	DAC_REVIEW: number;
	DAC_REVISIONS_REQUESTED: number;
	DRAFT: number;
	INSTITUTIONAL_REP_REVIEW: number;
	REJECTED: number;
	INSTITUTIONAL_REP_REVISION_REQUESTED: number;
	REVOKED: number;
	TOTAL: number;
};

export type OrderBy<Key extends SchemaKeys> = {
	direction: 'asc' | 'desc';
	column: Key;
};

export type PostgresTransaction = PgTransaction<
	NodePgQueryResultHKT,
	typeof schema,
	ExtractTablesWithRelations<typeof schema>
>;
