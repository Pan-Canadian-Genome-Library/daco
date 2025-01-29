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
import { applicationActionSvc } from '@/service/applicationActionService.js';
import { applicationSvc } from '@/service/applicationService.js';

export type ApplicationsColumnName = keyof typeof applications.$inferSelect;
export type ApplicationActionsColumnName = keyof typeof applicationActions.$inferSelect;
export type SchemaKeys = ApplicationsColumnName | ApplicationActionsColumnName;

export type ApplicationContentInsert = typeof applicationContents.$inferInsert;
export type ApplicationContentUpdates = Partial<ApplicationContentInsert>;
export type ApplicationInsert = typeof applications.$inferInsert;
export type ApplicationUpdates = Partial<typeof applications.$inferInsert>;

export interface JoinedApplicationRecord extends Omit<ApplicationModel, 'contents'> {
	contents: ApplicationContentUpdates | null;
}

export type ApplicationModel = typeof applications.$inferSelect;
export type ApplicationActionModel = typeof applicationActions.$inferSelect;

export interface JoinedApplicationRecord extends Omit<ApplicationModel, 'contents'> {
	contents: ApplicationContentUpdates | null;
}
export type ApplicationService = ReturnType<typeof applicationSvc>;
export type ApplicationActionService = ReturnType<typeof applicationActionSvc>;
export type AddActionMethods = Exclude<keyof ReturnType<typeof applicationActionSvc>, 'listActions'>;

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
