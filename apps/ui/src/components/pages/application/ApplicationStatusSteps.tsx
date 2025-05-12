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

import { Flex, GlobalToken, theme } from 'antd';
import { useTranslation } from 'react-i18next';

import { ValidateAllSections } from '@/components/pages/application/utils/validatorFunctions';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { pcglColours } from '@/providers/ThemeProvider';
import { ApplicationStates, ApplicationStateValues } from '@pcgl-daco/data-model/src/types';

const { useToken } = theme;

const StepOptions = {
	DRAFT: 'DRAFT',
	SIGNED: 'SIGN_SUBMIT',
	REP_REVIEW: 'REP_REVIEW',
	DAC_REVIEW: 'DAC_REVIEW',
	APPROVED: 'APPROVED',
	REVOKED: 'REVOKED',
	REJECTED: 'REJECTED',
	CLOSED: 'CLOSED',
} as const;
type StepOptions = (typeof StepOptions)[keyof typeof StepOptions];

type AppStatusType = {
	step: StepOptions;
	state: ApplicationStateValues;
};

const appStatusItems: AppStatusType[] = [
	{
		step: StepOptions.DRAFT,
		state: ApplicationStates.DRAFT,
	},
	{
		step: StepOptions.SIGNED,
		state: ApplicationStates.DRAFT,
	},
	{
		step: StepOptions.REP_REVIEW,
		state: ApplicationStates.INSTITUTIONAL_REP_REVIEW,
	},
	{
		step: StepOptions.DAC_REVIEW,
		state: ApplicationStates.DAC_REVIEW,
	},
];

const ApplicationStep = ({ item, colour, token }: { item: AppStatusType; colour: string; token: GlobalToken }) => {
	const { t: translate } = useTranslation();
	return (
		<Flex
			flex={1}
			key={item.step}
			style={{
				width: '100%',
				textWrap: 'nowrap',
				minWidth: '100px',
				padding: token.paddingXS,
				paddingInline: '40px',
				backgroundColor: colour,
			}}
			justify="center"
			align="center"
		>
			{translate(`applicationViewer.steps.${item.step}`)}
		</Flex>
	);
};

const ApplicationStatusSteps = ({ currentStatus }: { currentStatus: ApplicationStateValues }) => {
	const { token } = useToken();
	const { state } = useApplicationContext();
	const isSectionsFilled = ValidateAllSections(state.fields);

	const renderAppStatusItems = (): JSX.Element[] => {
		const stepIndex = appStatusItems.findIndex((step) => {
			if (step.state === ApplicationStates.DRAFT && currentStatus === ApplicationStates.DRAFT) {
				// Check if the step is DRAFT and not filled or SIGNED and filled
				if (
					(step.step === StepOptions.DRAFT && !isSectionsFilled) ||
					(step.step === StepOptions.SIGNED && isSectionsFilled)
				) {
					return true;
				} else {
					return false;
				}
			} else if (
				step.state === ApplicationStates.INSTITUTIONAL_REP_REVIEW &&
				currentStatus === ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED
			) {
				return true;
			} else if (
				step.state === ApplicationStates.DAC_REVIEW &&
				currentStatus === ApplicationStates.DAC_REVISIONS_REQUESTED
			) {
				return true;
			}

			return step.state === currentStatus;
		});

		// Until step is found, render green components but once it is found, set current step to yellow and remainder grey
		return appStatusItems.map((item, index) => {
			let colour = pcglColours.grey;

			if (index < stepIndex) {
				colour = pcglColours.successPrimary;
			} else if (index === stepIndex) {
				colour = pcglColours.warningPrimary;
			}

			return <ApplicationStep colour={colour} item={item} token={token} />;
		});
	};

	const renderStatus = () => {
		if (
			currentStatus !== ApplicationStates.APPROVED &&
			currentStatus !== ApplicationStates.REVOKED &&
			currentStatus !== ApplicationStates.REJECTED &&
			currentStatus !== ApplicationStates.CLOSED
		) {
			return renderAppStatusItems();
		} else if (currentStatus === ApplicationStates.APPROVED) {
			return (
				<ApplicationStep
					colour={pcglColours.successPrimary}
					item={{ state: ApplicationStates.APPROVED, step: StepOptions.APPROVED }}
					token={token}
				/>
			);
		} else if (currentStatus === ApplicationStates.REVOKED) {
			return (
				<ApplicationStep
					colour={pcglColours.grey}
					item={{ state: ApplicationStates.REVOKED, step: StepOptions.REVOKED }}
					token={token}
				/>
			);
		} else if (currentStatus === ApplicationStates.REJECTED) {
			return (
				<ApplicationStep
					colour={pcglColours.grey}
					item={{ state: ApplicationStates.REJECTED, step: StepOptions.REJECTED }}
					token={token}
				/>
			);
		} else {
			return (
				<ApplicationStep
					colour={pcglColours.grey}
					item={{ state: ApplicationStates.CLOSED, step: StepOptions.CLOSED }}
					token={token}
				/>
			);
		}
	};

	return (
		<Flex flex={1} style={{ width: '100%' }} gap={2} justify="center" align="center">
			{renderStatus()}
		</Flex>
	);
};

export default ApplicationStatusSteps;
