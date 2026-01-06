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

import cron from 'node-cron';

import type {
	ApplicationDTO,
	ApplicationHistoryResponseData,
	ApplicationResponseData,
	ApproveApplication,
	DacCommentRecord,
	RevisionsDTO,
} from '@pcgl-daco/data-model';
import { ApplicationStates } from '@pcgl-daco/data-model';
import type { SectionRoutesValues, UpdateEditApplicationRequest } from '@pcgl-daco/validation';

import { getEmailConfig } from '@/config/emailConfig.ts';
import { getDbInstance } from '@/db/index.js';
import BaseLogger from '@/logger.js';
import { type ApplicationListRequest } from '@/routes/types.js';
import { applicationActionSvc } from '@/service/applicationActionService.ts';
import { applicationSvc } from '@/service/applicationService.js';
import { collaboratorsSvc } from '@/service/collaboratorsService.ts';
import { emailSvc } from '@/service/email/emailsService.ts';
import { filesSvc } from '@/service/fileService.ts';
import { pdfService, TrademarkValues } from '@/service/pdf/pdfService.ts';
import { signatureService as signatureSvc } from '@/service/signatureService.ts';
import {
	type ApplicationRecord,
	type ApplicationService,
	type CollaboratorsService,
	type FilesService,
	type PDFService,
	type RevisionRequestModel,
	type SignatureService,
} from '@/service/types.js';
import {
	convertToApplicationContentsRecord,
	convertToApplicationHistoryRecord,
	convertToApplicationRecord,
	convertToBasicApplicationRecord,
	convertToCollaboratorRecords,
	convertToFileRecord,
	convertToSignatureRecord,
} from '@/utils/aliases.js';
import { failure, type AsyncResult, type Result } from '@/utils/results.js';
import { validateRevisedFields } from '@/utils/validation.ts';
import { ApplicationStateEvents, ApplicationStateManager } from './stateManager.js';

const logger = BaseLogger.forModule('applicationController');

/**
 * Creates a new application and returns the created data.
 * @param user_id - The ID of the user requesting the creation of the application.
 * @returns Success with Application data / Failure with Error.
 */
export const createApplication = async ({ user_id }: { user_id: string }): AsyncResult<ApplicationDTO> => {
	const database = getDbInstance();
	const applicationRepo: ApplicationService = applicationSvc(database);

	const result = await applicationRepo.createApplication({ user_id });

	if (!result.success) {
		return result;
	}

	cron.schedule('0 0 */7 * *', () => {
		// if still in draft after 7 days -> send email reminder
		console.log('\nRunning Every 7th Day\n');
	});

	cron.schedule('0 0 */30 * *', () => {
		// close after 30 days
		console.log('\nRunning Every 7th Day\n');
	});

	const applicationDTO = convertToBasicApplicationRecord(result.data);

	return applicationDTO;
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
}): AsyncResult<ApplicationResponseData, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	const database = getDbInstance();
	const applicationRepo: ApplicationService = applicationSvc(database);

	const result = await applicationRepo.getApplicationById({ id });

	if (!result.success) {
		return result;
	}

	const application = result.data;
	const { edit } = ApplicationStateEvents;

	/**
	 * FIXME: This does not prevent editing of fields that have already been approved. This needs to be added.
	 */
	const canEditResult = new ApplicationStateManager(application)._canPerformAction(edit);

	if (!canEditResult.success) {
		const message = `Cannot update application with state ${application.state}`;
		logger.error(message);
		return failure('INVALID_STATE_TRANSITION', message);
	}

	/**
	 * If the state is INSTITUTIONAL_REP_REVISION_REQUESTED or DAC_REVISIONS_REQUESTED, that means the fields sent
	 * must be belong to the relevant sections that the Rep or DAC has requested revisions for.
	 */
	if (
		application.state === ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED ||
		application.state === ApplicationStates.DAC_REVISIONS_REQUESTED
	) {
		const revisionsResult = await getRevisions({ applicationId: id });
		if (!revisionsResult.success) {
			return revisionsResult;
		}

		if (!revisionsResult.data[0]) {
			const message = `Cannot verify most recent application revision data`;

			return failure('SYSTEM_ERROR', message);
		}

		// If the application state is in revision, then we need to verify that only fields that require revision has been sent to the backend
		if (!validateRevisedFields(update, revisionsResult.data[0])) {
			const message = `Upload data contains illegal fields`;

			return failure('SYSTEM_ERROR', message);
		}
	}

	const formattedResult = convertToApplicationContentsRecord(update);

	if (!formattedResult.success) {
		return formattedResult;
	}

	const editResult = await applicationRepo.editApplication({ id, update: formattedResult.data });

	if (!editResult.success) {
		return editResult;
	}

	const joinedApplicationDTO = convertToApplicationRecord(editResult.data);

	return joinedApplicationDTO;
};

