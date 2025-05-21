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

import { ApplicationStates, ApplicationStateValues, SignatureDTO } from '@pcgl-daco/data-model';
import { SectionRevision, UserRole } from '@pcgl-daco/validation';

export const canSignSection = ({
	role,
	state,
	isEditMode,
	signatures,
	revisions,
}: {
	signatures?: SignatureDTO;
	role?: UserRole;
	state: ApplicationStateValues;
	revisions: Partial<SectionRevision>;
	isEditMode: boolean;
}) => {
	// If signatures are still loading, then disable signature functionality
	if (!signatures) {
		return { disableSignature: true, disableSubmit: true };
	}

	switch (state) {
		case ApplicationStates.DRAFT:
			return {
				disableSignature: !(role === 'APPLICANT' && isEditMode),
				disableSubmit: !(role === 'APPLICANT' && signatures.applicantSignature && isEditMode),
			};
		case ApplicationStates.INSTITUTIONAL_REP_REVIEW:
			return {
				disableSignature: !(role === 'INSTITUTIONAL_REP'),
				disableSubmit: !(role === 'INSTITUTIONAL_REP' && signatures.institutionalRepSignature),
			};
		case ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED:
			return {
				disableSignature: !(role === 'APPLICANT' && !revisions['sign']?.isApproved),
				disableSubmit: !(role === 'APPLICANT' && signatures.applicantSignature),
			};
		case ApplicationStates.DAC_REVIEW:
			return {
				disableSignature: true,
				disableSubmit: true,
			};
		case ApplicationStates.DAC_REVISIONS_REQUESTED:
			return {
				disableSignature: !(role === 'APPLICANT' && !revisions['sign']?.isApproved),
				disableSubmit: !(role === 'APPLICANT' && signatures.applicantSignature),
			};
		default:
			return { disableSignature: true, disableSubmit: true };
	}
};
