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

import { eq, inArray, sql } from 'drizzle-orm';

import { type PostgresDb } from '@/db/index.js';
import { dac } from '@/db/schemas/dac.ts';
import { study } from '@/db/schemas/studies.ts';
import { studyTranslations } from '@/db/schemas/studyTranslationsSchema.ts';
import { isPostgresError, PostgresErrors } from '@/db/utils.ts';
import BaseLogger from '@/logger.ts';
import { failure, success, type AsyncResult } from '@/utils/results.js';
import type { StudyDacoDTO, StudyResponse, StudyTranslationDTO, UpsertStudy } from '@pcgl-daco/data-model';
import { StudyTranslationRecord, type PostgresTransaction, type StudyRecord } from './types.ts';

const logger = BaseLogger.forModule('studyService');

const convertFromRecordToStudyDTO = (study: StudyRecord): StudyDacoDTO => {
	return {
		studyId: study.study_id,
		dacId: study.dac_id,
		studyName: study.study_name,
		status: study.status,
		context: study.context,
		domain: study.domain,
		principalInvestigators: study.principal_investigators,
		leadOrganizations: study.lead_organizations,
		collaborators: study.collaborators,
		publicationLinks: study.publication_links,
		defaultTranslation: study.default_translation,
		acceptingApplications: study.accepting_applications,
		createdAt: study.created_at,
		updatedAt: study.updated_at,
		categoryId: study.category_id,
	};
};

const convertStudyTranslations = (translations: StudyTranslationRecord[]): StudyTranslationDTO[] => {
	return translations.map((translation) => ({
		languageId: translation.language_id,
		studyDescription: translation.study_description,
		fundingSources: translation.funding_sources,
		keywords: translation.keywords,
		participantCriteria: translation.participant_criteria,
		programName: translation.program_name,
		createdAt: translation.created_at,
		updatedAt: translation.updated_at,
	}));
};

/*
 * Converts a StudyRecord from the database into a StudyResponse DTO
 * with associated translations.
 * @param study - The StudyRecord to convert
 * @param db - The database connection or transaction
 * @returns A StudyResponse DTO with translations appended
 */
const convertFromRecordToStudyResponse = async (
	study: StudyRecord,
	db: PostgresTransaction | PostgresDb,
): Promise<StudyResponse> => {
	// Format return object
	const result = await db.select().from(studyTranslations).where(eq(studyTranslations.study_id, study.study_id));
	let resultTranslations: StudyTranslationDTO[] = [];

	// Group translations into an array
	if (result.length > 0 && result[0]) {
		resultTranslations = convertStudyTranslations(result);
	}

	return {
		...convertFromRecordToStudyDTO(study),
		translations: resultTranslations,
	};
};

/**
 * Study service provides methods for study DB access
 * @param db - Drizzle Postgres DB Instance
 */
