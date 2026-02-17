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

import type { StudyDTO } from '@pcgl-daco/data-model';

import { getDbInstance } from '@/db/index.js';
import BaseLogger from '@/logger.js';
import { studySvc } from '@/service/studyService.ts';
import { type PostgresTransaction, type StudyRecord } from '@/service/types.ts';
import { convertToStudyUpdateRecord } from '@/utils/aliases.ts';
import { failure, type AsyncResult } from '@/utils/results.ts';

const logger = BaseLogger.forModule('studyController');

/**
 * Gets a study.
 * @param studyId - The study ID
 * @returns {StudyDTO} - The study data
 */
export const getStudyById = async ({
	studyId,
}: {
	studyId: string;
}): AsyncResult<StudyDTO, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
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
}): AsyncResult<Pick<StudyDTO, 'acceptingApplications'>, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const studyService = studySvc(database);

		const study = await studyService.updateStudyAcceptingApplication({ studyId, enabled });

		return study;
	} catch (error) {
		return failure('SYSTEM_ERROR', `Unexpected error fetching study: ${studyId}`);
	}
};

/**
 * Returns all studies.
 * @returns {StudyDTO[]}
 */
export const getAllStudies = async (): AsyncResult<StudyDTO[], 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const studyService = studySvc(database);
		const studies = await studyService.getAllStudies();

		return studies;
	} catch (error) {
		return failure('SYSTEM_ERROR', `Unexpected error fetching studies`);
	}
};
/*
 * Inserts & Updates Multiple Study Records
 * @param studies - An array of Study DTO objects from the Submission Service
 * @returns
 */
export const updateStudies = async ({
	studies,
	transaction,
}: {
	studies: Omit<StudyDTO, 'acceptingApplications'>[];
	transaction?: PostgresTransaction;
}): AsyncResult<StudyRecord[], 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const studyService = studySvc(database);

		const studyData = studies.map((study) => {
			const createdDate = typeof study.createdAt === 'string' ? new Date(study.createdAt) : study.createdAt;
			const updatedDate = typeof study.updatedAt === 'string' ? new Date(study.updatedAt) : study.updatedAt;

			const studyModel = { ...study, createdAt: createdDate, updatedAt: updatedDate, acceptingApplications: false };
			const updatedRecordResult = convertToStudyUpdateRecord(studyModel);
			if (updatedRecordResult.success) {
				return updatedRecordResult.data;
			}
			throw new Error(updatedRecordResult.message);
		});

		const updatedStudies = await studyService.updateStudies({ studyData, transaction });

		return updatedStudies;
	} catch (error) {
		logger.error(error);
		return failure('SYSTEM_ERROR', `Unexpected error fetching updated studies`);
	}
};
