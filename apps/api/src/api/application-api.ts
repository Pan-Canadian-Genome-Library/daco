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

import { ApplicationStates, ApproveApplication } from '@pcgl-daco/data-model/src/types.js';

import { getDbInstance } from '@/db/index.js';
import logger from '@/logger.js';
import { ApplicationListRequest } from '@/routes/types.js';
import { applicationSvc } from '@/service/applicationService.js';
import { ApplicationModel, type ApplicationContentUpdates, type ApplicationServiceType } from '@/service/types.js';
import { failure, success, type AsyncResult } from '@/utils/results.js';
import { aliasApplicationModel } from '@/utils/routes.js';
import { ApplicationStateManager } from './states.js';

/**
 * Creates a new application and returns the created data.
 * @param user_id - The ID of the user requesting the creation of the application.
 * @returns Success with Application data / Failure with Error.
 */
export const createApplication = async ({ user_id }: { user_id: string }) => {
	const database = getDbInstance();
	const applicationRepo: ApplicationServiceType = applicationSvc(database);

	const result = await applicationRepo.createApplication({ user_id });

	return result;
};

/**
 * Validates if a given Application state allows edits, then updates the record
 * Updated records are returned in state 'DRAFT'
 * @param id - Application ID
 * @param update - Application Contents details to update
 * @returns Success with Application data / Failure with Error
 */
export const editApplication = async ({ id, update }: { id: number; update: ApplicationContentUpdates }) => {
	const database = getDbInstance();
	const applicationRepo: ApplicationServiceType = applicationSvc(database);

	const result = await applicationRepo.getApplicationById({ id });

	if (!result.success) {
		return result;
	}

	const { state } = result.data;

	// TODO: Replace w/ state machine https://github.com/Pan-Canadian-Genome-Library/daco/issues/58
	const isEditState =
		state === ApplicationStates.DRAFT ||
		state === ApplicationStates.INSTITUTIONAL_REP_REVIEW ||
		state === ApplicationStates.DAC_REVIEW;

	if (isEditState) {
		const result = await applicationRepo.editApplication({ id, update });
		return result;
	} else {
		const message = `Cannot update application with state ${state}`;
		logger.error(message);
		return failure(message);
	}
};

/**
 *
 * @param userId - user ID
 * @param state - application state
 * @param sort - sorting options
 * @param page - page offset
 * @param pageSize - page limit
 * @returns Success with list of Applications / Failure with Error
 */
export const getAllApplications = async ({ userId, state, sort, page, pageSize }: ApplicationListRequest) => {
	const database = getDbInstance();
	const applicationRepo: ApplicationServiceType = applicationSvc(database);

	const result = await applicationRepo.listApplications({ user_id: userId, state, sort, page, pageSize });

	return result;
};

/**
 * Gets an application by a corresponding application ID
 * @param applicationId - The ID of the application within the database.
 * @returns Success with the details of the application / Failure with Error.
 */
export const getApplicationById = async ({ applicationId }: { applicationId: number }) => {
	const database = getDbInstance();
	const applicationRepo: ApplicationServiceType = applicationSvc(database);

	const result = await applicationRepo.getApplicationWithContents({ id: applicationId });

	if (result.success) {
		const responseData = aliasApplicationModel(result.data);
		return success(responseData);
	}

	return result;
};
/**
 * Gets the total of how many applications are in each state type, including a TOTAL count.
 * @param userId - The ID of the current user.
 * @returns Success with the details of the application / Failure with Error.
 */
export const getApplicationStateTotals = async ({ userId }: { userId: string }) => {
	const database = getDbInstance();
	const service: ApplicationServiceType = applicationSvc(database);

	return await service.applicationStateTotals({ user_id: userId });
};
/**
 * Approves the application by providing the applicationId
 *
 * @async
 * @param {ApproveApplication} param0
 * @param {ApproveApplication} param0.applicationId
 * @returns {Promise<{
 * 	success: boolean;
 * 	message?: string;
 * 	errors?: string | Error;
 * 	data?: any;
 * }>}
 */
export const approveApplication = async ({ applicationId }: ApproveApplication): AsyncResult<ApplicationModel[]> => {
	try {
		// Fetch application
		const database = getDbInstance();
		const service: ApplicationServiceType = applicationSvc(database);
		const result = await service.getApplicationById({ id: applicationId });

		if (!result.success) {
			return result;
		}

		const application = result.data;

		const appStateManager = new ApplicationStateManager(application);

		if (appStateManager.state === ApplicationStates.APPROVED) {
			return failure('Application is already approved.', 'ApprovalConflict');
		}

		const approvalResult = await appStateManager.approveDacReview();

		if (!approvalResult.success) {
			return failure(approvalResult.message || 'Failed to approve application.', 'StateTransitionError');
		}

		const update = { state: appStateManager.state, approved_at: new Date() };
		const updatedResult = await service.findOneAndUpdate({ id: applicationId, update });

		return updatedResult;
	} catch (error) {
		const message = `Unable to approve application with id: ${applicationId}`;
		logger.error(message);
		logger.error(error);
		return failure(message, error);
	}
};
