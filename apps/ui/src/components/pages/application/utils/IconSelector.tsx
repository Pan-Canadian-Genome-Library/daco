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

import { CheckCircleOutlined, ExclamationCircleFilled, LockOutlined } from '@ant-design/icons';
import { ApplicationStates } from '@pcgl-daco/data-model';
import { SectionRoutes, userRoleSchema } from '@pcgl-daco/validation';
import { SectionMenuItemProps } from '../SectionMenuItem';

/**
 * TODO: once we are in the DAC/REP revision state in the application, add a renderIcon condition
 */
export const RenderIcon = (props: SectionMenuItemProps) => {
	const { appState } = props;

	switch (appState) {
		case ApplicationStates.DRAFT:
			return DraftLogic(props);
		case ApplicationStates.INSTITUTIONAL_REP_REVIEW:
			return InstitutionalRepReviewLogic(props);
		case ApplicationStates.DAC_REVIEW:
			return DACReviewLogic();
		case ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED:
			return RevisionsRequested(props);
		case ApplicationStates.DAC_REVISIONS_REQUESTED:
			return RevisionsRequested(props);
		default:
			return DraftLogic(props);
	}
};

const DraftLogic = ({
	isCurrentSection,
	label,
	hasCollaborators,
	isEditMode,
	isLocked,
	isSectionTouched,
	isSectionValid,
}: Omit<SectionMenuItemProps, 'appState'>) => {
	if (isLocked ?? !isEditMode) {
		// display lock on edit mode
		return <LockOutlined />;
	} else if (label === SectionRoutes.INTRO) {
		// do not display intro icon
		return;
	} else if (label === SectionRoutes.COLLABORATORS && isEditMode) {
		// If has collaborators, show checkmark otherwise return null
		return hasCollaborators ? <CheckCircleOutlined /> : null;
	} else if (isCurrentSection && isEditMode && !isSectionValid) {
		// do not display icon if on current page
		return;
	} else if (!isSectionTouched) {
		// do not display icon if the section has not been worked on
		return;
	} else if (isSectionValid) {
		// display checkmark is section is valid
		return <CheckCircleOutlined />;
	} else if (!isSectionValid) {
		// display exclamation if section is invalid and needs revisions
		return <ExclamationCircleFilled />;
	}
};

// This is the logic for the application state when revisions are requested for both INSTITUTIONAL REP and DAC MEMBERS
const RevisionsRequested = ({ label, isLocked, role }: Omit<SectionMenuItemProps, 'appState'>) => {
	if (label === SectionRoutes.INTRO) {
		// do not display intro icon
		return <LockOutlined />;
	} else if (!isLocked && role === userRoleSchema.Values.APPLICANT) {
		// Do not display icon on sections with revisions AND if the user is APPLICANT.
		return;
	} else if (label === SectionRoutes.SIGN) {
		return;
	}
	return <LockOutlined />;
};

const InstitutionalRepReviewLogic = ({ label }: Omit<SectionMenuItemProps, 'appState'>) => {
	if (label === SectionRoutes.SIGN) {
		// Only sign and submit section should display no icon
		return;
	}

	return <LockOutlined />;
};

const DACReviewLogic = () => {
	return <LockOutlined />;
};
