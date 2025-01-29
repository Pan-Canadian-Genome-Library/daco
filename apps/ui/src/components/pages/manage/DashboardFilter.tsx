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

import { isApplicationStateValue } from '@pcgl-daco/data-model';
import { ApplicationStates } from '@pcgl-daco/data-model/dist/types';
import { ApplicationStateValues } from '@pcgl-daco/data-model/src/types';
import { Flex, Tag, theme } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { useToken } = theme;

/**
 * The allowable values that a filter can be for the manage applications interface.
 **/
export type FilterKeys = ApplicationStateValues | 'TOTAL';

interface DashboardFilterProps {
	onFilterChange: (filtersEnabled: FilterKeys[]) => void;
	filters: FilterKeys[];
	availableStates: { key: FilterKeys; amount: number }[];
}

interface Filter {
	name: string;
	amount: number;
	key: FilterKeys;
}

const DashboardFilter = ({ onFilterChange, filters, availableStates }: DashboardFilterProps) => {
	const { t: translate } = useTranslation();
	const { token } = useToken();

	//By default we want the "Total" filter selected, displaying all possible application types.
	const [filterStates, setFilterStates] = useState<Array<FilterKeys>>([]);

	// The currently displayed filters in the interface, this is determined by whatever is sent in by fetched data.
	const displayedFilters: Filter[] = [
		{
			name: 'Total',
			key: 'TOTAL',
			amount: availableStates.find((state) => state.key === 'TOTAL')?.amount || 0,
		},

		...Object.values(ApplicationStates).map((possibleState: FilterKeys): Filter => {
			return {
				name: translate(`application.states.${possibleState}`),
				amount: availableStates.find((state) => state.key === possibleState)?.amount || 0,
				key: possibleState,
			};
		}),
	];

	const handleChange = (selectedFilter: FilterKeys, checked: boolean) => {
		let nextSelectedFilters = checked
			? [...filterStates, selectedFilter]
			: filterStates.filter((t) => t !== selectedFilter);

		/**
		 * If the user selects total, it makes no sense to have any other filters selected,
		 * in this case, we empty out the selected filters, adn replace them with just TOTAL
		 *
		 * Also if the user unselects all filters, default back to total.
		 **/
		if (selectedFilter === 'TOTAL' || (nextSelectedFilters.length === 0 && filters.length === 0)) {
			nextSelectedFilters = ['TOTAL'];
		} else if (filterStates.includes('TOTAL')) {
			/**
			 * If the user selects anything else besides total and the total filter is still in the list
			 * drop the total filter, and keep everything else.
			 **/
			nextSelectedFilters = nextSelectedFilters.filter((filters) => filters !== 'TOTAL');
		}

		/**
		 * Finally, if the user selects everything, we want to just assume they want the total
		 * deselect everything, and select total
		 **/
		if (nextSelectedFilters.length === displayedFilters.length - 1) {
			nextSelectedFilters = ['TOTAL'];
		}

		setFilterStates(nextSelectedFilters);
		onFilterChange(nextSelectedFilters);
	};

	useEffect(() => {
		if (filters && filters.length) {
			setFilterStates([...filters]);
		}
	}, [filters]);

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

/**
 * A type guard to ensure that a passed in string is a part of a valid filter state.
 * @param filter A potentially valid filter
 * @returns A boolean ensuring that a filter is a part of of the set of valid filter states (`true`) or not (`false`)
 */
export const isFilterKey = (filter: string): filter is FilterKeys => {
	if (filter && (isApplicationStateValue(filter) || filter === 'TOTAL')) {
		return true;
	}
	return false;
};
