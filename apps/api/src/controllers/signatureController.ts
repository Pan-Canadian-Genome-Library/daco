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
import { ApplicationSignatureUpdate, type SignatureService } from '@/service/types.js';
import { type EditSignatureRequest } from '@pcgl-daco/validation';

/**
 * Adds or updates a signature to an application.
 * @param id - The Application ID
 * @param signature - The base64-encoded image containing the signature for the Application.
 * @returns Success with the signature and signed at time / Failure with Error
 */
export const updateApplicationSignature = async ({ id, signature, signee }: EditSignatureRequest) => {
	const database = getDbInstance();
	const applicationRepo: SignatureService = signatureService(database);

	let update: ApplicationSignatureUpdate = {
		application_id: id,
	};

	if (signee === 'APPLICANT') {
		update = {
			...update,
			applicant_signature: signature,
		};
	} else if (signee === 'INSTITUTIONAL_REP') {
		update = {
			...update,
			institutional_rep_signature: signature,
		};
	} else {
		throw new Error('Error: Invalid Signee type. Signee can only be an Applicant or a Institutional Rep.');
	}

	const result = await applicationRepo.updateApplicationSignature(update);

	return result;
};
