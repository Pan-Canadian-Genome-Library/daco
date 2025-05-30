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

import { pcglColours } from '@/providers/ThemeProvider';
import { ApplicationStates, ApplicationStateValues } from '@pcgl-daco/data-model/src/types';

type ApplicationCardProps = {
	showEdit: boolean;
	showActionRequired: boolean;
	colour: string;
};

export const getApplicationStateProperties = (applicationState: ApplicationStateValues): ApplicationCardProps => {
	let showEdit = false;
	let showActionRequired = false;
	let colour = pcglColours.white;

	switch (applicationState) {
		case ApplicationStates.DRAFT:
			showEdit = true;
			colour = pcglColours.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationStates.INSTITUTIONAL_REP_REVIEW:
			showEdit = true;
			colour = pcglColours.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationStates.DAC_REVIEW:
			showEdit = true;
			colour = pcglColours.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED:
			showEdit = true;
			colour = pcglColours.warningPrimary;
			showActionRequired = true;
			break;
		case ApplicationStates.DAC_REVISIONS_REQUESTED:
			showEdit = true;
			colour = pcglColours.warningPrimary;
			showActionRequired = true;
			break;
		case ApplicationStates.REJECTED:
			showEdit = false;
			colour = pcglColours.errorSecondary;
			showActionRequired = false;
			break;
		case ApplicationStates.REVOKED:
			showEdit = false;
			colour = pcglColours.errorSecondary;
			showActionRequired = false;
			break;
		case ApplicationStates.APPROVED:
			showEdit = false;
			colour = pcglColours.successSecondary;
			showActionRequired = false;
			break;
		case ApplicationStates.CLOSED:
			showEdit = false;
			colour = pcglColours.grey;
			showActionRequired = false;
			break;
		default:
			break;
	}

	return { showEdit, showActionRequired, colour };
};
