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

import { ApplicationStates } from '@pcgl-daco/data-model';
import cron from 'node-cron';

import { getAllApplications } from '@/controllers/applicationController.js';
import { getDbInstance } from '@/db/index.js';
import BaseLogger from '@/logger.js';
import { applicationActionSvc } from '@/service/applicationActionService.ts';
import { type ApplicationActionRecord } from '@/service/types.js';
import {
	dacReviewReminder,
	dacRevisionRequestReminder,
	dacSubmitRevisionReminder,
	repReviewReminder,
	repRevisionRequestReminder,
	repSubmitRevisionReminder,
	submitDraftReminder,
} from '@/utils/emailReminders.ts';

const logger = BaseLogger.forModule('Scheduler Error');

const dateDiffCheck = ({
	applicationAction,
	interval = 7,
}: {
	applicationAction: ApplicationActionRecord;
	interval?: number;
}) => {
	const actionDate = applicationAction.created_at.getDate();
	const currentDate = new Date().getDate();
	const diff = currentDate - actionDate;

	return diff > interval;
};

const scheduler = async () => {
	try {
		cron.schedule('5 * * * *', async () => {
			const allApplicationsResult = await getAllApplications({
				state: [
					ApplicationStates.DRAFT,
					ApplicationStates.DAC_REVIEW,
					ApplicationStates.DAC_REVISIONS_REQUESTED,
					ApplicationStates.INSTITUTIONAL_REP_REVIEW,
					ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED,
				],
				isDAC: true,
			});

			if (allApplicationsResult.success) {
				const applications = allApplicationsResult.data.applications;
				const database = getDbInstance();
				const applicationActionRepo = applicationActionSvc(database);

				for (const application of applications) {
					const actionResult = await applicationActionRepo.listActions({
						application_id: application.id,
						sort: [{ column: 'created_at', direction: 'desc' }],
					});

					if (actionResult.success) {
						const actionData = actionResult.data[0];
						if (!actionData) {
							logger.error(`Error retrieving actions for application with ID ${application.id}`);
							continue;
						}

						const sendReminder = dateDiffCheck({ applicationAction: actionData });

						if (sendReminder) {
							switch (application.state) {
								case ApplicationStates.DRAFT:
									submitDraftReminder(application.id);
									break;
								case ApplicationStates.DAC_REVIEW:
									dacReviewReminder(application.id);
									break;
								case ApplicationStates.DAC_REVISIONS_REQUESTED: {
									if (actionData.user_name === 'APPLICANT') {
										dacRevisionRequestReminder(application.id);
									} else if (actionData.user_name === 'INSTITUTIONAL_REP') {
										dacSubmitRevisionReminder(application.id);
									}
									break;
								}
								case ApplicationStates.INSTITUTIONAL_REP_REVIEW:
									repReviewReminder(application.id);
									break;
								case ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED: {
									if (actionData.user_name === 'APPLICANT') {
										repSubmitRevisionReminder(application.id);
									} else if (actionData.user_name === 'INSTITUTIONAL_REP') {
										repRevisionRequestReminder(application.id);
									}
									break;
								}
								default:
									break;
							}
						}
					} else {
						logger.error(`Error retrieving actions for application with ID ${application.id}`, actionResult.message);
					}
				}
			} else {
				throw new Error('Error retrieving applications');
			}
		});
	} catch (error) {
		logger.error(error);
	}
};

export default scheduler;
