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
import { ApplicationState } from '@/global/types';

type ApplicationCardProps = {
	showEdit: boolean;
	showActionRequired: boolean;
	color: string;
};

export const getFriendlyStateName = (applicationState: ApplicationState): string => {
	switch (applicationState) {
		case ApplicationState.DRAFT:
			return 'Draft';
		case ApplicationState.INSTITUTIONAL_REP_REVIEW:
			return 'Rep Review';
		case ApplicationState.DAC_REVIEW:
			return 'DAC Review';
		case ApplicationState.REP_REVISION:
			return 'Rep Revisions';
		case ApplicationState.DAC_REVISIONS_REQUESTED:
			return 'DAC Revisions';
		case ApplicationState.REJECTED:
			return 'Rejected';
		case ApplicationState.REVOKED:
			return 'Revoked';
		case ApplicationState.APPROVED:
			return 'Approved';
		case ApplicationState.CLOSED:
			return 'Closed';
		default:
			return 'Unknown';
	}
};
export const getApplicationStateProperties = (applicationState: ApplicationState): ApplicationCardProps => {
	let showEdit = false;
	let showActionRequired = false;
	let color = pcglColors.white;

	switch (applicationState) {
		case ApplicationState.DRAFT:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationState.INSTITUTIONAL_REP_REVIEW:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationState.DAC_REVIEW:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationState.REP_REVISION:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = true;
			break;
		case ApplicationState.DAC_REVISIONS_REQUESTED:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = true;
			break;
		case ApplicationState.REJECTED:
			showEdit = false;
			color = pcglColors.errorSecondary;
			showActionRequired = false;
			break;
		case ApplicationState.REVOKED:
			showEdit = false;
			color = pcglColors.errorSecondary;
			showActionRequired = false;
			break;
		case ApplicationState.APPROVED:
			showEdit = false;
			color = pcglColors.successSecondary;
			showActionRequired = false;
			break;
		case ApplicationState.CLOSED:
			showEdit = false;
			color = pcglColors.grey;
			showActionRequired = false;
			break;
		default:
			break;
	}

	return { showEdit, showActionRequired, color };
};
