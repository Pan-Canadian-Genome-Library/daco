/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import { ApplicationStates } from '@pcgl-daco/data-model/src/types.js';
import { getDbInstance } from '../db/index.js';
import applicationService from '../service/application-service.js';
import { type ApplicationContentUpdates, type ApplicationService } from '../service/types.js';
import { failure } from '../utils/results.js';

/**
 * Validates if a given Application state allows edits, then updates the record
 * Updated records are returned in state 'DRAFT'
 * @param id - Application ID
 * @param update - Application Contents details to update
 * @returns Success with Application data / Failure with Error
 */
export const editApplication = async ({ id, update }: { id: number; update: ApplicationContentUpdates }) => {
	const database = getDbInstance();
	const service: ApplicationService = applicationService(database);

	const result = await service.getApplicationById({ id });

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
		const result = await service.editApplication({ id, update });
		return result;
	} else {
		const message = `Cannot update application with state ${state}`;
		console.error(message);
		return failure(message);
	}
};

/**
 *
 * @param userId - user ID
 * @returns Success with list of Applications / Failure with Error
 */
export const getAllApplications = async ({ userId }: { userId: string }) => {
	const database = getDbInstance();
	const service: ApplicationService = applicationService(database);

	const result = await service.listApplications({ user_id: userId });

	if (!result.success) {
		return result;
	}

	return result;
};
