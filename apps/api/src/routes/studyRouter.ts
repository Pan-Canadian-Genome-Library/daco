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
import express from 'express';

import { getAllStudies, getStudyById, setStudyAcceptingApplications } from '@/controllers/studyController.ts';
import { adminMiddleware } from '@/middleware/adminMiddleware.ts';
import { apiZodErrorMapping } from '@/utils/validation.js';
import { activateBodyParamSchema, basicStudyParamSchema } from '@pcgl-daco/validation';
import type { ResponseWithData } from './types.ts';

const studyRouter = express.Router();

/**
 * Get study by studyId
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
