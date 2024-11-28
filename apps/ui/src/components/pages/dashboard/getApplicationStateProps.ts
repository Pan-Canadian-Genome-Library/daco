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

import { ApplicationStatus } from '@/components/mock/applicationMockData';
import { pcglColors } from '@/components/providers/ThemeProvider';

type ApplicationCardProps = {
	showEdit: boolean;
	showActionRequired: boolean;
	color: string;
};

export const getApplicationStatusProperties = (applicationStatus: ApplicationStatus): ApplicationCardProps => {
	let showEdit = false;
	let showActionRequired = false;
	let color = pcglColors.white;

	switch (applicationStatus) {
		case ApplicationStatus.Draft:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationStatus.RepReview:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationStatus.DACReview:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationStatus.RepRevision:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = true;
			break;
		case ApplicationStatus.DACRevision:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = true;
			break;
		case ApplicationStatus.Rejected:
			showEdit = false;
			color = pcglColors.errorSecondary;
			showActionRequired = false;
			break;
		case ApplicationStatus.Revoked:
			showEdit = false;
			color = pcglColors.errorSecondary;
			showActionRequired = false;
			break;
		case ApplicationStatus.Approved:
			showEdit = false;
			color = pcglColors.successSecondary;
			showActionRequired = false;
			break;
		case ApplicationStatus.Closed:
			showEdit = false;
			color = pcglColors.grey;
			showActionRequired = false;
			break;
		default:
			break;
	}

	return { showEdit, showActionRequired, color };
};