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

import { getDbInstance } from '@/db/index.js';
import BaseLogger from '@/logger.js';
import { type ApplicationListRequest } from '@/routes/types.js';
import { applicationSvc } from '@/service/applicationService.js';
import { emailSvc } from '@/service/email/emailsService.ts';
import {
	type ApplicationRecord,
	type ApplicationService,
	type JoinedApplicationRecord,
	type RevisionRequestModel,
} from '@/service/types.js';
import {
	convertToApplicationContentsRecord,
	convertToApplicationRecord,
	convertToBasicApplicationRecord,
} from '@/utils/aliases.js';
import { failure, success, type AsyncResult, type Result } from '@/utils/results.js';
import type { ApplicationDTO, ApplicationResponseData, ApproveApplication } from '@pcgl-daco/data-model';
import { ApplicationStates } from '@pcgl-daco/data-model/src/main.ts';
import type { UpdateEditApplicationRequest } from '@pcgl-daco/validation';
import { ApplicationStateEvents, ApplicationStateManager } from './stateManager.js';

const logger = BaseLogger.forModule('applicationController');

/**
 * Creates a new application and returns the created data.
 * @param user_id - The ID of the user requesting the creation of the application.
 * @returns Success with Application data / Failure with Error.
 */
export const createApplication = async ({ user_id }: { user_id: string }): AsyncResult<ApplicationRecord> => {
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
export const editApplication = async ({
	id,
	update,
}: {
	id: number;
	update: UpdateEditApplicationRequest;
}): AsyncResult<JoinedApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
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
		return failure('INVALID_STATE_TRANSITION', message);
	}

	const formattedResult = convertToApplicationContentsRecord(update);

	if (!formattedResult.success) return formattedResult;

	return await applicationRepo.editApplication({ id, update: formattedResult.data });
};

/**
 *
 * @param userId - user ID
 * @param state - application state
 * @param sort - sorting options
 * @param page - page offset
 * @param pageSize - page limit
 * @param isDACMember - Boolean which represents if the user is a DAC Member (they can see all applications)
 * @returns Success with list of Applications / Failure with Error
 */
export const getAllApplications = async ({
	userId,
	state,
	sort,
	page,
	pageSize,
	isDACMember,
}: ApplicationListRequest) => {
	const database = getDbInstance();
	const applicationRepo: ApplicationService = applicationSvc(database);

	if (isDACMember) {
		//If we set UserID to undefined, it will not add in the where clause for limiting by userID.
		userId = undefined;
	}

	const result = await applicationRepo.listApplications({ user_id: userId, state, sort, page, pageSize });

	return result;
};

/**
 * Gets an application by a corresponding application ID
 * @param applicationId - The ID of the application within the database.
 * @returns Success with the details of the application / Failure with Error.
 */
export const getApplicationById = async ({
	applicationId,
}: {
	applicationId: number;
}): AsyncResult<ApplicationResponseData, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	const database = getDbInstance();
	const applicationRepo: ApplicationService = applicationSvc(database);

	const result = await applicationRepo.getApplicationWithContents({ id: applicationId });

	if (result.success) {
		const aliasResult = convertToApplicationRecord(result.data);
		return aliasResult;
	}

	return result;
};

/**
 * Gets the total of how many applications are in each state type, including a TOTAL count.
 * @param userId - The ID of the current user.
 * @returns Success with the details of the application / Failure with Error.
 */
export const getApplicationStateTotals = async () => {
	const database = getDbInstance();
	const service: ApplicationService = applicationSvc(database);

	return await service.applicationStateTotals();
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
export const approveApplication = async ({
	applicationId,
}: ApproveApplication): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
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
			return failure('INVALID_STATE_TRANSITION', 'Application is already approved.');
		}

		const approvalResult = await appStateManager.approveDacReview();

		if (!approvalResult.success) {
			return failure('SYSTEM_ERROR', approvalResult.message);
		}

		const update = { state: appStateManager.state, approved_at: new Date() };
		const updatedResult = await service.findOneAndUpdate({ id: applicationId, update });

		return updatedResult;
	} catch (error) {
		logger.error(`Unable to approve application with id: ${applicationId}`, error);
		return failure('SYSTEM_ERROR', 'An unexpected error occurred attempting to approve application.');
	}
};

