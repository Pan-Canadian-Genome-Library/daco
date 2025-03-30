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
import BaseLogger from '@/logger.ts';
import { applicationSvc } from '@/service/applicationService.js';
import { collaboratorsSvc } from '@/service/collaboratorsService.js';
import { type ApplicationService, type CollaboratorModel, type CollaboratorsService } from '@/service/types.js';
import { failure, success, type AsyncResult } from '@/utils/results.js';
import { aliasCollaboratorRecords } from '@/utils/routes.ts';
import {
	type CollaboratorDTO,
	type CollaboratorUpdateRecord,
	type ListCollaboratorResponse,
} from '@pcgl-daco/data-model';
import type { CollaboratorsResponseDTO } from '@pcgl-daco/data-model/src/types.ts';
import { getApplicationById } from './applicationController.ts';
import { ApplicationStateEvents, ApplicationStateManager } from './stateManager.ts';

const logger = BaseLogger.forModule('coillaboratorsController');

/**
 * Creates a new collaborator and returns the created data.
 * @param application_id - ID of related application record to associate with Collaborators
 * @param user_id - ID of Applicant updating the application
 * @param collaborators - Array of new Collaborators to create
 * @returns Success with Collaborator data array / Failure with Error.
 */
export const createCollaborators = async ({
	application_id,
	user_id,
	collaborators,
}: {
	application_id: number;
	user_id: string;
	collaborators: CollaboratorDTO[];
}): AsyncResult<
	ListCollaboratorResponse,
	'UNAUTHORIZED' | 'SYSTEM_ERROR' | 'NOT_FOUND' | 'INVALID_STATE_TRANSITION' | 'DUPLICATE_RECORD'
> => {
	const database = getDbInstance();
	const collaboratorsRepo: CollaboratorsService = collaboratorsSvc(database);
	const applicationRepo: ApplicationService = applicationSvc(database);

	const applicationResult = await applicationRepo.getApplicationById({ id: application_id });

	if (!applicationResult.success) {
		return applicationResult;
	}

	const application = applicationResult.data;
	const { edit } = ApplicationStateEvents;
	const canEditResult = new ApplicationStateManager(application)._canPerformAction(edit);

	// TODO: Add Real Auth
	// Validate User is Applicant
	if (!(user_id === application.user_id)) {
		return failure('UNAUTHORIZED', 'Unauthorized, cannot create Collaborators');
	}

	if (!canEditResult.success) {
		return canEditResult;
	}

	const hasDuplicateRecords = collaborators.some((collaborator, index) => {
		// TODO: duplicate for collaborators should be by application + email
		const matchingRecord = collaborators.find(
			(record, searchIndex) =>
				searchIndex !== index &&
				record.collaboratorFirstName === collaborator.collaboratorFirstName &&
				record.collaboratorLastName === collaborator.collaboratorLastName &&
				record.collaboratorInstitutionalEmail === collaborator.collaboratorInstitutionalEmail &&
				record.collaboratorPositionTitle === collaborator.collaboratorPositionTitle,
		);

		return matchingRecord;
	});

	if (hasDuplicateRecords) {
		// TODO: List the duplicate records.
		return failure('DUPLICATE_RECORD', `Cannot create duplicate collaborator records.`);
	}

	const newCollaborators: CollaboratorModel[] = collaborators.map((data) => ({
		first_name: data.collaboratorFirstName,
		middle_name: data.collaboratorMiddleName,
		last_name: data.collaboratorLastName,
		suffix: data.collaboratorSuffix,
		position_title: data.collaboratorPositionTitle,
		institutional_email: data.collaboratorInstitutionalEmail,
		application_id,
	}));

	const collaboratorsResult = await collaboratorsRepo.createCollaborators({
		newCollaborators,
	});

	if (!collaboratorsResult.success) {
		return collaboratorsResult;
	}

	const result = aliasCollaboratorRecords(collaboratorsResult.data);

	return success(result);
};

/**
 * Delete a selected collaborator by ID
 * @param application_id - ID of related application record to associate with Collaborators
 * @param user_id - ID of Applicant updating the application
 * @param collaborator_id - ID of Collaborator to delete
 * @returns Success with Collaborator data record / Failure with Error.
 */
