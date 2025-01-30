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
import { type ApplicationServiceType, type CollaboratorModel, type CollaboratorsService } from '@/service/types.js';
import { failure } from '@/utils/results.js';
import { CollaboratorDTO } from '@pcgl-daco/data-model';

interface ValidCollaboratorDTO extends CollaboratorDTO {
	collaboratorFirstName: string;
	collaboratorLastName: string;
	collaboratorPositionTitle: string;
	collaboratorInstitutionalEmail: string;
}

/**
 * Creates a new collaborator and returns the created data.
 * @param first_name - Collaborator's first name
 * @param last_name - Collaborator's last name
 * @param position_title - Collaborator's position title
 * @param institutional_email - Collaborator's institutional email address
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
	const applicationRepo: ApplicationServiceType = applicationSvc(database);

	const applicationResult = await applicationRepo.getApplicationById({ id: application_id });

	if (!applicationResult.success) {
		return applicationResult;
	}

	const application = applicationResult.data;

	// TODO: Add Real Auth
	// Validate User is Applicant
	if (!(user_id === application.user_id)) {
		return failure('Unauthorized, cannot create Collaborators');
	}

	const validCollaborators: ValidCollaboratorDTO[] = collaborators.filter(
		(data): data is ValidCollaboratorDTO =>
			!!data.collaboratorFirstName &&
			!!data.collaboratorLastName &&
			!!data.collaboratorPositionTitle &&
			!!data.collaboratorInstitutionalEmail,
	);

	if (!(validCollaborators.length === collaborators.length)) {
		return failure('Required Collaborator details are missing.');
	}

	const newCollaborators: CollaboratorModel[] = validCollaborators.map((data) => ({
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
