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
import { applicationSvc } from '@/service/applicationService.js';
import { collaboratorsSvc } from '@/service/collaboratorsService.js';
import { type ApplicationService, type CollaboratorModel, type CollaboratorsService } from '@/service/types.js';
import { failure } from '@/utils/results.js';
import { CollaboratorDTO, CollaboratorUpdateRecord } from '@pcgl-daco/data-model';

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
}) => {
	const database = getDbInstance();
	const collaboratorsRepo: CollaboratorsService = collaboratorsSvc(database);
	const applicationRepo: ApplicationService = applicationSvc(database);

	const applicationResult = await applicationRepo.getApplicationById({ id: application_id });

	if (!applicationResult.success) {
		return applicationResult;
	}

	const application = applicationResult.data;

	// TODO: Add Real Auth
	// Validate User is Applicant
	if (!(user_id === application.user_id)) {
		return failure('Unauthorized, cannot create Collaborators', 'Unauthorized');
	}

	if (!(application.state === 'DRAFT')) {
		return failure(`Can only add Collaborators when Application is in state DRAFT`, 'InvalidState');
	}

	const hasDuplicateRecords = collaborators.some((collaborator, index) => {
		const matchingRecordIndex = collaborators.findIndex(
			(record, searchIndex) =>
				searchIndex !== index &&
				record.collaboratorFirstName === collaborator.collaboratorFirstName &&
				record.collaboratorLastName === collaborator.collaboratorLastName &&
				record.collaboratorInstitutionalEmail === collaborator.collaboratorInstitutionalEmail &&
				record.collaboratorPositionTitle === collaborator.collaboratorPositionTitle,
		);

		return matchingRecordIndex !== -1;
	});

	if (hasDuplicateRecords) {
		return failure(`Cannot create duplicate collaborator records`, 'DuplicateRecords');
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

	const result = await collaboratorsRepo.createCollaborators({
		newCollaborators,
	});

	return result;
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
	user_id,
	id,
}: {
	application_id: number;
	user_id: string;
	id: number;
}) => {
	const database = getDbInstance();
	const collaboratorsRepo: CollaboratorsService = collaboratorsSvc(database);
	const applicationRepo: ApplicationService = applicationSvc(database);

	const applicationResult = await applicationRepo.getApplicationById({ id: application_id });

	if (!applicationResult.success) {
		return applicationResult;
	}

	const application = applicationResult.data;

	// TODO: Add Real Auth
	// Validate User is Applicant
	if (!(user_id === application.user_id)) {
		return failure('Unauthorized, cannot create Collaborators', 'Unauthorized');
	}

	if (!(application.state === 'DRAFT')) {
		return failure(`Can only add Collaborators when Application is in state DRAFT`, 'InvalidState');
	}

	const result = await collaboratorsRepo.deleteCollaborator({
		id,
	});

	return result;
};

/**
 * Delete a selected collaborator by ID
 * @param application_id - ID of related application record to associate with Collaborators
 * @param user_id - ID of Applicant updating the application
 * @param collaboratorUpdate - Collaborator record with updated properties
 * @returns Success with Collaborator data record / Failure with Error.
 */
export const updateCollaborator = async ({
	application_id,
	user_id,
	collaboratorUpdate,
}: {
	application_id: number;
	user_id: string;
	collaboratorUpdate: CollaboratorUpdateRecord;
}) => {
	const database = getDbInstance();
	const collaboratorsRepo: CollaboratorsService = collaboratorsSvc(database);
	const applicationRepo: ApplicationService = applicationSvc(database);

	const applicationResult = await applicationRepo.getApplicationById({ id: application_id });

	if (!applicationResult.success) {
		return applicationResult;
	}

	const application = applicationResult.data;

	// TODO: Add Real Auth
	// Validate User is Applicant
	if (!(user_id === application.user_id)) {
		return failure('Unauthorized, cannot create Collaborators', 'Unauthorized');
	}

	if (!(application.state === 'DRAFT')) {
		return failure(`Can only edit Collaborators when Application is in state DRAFT`, 'InvalidState');
	}

	const { id } = collaboratorUpdate;

	const collaborator: CollaboratorModel = {
		first_name: collaboratorUpdate.collaboratorFirstName,
		middle_name: collaboratorUpdate.collaboratorMiddleName,
		last_name: collaboratorUpdate.collaboratorLastName,
		suffix: collaboratorUpdate.collaboratorSuffix,
		position_title: collaboratorUpdate.collaboratorPositionTitle,
		institutional_email: collaboratorUpdate.collaboratorInstitutionalEmail,
		profile_url: collaboratorUpdate.collaboratorResearcherProfileURL,
		collaborator_type: collaboratorUpdate.collaboratorType,
		application_id,
	};

	const result = await collaboratorsRepo.updateCollaborator({
		id,
		collaborator,
	});

	return result;
};
