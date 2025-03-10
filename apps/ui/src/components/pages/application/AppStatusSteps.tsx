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

import { Flex, theme } from 'antd';

import { pcglColors } from '@/providers/ThemeProvider';
import { ApplicationStates, ApplicationStateValues } from '@pcgl-daco/data-model/src/types';

const { useToken } = theme;

type AppStatusType = {
	step: StepOptions;
	state: ApplicationStateValues;
};

enum StepOptions {
	DRAFT = 'Draft',
	SIGNED = 'Sign & Submit',
	REP_REVIEW = 'Rep Review',
	DAC_REVIEW = 'DAC Review',
}

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

// Temporary logic
const isFilled = true;

const AppStatusSteps = ({ currentStatus }: { currentStatus: ApplicationStateValues }) => {
	const { token } = useToken();

	const renderAppStatusItems = (): JSX.Element[] => {
		const stepIndex = appStatusItems.findIndex((step) => {
			if (step.state === ApplicationStates.DRAFT && currentStatus === ApplicationStates.DRAFT) {
				// Check if the step is DRAFT and not filled or SIGNED and filled
				if ((step.step === StepOptions.DRAFT && !isFilled) || (step.step === StepOptions.SIGNED && isFilled)) {
					return true;
				}
				return false;
			}

			return step.state === currentStatus;
		});

		// Until step is found, render green components but once it is found, set current step to yellow and remainder grey
		return appStatusItems.map((item, index) => {
			let color = pcglColors.grey;

			if (index < stepIndex) {
				color = token.colorSuccess;
			} else if (index === stepIndex) {
				color = pcglColors.warningPrimary;
			}

			return (
				<Flex
					flex={1}
					key={item.step}
					style={{ textWrap: 'nowrap', minWidth: '100px', padding: token.paddingSM, backgroundColor: color }}
					justify="center"
					align="center"
				>
					{item.step}
				</Flex>
			);
		});
	};

	return (
		<Flex flex={1} style={{ width: '100%' }} gap={'small'} justify="center" align="center">
			{renderAppStatusItems()}
		</Flex>
	);
};

export default AppStatusSteps;