/**
 *
 * @param userId - user ID
 * @param state - application state
 * @param sort - sorting options
 * @param page - page offset
 * @param pageSize - page limit
 * @param isDACMember - Boolean which represents if the user is a DAC Member (they can see all applications)
 * @param isApplicantView - Boolean which represents if the user is an applicant (they can only see their own applications)
 * @param search - text to search
 * @returns Success with list of Applications / Failure with Error
 */
export const getAllApplications = async ({
	userId,
	state,
	sort,
	page,
	pageSize,
	search,
	isDAC,
	isApplicantView,
}: ApplicationListRequest) => {
	const database = getDbInstance();
	const applicationRepo: ApplicationService = applicationSvc(database);

	if (isDAC) {
		//If we set UserID to undefined, it will not add in the where clause for limiting by userID.
		userId = undefined;
	}

	const result = await applicationRepo.listApplications({
		user_id: userId,
		state,
		sort,
		page,
		pageSize,
		search,
		isApplicantView,
	});

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
 * Gets Action History for a corresponding application ID
 * @param applicationId - The ID of the application within the database.
 * @returns Success with the history of the application / Failure with Error.
 */
export const getApplicationHistory = async ({
	applicationId,
}: {
	applicationId: number;
}): AsyncResult<ApplicationHistoryResponseData, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	const database = getDbInstance();
	const applicationActionRepo = applicationActionSvc(database);

	const result = await applicationActionRepo.listActions({ application_id: applicationId });
	if (!result.success) return result;

	const aliasedResult = convertToApplicationHistoryRecord(result.data);

	return aliasedResult;
};

/**
 * Generates a PDF with the application data provided in the various application tables.
 * @param applicationId - The ID of the application within the database.
 * @returns Success with a Buffer containing the PDF / Failure with Error.
 */
