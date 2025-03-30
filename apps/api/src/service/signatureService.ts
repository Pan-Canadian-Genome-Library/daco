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

import { eq, sql } from 'drizzle-orm';

import { type PostgresDb } from '@/db/index.js';
import { applicationContents } from '@/db/schemas/applicationContents.js';
import { applications } from '@/db/schemas/applications.ts';
import BaseLogger from '@/logger.js';
import { failure, success, type AsyncResult } from '@/utils/results.js';
import { ApplicationStates } from '@pcgl-daco/data-model';
import { type SignatureType } from '@pcgl-daco/data-model/src/types.ts';
import { type ApplicationContentModel, type ApplicationSignatureUpdate } from './types.js';

const logger = BaseLogger.forModule('signatureService');

/**
 * SignatureService provides methods for DB access for the signature columns in Application Contents
 * @param db - Drizzle Postgres DB Instance
 */
const signatureService = (db: PostgresDb) => ({
	getApplicationSignature: async ({
		application_id: id,
	}: Pick<ApplicationContentModel, 'application_id'>): AsyncResult<
		ApplicationSignatureUpdate,
		'SYSTEM_ERROR' | 'NOT_FOUND'
	> => {
		try {
			const retrieveSignature = await db
				.select({
					application_id: applicationContents.application_id,
					applicant_signature: applicationContents.applicant_signature,
					applicant_signed_at: applicationContents.applicant_signed_at,
					institutional_rep_signature: applicationContents.institutional_rep_signature,
					institutional_rep_signed_at: applicationContents.institutional_rep_signed_at,
				})
				.from(applicationContents)
				.where(eq(applicationContents.application_id, id));

			if (retrieveSignature[0]) {
				return success(retrieveSignature[0]);
			} else {
				return failure('NOT_FOUND', 'No signature found for application.');
			}
		} catch (error) {
			const message = `Error retrieving application with id: ${id}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	updateApplicationSignature: async ({
		application_id,
		applicant_signature,
		institutional_rep_signature,
	}: Omit<ApplicationSignatureUpdate, 'applicant_signed_at' | 'institutional_rep_signed_at'>): AsyncResult<
		ApplicationSignatureUpdate,
		'SYSTEM_ERROR' | 'NOT_FOUND'
	> => {
		try {
			const updatedSignature = await db.transaction(async (transaction) => {
				const signature_fields = {
					applicant_signature,
					applicant_signed_at: applicant_signature ? sql`NOW()` : undefined,
					institutional_rep_signature,
					institutional_rep_signed_at: institutional_rep_signature ? sql`NOW()` : undefined,
				};

				const editedContents = await transaction
					.update(applicationContents)
					.set(signature_fields)
					.where(eq(applicationContents.application_id, application_id))
					.returning();
				if (!editedContents[0]) {
					return failure('NOT_FOUND', 'Application contents not found.');
				}

				// Update Related Application
				const applicationUpdates = {
					updated_at: sql`NOW()`,
					state: ApplicationStates.DRAFT,
				};

				const editedApplication = await transaction
					.update(applications)
					.set(applicationUpdates)
					.where(eq(applications.id, application_id))
					.returning();

				if (!editedApplication[0]) {
					return failure('NOT_FOUND', 'Application not found.');
				}

				return success({
					application_id: editedContents[0].application_id,
					applicant_signature: editedContents[0].applicant_signature,
					applicant_signed_at: editedContents[0].applicant_signed_at,
					institutional_rep_signature: editedContents[0].institutional_rep_signature,
					institutional_rep_signed_at: editedContents[0].institutional_rep_signed_at,
				});
			});

			return updatedSignature;
		} catch (error) {
			const message = `Error updating signature for application with id: ${application_id}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	deleteApplicationSignature: async ({
		application_id,
		signature_type,
	}: Pick<ApplicationContentModel, 'application_id'> & {
		signature_type: SignatureType;
	}): AsyncResult<ApplicationSignatureUpdate, 'SYSTEM_ERROR' | 'NOT_FOUND'> => {
		try {
			const updatedSignature = await db.transaction(async (transaction) => {
				const signature_fields = {
					applicant_signature: signature_type === 'APPLICANT' ? null : undefined,
					applicant_signed_at: signature_type === 'APPLICANT' ? null : undefined,
					institutional_rep_signature: signature_type === 'INSTITUTIONAL_REP' ? null : undefined,
					institutional_rep_signed_at: signature_type === 'INSTITUTIONAL_REP' ? null : undefined,
				};

				const editedContents = await transaction
					.update(applicationContents)
					.set(signature_fields)
					.where(eq(applicationContents.application_id, application_id))
					.returning();
				if (!editedContents[0]) {
					return failure('NOT_FOUND', 'Application contents not found.');
				}

				// Update Related Application
				const applicationUpdates = {
					updated_at: sql`NOW()`,
					state: ApplicationStates.DRAFT,
				};

				const editedApplication = await transaction
					.update(applications)
					.set(applicationUpdates)
					.where(eq(applications.id, application_id))
					.returning();

				if (!editedApplication[0]) {
					return failure('NOT_FOUND', 'Application not found.');
				}

				return success({
					application_id: editedContents[0].application_id,
					applicant_signature: editedContents[0].applicant_signature,
					applicant_signed_at: editedContents[0].applicant_signed_at,
					institutional_rep_signature: editedContents[0].institutional_rep_signature,
					institutional_rep_signed_at: editedContents[0].institutional_rep_signed_at,
				});
			});

			return updatedSignature;
		} catch (error) {
			const message = `Error deleting signature for application with id: ${application_id}`;

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
});

export { signatureService };
