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

import { pcglColors } from '@/components/providers/ThemeProvider';
import { ApplicationStates, ApplicationStateValues } from '@pcgl-daco/data-model/src/types';

type ApplicationCardProps = {
	showEdit: boolean;
	showActionRequired: boolean;
	color: string;
};

export const getFriendlyStateName = (applicationState: ApplicationStateValues): string => {
	switch (applicationState) {
		case ApplicationStates.DRAFT:
			return 'Draft';
		case ApplicationStates.INSTITUTIONAL_REP_REVIEW:
			return 'Rep Review';
		case ApplicationStates.DAC_REVIEW:
			return 'DAC Review';
		case ApplicationStates.REP_REVISION:
			return 'Rep Revisions';
		case ApplicationStates.DAC_REVISIONS_REQUESTED:
			return 'DAC Revisions';
		case ApplicationStates.REJECTED:
			return 'Rejected';
		case ApplicationStates.REVOKED:
			return 'Revoked';
		case ApplicationStates.APPROVED:
			return 'Approved';
		case ApplicationStates.CLOSED:
			return 'Closed';
		default:
			return 'Unknown';
	}
};
export const getApplicationStateProperties = (applicationState: ApplicationStateValues): ApplicationCardProps => {
	let showEdit = false;
	let showActionRequired = false;
	let color = pcglColors.white;

	switch (applicationState) {
		case ApplicationStates.DRAFT:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationStates.INSTITUTIONAL_REP_REVIEW:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationStates.DAC_REVIEW:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationStates.REP_REVISION:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = true;
			break;
		case ApplicationStates.DAC_REVISIONS_REQUESTED:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = true;
			break;
		case ApplicationStates.REJECTED:
			showEdit = false;
			color = pcglColors.errorSecondary;
			showActionRequired = false;
			break;
		case ApplicationStates.REVOKED:
			showEdit = false;
			color = pcglColors.errorSecondary;
			showActionRequired = false;
			break;
		case ApplicationStates.APPROVED:
			showEdit = false;
			color = pcglColors.successSecondary;
			showActionRequired = false;
			break;
		case ApplicationStates.CLOSED:
			showEdit = false;
			color = pcglColors.grey;
			showActionRequired = false;
			break;
		default:
			break;
	}

	return { showEdit, showActionRequired, color };
};
