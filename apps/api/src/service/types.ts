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
import { type ExtractTablesWithRelations } from 'drizzle-orm';
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { type Request } from 'express';

import { applicationActions } from '@/db/schemas/applicationActions.js';
import { applicationContents } from '@/db/schemas/applicationContents.js';
import { applications } from '@/db/schemas/applications.js';
import { collaborators } from '@/db/schemas/collaborators.js';
import * as schema from '@/db/schemas/index.js';
import { files } from '@/db/schemas/index.js';
import { study } from '@/db/schemas/studies.ts';

import { revisionRequests } from '@/db/schemas/revisionRequests.js';
import { applicationActionSvc } from '@/service/applicationActionService.js';
import { applicationSvc } from '@/service/applicationService.js';
import { collaboratorsSvc } from '@/service/collaboratorsService.js';
import { type SessionUser } from '@pcgl-daco/validation';
import { emailSvc } from './email/emailsService.ts';
import { filesSvc } from './fileService.js';
import { pdfService } from './pdf/pdfService.ts';
import { signatureService } from './signatureService.ts';
import { studySvc } from './studyService.ts';

export type ApplicationsColumnName = keyof typeof applications.$inferSelect;
export type ApplicationActionsColumnName = keyof typeof applicationActions.$inferSelect;
export type SchemaKeys = ApplicationsColumnName | ApplicationActionsColumnName;

export type ApplicationModel = typeof applications.$inferInsert;
export type ApplicationRecord = typeof applications.$inferSelect;
export type ApplicationUpdates = Partial<ApplicationModel>;
export type ApplicationService = ReturnType<typeof applicationSvc>;

export type ApplicationContentModel = typeof applicationContents.$inferInsert;
export type ApplicationContentUpdates = Omit<
	Partial<ApplicationContentModel>,
	'applicant_signature' | 'applicant_signed_at' | 'institutional_rep_signature' | 'institutional_rep_signed_at'
>;
export type ApplicationSignatureUpdate = Pick<
	ApplicationContentModel,
	| 'application_id'
	| 'applicant_signature'
	| 'applicant_signed_at'
	| 'institutional_rep_signature'
	| 'institutional_rep_signed_at'
>;
export interface JoinedApplicationRecord extends Omit<ApplicationRecord, 'contents'> {
	contents: ApplicationContentUpdates | null;
}

export type PDFService = ReturnType<typeof pdfService>;

export type FilesModel = typeof files.$inferInsert;
export type FilesRecord = typeof files.$inferSelect;
export type FilesUpdate = Partial<FilesRecord>;

export type FilesRecordOptionalContents = Omit<FilesRecord, 'content'> & { content?: Buffer<ArrayBufferLike> };

export type FilesService = ReturnType<typeof filesSvc>;

export interface JoinedApplicationRecord extends Omit<ApplicationRecord, 'contents'> {
	contents: ApplicationContentUpdates | null;
}

export type ApplicationActionModel = typeof applicationActions.$inferSelect;
export type ApplicationActionRecord = typeof applicationActions.$inferSelect;
export type ApplicationActionService = ReturnType<typeof applicationActionSvc>;

export type CollaboratorModel = typeof collaborators.$inferInsert;
export type CollaboratorRecord = typeof collaborators.$inferSelect;
export type CollaboratorsService = ReturnType<typeof collaboratorsSvc>;

export type SignatureService = ReturnType<typeof signatureService>;

export type AddActionMethods = Exclude<keyof ReturnType<typeof applicationActionSvc>, 'listActions'>;
export interface JoinedApplicationRecord extends Omit<ApplicationRecord, 'contents'> {
	contents: ApplicationContentUpdates | null;
}

export type OrderBy<Key extends SchemaKeys> = {
	direction: 'asc' | 'desc';
	column: Key;
};

export type PostgresTransaction = PgTransaction<
	NodePgQueryResultHKT,
	typeof schema,
	ExtractTablesWithRelations<typeof schema>
>;

export type RevisionRequestModel = typeof revisionRequests.$inferInsert;
export type RevisionRequestRecord = typeof revisionRequests.$inferSelect;

export type EmailService = ReturnType<typeof emailSvc>;

export type SessionType = Request['session'];
export interface UserSession extends SessionType {
	user: SessionUser;
}
export interface AuthorizedRequest extends Request {
	session: UserSession;
}

export type StudyService = ReturnType<typeof studySvc>;

export type StudyModel = typeof study.$inferInsert;