const studySvc = (db: PostgresDb) => ({
	getStudyById: async ({ studyId }: { studyId: string }): AsyncResult<StudyDacoDTO, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
		try {
			const studyRecord = await db
				.select({
					studyId: study.study_id,
					dacId: study.dac_id,
					dacName: dac.dac_name,
					categoryId: study.category_id,
					studyName: study.study_name,
					status: study.status,
					context: study.context,
					domain: study.domain,
					principalInvestigators: study.principal_investigators,
					leadOrganizations: study.lead_organizations,
					collaborators: study.collaborators,
					publicationLinks: study.publication_links,
					acceptingApplications: study.accepting_applications,
					createdAt: study.created_at,
					updatedAt: study.updated_at,
				})
				.from(study)
				.where(eq(study.study_id, studyId))
				.innerJoin(dac, eq(dac.dac_id, study.dac_id));

			if (!studyRecord[0]) {
				return failure('NOT_FOUND', `Unable to find study record ${studyId}.`);
			}

			return success(studyRecord[0]);
		} catch (error) {
			const message = 'Error at getStudyById';

			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	updateStudyAcceptingApplication: async ({
		studyId,
		enabled,
	}: {
		studyId: string;
		enabled: boolean;
	}): AsyncResult<Pick<StudyDacoDTO, 'acceptingApplications'>, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
		try {
			const studyRecord = await db
				.update(study)
				.set({ accepting_applications: enabled, updated_at: sql`CURRENT_TIMESTAMP` })
				.where(eq(study.study_id, studyId))
				.returning({
					acceptingApplications: study.accepting_applications,
				});

			if (!studyRecord || studyRecord.length === 0 || studyRecord[0] === undefined) {
				return failure('NOT_FOUND', `Unable to find study record to update ${studyId}.`);
			}

			return success(studyRecord[0]);
		} catch (error) {
			const message = 'Error at setStudyAcceptingApplications';
			return failure('SYSTEM_ERROR', message);
		}
	},
	getAllStudies: async ({ studyIds }: { studyIds?: string[] }): AsyncResult<StudyDacoDTO[], 'SYSTEM_ERROR'> => {
		try {
			const studyRecords = await db
				.select({
					studyId: study.study_id,
					dacId: study.dac_id,
					dacName: dac.dac_name,
					categoryId: study.category_id,
					studyName: study.study_name,
					status: study.status,
					context: study.context,
					domain: study.domain,
					principalInvestigators: study.principal_investigators,
					leadOrganizations: study.lead_organizations,
					collaborators: study.collaborators,
					publicationLinks: study.publication_links,
					acceptingApplications: study.accepting_applications,
					createdAt: study.created_at,
					updatedAt: study.updated_at,
				})
				.from(study)
				.innerJoin(dac, eq(dac.dac_id, study.dac_id))
				.where(studyIds ? inArray(study.study_id, studyIds) : undefined);

			return success(studyRecords);
		} catch (error) {
			const message = 'Error at getAllStudies';

			logger.error(message, error);
			return failure('SYSTEM_ERROR', message);
		}
	},
	/*
	 * Create a new study
	 * @param studyData - The study data to create
	 * @param transaction - Optional transaction object
	 * @returns The created study or undefined if creation fails, will throw bad request in controller
	 */
	createStudyFromClinical: async ({
		studyData,
		transaction,
	}: {
		studyData: UpsertStudy;
		transaction?: PostgresTransaction;
	}): AsyncResult<StudyResponse | undefined, 'DUPLICATE_RECORD' | 'SYSTEM_ERROR'> => {
		const dbDriver = transaction ? transaction : db;

		try {
			const translations = studyData.translations[0];

			if (!translations) {
				return failure(`SYSTEM_ERROR`, 'Malformed data, no existing translations are associated with this study');
			}

			// Create CTE to insert translation first
			const insertTranslation = dbDriver.$with('insert_translation').as(
				dbDriver
					.insert(studyTranslations)
					.values(
						studyData.translations.map((translation) => {
							return {
								study_id: studyData.studyId,
								language_id: translation.languageId,
								study_description: translation.studyDescription,
								program_name: translation.programName,
								keywords: translation.keywords,
								participant_criteria: translation.participantCriteria,
								funding_sources: translation.fundingSources,
							};
						}),
					)
					.onConflictDoUpdate({
						target: [studyTranslations.study_id, studyTranslations.language_id],
						set: {
							study_description: sql`EXCLUDED.study_description`,
							program_name: sql`EXCLUDED.program_name`,
							keywords: sql`EXCLUDED.keywords`,
							participant_criteria: sql`EXCLUDED.participant_criteria`,
							funding_sources: sql`EXCLUDED.funding_sources`,
							updated_at: sql`CURRENT_TIMESTAMP`,
						},
					})
					.returning(),
			);

			// Insert study using the translation_id from the CTE
			const studyResult = await dbDriver
				.with(insertTranslation)
				.insert(study)
				.values({
					study_id: sql`(SELECT study_id FROM ${insertTranslation} LIMIT 1)`,
					default_translation: sql`(SELECT study_translation_id FROM ${insertTranslation} LIMIT 1)`,
					dac_id: studyData.dacId,
					study_name: studyData.studyName,
					status: studyData.status,
					context: studyData.context,
					domain: studyData.domain.map((domains) => domains.toUpperCase()),
					principal_investigators: studyData.principalInvestigators,
					lead_organizations: studyData.leadOrganizations,
					collaborators: studyData.collaborators,
					category_id: studyData.categoryId,
					publication_links: studyData.publicationLinks,
				})
				.onConflictDoUpdate({
					target: study.study_id,
					set: {
						dac_id: sql`EXCLUDED.dac_id`,
						study_name: sql`EXCLUDED.study_name`,
						status: sql`EXCLUDED.status`,
						context: sql`EXCLUDED.context`,
						domain: sql`EXCLUDED.domain`,
						principal_investigators: sql`EXCLUDED.principal_investigators`,
						lead_organizations: sql`EXCLUDED.lead_organizations`,
						dac_name: sql`EXCLUDED.dac_name`,
						collaborators: sql`EXCLUDED.collaborators`,
						category_id: sql`EXCLUDED.category_id`,
						publication_links: sql`EXCLUDED.publication_links`,
						updated_at: sql`CURRENT_TIMESTAMP`,
					},
				})
				.returning();

			if (!studyResult[0]) {
				logger.error(`No results returned from the insertTranslation CTE for study ${studyData.studyName}`);
				throw new Error();
			}

			const returnResult = await convertFromRecordToStudyResponse(studyResult[0], dbDriver);

			return success(returnResult);
		} catch (error) {
			logger.error(error, 'Error at createStudy in StudyService');
			const postgresError = isPostgresError(error);

			switch (postgresError?.code) {
				case PostgresErrors.UNIQUE_KEY_VIOLATION:
					return failure(
						'DUPLICATE_RECORD',
						`${studyData.studyName} already exists in studies. Study name must be unique.`,
					);
				case PostgresErrors.FOREIGN_KEY_VIOLATION:
					return failure(
						'SYSTEM_ERROR',
						`${studyData.dacId} does not appear to be a valid DAC ID, please ensure this DAC record exists prior to creating a study.`,
					);
				default:
					return failure('SYSTEM_ERROR', 'Something went wrong while creating a new study. Please try again later.');
			}
		}
	},
});

export { studySvc };
