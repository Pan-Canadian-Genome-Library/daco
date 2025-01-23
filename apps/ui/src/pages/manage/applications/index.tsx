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

import { mockTableData } from '@/components/mock/applicationMockData';
import PageHeader from '@/components/pages/global/PageHeader';
import { FilterKeyType } from '@/components/pages/manage/DashboardFilter';
import ManagementDashboard, { FilterState, TableData } from '@/components/pages/manage/ManagementDashboard';
import { ApplicationStates } from '@pcgl-daco/data-model/dist/types';

import { Flex, Layout } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

const { Content } = Layout;
const POSSIBLE_FILTERS = ['TOTAL', ...Object.values(ApplicationStates)] as FilterKeyType[];
/**
 * Calculates the number shown beside the filter at the top of the page.
 * Example: 10 Total | 3 DAC Review, etc...
 * @param data The data displayed within the table.
 * @returns A FilterState object, containing the unique key of the filter and how many applications are filed under it/
 */
const calculateFilterAmounts = (data: TableData[]) => {
	const availableStates: FilterState[] = [];

	for (const appState of Object.keys(ApplicationStates) as FilterKeyType[]) {
		availableStates.push({
			key: appState,
			amount: data.filter((data) => data.state === appState).length,
		});
	}

	availableStates.push({ key: 'TOTAL', amount: data.length });
	return availableStates;
};

const ManageApplicationsPage = () => {
	const { t: translate } = useTranslation();

	const [tableData, setTableData] = useState<Array<TableData>>(mockTableData);
	const [filters, setFilters] = useState<Array<FilterKeyType>>([]);
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const urlSetFilters = searchParams.get('filters');
		const filterParam = new URLSearchParams();
		if (!urlSetFilters) {
			filterParam.set('filters', 'TOTAL');
			setSearchParams(filterParam);
		} else {
			const filtersProvided = urlSetFilters.split(',');
			for (const providedFilters of filtersProvided) {
				if (!POSSIBLE_FILTERS.find((possibleFilters) => possibleFilters === providedFilters)) {
					filterParam.set('filters', 'TOTAL');
					setSearchParams(filterParam);
					return;
				}
			}
		}
	}, [searchParams, setSearchParams]);

	/**
	 * Given that we don't need to constantly recalculate how many applications are at a current state
	 * we memoize the value after calculating to avoid expensive recalculation.
	 *
	 * Right now this array has zero dependencies but once it's
	 * connected up to the API, we should add that value as a dependant
	 */
	const filterAmounts = useMemo(() => calculateFilterAmounts(mockTableData), []);

	const handleFilterChange = useCallback(
		(filtersActive: Array<FilterKeyType>, shouldSetParams: boolean) => {
			setFilters(filtersActive);
			if (shouldSetParams) {
				const filterParam = new URLSearchParams();
				filterParam.set('filters', filtersActive.flat().toString());
				setSearchParams(filterParam);
			}
			//In this case, we've likely selected the "Total" filter, just display what we've got from the initial call to the server.
			if (filtersActive.length === 1 && filtersActive.includes('TOTAL')) {
				setTableData(mockTableData);
			} else {
				const filteredData = [];
				//Otherwise we want to filter down to whatever applications match our currently filtered state.
				for (const filterKey of filtersActive) {
					const filtered = mockTableData.filter((data) => data.state === filterKey);
					if (filtered.length) {
						filteredData.push(...filtered);
					}
				}
				setTableData(filteredData);
			}
		},
		[setSearchParams],
	);

	useEffect(() => {
		const currentFilters = searchParams.get('filters');
		if (currentFilters) {
			const filters = currentFilters.split(',') as FilterKeyType[];
			handleFilterChange(filters, false);
		}
	}, [handleFilterChange, searchParams]);

	return (
		<Content>
			<Flex vertical>
				<PageHeader title={translate('manage.applications.title')} />
				<ManagementDashboard
					filterCounts={filterAmounts}
					data={tableData}
					filters={filters}
					onFilterChange={(filtersEnabled) => handleFilterChange(filtersEnabled, true)}
				/>
			</Flex>
		</Content>
	);
};

export default ManageApplicationsPage;