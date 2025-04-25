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
import { convertToCollaboratorRecords } from '@/utils/aliases.ts';
import { failure, success, type AsyncResult } from '@/utils/results.js';
import {
	type CollaboratorDTO,
	type CollaboratorsResponseDTO,
	type ListCollaboratorResponse,
} from '@pcgl-daco/data-model';
import { ApplicationStateEvents, ApplicationStateManager } from './stateManager.ts';

const logger = BaseLogger.forModule('collaboratorsController');

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

	// Validate User is Applicant
	if (!(user_id === application.user_id)) {
		return failure('UNAUTHORIZED', 'Unauthorized, cannot create Collaborators');
	}

	if (!canEditResult.success) {
		return canEditResult;
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

	const result = convertToCollaboratorRecords(collaboratorsResult.data);

	return success(result);
};

/**
 * Delete a selected collaborator by ID
 * @param application_id - ID of related application record to associate with Collaborators
 * @param collaborator_email - Institutional Email of Collaborator to delete
 * @returns Success with Collaborator data record / Failure with Error.
 */
export const deleteCollaborator = async ({
	application_id,
	collaborator_email,
}: {
	application_id: number;
	collaborator_email: string;
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

		const appStateManager = new ApplicationStateManager(application);
		const canEdit = appStateManager._canPerformAction(ApplicationStateEvents.edit);

		if (!canEdit.success) {
			return failure('INVALID_STATE_TRANSITION', 'Cannot edit application in its current state');
		}

		const deleteResult = await collaboratorsRepo.deleteCollaborator({
			application_id,
			institutional_email: collaborator_email,
		});

		if (!deleteResult.success) {
			return deleteResult;
		}
		const result = convertToCollaboratorRecords(deleteResult.data);

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

		return success(convertToCollaboratorRecords(collaboratorsResult.data));
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
	collaboratorUpdates: CollaboratorDTO;
}): AsyncResult<
	CollaboratorsResponseDTO[],
	'NOT_FOUND' | 'SYSTEM_ERROR' | 'INVALID_STATE_TRANSITION' | 'FORBIDDEN' | 'DUPLICATE_RECORD'
> => {
	const database = getDbInstance();
	const collaboratorsRepo: CollaboratorsService = collaboratorsSvc(database);
	const applicationRepo: ApplicationService = applicationSvc(database);

	const applicationResult = await applicationRepo.getApplicationById({ id: application_id });

	if (!applicationResult.success) {
		return applicationResult;
	}

	const application = applicationResult.data;

	// Validate User is Applicant
	if (!(user_id === application.user_id)) {
		return failure('FORBIDDEN', 'User is not authorized to modify collaborators for this application.');
	}

	const appStateManager = new ApplicationStateManager(application);
	const canEdit = appStateManager._canPerformAction(ApplicationStateEvents.edit);

	if (!canEdit.success) {
		return failure('INVALID_STATE_TRANSITION', 'Cannot edit application in its current state');
	}

	const collaboratorsListResult = await collaboratorsRepo.listCollaborators(application.id);

	if (!collaboratorsListResult.success) {
		return collaboratorsListResult;
	}

	const { collaboratorInstitutionalEmail } = collaboratorUpdates;

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
		institutional_email: collaboratorInstitutionalEmail,
		application_id: application_id,
		collaborator,
	});

	if (!updateResult.success) {
		return updateResult;
	}

	const result = convertToCollaboratorRecords(updateResult.data);

	return success(result);
};