export const createApplicationPDF = async ({
	applicationId,
	trademark,
}: {
	applicationId: number;
	trademark?: TrademarkValues;
}): AsyncResult<Uint8Array<ArrayBufferLike>, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	const database = getDbInstance();
	const applicationService: ApplicationService = applicationSvc(database);
	const signatureService: SignatureService = signatureSvc(database);
	const collaboratorsService: CollaboratorsService = collaboratorsSvc(database);
	const fileService: FilesService = filesSvc(database);

	const pdfRepo: PDFService = pdfService();

	const applicationContents = await applicationService.getApplicationWithContents({ id: applicationId });

	if (!applicationContents.success) {
		return applicationContents;
	}

	const signatureContents = await signatureService.getApplicationSignature({ application_id: applicationId });
	if (!signatureContents.success) {
		return signatureContents;
	}

	const collaboratorsContents = await collaboratorsService.listCollaborators(applicationId);
	if (!collaboratorsContents.success) {
		return collaboratorsContents;
	}

	const ethicsLetterID = applicationContents.data.contents?.ethics_letter;

	if (!ethicsLetterID) {
		return failure('SYSTEM_ERROR', 'No ethics approval or exemption file was found, unable to generate PDF.');
	}

	const fileContents = await fileService.getFileById({ fileId: ethicsLetterID });

	if (!fileContents.success) {
		return failure('NOT_FOUND', 'Unable to retrieve ethics approval or exemption file, unable to generate PDF.');
	}

	// If we are creating PDF, check to see if a current pdf exists. If yes then remove it then proceed
	const signedPDFId = applicationContents.data.contents?.signed_pdf;
	if (signedPDFId) {
		const lastPdf = await fileService.deleteFileById({ fileId: signedPDFId });
		if (!lastPdf.success) {
			return failure('SYSTEM_ERROR', 'Unable to remove previous application PDF file, unable to generate PDF');
		}
	}

	const aliasedApplicationContents = convertToApplicationRecord(applicationContents.data);
	const aliasedSignatureContents = convertToSignatureRecord(signatureContents.data);
	const aliasedCollaboratorsContents = convertToCollaboratorRecords(collaboratorsContents.data);
	const aliasedFileContents = convertToFileRecord(fileContents.data);

	if (
		!aliasedApplicationContents.success ||
		!aliasedSignatureContents.success ||
		!aliasedFileContents.success ||
		!aliasedFileContents.success
	) {
		return failure('SYSTEM_ERROR', 'Error aliasing data records. Unknown keys.');
	}
	/**
	 * This is a bit odd because we're using the DTO aliases while passing back to the service (usually its the opposite),
	 * however, given this service is essentially running a React render, we need to.
	 */
	const renderedPDF = await pdfRepo.renderPCGLApplicationPDF({
		applicationContents: aliasedApplicationContents.data,
		signatureContents: aliasedSignatureContents.data,
		collaboratorsContents: aliasedCollaboratorsContents,
		fileContents: aliasedFileContents.data,
		filename: `PCGL-${applicationContents.data.id} - Application for Access to PCGL Controlled Data`,
		trademark,
	});

	if (!renderedPDF.success) {
		return renderedPDF;
	}

	const createFileRecord = await fileService.createFile({
		file: {
			originalFilename: `${`PCGL_DACO_Application-${applicationContents.data.id}_${Date.now().toString()}`}.pdf`,
			filepath: '#', //This doesn't matter as it's not used in the createFile method, however it required by the Formidable.File Type
		},
		application: applicationContents.data,
		readFrom: 'buffer',
		contentsBuffer: Buffer.from(renderedPDF.data),
		type: 'SIGNED_APPLICATION',
	});

	if (!createFileRecord.success) {
		return createFileRecord;
	}

	const updatedApplicationRecord = await applicationService.editApplication({
		id: applicationId,
		update: {
			signed_pdf: createFileRecord.data.id,
		},
	});

	if (!updatedApplicationRecord.success) {
		return updatedApplicationRecord;
	}

	return renderedPDF;
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
	userName,
}: ApproveApplication): AsyncResult<ApplicationDTO, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		// Fetch application
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);
		const result = await service.getApplicationById({ id: applicationId });
		const emailService = await emailSvc();
		const collaboratorsService = await collaboratorsSvc(database);

		if (!result.success) {
			return result;
		}

		const application = result.data;

		const appStateManager = new ApplicationStateManager(application);

		if (appStateManager.state === ApplicationStates.APPROVED) {
			return failure('INVALID_STATE_TRANSITION', 'Application is already approved.');
		}

		const approvalResult = await appStateManager.approveDacReview(userName);

		if (!approvalResult.success) {
			return failure('SYSTEM_ERROR', approvalResult.message);
		}

		const update = { state: appStateManager.state, approved_at: new Date() };
		const updatedResult = await service.findOneAndUpdate({ id: applicationId, update });

		if (!updatedResult.success) {
			return updatedResult;
		}

		const updatedApplication = await service.getApplicationById({ id: applicationId });

		if (!updatedApplication.success) {
			return updatedApplication;
		}

		const dtoFriendlyData = convertToBasicApplicationRecord(updatedApplication.data);

		if (!dtoFriendlyData.success) {
			return dtoFriendlyData;
		}

		// Fetch the application with contents to send the email
		const resultContents = await service.getApplicationWithContents({ id: applicationId });

		if (!resultContents.success || !resultContents.data.contents) {
			logger.error(`Unable to retrieve information to send approval email: ${applicationId}`, resultContents);
			return dtoFriendlyData;
		}

		const { applicant_first_name, applicant_institutional_email } = resultContents.data.contents;

		emailService.sendEmailApproval({
			id: application.id,
			to: applicant_institutional_email,
			name: applicant_first_name || 'N/A',
		});

		const collaboratorResponse = await collaboratorsService.listCollaborators(application.id);

		if (!collaboratorResponse.success) {
			logger.error(
				`Unable to retrieve information to send approval email to collaborators: ${applicationId}`,
				collaboratorResponse,
			);
			return dtoFriendlyData;
		}

		collaboratorResponse.data.forEach((collab) => {
			emailService.sendEmailApproval({
				id: application.id,
				to: collab.institutional_email,
				name: collab.first_name || 'N/A',
			});
		});

		return dtoFriendlyData;
	} catch (error) {
		logger.error(`Unable to approve application with id: ${applicationId}`, error);
		return failure('SYSTEM_ERROR', 'An unexpected error occurred attempting to approve application.');
	}
};

