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
import {
	JoinedApplicationRecord,
	type ApplicationRecord,
	type ApplicationService,
	type RevisionRequestModel,
} from '@/service/types.js';
import { failure, success, type AsyncResult } from '@/utils/results.js';
import { aliasApplicationContentsRecord, aliasApplicationRecord } from '@/utils/routes.js';
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

	const data = aliasApplicationContentsRecord(update);

	return await applicationRepo.editApplication({ id, update: data });
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

export const submitRevision = async ({ applicationId }: { applicationId: number }) => {
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

		if (
			appStateManager.state === ApplicationStates.DAC_REVISIONS_REQUESTED ||
			appStateManager.state === ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED
		) {
			return failure('Application revision is already submitted.', 'RejectionConflict');
		}

		let submittedRevision;
		if (appStateManager.state === ApplicationStates.DAC_REVIEW) {
			submittedRevision = await appStateManager.submitDacRevision();
		} else {
			submittedRevision = await appStateManager.submitRepRevision();
		}

		if (!submittedRevision.success) {
			return failure(submittedRevision.message || 'Failed to submit application revision.', 'StateTransitionError');
		}

		return submittedRevision;
	} catch (error) {
		const message = `Unable to submit revision with applicationId: ${applicationId}`;
		logger.error(message);
		logger.error(error);
		return failure(message, error);
	}
};

export const requestApplicationRevisionsByDac = async ({
	applicationId,
	role,
	revisionData,
}: {
	applicationId: number;
	role: string;
	revisionData: RevisionRequestModel;
}): AsyncResult<JoinedApplicationRecord> => {
	try {
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);

		const result = await service.getApplicationById({ id: applicationId });

		if (!result.success) {
			return result;
		}

		const application = result.data;
		const appStateManager = new ApplicationStateManager(application);

		if (role === 'DAC_MEMBER' && application.state !== ApplicationStates.DAC_REVIEW) {
			return failure('Application is not in the correct status for revisions.');
		}

		const revisionResult = await appStateManager.reviseDacReview();

		if (!revisionResult.success) {
			return failure(revisionResult.message || 'Failed to request revisions for application.', 'StateTransitionError');
		}

		const revisionRequestResult = await service.createRevisionRequest({ applicationId, revisionData });

		if (!revisionRequestResult.success) {
			return failure(
				revisionRequestResult.message || 'Failed to request revisions for application.',
				'StateTransitionError',
			);
		}

		return service.getApplicationWithContents({ id: applicationId });
	} catch (error) {
		logger.error(`Failed to request revisions for application ${applicationId}:`, error);
		return failure('An error occurred while processing the request.', error);
	}
};

export const requestApplicationRevisionsByRep = async ({
	applicationId,
	role,
	revisionData,
}: {
	applicationId: number;
	role: string;
	revisionData: RevisionRequestModel;
}): AsyncResult<JoinedApplicationRecord> => {
	try {
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);

		const result = await service.getApplicationById({ id: applicationId });

		if (!result.success) {
			return result;
		}

		const application = result.data;
		const appStateManager = new ApplicationStateManager(application);

		if (role === 'INSTITUTIONAL_REP' && application.state !== ApplicationStates.INSTITUTIONAL_REP_REVIEW) {
			return failure('Application is not in the correct status for revisions.');
		}

		const revisionResult = await appStateManager.reviseRepReview();

		if (!revisionResult.success) {
			return failure(revisionResult.message || 'Failed to request revisions for application.', 'StateTransitionError');
		}

		const revisionRequestResult = await service.createRevisionRequest({ applicationId, revisionData });

		if (!revisionRequestResult.success) {
			return failure(
				revisionRequestResult.message || 'Failed to request revisions for application.',
				'StateTransitionError',
			);
		}

		return service.getApplicationWithContents({ id: applicationId });
	} catch (error) {
		logger.error(`Failed to request revisions for application ${applicationId}:`, error);
		return failure('An error occurred while processing the request.', error);
	}
};

export const closeApplication = async ({
	applicationId,
	requesterId,
	isDacMember = false,
}: {
	applicationId: number;
	requesterId: string;
	isDacMember?: boolean;
}) => {
	try {
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);
		const result = await service.getApplicationById({ id: applicationId });

		if (!result.success) {
			return result;
		}

		const application = result.data;
		const appStateManager = new ApplicationStateManager(application);

		// Check if application is already closed
		if (appStateManager.state === ApplicationStates.CLOSED) {
			return failure('Application is already closed.', 'StateConflict');
		}

		// Authorization logic based on state
		const isApplicant = application.user_id === requesterId;

		const canCloseDacApplication =
			(isDacMember && appStateManager.state === ApplicationStates.DAC_REVIEW) || isApplicant;

		if (!canCloseDacApplication) {
			return failure('Current user is not authorized to close the application', 'Unauthorized');
		}

		let closeResult;

		switch (appStateManager.state) {
			case ApplicationStates.DRAFT:
				closeResult = await appStateManager.closeDraft();
				break;
			case ApplicationStates.INSTITUTIONAL_REP_REVIEW:
				closeResult = await appStateManager.closeRepReview();
				break;
			case ApplicationStates.DAC_REVIEW:
				closeResult = await appStateManager.closeDacReview();
				break;
			default:
				return failure(`Cannot close application in state ${appStateManager.state}.`, 'InvalidState');
		}

		if (!closeResult.success) {
			return failure(closeResult.message || 'Failed to close application.', 'StateTransitionError');
		}

		return closeResult;
	} catch (error) {
		const message = `Unable to close application with id: ${applicationId}`;
		logger.error(message);
		logger.error(error);
		return failure(message, error);
	}
};
