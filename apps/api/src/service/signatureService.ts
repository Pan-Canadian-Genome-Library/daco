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
import logger from '@/logger.js';
import { failure, success, type AsyncResult } from '@/utils/results.js';
import { ApplicationStates } from '@pcgl-daco/data-model';
import { ApplicationContentModel, type ApplicationSignatureUpdate } from './types.js';

/**
 * SignatureService provides methods for DB access for the signature columns in Application Contents
 * @param db - Drizzle Postgres DB Instance
 */
const signatureService = (db: PostgresDb) => ({
	getApplicationSignature: async ({
		application_id: id,
	}: Pick<ApplicationContentModel, 'application_id'>): AsyncResult<ApplicationSignatureUpdate> => {
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
				throw new Error('Application record is undefined');
			}
		} catch (err) {
			const message = `Error at updateApplicationSignature with id: ${id}`;

			logger.error(message);
			logger.error(err);

			return failure(message, err);
		}
	},
	updateApplicationSignature: async ({
		application_id,
		applicant_signature,
		institutional_rep_signature,
	}: Omit<
		ApplicationSignatureUpdate,
		'applicant_signed_at' | 'institutional_rep_signed_at'
	>): AsyncResult<ApplicationSignatureUpdate> => {
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
					throw new Error('Error: Application contents record is undefined');
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
					throw new Error('Application record is undefined');
				}

				return {
					application_id: editedContents[0].application_id,
					applicant_signature: editedContents[0].applicant_signature,
					applicant_signed_at: editedContents[0].applicant_signed_at,
					institutional_rep_signature: editedContents[0].institutional_rep_signature,
					institutional_rep_signed_at: editedContents[0].institutional_rep_signed_at,
				};
			});

			return success(updatedSignature);
		} catch (err) {
			const message = `Error at updateApplicationSignature with id: ${application_id}`;

			logger.error(message);
			logger.error(err);

			return failure(message, err);
		}
	},
});

export { signatureService };