export const dacRejectApplication = async ({
	applicationId,
	rejectionReason,
	userName,
}: {
	applicationId: number;
	rejectionReason: string;
	userName: string;
}): AsyncResult<ApplicationDTO, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		// Fetch application
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);
		const result = await service.getApplicationById({ id: applicationId });
		const emailService = await emailSvc();

		if (!result.success) {
			return result;
		}

		const application = result.data;

		const appStateManager = new ApplicationStateManager(application);

		const rejectResult = await appStateManager.rejectDacReview(userName);

		if (!rejectResult.success) {
			return failure('INVALID_STATE_TRANSITION', rejectResult.message || 'Failed to reject application.');
		}

		const update = { state: appStateManager.state, updated_at: new Date() };
		const updatedResult = await service.findOneAndUpdate({ id: applicationId, update });

		if (!updatedResult.success) {
			return updatedResult;
		}

		const dtoFriendlyData = convertToBasicApplicationRecord(updatedResult.data);

		if (!dtoFriendlyData.success) {
			return dtoFriendlyData;
		}

		// Fetch the application with contents to send the email
		const resultContents = await service.getApplicationWithContents({ id: applicationId });

		if (!resultContents.success || !resultContents.data.contents) {
			logger.error(`Unable to retrieve information to send reject email: ${applicationId}`, resultContents);
			return dtoFriendlyData;
		}

		const { applicant_institutional_email, applicant_first_name } = resultContents.data.contents;

		emailService.sendEmailReject({
			id: application.id,
			to: applicant_institutional_email,
			name: applicant_first_name || 'N/A',
			comment: rejectionReason,
		});

		return dtoFriendlyData;
	} catch (error) {
		const message = `Unable to reject application with id: ${applicationId}`;
		logger.error(message);
		logger.error(error);
		return failure('SYSTEM_ERROR', message);
	}
};

