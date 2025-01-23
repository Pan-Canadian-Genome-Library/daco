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

import useGetApplicationCounts from '@/api/metadata/useGetApplicationCounts';
import useGetApplicationList from '@/api/useGetApplicationList';
import { mockUserID } from '@/components/mock/applicationMockData';
import ErrorPage from '@/components/pages/ErrorPage';
import PageHeader from '@/components/pages/global/PageHeader';
import { FilterKeyType } from '@/components/pages/manage/DashboardFilter';
import ManagementDashboard, { FilterState, TableParams } from '@/components/pages/manage/ManagementDashboard';
import { ApplicationCountMetadata, ApplicationWithApplicantInformation } from '@/global/types';
import { isValidPageNumber } from '@/global/utils';
import { ApplicationStates } from '@pcgl-daco/data-model/dist/types';
import { ApplicationStateValues } from '@pcgl-daco/data-model/src/types';

import { Flex, Layout, TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
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
const calculateFilterAmounts = (countMetadata: ApplicationCountMetadata) => {
	const availableStates: FilterState[] = [];

	for (const appState of Object.keys(countMetadata)) {
		availableStates.push({
			key: appState as ApplicationStateValues,
			amount: countMetadata[appState as keyof ApplicationCountMetadata],
		});
	}
	return availableStates;
};

const parsePageNumber = (pageNumber: number | string | null | undefined) => {
	if (pageNumber) {
		const parsedPage = typeof pageNumber === 'string' ? parseInt(pageNumber) : pageNumber;
		if (isValidPageNumber(parsedPage)) {
			return parsedPage;
		}
		return 0;
	} else {
		return 0;
	}
};

const ManageApplicationsPage = () => {
	const [filters, setFilters] = useState<Array<FilterKeyType>>([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [page, setPage] = useState<number>(parsePageNumber(searchParams.get('page')));
	const [tableParams, setTableParams] = useState<TableParams>({
		pagination: {
			current: 1,
			pageSize: 20,
			total: undefined,
		},
	});

	const { t: translate } = useTranslation();

	const {
		data: tableData,
		error: tableError,
		isLoading: isTableLoading,
		refetch: tableDataRefetch,
	} = useGetApplicationList({
		userId: mockUserID,
		state: filters.find((filter) => filter === 'TOTAL')
			? undefined
			: [...filters.map((filter) => filter as ApplicationStateValues)],
		page: page,
	});

	const handleFilterChange = useCallback(
		async (filtersActive: Array<FilterKeyType>, setParamsAndFetch: boolean) => {
			setFilters(filtersActive);

			if (setParamsAndFetch) {
				setSearchParams((prev) => {
					prev.set('filters', filtersActive.flat().toString());
					return prev;
				});

				await tableDataRefetch({ cancelRefetch: true });
			}
		},
		[setSearchParams, tableDataRefetch],
	);

	const handleTableChange = async ({
		pagination,
	}: {
		pagination: TablePaginationConfig;
		sorter: SorterResult<ApplicationWithApplicantInformation>[] | SorterResult<ApplicationWithApplicantInformation>;
	}) => {
		const page = parsePageNumber(pagination.current);

		if (page > 0) {
			setPage(page - 1);
		} else {
			setPage(page);
		}

		await tableDataRefetch();
	};

	useEffect(() => {
		let currentPage = tableData?.pagingMetadata.page;
		const currentFilters = searchParams.get('filters');

		setPage(parsePageNumber(currentPage));

		console.log(currentPage);

		if (currentPage) {
			currentPage = currentPage + 1;
		} else {
			currentPage = 1;
		}

		if (currentFilters) {
			const filters = currentFilters.split(',') as FilterKeyType[];
			setPage(page);
			handleFilterChange(filters, false);
		}

		setTableParams({
			pagination: {
				current: currentPage,
				pageSize: tableData?.pagingMetadata.pageSize,
				total: tableData?.pagingMetadata.totalRecords,
			},
		});
	}, [handleFilterChange, page, searchParams, tableData]);

	/**
	 * This sets the initial state for the page on load.
	 *
	 * We need to check what filters currently exist in the URL, and apply them into the current filters object
	 */
	useEffect(() => {
		const urlSetFilters = searchParams.get('filters');
		const urlSetPage = searchParams.get('page');
		const allUrlParams = new URLSearchParams();

		if (!urlSetFilters || !urlSetPage || !isValidPageNumber(Number.parseInt(urlSetPage))) {
			allUrlParams.set('filters', 'TOTAL');
			allUrlParams.set('page', '0');
			setSearchParams(allUrlParams);
		} else {
			const filtersProvided = urlSetFilters.split(',');
			for (const providedFilters of filtersProvided) {
				if (!POSSIBLE_FILTERS.find((possibleFilters) => possibleFilters === providedFilters)) {
					allUrlParams.set('filters', 'TOTAL');
					allUrlParams.set('page', '0');
					setSearchParams(allUrlParams);
					return;
				}
			}
		}
	}, [filters, searchParams, setSearchParams]);

	// useEffect(() => {
	// 	const currentFilters = searchParams.get('filters');
	// 	const currentPage = searchParams.get('page');
	// 	const page = parsePageNumber(currentPage);

	// 	if (currentFilters) {
	// 		const filters = currentFilters.split(',') as FilterKeyType[];
	// 		setPage(page);
	// 		handleFilterChange(filters, false);
	// 	}
	// }, [handleFilterChange, searchParams]);

	const {
		data: filterMetadata,
		error: filterMetaDataError,
		isLoading: areFiltersLoading,
	} = useGetApplicationCounts(mockUserID);

	/**
	 * Given that we don't need to constantly recalculate how many applications are at a current state
	 * we memoize the value after calculating to avoid expensive recalculation.
	 *
	 * Right now this array has zero dependencies but once it's
	 * connected up to the API, we should add that value as a dependant
	 */
	const filterAmounts = useMemo(() => (filterMetadata ? calculateFilterAmounts(filterMetadata) : []), [filterMetadata]);

	return (
		<Content>
			<Flex vertical>
				<PageHeader title={translate('manage.applications.title')} />
				{filterMetaDataError || areFiltersLoading ? (
					<ErrorPage loading={areFiltersLoading} error={filterMetaDataError || tableError} />
				) : (
					<ManagementDashboard
						filterCounts={filterAmounts}
						loading={isTableLoading}
						data={tableData && tableData.applications ? tableData.applications : []}
						filters={filters}
						pagination={tableParams.pagination}
						onTableChange={handleTableChange}
						onFilterChange={(filtersEnabled) => handleFilterChange(filtersEnabled, true)}
					/>
				)}
			</Flex>
		</Content>
	);
};

export default ManageApplicationsPage;