export const dacRejectApplication = async ({
	applicationId,
}: {
	applicationId: number;
}): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
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

		const rejectResult = await appStateManager.rejectDacReview();

		if (!rejectResult.success) {
			return failure('INVALID_STATE_TRANSITION', rejectResult.message || 'Failed to reject application.');
		}

		const update = { state: appStateManager.state, updated_at: new Date() };
		const updatedResult = await service.findOneAndUpdate({ id: applicationId, update });

		return updatedResult;
	} catch (error) {
		const message = `Unable to reject application with id: ${applicationId}`;
		logger.error(message);
		logger.error(error);
		return failure('SYSTEM_ERROR', message);
	}
};

export const submitRevision = async ({
	applicationId,
}: {
	applicationId: number;
}): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
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
			return failure('INVALID_STATE_TRANSITION', 'Application revision is already submitted.');
		}

		let submittedRevision;
		if (appStateManager.state === ApplicationStates.DAC_REVIEW) {
			submittedRevision = await appStateManager.submitDacRevision();
		} else {
			submittedRevision = await appStateManager.submitRepRevision();
		}

		if (!submittedRevision.success) {
			return failure('INVALID_STATE_TRANSITION', submittedRevision.message || 'Failed to submit application revision.');
		}

		return submittedRevision;
	} catch (error) {
		const message = `Unable to submit revision with applicationId: ${applicationId}`;

		logger.error(message, error);
		return failure('SYSTEM_ERROR', message);
	}
};

export const revokeApplication = async (
	applicationId: number,
): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
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

		const revokeApplicationResult = await appStateManager.revokeApproval();

		if (!revokeApplicationResult.success) {
			return revokeApplicationResult;
		}

		const update = { state: appStateManager.state, approved_at: new Date() };
		const updatedResult = await service.findOneAndUpdate({ id: applicationId, update });

		return updatedResult;
	} catch (error) {
		const message = `Unable to revoke application with id: ${applicationId}`;
		logger.error(message, error);
		return failure('SYSTEM_ERROR', message);
	}
};

export const requestApplicationRevisionsByDac = async ({
	applicationId,
	revisionData,
}: {
	applicationId: number;
	revisionData: RevisionRequestModel;
}): AsyncResult<JoinedApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);

		const result = await service.getApplicationById({ id: applicationId });

		if (!result.success) {
			return result;
		}

		const application = result.data;
		const appStateManager = new ApplicationStateManager(application);

		if (application.state !== ApplicationStates.DAC_REVIEW) {
			return failure('INVALID_STATE_TRANSITION', 'Application is not in the correct status for revisions.');
		}

		const revisionResult = await appStateManager.reviseDacReview();

		if (!revisionResult.success) {
			return revisionResult;
		}

		const revisionRequestResult = await service.createRevisionRequest({ applicationId, revisionData });

		if (!revisionRequestResult.success) {
			return revisionRequestResult;
		}

		return service.getApplicationWithContents({ id: applicationId });
	} catch (error) {
		logger.error(`Failed to request revisions for applicationId: ${applicationId}`, error);

		return failure('SYSTEM_ERROR', 'An error occurred while processing the request.');
	}
};

export const requestApplicationRevisionsByInstitutionalRep = async ({
	applicationId,
	revisionData,
}: {
	applicationId: number;
	revisionData: RevisionRequestModel;
}): AsyncResult<JoinedApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);
		const emailService = await emailSvc();

		const result = await service.getApplicationById({ id: applicationId });

		if (!result.success) {
			return result;
		}

		const application = result.data;
		const appStateManager = new ApplicationStateManager(application);

		if (application.state !== ApplicationStates.INSTITUTIONAL_REP_REVIEW) {
			return failure('INVALID_STATE_TRANSITION', 'Application is not in the correct status for revisions.');
		}

		const revisionResult = await appStateManager.reviseRepReview();

		if (!revisionResult.success) {
			return revisionResult;
		}

		const revisionRequestResult = await service.createRevisionRequest({ applicationId, revisionData });

		if (!revisionRequestResult.success) {
			return revisionRequestResult;
		}

		// Fetch the application with contents to send the email
		const resultContents = await service.getApplicationWithContents({ id: applicationId });

		if (!resultContents.success || !resultContents.data.contents) {
			return resultContents;
		}

		const { applicant_first_name, institutional_rep_first_name, institutional_rep_last_name, institutional_rep_email } =
			resultContents.data.contents;

		if (!institutional_rep_email) {
			const message = 'Error retrieving address to send email to';
			return failure('SYSTEM_ERROR', message);
		}
		await emailService.sendEmailApplicantRepRevisions({
			id: application.id,
			applicantName: applicant_first_name || 'N/A',
			institutionalRepFirstName: institutional_rep_first_name || 'N/A',
			institutionalRepLastName: institutional_rep_last_name || 'N/A',
			comments: revisionRequestResult.data,
			to: institutional_rep_email,
		});

		return service.getApplicationWithContents({ id: applicationId });
	} catch (error) {
		logger.error(`Failed to request revisions for applicationId: ${applicationId}`, error);

		return failure('SYSTEM_ERROR', 'An error occurred while processing the request.');
	}
};

