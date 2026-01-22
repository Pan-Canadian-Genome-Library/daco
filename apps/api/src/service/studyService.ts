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

import { eq } from 'drizzle-orm';

import { type PostgresDb } from '@/db/index.js';
import { dac } from '@/db/schemas/dac.ts';
import { study } from '@/db/schemas/studies.ts';
import BaseLogger from '@/logger.ts';
import { failure, success, type AsyncResult } from '@/utils/results.js';
import { StudyDTO } from '@pcgl-daco/data-model';

const logger = BaseLogger.forModule('studyService');

/**
 * Study service provides methods for study DB access
 * @param db - Drizzle Postgres DB Instance
 */
const studySvc = (db: PostgresDb) => ({
	getStudyById: async ({ studyId }: { studyId: string }): AsyncResult<StudyDTO, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
		try {
			const studyRecord = await db
				.select({
					studyId: study.study_id,
					dacId: study.dac_id,
					dacName: dac.dac_name,
					categoryId: study.category_id,
					studyName: study.study_name,
					studyDescription: study.study_description,
					programName: study.program_name,
					keywords: study.keywords,
					status: study.status,
					context: study.context,
					domain: study.domain,
					participantCriteria: study.participant_criteria,
					principalInvestigators: study.principal_investigators,
					leadOrganizations: study.lead_organizations,
					collaborators: study.collaborators,
					fundingSources: study.funding_sources,
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
});

export { studySvc };