export const submitRevision = async ({
	applicationId,
	userName,
}: {
	applicationId: number;
	userName: string;
}): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		// Fetch application
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);
		const result = await service.getApplicationById({ id: applicationId });
		const emailService = await emailSvc();

		if (!result.success) {
			return result;
		}

		const application = result.data;

		const appStateManager = new ApplicationStateManager(application);

		if (
			appStateManager.state === ApplicationStates.DAC_REVIEW ||
			appStateManager.state === ApplicationStates.INSTITUTIONAL_REP_REVIEW
		) {
			return failure('INVALID_STATE_TRANSITION', 'Application is already submitted for revisions.');
		}

		let submittedRevision;
		if (appStateManager.state === ApplicationStates.DAC_REVISIONS_REQUESTED) {
			submittedRevision = await appStateManager.submitDacRevision(userName);
		} else {
			submittedRevision = await appStateManager.submitRepRevision(userName);
		}

		if (!submittedRevision.success) {
			return failure('INVALID_STATE_TRANSITION', submittedRevision.message || 'Failed to submit application revision.');
		}

		// Fetch the application with contents to send the email
		const resultContents = await service.getApplicationWithContents({ id: applicationId });

		if (!resultContents.success || !resultContents.data.contents) {
			logger.error(
				`Unable to retrieve information to send submitted revisions email: ${applicationId}`,
				resultContents,
			);
			return submittedRevision;
		}

		const { applicant_first_name, institutional_rep_email, institutional_rep_first_name } =
			resultContents.data.contents;

		if (result.data.state === ApplicationStates.DAC_REVIEW) {
			const {
				email: { dacAddress },
			} = getEmailConfig;

			emailService.sendEmailDacForSubmittedRevisions({
				id: application.id,
				to: dacAddress,
				applicantName: applicant_first_name || 'N/A',
				submittedDate: new Date(),
			});
		} else {
			// TODO: Theres no email template for specifically to notify institutional rep for revisions similar to DAC
			emailService.sendEmailInstitutionalRepForReview({
				id: application.id,
				to: institutional_rep_email,
				repName: institutional_rep_first_name || 'N/A',
				applicantName: applicant_first_name || 'N/A',
				submittedDate: new Date(),
			});
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
	isDACMember: boolean,
	revokeReason: string,
	userName: string,
): AsyncResult<ApplicationDTO, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		// Fetch application
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);
		const result = await service.getApplicationById({ id: applicationId });
		const emailService = await emailSvc();

		if (!result.success) {
			return result;
		}

		const application = result.data;

		const appStateManager = new ApplicationStateManager(application);

		const revokeApplicationResult = await appStateManager.revokeApproval(userName);

		if (!revokeApplicationResult.success) {
			return revokeApplicationResult;
		}

		const update = { state: appStateManager.state, approved_at: new Date() };
		const updatedResult = await service.findOneAndUpdate({ id: applicationId, update });

		if (!updatedResult.success) {
			return updatedResult;
		}

		const applicationDTO = convertToBasicApplicationRecord(updatedResult.data);
		const applicationWithContents = await service.getApplicationWithContents({ id: applicationId });

		if (!applicationWithContents.success) {
			logger.error(`Unable to retrieve information to send revoke email: ${applicationId}`);
			return applicationDTO;
		}

		emailService.sendEmailApplicantRevoke({
			id: application.id,
			to: applicationWithContents.data.contents?.applicant_institutional_email,
			name: `${applicationWithContents.data.contents?.applicant_first_name} ${applicationWithContents.data.contents?.applicant_last_name}`,
			comment: revokeReason,
			dacRevoked: isDACMember,
		});

		return applicationDTO;
	} catch (error) {
		const message = `Unable to revoke application with id: ${applicationId}`;
		logger.error(message, error);
		return failure('SYSTEM_ERROR', message);
	}
};

export const requestApplicationRevisionsByDac = async ({
	applicationId,
	revisionData,
	userName,
}: {
	applicationId: number;
	revisionData: RevisionRequestModel;
	userName: string;
}): AsyncResult<ApplicationDTO, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const applicationService = applicationSvc(database);
		const emailService = await emailSvc();
		const result = await applicationService.getApplicationById({ id: applicationId });

		if (!result.success) {
			return result;
		}

		const application = result.data;
		const appStateManager = new ApplicationStateManager(application);

		if (application.state !== ApplicationStates.DAC_REVIEW) {
			return failure(
				'INVALID_STATE_TRANSITION',
				'Application is not in the correct status for revisions. Must be in DAC_REVIEW.',
			);
		}

		const actionResult = await appStateManager.reviseDacReview(userName);

		if (!actionResult.success) {
			return actionResult;
		}

		const revisionRequestResult = await applicationService.createRevisionRequest({ applicationId, revisionData });

		if (!revisionRequestResult.success) {
			return revisionRequestResult;
		}

		const updateAction = await applicationService.updateApplicationActionRecordRevisionId({
			actionId: actionResult.data.actionId,
			revisionId: revisionRequestResult.data.id,
		});

		if (!updateAction.success) {
			return updateAction;
		}

		const updatedApplication = await applicationService.getApplicationById({ id: applicationId });

		if (!updatedApplication.success) {
			return updatedApplication;
		}

		const aliasResult = convertToBasicApplicationRecord(updatedApplication.data);

		if (!aliasResult.success) {
			return aliasResult;
		}

		// Fetch the application with contents to send the email
		const resultContents = await applicationService.getApplicationWithContents({ id: applicationId });

		if (!resultContents.success || !resultContents.data.contents) {
			logger.error(
				`Unable to retrieve information to send dac revisions requested email: ${applicationId}`,
				resultContents,
			);
			return aliasResult;
		}

		const { applicant_first_name } = resultContents.data.contents;
		const {
			email: { dacAddress },
		} = getEmailConfig;

		emailService.sendEmailApplicantDacRevisions({
			id: application.id,
			to: dacAddress,
			applicantName: applicant_first_name || 'N/A',
			comments: revisionRequestResult.data,
		});

		return aliasResult;
	} catch (error) {
		logger.error(`Failed to request revisions for applicationId: ${applicationId}`, error);
		return failure('SYSTEM_ERROR', 'An error occurred while processing the request.');
	}
};