export const submitApplication = async ({
	applicationId,
}: {
	applicationId: number;
}): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);
		const emailService = await emailSvc();

		// Fetch the application
		const result = await service.getApplicationById({ id: applicationId });

		if (!result.success) {
			return result;
		}

		const application = result.data;

		// Ensure the application can be submitted
		const appStateManager = new ApplicationStateManager(application);

		// Transition application to the next state (e.g., under review)
		let submissionResult: Result<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'>;

		if (appStateManager.state === ApplicationStates.DRAFT) {
			submissionResult = await appStateManager.submitDraft();
		} else if (appStateManager.state === ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED) {
			submissionResult = await appStateManager.approveRepReview();
		} else {
			submissionResult = await appStateManager.submitRepRevision();
		}

		if (!submissionResult.success) {
			return submissionResult;
		}

		// Fetch the application with contents to send the email
		const resultContents = await service.getApplicationWithContents({ id: applicationId });

		if (!resultContents.success || !resultContents.data.contents) {
			return result;
		}

		const { applicant_first_name, institutional_rep_first_name, institutional_rep_email } =
			resultContents.data.contents;

		if (!institutional_rep_email) {
			const message = 'Error retrieving address to send email to';
			return failure('SYSTEM_ERROR', message);
		}
		await emailService.sendEmailInstitutionalRepReviewRequest({
			id: application.id,
			to: institutional_rep_email,
			applicantName: applicant_first_name || 'N/A',
			repName: institutional_rep_first_name || 'N/A',
			submittedDate: submissionResult.data.created_at,
		});

		return submissionResult;
	} catch (error) {
		const message = `Unable to submit application with id: ${applicationId}`;
		logger.error(message, error);

		return failure('SYSTEM_ERROR', message);
	}
};

export const closeApplication = async ({
	applicationId,
}: {
	applicationId: number;
}): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
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
			return failure('INVALID_STATE_TRANSITION', 'Application is already closed.');
		}

		let closeResult: Result<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'>;

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
				return failure('INVALID_STATE_TRANSITION', `Cannot close application in state ${appStateManager.state}.`);
		}

		if (!closeResult.success) {
			return closeResult;
		}

		return closeResult;
	} catch (error) {
		const message = `Unable to close application with id: ${applicationId}`;
		logger.error(message, error);

		return failure('SYSTEM_ERROR', message);
	}
};

export const withdrawApplication = async ({
	applicationId,
}: {
	applicationId: number;
}): AsyncResult<ApplicationDTO, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);
		const result = await service.getApplicationById({ id: applicationId });

		if (!result.success) {
			return result;
		}

		const application = result.data;
		const appStateManager = new ApplicationStateManager(application);

		let withdrawalRequest;
		if (appStateManager.state === ApplicationStates.DAC_REVIEW) {
			withdrawalRequest = await appStateManager.withdrawDacReview();
		} else if (appStateManager.state === ApplicationStates.INSTITUTIONAL_REP_REVIEW) {
			withdrawalRequest = await appStateManager.withdrawRepReview();
		} else {
			return failure(
				'INVALID_STATE_TRANSITION',
				"The application cannot be withdrawn because it's in an inappropriate state. Only applications in DAC_REVIEW or INSTITUTIONAL_REP_REVIEW may be withdrawn.",
			);
		}

		if (!withdrawalRequest.success) {
			return withdrawalRequest;
		}

		const dtoFriendlyData = convertToBasicApplicationRecord(withdrawalRequest.data);

		return dtoFriendlyData;
	} catch (error) {
		const message = `Unable to withdraw application with id: ${applicationId}`;
		logger.error(message, error);

		return failure('SYSTEM_ERROR', message);
	}
};

export const getRevisions = async ({
	applicationId,
}: {
	applicationId: number;
}): AsyncResult<RevisionRequestModel[], 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);

		const revisionsResult = await service.getRevisions({ applicationId });

		if (!revisionsResult.success) {
			return revisionsResult;
		}

		return success(revisionsResult.data);
	} catch (error) {
		const message = `Failed to fetch revisions for applicationId: ${applicationId}`;
		logger.error(message, error);
		return failure('SYSTEM_ERROR', message);
	}
};
