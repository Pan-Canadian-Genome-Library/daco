/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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

import { connectToDb, type PostgresDb } from '@/db/index.js';

import { studySvc } from '@/service/studyService.ts';
import { type StudyService } from '@/service/types.ts';
import { UpsertStudy } from '@pcgl-daco/data-model';
import { addStudyAndDacUsers, initTestMigration, PG_DATABASE, PG_PASSWORD, PG_USER } from '../utils/testUtils.ts';

describe('Study Service', () => {
	let db: PostgresDb;
	let container: StartedPostgreSqlContainer;
	let studyService: StudyService;

	before(async () => {
		container = await new PostgreSqlContainer()
			.withUsername(PG_USER)
			.withPassword(PG_PASSWORD)
			.withDatabase(PG_DATABASE)
			.start();

		const connectionString = container.getConnectionUri();
		db = connectToDb(connectionString);

		await initTestMigration(db);
		await addStudyAndDacUsers(db);
		// TODO: Will utilize below once applicationContents.dac_id is in main then add relevant test cases
		// await addInitialApplications(db);

		studyService = studySvc(db);
	});

	describe('getStudyById', () => {
		it('should get study by id', async () => {
			const testRecordId = 'study1';
			const result = await studyService.getStudyById({ studyId: testRecordId });

			assert.ok(result.success && result.data);
			assert.strictEqual(result.data.studyId, testRecordId);
		});

		it('should fail to get study if study does not exist', async () => {
			const testRecordId = 'MISSING-STUDY';
			const result = await studyService.getStudyById({ studyId: testRecordId });

			assert.ok(!result.success);
			assert.ok(result.error, 'NOT_FOUND');
		});

		it('should allow creating studies', async () => {
			const testRecords: UpsertStudy = {
				studyId: 'study7',
				dacId: 'dac7',
				studyName: 'Macronutrient Study',
				context: 'Research',
				domain: ['GASTROINTESTINAL'],
				leadOrganizations: ['Mayo Clinic'],
				principalInvestigators: ['Emeril Lagasse'],
				status: 'Completed',
				acceptingApplications: true,
				defaultTranslation: 1,
				categoryId: null,
				collaborators: ['Canadian Cancer Society'],
				publicationLinks: ['http://example.com/stomach-study'],
				defaultLanguage: 'en_ca',
				createdAt: new Date(),
				updatedAt: new Date(),
				translations: [
					{
						languageId: 'en_ca',
						fundingSources: ['Heinz'],
						studyDescription: 'Studying nutritional sources of malignant gastric tumors.',
						programName: 'The Carcinoid Program',
						keywords: ['intestine', 'stomach', 'gastrointestinal', 'gastroesophageal'],
						participantCriteria: 'Adults age 25 to 55 who cook and eat.',
						studyTranslationId: 1,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				],
			};

			const result = await studyService.createStudyFromClinical({ studyData: testRecords });

			assert.ok(result.success && result.data);
			assert.strictEqual(result.data.studyId, testRecords.studyId);
		});

		it('should updating existing studies', async () => {
			const testRecords: UpsertStudy = {
				studyId: 'study7',
				dacId: 'dac7',
				studyName: 'Macronutrient Study',
				context: 'Research',
				domain: ['GASTROINTESTINAL'],
				leadOrganizations: ['Mayo Clinic'],
				principalInvestigators: ['Emeril Lagasse'],
				status: 'Completed',
				defaultTranslation: 1,
				defaultLanguage: 'en_ca',
				acceptingApplications: false,
				categoryId: null,
				collaborators: null,
				createdAt: new Date(),
				dacName: '',
				publicationLinks: null,
				updatedAt: new Date(),
				translations: [
					{
						languageId: 'en_ca',
						fundingSources: ['Heinz', 'A&W'],
						studyDescription: 'Studying nutritional sources of malignant gastric tumors.',
						studyTranslationId: 1,
						keywords: [''],
						participantCriteria: '',
						programName: '',
						updatedAt: new Date(),
						createdAt: new Date(),
					},
				],
			};

			const result = await studyService.createStudyFromClinical({ studyData: testRecords });

			assert.ok(
				result.success && result.data && result.data.translations[0] && result.data.translations[0].fundingSources,
			);

			assert.deepStrictEqual(result.data.translations[0].fundingSources, testRecords.translations[0]?.fundingSources);
		});
	});

	describe('getAllStudies', () => {
		it('should get all studies', async () => {
			const result = await studyService.getAllStudies({});

			assert.ok(result.success && result.data.length >= 0);
		});
	});

	describe('updateStudyAcceptingApplication', () => {
		it('should set acceptingApplications to true', async () => {
			const testRecordId = 'study1';
			const result = await studyService.updateStudyAcceptingApplication({ studyId: testRecordId, enabled: true });

			assert.ok(result.success);
			assert.strictEqual(result.data.acceptingApplications, true);
		});

		it('should set acceptingApplications to false', async () => {
			const testRecordId = 'study1';
			const result = await studyService.updateStudyAcceptingApplication({ studyId: testRecordId, enabled: false });

			assert.ok(result.success);
			assert.strictEqual(result.data.acceptingApplications, false);
		});

		it('should fail to set acceptingApplications if study does not exist', async () => {
			const testRecordId = 'MISSING-STUDY';
			const result = await studyService.updateStudyAcceptingApplication({ studyId: testRecordId, enabled: true });

			assert.ok(!result.success);
			assert.strictEqual(result.error, 'NOT_FOUND');
		});
	});

	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
