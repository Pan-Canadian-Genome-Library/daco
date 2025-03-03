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
import { type ApplicationListRequest } from '@/routes/types.js';
import { applicationSvc } from '@/service/applicationService.js';
import { type ApplicationContentUpdates, type ApplicationRecord, type ApplicationService } from '@/service/types.js';
import { failure, success, type AsyncResult } from '@/utils/results.js';
import { aliasApplicationRecord } from '@/utils/routes.js';
import { type UpdateEditApplicationRequest } from '@pcgl-daco/validation';
import { ApplicationStateEvents, ApplicationStateManager } from './stateManager.js';

/**
 * Creates a new application and returns the created data.
 * @param user_id - The ID of the user requesting the creation of the application.
 * @returns Success with Application data / Failure with Error.
 */
export const createApplication = async ({ user_id }: { user_id: string }) => {
	const database = getDbInstance();
	const applicationRepo: ApplicationService = applicationSvc(database);

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
export const editApplication = async ({ id, update }: { id: number; update: UpdateEditApplicationRequest }) => {
	const database = getDbInstance();
	const applicationRepo: ApplicationService = applicationSvc(database);

	const result = await applicationRepo.getApplicationById({ id });

	if (!result.success) {
		return result;
	}

	const application = result.data;

	const { edit } = ApplicationStateEvents;
	const canEditResult = new ApplicationStateManager(application)._canPerformAction(edit);

	if (!canEditResult.success) {
		const message = `Cannot update application with state ${application.state}`;
		logger.error(message);
		return failure(message);
	}

	const formatedUpdate: ApplicationContentUpdates = {
		applicant_first_name: update.applicantFirstname,
		applicant_middle_name: update.applicantMiddlename,
		applicant_last_name: update.applicantLastname,
		applicant_institutional_email: update.applicantInstitutionalEmail,
		applicant_position_title: update.applicantPositionTitle,
		applicant_primary_affiliation: update.applicantPrimaryAffiliation,
		applicant_profile_url: update.applicantProfileUrl,
		applicant_suffix: update.applicantSuffix,
		applicant_title: update.applicantTitle,
		institutional_rep_first_name: update.institutionalRepFirstname,
		institutional_rep_middle_name: update.institutionalRepMiddlename,
		institutional_rep_last_name: update.institutionalRepLastname,
		institutional_rep_title: update.institutionalRepTitle,
		institutional_rep_position_title: update.institutionalRepPositionTitle,
		institutional_rep_suffix: update.institutionalRepSuffix,
		institutional_rep_email: update.institutionalRepEmail,
		institutional_rep_primary_affiliation: update.institutionalRepPrimaryAffiliation,
		institutional_rep_profile_url: update.institutionalRepProfileUrl,
		institution_building: update.institutionBuilding,
		institution_city: update.institutionCity,
		institution_country: update.institutionCountry,
		institution_postal_code: update.institutionPostalCode,
		institution_state: update.institutionState,
		institution_street_address: update.institutionStreetAddress,
		project_aims: update.projectAims,
		project_methodology: update.projectMethodology,
		project_summary: update.projectSummary,
		project_title: update.projectTitle,
		project_website: update.projectWebsite,
	};
	return await applicationRepo.editApplication({ id, update: formatedUpdate });
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
	const applicationRepo: ApplicationService = applicationSvc(database);

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
	const applicationRepo: ApplicationService = applicationSvc(database);

	const result = await applicationRepo.getApplicationWithContents({ id: applicationId });

	if (result.success) {
		const responseData = aliasApplicationRecord(result.data);
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
	const service: ApplicationService = applicationSvc(database);

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
export const approveApplication = async ({ applicationId }: ApproveApplication): AsyncResult<ApplicationRecord> => {
	try {
		// Fetch application
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);
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

export const rejectApplication = async ({ applicationId }: { applicationId: number }) => {
	try {
		// Fetch application
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);
		const result = await service.getApplicationById({ id: applicationId });

		if (!result.success) {
			return result;
		}

		const application = result.data;

		const appStateManager = new ApplicationStateManager(application);

		if (appStateManager.state === ApplicationStates.REJECTED) {
			return failure('Application is already rejected.', 'RejectionConflict');
		}

		const rejectResult = await appStateManager.rejectDacReview();

		if (!rejectResult.success) {
			return failure(rejectResult.message || 'Failed to reject application.', 'StateTransitionError');
		}

		const update = { state: appStateManager.state, updated_at: new Date() };
		const updatedResult = await service.findOneAndUpdate({ id: applicationId, update });

		return updatedResult;
	} catch (error) {
		const message = `Unable to reject application with id: ${applicationId}`;
		logger.error(message);
		logger.error(error);
		return failure(message, error);
	}
};
