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
import { withBodySchemaValidation, withParamsSchemaValidation } from '@pcgl-daco/request-utils';
import {
	activateBodyParamSchema,
	basicStudyParamSchema,
	dacDTOResponseSchema,
	studyClinicalDTOResponseSchema,
} from '@pcgl-daco/validation';
import express from 'express';

import { serverConfig } from '@/config/serverConfig.js';
import { createDacRecords } from '@/controllers/dacController.ts';
import {
	getAllStudies,
	getStudyById,
	setStudyAcceptingApplications,
	updateStudies,
} from '@/controllers/studyController.ts';
import { getDbInstance } from '@/db/index.js';
import BaseLogger from '@/logger.js';
import { adminMiddleware } from '@/middleware/adminMiddleware.ts';
import { type StudyModel } from '@/service/types.ts';
import { apiZodErrorMapping } from '@/utils/validation.js';
import type { ResponseWithData } from './types.ts';

const logger = BaseLogger.forModule('studyRouter');
const studyRouter = express.Router();

/**
 * Import all studies from submission service
 */
studyRouter.get(
	'/import',
	async (request, response: ResponseWithData<{ studies: StudyModel[] }, ['SYSTEM_ERROR', 'NOT_FOUND']>) => {
		const { CLINICAL_URL } = serverConfig;
		const dacResponse = await fetch(`${CLINICAL_URL}/dac`);
		const dacResponseData = await dacResponse.json();
		const parsedDacData = dacDTOResponseSchema.safeParse(dacResponseData);

		if (!parsedDacData.success) {
			logger.error('Error retrieving DAC data', parsedDacData.error);
			response.status(500).json({ error: 'SYSTEM_ERROR', message: 'Error retrieving DAC data' });
			return;
		} else if (parsedDacData.data.length === 0) {
			logger.error('No DAC data retrieved from Clinical on Import Studies');
			response.status(404).json({ error: 'NOT_FOUND', message: 'No DAC Study data retrieved from Clinical' });
			return;
		}

		const studyResponse = await fetch(`${CLINICAL_URL}/study`);
		const studyResponseData = await studyResponse.json();
		const parsedStudyData = studyClinicalDTOResponseSchema.safeParse(studyResponseData);

		if (!parsedStudyData.success) {
			logger.error('Error retrieving DAC Study data retrieved from Clinical on Import Studies', parsedStudyData.error);
			response.status(500).json({ error: 'SYSTEM_ERROR', message: 'Error retrieving DAC Study data from Clinical' });
			return;
		} else if (parsedStudyData.data.length === 0) {
			logger.error('No Study data retrieved from Clinical on Import Studies');
			response.status(404).json({ error: 'NOT_FOUND', message: 'No Study data retrieved from Clinical' });
			return;
		}

		const database = getDbInstance();
		const txResult = await database.transaction(async (tx) => {
			const dacData = parsedDacData.data;
			const updatedDacResult = await createDacRecords({ dacData, transaction: tx });

			if (!updatedDacResult.success) {
				switch (updatedDacResult.error) {
					case 'NOT_FOUND':
						response.status(404).json({ error: updatedDacResult.error, message: updatedDacResult.message });
						break;
					case 'SYSTEM_ERROR':
						response.status(500).json({ error: updatedDacResult.error, message: updatedDacResult.message });
						break;
					default:
						response.status(500).json({ error: updatedDacResult.error, message: updatedDacResult.message });
				}
				return;
			}

			const studyData = parsedStudyData.data;
			const updatedStudiesResult = await updateStudies({ studies: studyData, transaction: tx });

			if (!updatedStudiesResult.success) {
				switch (updatedStudiesResult.error) {
					case 'NOT_FOUND':
						response.status(404).json({ error: updatedStudiesResult.error, message: updatedStudiesResult.message });
						break;
					case 'SYSTEM_ERROR':
						response.status(500).json({ error: updatedStudiesResult.error, message: updatedStudiesResult.message });
						break;
					default:
						response.status(500).json({ error: updatedStudiesResult.error, message: updatedStudiesResult.message });
				}
				return;
			}

			return updatedStudiesResult;
		});

		if (txResult) {
			response.status(200).json({ studies: txResult.data });
		}
		return;
	},
);

/**
 * Get the study by studyId
 */
studyRouter.get(
	'/:studyId',
	withParamsSchemaValidation(
		basicStudyParamSchema,
		apiZodErrorMapping,
		async (request, response: ResponseWithData<StudyDTO, ['SYSTEM_ERROR', 'NOT_FOUND']>) => {
			const studyId = String(request.params.studyId);

			const result = await getStudyById({ studyId });

			if (!result.success) {
				switch (result.error) {
					case 'NOT_FOUND':
						response.status(404).json({ error: result.error, message: result.message });
						break;
					case 'SYSTEM_ERROR':
						response.status(500).json({ error: result.error, message: result.message });
						break;
					default:
						response.status(500).json({ error: result.error, message: result.message });
				}
				return;
			}
			response.status(200).json(result.data);
			return;
		},
	),
);

/**
 * Activate or Deactive study by Id
 */
studyRouter.patch(
	'/:studyId/accepting-applications',
	adminMiddleware(),
	withParamsSchemaValidation(
		basicStudyParamSchema,
		apiZodErrorMapping,
		withBodySchemaValidation(
			activateBodyParamSchema,
			apiZodErrorMapping,
			async (
				request,
				response: ResponseWithData<Pick<StudyDTO, 'acceptingApplications'>, ['SYSTEM_ERROR', 'NOT_FOUND']>,
			) => {
				const studyId = String(request.params.studyId);
				const enabled = request.body.enabled;

				const result = await setStudyAcceptingApplications({ studyId, enabled });

				if (!result.success) {
					switch (result.error) {
						case 'NOT_FOUND':
							response.status(404).json({ error: result.error, message: result.message });
							break;
						case 'SYSTEM_ERROR':
							response.status(500).json({ error: result.error, message: result.message });
							break;
						default:
							response.status(500).json({ error: result.error, message: result.message });
					}
					return;
				}
				response.status(204).json();
				return;
			},
		),
	),
);
/*
 * Get all studies
 */
studyRouter.get('/', async (request, response: ResponseWithData<StudyDTO[], ['SYSTEM_ERROR']>) => {
	const result = await getAllStudies();

	if (!result.success) {
		switch (result.error) {
			case 'SYSTEM_ERROR':
				response.status(500).json({ error: result.error, message: result.message });
				break;
			default:
				response.status(500).json({ error: result.error, message: result.message });
		}
		return;
	}
	response.status(200).json(result.data);
	return;
});

export default studyRouter;
