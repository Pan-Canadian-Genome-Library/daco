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

import { ApplicationStates } from '@pcgl-daco/data-model/dist/types';
import { ApplicationStateValues } from '@pcgl-daco/data-model/src/types';
import { Flex, Tag, theme } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const { useToken } = theme;

interface Filter {
	name: string;
	amount: number | undefined;
	key: ApplicationStateValues | 'TOTAL' | string;
}

interface DashboardFilterProps {
	onFilterChange: (filtersEnabled: string[]) => void;
	availableStates: { key: string; amount: number }[];
}

const DashboardFilter = ({ onFilterChange, availableStates }: DashboardFilterProps) => {
	const { t: translate } = useTranslation();
	const { token } = useToken();

	const [filterStates, setFilterStates] = useState<Array<ApplicationStateValues | 'TOTAL' | string>>(['TOTAL']);

	const displayedFilters: Filter[] = [
		{ name: 'Total', key: 'TOTAL', amount: availableStates.find((state) => state.key === 'TOTAL')?.amount },
		...Array.from(Object.keys(ApplicationStates)).map((possibleState) => {
			return {
				name: translate(`application.states.${possibleState}`),
				amount: availableStates.find((state) => state.key === possibleState)?.amount,
				key: possibleState,
			};
		}),
	];

	const handleChange = (selectedFilter: ApplicationStateValues | 'TOTAL' | string, checked: boolean) => {
		let nextSelectedFilters = checked
			? [...filterStates, selectedFilter]
			: filterStates.filter((t) => t !== selectedFilter);

		if (selectedFilter === 'TOTAL') {
			nextSelectedFilters = ['TOTAL'];
		} else if (filterStates.includes('TOTAL')) {
			nextSelectedFilters = nextSelectedFilters.filter((filters) => filters !== 'TOTAL');
		}

		if (nextSelectedFilters.length === displayedFilters.length - 1) {
			nextSelectedFilters = ['TOTAL'];
		}
		setFilterStates(nextSelectedFilters);
		onFilterChange(nextSelectedFilters);
	};

	return (
		<Flex gap={token.paddingXXS}>
			{displayedFilters.map((filter, filterKey) => (
				<Tag.CheckableTag
					style={{ fontWeight: token.fontWeightStrong, border: `1px solid ${token.colorBorder}`, paddingTop: 1 }}
					checked={filterStates.includes(filter.key)}
					onChange={(checked) => handleChange(filter.key, checked)}
					key={filterKey}
				>
					{filter.amount} {filter.name}
				</Tag.CheckableTag>
			))}
		</Flex>
	);
};

export default DashboardFilter;
