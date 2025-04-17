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

import { getDbInstance } from '@/db/index.js';
import { signatureService } from '@/service/signatureService.ts';
import { type ApplicationSignatureUpdate, type SignatureService } from '@/service/types.js';
import { convertToSignatureRecord } from '@/utils/aliases.ts';
import { failure, success, type AsyncResult } from '@/utils/results.ts';
import type { SignatureDTO, SignatureType } from '@pcgl-daco/data-model';
import { type ApplicationSignatureDTO, type EditSignatureRequest } from '@pcgl-daco/validation';

/**
 * Gets a signature for an application.
 * @param application_id - The Application ID
 * @returns Success with the signature and signed at time, properties may be `null` if not yet signed / Failure with Error.
 */
export const getApplicationSignature = async ({
	applicationId,
}: {
	applicationId: number;
}): AsyncResult<SignatureDTO, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const signatureRepo: SignatureService = signatureService(database);

		const result = await signatureRepo.getApplicationSignature({ application_id: applicationId });

		if (!result.success) {
			return result;
		}

		const aliasedResponseResult = convertToSignatureRecord(result.data);
		return aliasedResponseResult;
	} catch (error) {
		return failure('SYSTEM_ERROR', `Unexpected error fetching signature for application: ${applicationId}`);
	}
};

/**
 * Adds or updates a signature to an application.
 * @param id - The Application ID
 * @param signature - The base64-encoded image containing the signature for the Application.
 * @returns Success with the signature and signed at time / Failure with Error
 */
export const updateApplicationSignature = async ({
	applicationId,
	signature,
	signee,
}: EditSignatureRequest & { signee: SignatureType }): AsyncResult<
	ApplicationSignatureDTO,
	'NOT_FOUND' | 'SYSTEM_ERROR'
> => {
	const database = getDbInstance();
	const signatureRepo: SignatureService = signatureService(database);

	let update: ApplicationSignatureUpdate =
		signee === 'APPLICANT'
			? {
					application_id: applicationId,
					applicant_signature: signature,
				}
			: {
					application_id: applicationId,
					institutional_rep_signature: signature,
				};

	const result = await signatureRepo.updateApplicationSignature(update);
	if (!result.success) {
		return result;
	}

	const updatedSignature =
		signee === 'APPLICANT' ? result.data.applicant_signature : result.data.institutional_rep_signature;
	if (updatedSignature) {
		return success({
			id: result.data.application_id,
			signedAt: (signee === 'APPLICANT'
				? result.data.applicant_signed_at
				: result.data.institutional_rep_signed_at
			)?.toISOString(),
			signature: updatedSignature,
		});
	}
	return failure('SYSTEM_ERROR', 'Signature missing after update.');
};

/**
 * Deletes a signature from an application.
 * @param id - The Application ID
 * @param signee - A `APPLICANT` or `INSTITUTIONAL_REP` whose signature you'd like to delete.
 * @returns Success with the signature and signed at time / Failure with Error
 * TODO: - There is no auth validation for this route yet.
 */
export const deleteApplicationSignature = async ({
	applicationId,
	signee,
}: {
	applicationId: number;
	signee: SignatureType;
}) => {
	const database = getDbInstance();
	const signatureRepo: SignatureService = signatureService(database);

	const result = await signatureRepo.deleteApplicationSignature({
		application_id: applicationId,
		signature_type: signee,
	});

	return result;
};
