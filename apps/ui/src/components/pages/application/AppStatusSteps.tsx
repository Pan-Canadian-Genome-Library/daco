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

import { pcglColors } from '@/components/providers/ThemeProvider';
import { ApplicationStates, ApplicationStateValues } from '@pcgl-daco/data-model/src/types';

const { useToken } = theme;

type AppStatusType = {
	title: StepHeaderOptions;
	state: ApplicationStateValues;
};

enum StepHeaderOptions {
	DRAFT = 'Draft',
	SIGNED = 'Sign & Submit',
	REP_REVIEW = 'Rep Review',
	DAC_REVIEW = 'DAC Review',
}

const appStatusItems: AppStatusType[] = [
	{
		title: StepHeaderOptions.DRAFT,
		state: ApplicationStates.DRAFT,
	},
	{
		title: StepHeaderOptions.SIGNED,
		state: ApplicationStates.DRAFT,
	},
	{
		title: StepHeaderOptions.REP_REVIEW,
		state: ApplicationStates.INSTITUTIONAL_REP_REVIEW,
	},
	{
		title: StepHeaderOptions.DAC_REVIEW,
		state: ApplicationStates.DAC_REVIEW,
	},
];

const AppStatusSteps = ({ currentStatus }: { currentStatus: ApplicationStateValues }) => {
	const { token } = useToken();

	const renderAppStatusItems = (): JSX.Element[] => {
		let foundCurrentState = false;

		// TODO: when we have forms filled in the store, create a check for this in the renderAppStatusItems form
		//       Moving on for now for this ticket. Got stuck on the logic to switch colors between Draft/Sign&Draft. Will revist in this ticket and remove comment.

		return appStatusItems.map((item) => {
			let color = token.colorSuccess;

			if (item.state === currentStatus) {
				foundCurrentState = true;
				color = token.colorWarning;
			} else if (foundCurrentState) {
				// Since current state is found, the remainder of items will be grey
				color = pcglColors.grey;
			}

			return (
				<Flex
					flex={1}
					key={item.title}
					style={{ textWrap: 'nowrap', minWidth: '100px', padding: token.paddingSM, backgroundColor: color }}
					justify="center"
					align="center"
				>
					{item.title}
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