export const requestApplicationRevisionsByInstitutionalRep = async ({
	applicationId,
	revisionData,
	userName,
}: {
	applicationId: number;
	revisionData: RevisionRequestModel;
	userName: string;
}): AsyncResult<ApplicationDTO, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const applicationService = applicationSvc(database);
		const emailService = await emailSvc();

		const result = await applicationService.getApplicationById({ id: applicationId });

		if (!result.success) {
			return result;
		}

		const application = result.data;
		const appStateManager = new ApplicationStateManager(application);

		if (application.state !== ApplicationStates.INSTITUTIONAL_REP_REVIEW) {
			return failure(
				'INVALID_STATE_TRANSITION',
				'Application is not in the correct status for revisions. Must be in INSTITUTIONAL_REP_REVIEW.',
			);
		}

		const actionResult = await appStateManager.reviseRepReview(userName);
		if (!actionResult.success) {
			return actionResult;
		}

		const revisionRequestResult = await applicationService.createRevisionRequest({ applicationId, revisionData });

		if (!revisionRequestResult.success) {
			return revisionRequestResult;
		}

		const updateAction = await applicationService.updateApplicationActionRecordRevisionId({
			actionId: actionResult.data.actionId,
			revisionId: revisionRequestResult.data.id,
		});

		if (!updateAction.success) {
			return updateAction;
		}

		// Fetch the application with contents to send the email
		const resultContents = await applicationService.getApplicationWithContents({ id: applicationId });

		if (!resultContents.success) {
			return resultContents;
		}

		const updatedApplication = await applicationService.getApplicationById({ id: applicationId });

		if (!updatedApplication.success) {
			return updatedApplication;
		}

		const aliasResult = convertToBasicApplicationRecord(updatedApplication.data);

		if (!aliasResult.success) {
			return aliasResult;
		}

		if (!resultContents.success || !resultContents.data.contents) {
			logger.error(
				`Unable to retrieve information to send institutional rep revisions request email: ${applicationId}`,
				resultContents,
			);
			return aliasResult;
		}

		const { applicant_first_name, institutional_rep_first_name, institutional_rep_last_name, institutional_rep_email } =
			resultContents.data.contents;

		emailService.sendEmailApplicantRepRevisions({
			id: application.id,
			to: institutional_rep_email,
			applicantName: applicant_first_name || 'N/A',
			institutionalRepFirstName: institutional_rep_first_name || 'N/A',
			institutionalRepLastName: institutional_rep_last_name || 'N/A',
			comments: revisionRequestResult.data,
		});

		return aliasResult;
	} catch (error) {
		logger.error(`Failed to request revisions for applicationId: ${applicationId}`, error);

		return failure('SYSTEM_ERROR', 'An error occurred while processing the request.');
	}
};

export const submitApplication = async ({
	applicationId,
	userName,
}: {
	applicationId: number;
	userName: string;
}): AsyncResult<ApplicationDTO, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
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
			submissionResult = await appStateManager.submitDraft(userName);
		} else if (appStateManager.state === ApplicationStates.INSTITUTIONAL_REP_REVIEW) {
			submissionResult = await appStateManager.approveRepReview(userName);
		} else {
			submissionResult = await appStateManager.submitRepRevision(userName);
		}

		if (!submissionResult.success) {
			return submissionResult;
		}

		const applicationDTO = convertToBasicApplicationRecord(submissionResult.data);

		// Fetch the application with contents to send the email
		const resultContents = await service.getApplicationWithContents({ id: applicationId });

		if (!resultContents.success || !resultContents.data.contents) {
			logger.error(`Unable to retrieve information to send submission email: ${applicationId}`, resultContents);
			return applicationDTO;
		}

		const {
			applicant_first_name,
			applicant_last_name,
			institutional_rep_first_name,
			institutional_rep_last_name,
			institutional_rep_email,
			applicant_institutional_email,
		} = resultContents.data.contents;

		if (result.data.state === ApplicationStates.DRAFT) {
			//  email to institutional rep for review
			emailService.sendEmailInstitutionalRepForReview({
				id: application.id,
				to: institutional_rep_email,
				applicantName: `${applicant_first_name} ${applicant_last_name}` || 'N/A',
				repName: `${institutional_rep_first_name} ${institutional_rep_last_name}` || 'N/A',
				submittedDate: new Date(),
			});
		} else if (result.data.state === ApplicationStates.INSTITUTIONAL_REP_REVIEW) {
			const {
				email: { dacAddress },
			} = getEmailConfig;

			// Send email to DAC for review
			emailService.sendEmailDacForReview({
				id: application.id,
				to: dacAddress,
				applicantName: applicant_first_name || 'N/A',
				submittedDate: new Date(),
			});

			//  send email to applicant that application is submitted to DAC
			emailService.sendEmailApplicantApplicationSubmitted({
				id: application.id,
				to: applicant_institutional_email,
				name: applicant_first_name || 'N/A',
			});
		}
		return applicationDTO;
	} catch (error) {
		const message = `Unable to submit application with id: ${applicationId}`;
		logger.error(message, error);

		return failure('SYSTEM_ERROR', message);
	}
};