export const deleteCollaborator = async ({
	application_id,
	id,
}: {
	application_id: number;
	id: number;
}): AsyncResult<CollaboratorsResponseDTO[], 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const collaboratorsRepo: CollaboratorsService = collaboratorsSvc(database);
		const applicationRepo: ApplicationService = applicationSvc(database);

		const applicationResult = await applicationRepo.getApplicationById({ id: application_id });

		if (!applicationResult.success) {
			return applicationResult;
		}

		const application = applicationResult.data;

		// TODO: Valid states for actions should be handled through the appStateManager
		if (!(application.state === 'DRAFT')) {
			return failure('INVALID_STATE_TRANSITION', `Can only add Collaborators when Application is in state DRAFT`);
		}

		const deleteResult = await collaboratorsRepo.deleteCollaborator({
			id,
		});

		if (!deleteResult.success) {
			return deleteResult;
		}
		const result = aliasCollaboratorRecords(deleteResult.data);

		return success(result);
	} catch (error) {
		return failure('SYSTEM_ERROR', 'Unexpected error.');
	}
};

/*
 * Lists all Collaborators for a given application
 * @param application_id - ID of related application record to associate with Collaborators
 * @param collaborators - Array of new Collaborators to create
 * @returns Success with Collaborator data array / Failure with Error.
 */
export const listCollaborators = async ({
	applicationId,
}: {
	applicationId: number;
}): AsyncResult<CollaboratorsResponseDTO[], 'SYSTEM_ERROR'> => {
	try {
		const database = getDbInstance();
		const collaboratorsRepo: CollaboratorsService = collaboratorsSvc(database);

		const collaboratorsResult = await collaboratorsRepo.listCollaborators(applicationId);

		if (!collaboratorsResult.success) {
			return collaboratorsResult;
		}

		return success(aliasCollaboratorRecords(collaboratorsResult.data));
	} catch (error) {
		logger.error(`Unable to list collaborators for application with id: ${applicationId}`, error);
		return failure('SYSTEM_ERROR', 'Unexpected error.');
	}
};

/**
 * Update a selected collaborator by ID
 * @param application_id - ID of related application record to associate with Collaborators
 * @param user_id - ID of Applicant updating the application
 * @param collaborators - Collaborator record with updated properties
 * @returns Success with Collaborator data record / Failure with Error.
 */
export const updateCollaborator = async ({
	application_id,
	user_id,
	collaboratorUpdates,
}: {
	application_id: number;
	user_id: string;
	collaboratorUpdates: CollaboratorUpdateRecord;
}): AsyncResult<
	CollaboratorsResponseDTO[],
	'NOT_FOUND' | 'SYSTEM_ERROR' | 'INVALID_STATE_TRANSITION' | 'FORBIDDEN'
> => {
	const database = getDbInstance();
	const collaboratorsRepo: CollaboratorsService = collaboratorsSvc(database);

	const applicationResult = await getApplicationById({ applicationId: application_id });

	if (!applicationResult.success) {
		return applicationResult;
	}

	const application = applicationResult.data;

	// Validate User is Applicant
	if (!(user_id === application.userId)) {
		return failure('FORBIDDEN', 'User is not authorized to modify collaborators for this application.');
	}

	// TODO: should use application state manager
	if (!(application.state === 'DRAFT')) {
		return failure('INVALID_STATE_TRANSITION', `Can only edit collaborators when application is in state DRAFT`);
	}

	const { id } = collaboratorUpdates;

	const collaborator: Partial<CollaboratorModel> = {
		first_name: collaboratorUpdates.collaboratorFirstName,
		middle_name: collaboratorUpdates.collaboratorMiddleName,
		last_name: collaboratorUpdates.collaboratorLastName,
		suffix: collaboratorUpdates.collaboratorSuffix,
		position_title: collaboratorUpdates.collaboratorPositionTitle,
		institutional_email: collaboratorUpdates.collaboratorInstitutionalEmail,
		profile_url: collaboratorUpdates.collaboratorResearcherProfileURL,
		collaborator_type: collaboratorUpdates.collaboratorType,
		application_id,
	};

	const updateResult = await collaboratorsRepo.updateCollaborator({
		id,
		collaborator,
	});

	if (!updateResult.success) {
		return updateResult;
	}

	const result = aliasCollaboratorRecords(updateResult.data);

	return success(result);
};
