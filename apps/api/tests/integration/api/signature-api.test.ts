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

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

import {
	deleteApplicationSignature,
	getApplicationSignature,
	updateApplicationSignature,
} from '@/controllers/signatureController.ts';
import { connectToDb, type PostgresDb } from '@/db/index.js';
import { type ApplicationService } from '@/service/types.js';
import { SignatureTypes } from '@pcgl-daco/data-model';

import {
	addInitialApplications,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
	testUserId as user_id,
} from '@tests/utils/testUtils.ts';

describe('Signature API', () => {
	let db: PostgresDb;
	let testApplicationRepo: ApplicationService;
	let container: StartedPostgreSqlContainer;

	const validBase64Signature =
		'data:image/png;base64,0ZxJm5HcCop3TCvbnvoHxseg4L0XM5WqylNBdkHKeEmIe4s5s4A7CZYs8TrPUzIuIA0bxD+Ei6764LcM2sPsmxKBuY3REWQ/uEe1j85hUHoiTbQqwln6Kfsd8cGC8sfjrNQD02oZ';

	before(async () => {
		container = await new PostgreSqlContainer()
			.withUsername(PG_USER)
			.withPassword(PG_PASSWORD)
			.withDatabase(PG_DATABASE)
			.start();

		const connectionString = container.getConnectionUri();
		db = connectToDb(connectionString);

		await initTestMigration(db);
		await addInitialApplications(db);

		testApplicationRepo = appSvc.applicationSvc(db);
	});

	describe('Sign Application', () => {
		it('Should allow signing an application as an Applicant', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const { id: applicationId } = applicationRecordsResult.data.applications[0];

			const result = await updateApplicationSignature({
				applicationId,
				signature: validBase64Signature,
				signee: SignatureTypes.APPLICANT,
			});

			assert.ok(result.success);

			const editedSignature = result.data;
			assert.strictEqual(editedSignature.signature, validBase64Signature);
		});

		it('Should allow signing an application as an Institutional Rep', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const { id: applicationId } = applicationRecordsResult.data.applications[0];

			const result = await updateApplicationSignature({
				applicationId,
				signature: validBase64Signature,
				signee: SignatureTypes.INSTITUTIONAL_REP,
			});

			assert.ok(result.success);

			const editedSignature = result.data;

			assert.strictEqual(editedSignature.signature, validBase64Signature);
		});
	});

	describe('Retrieve Signed Application', () => {
		it('Should retrieve a signed application', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			//This application was previously signed above.
			const { id: applicationId } = applicationRecordsResult.data.applications[0];

			const result = await getApplicationSignature({
				applicationId,
			});

			assert.ok(result.success);

			const retrievedSignature = result.data;
			assert.notStrictEqual(retrievedSignature.applicantSignature, null);
			assert.notStrictEqual(retrievedSignature.applicantSignedAt, null);
		});
		it('Should retrieve a unsigned application successfully', async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[1],
			);

			//This application was not previously signed above.
			const { id: applicationId } = applicationRecordsResult.data.applications[1];

			const result = await getApplicationSignature({
				applicationId,
			});

			assert.ok(result.success);

			const retrievedSignature = result.data;
			assert.strictEqual(retrievedSignature.applicantSignature, null);
			assert.strictEqual(retrievedSignature.applicantSignedAt, null);
		});

		it('Be unable to retrieve an invalid signed application', async () => {
			const applicationId = 9999;

			const result = await getApplicationSignature({
				applicationId,
			});

			assert.strictEqual(result.success, false);
		});
	});

	describe('Delete Signatures', () => {
		it("should retrieve an application and delete it's applicant signature but NOT it's rep signatures", async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const { id: applicationId } = applicationRecordsResult.data.applications[0];

			const result = await deleteApplicationSignature({
				applicationId,
				signee: SignatureTypes.APPLICANT,
			});

			assert.ok(result.success);

			const deletedSignature = await getApplicationSignature({
				applicationId,
			});

			assert.ok(deletedSignature.success);

			assert.strictEqual(deletedSignature.data.applicantSignature, null);
			assert.strictEqual(deletedSignature.data.applicantSignedAt, null);
			assert.notStrictEqual(deletedSignature.data.institutionalRepSignature, null);
			assert.notStrictEqual(deletedSignature.data.institutionalRepSignedAt, null);
		});
		it("should retrieve an application and delete it's rep signatures", async () => {
			const applicationRecordsResult = await testApplicationRepo.listApplications({ user_id });

			assert.ok(applicationRecordsResult.success);

			assert.ok(
				Array.isArray(applicationRecordsResult.data.applications) && applicationRecordsResult.data.applications[0],
			);

			const { id: applicationId } = applicationRecordsResult.data.applications[0];

			const result = await deleteApplicationSignature({
				applicationId,
				signee: SignatureTypes.INSTITUTIONAL_REP,
			});

			assert.ok(result.success);

			const deletedSignature = await getApplicationSignature({
				applicationId,
			});

			assert.ok(deletedSignature.success);

			assert.strictEqual(deletedSignature.data.institutionalRepSignature, null);
			assert.strictEqual(deletedSignature.data.institutionalRepSignature, null);
		});

		it('Be unable to delete an invalid signed application', async () => {
			const applicationId = 9999;

			const result = await deleteApplicationSignature({
				applicationId,
				signee: SignatureTypes.APPLICANT,
			});

			assert.strictEqual(result.success, false);
		});
	});

	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