export const closeApplication = async ({
	applicationId,
	userName,
}: {
	applicationId: number;
	userName: string;
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

		// Check if application is already closed
		if (appStateManager.state === ApplicationStates.CLOSED) {
			return failure('INVALID_STATE_TRANSITION', 'Application is already closed.');
		}

		let closeResult: Result<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'>;

		switch (appStateManager.state) {
			case ApplicationStates.DRAFT:
				closeResult = await appStateManager.closeDraft(userName);
				break;
			case ApplicationStates.INSTITUTIONAL_REP_REVIEW:
				closeResult = await appStateManager.closeRepReview(userName);
				break;
			case ApplicationStates.DAC_REVIEW:
				closeResult = await appStateManager.closeDacReview(userName);
				break;
			default:
				return failure('INVALID_STATE_TRANSITION', `Cannot close application in state ${appStateManager.state}.`);
		}

		if (!closeResult.success) {
			return closeResult;
		}

		const applicationDTO = convertToBasicApplicationRecord(closeResult.data);

		return applicationDTO;
	} catch (error) {
		const message = `Unable to close application with id: ${applicationId}`;
		logger.error(message, error);

		return failure('SYSTEM_ERROR', message);
	}
};

export const withdrawApplication = async ({
	applicationId,
	userName,
}: {
	applicationId: number;
	userName: string;
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
			withdrawalRequest = await appStateManager.withdrawDacReview(userName);
		} else if (appStateManager.state === ApplicationStates.INSTITUTIONAL_REP_REVIEW) {
			withdrawalRequest = await appStateManager.withdrawRepReview(userName);
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
}): AsyncResult<RevisionsDTO[], 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);

		const revisionsResult = await service.getRevisions({ applicationId });

		if (!revisionsResult.success) {
			return revisionsResult;
		}

		return revisionsResult;
	} catch (error) {
		const message = `Failed to fetch revisions for applicationId: ${applicationId}`;
		logger.error(message, error);
		return failure('SYSTEM_ERROR', message);
	}
};

export const submitDacComment = async ({
	applicationId,
	message,
	userId,
	userName,
	section,
	toDacChair,
}: {
	applicationId: number;
	message: string;
	userId: string;
	userName: string;
	section: SectionRoutesValues;
	toDacChair: boolean;
}): AsyncResult<DacCommentRecord, 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);

		const result = await service.createDacComment({ applicationId, message, userId, userName, section, toDacChair });

		return result;
	} catch (error) {
		const message = `Failed to submit dac comment for applicationId: ${applicationId}`;
		logger.error(message, error);
		return failure('SYSTEM_ERROR', message);
	}
};

export const getDacComments = async ({
	applicationId,
	section,
	isDac,
}: {
	applicationId: number;
	section: string;
	isDac: boolean;
}): AsyncResult<DacCommentRecord[], 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const service: ApplicationService = applicationSvc(database);

		const result = await service.getDacComment({ applicationId, section, isDac });

		return result;
	} catch (error) {
		const message = `Failed to retrieve dac comments for applicationId: ${applicationId} on section: ${section}`;
		logger.error(message, error);
		return failure('SYSTEM_ERROR', message);
	}
};
