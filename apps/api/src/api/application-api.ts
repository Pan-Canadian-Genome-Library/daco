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
import applicationService from '../service/application-service.js';
import { type ApplicationContentUpdates, type ApplicationService } from '../service/types.js';

import { getDbInstance } from '../db/index.js';

export const editApplication = async ({ id, update }: { id: number; update: ApplicationContentUpdates }) => {
	const database = getDbInstance();
	const service: ApplicationService = applicationService(database);

	const applicationRecord = await service.getApplicationById({ id });

	if (!applicationRecord) {
		throw new Error('Application Not Found');
	}

	// Validate Application state will allow updates
	// Edits to Applications under review will revert state to 'DRAFT'
	const { state } = applicationRecord;

	// TODO: Replace w/ state machine https://github.com/Pan-Canadian-Genome-Library/daco/issues/58
	const isEditState =
		state === ApplicationStates.DRAFT ||
		state === ApplicationStates.INSTITUTIONAL_REP_REVIEW ||
		state === ApplicationStates.DAC_REVIEW;

	if (isEditState) {
		const updatedRecord = service.editApplication({ id, update });
		if (updatedRecord) {
			return updatedRecord;
		} else {
			console.error(`Error updating application`);
			return null;
		}
	} else {
		console.error(`Cannot update application with state ${state}`);
		return null;
	}
};
