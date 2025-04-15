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

import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';

import dbUtils, { type PostgresDb } from '@/db/index.js';
import { SignatureService } from '@/service/types.js';

import { signatureService } from '@/service/signatureService.ts';
import { mockApplicationRepo } from '@tests/utils/mocks.ts';
import { testUserId as user_id } from '@tests/utils/testUtils.ts';

describe('Signature Service', { skip: true }, () => {
	let db: PostgresDb;
	let testSignatureService: SignatureService;

	const validBase64Signature =
		'data:image/png;base64,0ZxJm5HcCop3TCvbnvoHxseg4L0XM5WqylNBdkHKeEmIe4s5s4A7CZYs8TrPUzIuIA0bxD+Ei6764LcM2sPsmxKBuY3REWQ/uEe1j85hUHoiTbQqwln6Kfsd8cGC8sfjrNQD02oZ';

	before(async () => {
		db = dbUtils.connectToDb('');
		testSignatureService = signatureService(db);
	});

	describe('Sign Application as Applicant', () => {
		it('should get an application and sign an application as an applicant', async () => {
			const applicationRecordsResult = await mockApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			const applicationRecords = applicationRecordsResult.data.applications;

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);

			const { id } = applicationRecords[0];

			const applicationResult = await testSignatureService.updateApplicationSignature({
				application_id: id,
				applicant_signature: validBase64Signature,
			});

			assert.ok(applicationResult.success && applicationResult.data);

			const application = applicationResult.data;

			assert.strictEqual(application.applicant_signature, validBase64Signature);
			assert.strictEqual(application.application_id, id);
			assert.strictEqual(application.institutional_rep_signature, null);
			assert.equal(application.institutional_rep_signed_at, null);
		});
	});

	describe('Sign Application an Institutional Representative', () => {
		it('should get an application and sign an application as an Institutional Representative', async () => {
			const applicationRecordsResult = await mockApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			const applicationRecords = applicationRecordsResult.data.applications;

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);

			const { id } = applicationRecords[0];

			const applicationResult = await testSignatureService.updateApplicationSignature({
				application_id: id,
				institutional_rep_signature: validBase64Signature,
			});

			assert.ok(applicationResult.success && applicationResult.data);

			const application = applicationResult.data;

			assert.strictEqual(application?.institutional_rep_signature, validBase64Signature);
			assert.strictEqual(application.application_id, id);
		});
	});

	describe('Retrieve Signed Application', () => {
		it('should retrieve a valid application with signatures', async () => {
			const applicationRecordsResult = await mockApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			const applicationRecords = applicationRecordsResult.data.applications;

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);

			const { id } = applicationRecords[0];

			const applicationResult = await testSignatureService.getApplicationSignature({
				application_id: id,
			});

			assert.ok(applicationResult.success && applicationResult.data);

			const application = applicationResult.data;

			assert.strictEqual(application.application_id, id);
			assert.strictEqual(application.applicant_signature, validBase64Signature);
			assert.notStrictEqual(application.applicant_signed_at, null);
			assert.strictEqual(application.institutional_rep_signature, validBase64Signature);
			assert.notStrictEqual(application.institutional_rep_signed_at, null);
		});
		it("should be unable to get an application that doesn't exist", async () => {
			const application_id = 9999;

			const applicationResult = await testSignatureService.getApplicationSignature({
				application_id: application_id,
			});

			assert.strictEqual(applicationResult.success, false);
		});
	});

	describe('Delete Signatures from an Application', () => {
		it('should get an application and delete signatures of the Institutional Representative', async () => {
			const applicationRecordsResult = await mockApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			const applicationRecords = applicationRecordsResult.data.applications;

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);

			const { id } = applicationRecords[0];

			const applicationResult = await testSignatureService.deleteApplicationSignature({
				application_id: id,
				signature_type: 'INSTITUTIONAL_REP',
			});

			assert.ok(applicationResult.success);

			const getSignatures = await testSignatureService.getApplicationSignature({
				application_id: id,
			});

			assert.ok(getSignatures.success);

			const application = getSignatures.data;

			assert.strictEqual(application.institutional_rep_signature, null);
			assert.strictEqual(application.institutional_rep_signed_at, null);
			assert.notStrictEqual(application.applicant_signature, null);
			assert.notStrictEqual(application.applicant_signed_at, null);
		});

		it('should get an application and delete signatures of the Applicant', async () => {
			const applicationRecordsResult = await mockApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			const applicationRecords = applicationRecordsResult.data.applications;

			assert.ok(Array.isArray(applicationRecords));
			assert.ok(applicationRecords[0]);

			const { id } = applicationRecords[0];

			const applicationResult = await testSignatureService.deleteApplicationSignature({
				application_id: id,
				signature_type: 'APPLICANT',
			});

			assert.ok(applicationResult.success);

			const getSignatures = await testSignatureService.getApplicationSignature({
				application_id: id,
			});

			assert.ok(getSignatures.success);

			const application = getSignatures.data;

			assert.strictEqual(application.applicant_signature, null);
			assert.strictEqual(application.applicant_signed_at, null);
		});
		it('Error out when trying to delete a signature from a non-existant application', async () => {
			const id = 9999;

			const applicationResult = await testSignatureService.deleteApplicationSignature({
				application_id: id,
				signature_type: 'APPLICANT',
			});

			assert.ok(!applicationResult.success);
		});
	});

	after(async () => {
		process.exit(0);
	});
});
