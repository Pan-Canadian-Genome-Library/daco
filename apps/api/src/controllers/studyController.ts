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

import type { StudyClinicalDTO, StudyDacoDTO } from '@pcgl-daco/data-model';

import { getDbInstance } from '@/db/index.js';
import BaseLogger from '@/logger.js';
import { studySvc } from '@/service/studyService.ts';
import { type PostgresTransaction } from '@/service/types.ts';
import { failure, success, type AsyncResult } from '@/utils/results.ts';

const logger = BaseLogger.forModule('studyController');

/**
 * Gets a study.
 * @param studyId - The study ID
 * @returns {StudyDacoDTO} - The study data
 */
export const getStudyById = async ({
	studyId,
}: {
	studyId: string;
}): AsyncResult<StudyDacoDTO, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const studyService = studySvc(database);

		const study = await studyService.getStudyById({ studyId });

		return study;
	} catch (error) {
		return failure('SYSTEM_ERROR', `Unexpected error fetching study: ${studyId}`);
	}
};

/**
 * Sets accepting applications for a study.
 * @param studyId - The study ID
 * @param enabled - Whether to enable or disable accepting applications
 * @returns {acceptingApplications: boolean}
 */
export const setStudyAcceptingApplications = async ({
	studyId,
	enabled,
}: {
	studyId: string;
	enabled: boolean;
}): AsyncResult<Pick<StudyDacoDTO, 'acceptingApplications'>, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const studyService = studySvc(database);

		const currentStudy = await studyService.getStudyById({ studyId });

		if (!currentStudy.success) {
			return currentStudy;
		}

		if (!currentStudy.data.dacId || currentStudy.data.dacId === null) {
			logger.error(`Studies require an associated DAC to update accepting applications`);
			return failure('SYSTEM_ERROR', `Cannot update accepting applications for a study without an associated DAC`);
		}

		const study = await studyService.updateStudyAcceptingApplication({ studyId, enabled });

		return study;
	} catch (error) {
		return failure('SYSTEM_ERROR', `Unexpected error fetching study: ${studyId}`);
	}
};

/**
 * Returns all studies.
 * @returns {StudyDacoDTO[]}
 */
export const getAllStudies = async (): AsyncResult<StudyDacoDTO[], 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const studyService = studySvc(database);
		const studies = await studyService.getAllStudies({});

		return studies;
	} catch (error) {
		return failure('SYSTEM_ERROR', `Unexpected error fetching studies`);
	}
};
export const upsertStudy = async ({
	studies,
	transaction,
}: {
	studies: StudyClinicalDTO[];
	transaction?: PostgresTransaction;
}): AsyncResult<string, 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const studyService = studySvc(database);

		// Check if any studies have been removed from clinical submission then delete them from the database
		const allStudiesFromDACO = await studyService.getAllStudies({});
		if (!allStudiesFromDACO.success) {
			logger.error('Failed to fetch all studies to verify if any have been removed', allStudiesFromDACO.message);
			return failure('SYSTEM_ERROR', 'Failed to upsert studies from clinical.');
		}

		const studiesToRemove = allStudiesFromDACO.data.filter(
			(study) => !studies.some((s) => s.studyId === study.studyId),
		);
		if (studiesToRemove.length > 0) {
			logger.warn('Some studies have been removed', studiesToRemove);
			for (const study of studiesToRemove) {
				const deleteResult = await studyService.deleteStudy({ studyId: study.studyId, transaction });
				if (!deleteResult.success || !deleteResult.data) {
					return failure('SYSTEM_ERROR', 'Failed to sync studies');
				}
			}
		}

		for (const study of studies) {
			const studyModel: StudyClinicalDTO = {
				...study,
				createdAt: typeof study.createdAt === 'string' ? new Date(study.createdAt) : study.createdAt,
				updatedAt: typeof study.updatedAt === 'string' ? new Date(study.updatedAt) : study.updatedAt,
			};

			const result = await studyService.createStudyFromClinical({ studyData: studyModel, transaction });

			if (!result.success || !result.data) {
				return failure('SYSTEM_ERROR', 'Failed to sync studies');
			}
		}

		return success('Success');
	} catch (error) {
		logger.error(error);
		return failure('SYSTEM_ERROR', `Unexpected error fetching updated studies`);
	}
};
