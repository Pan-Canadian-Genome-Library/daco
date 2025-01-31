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
import useGetApplicationList, { ApplicationListSortingOptions } from '@/api/useGetApplicationList';
import { mockUserID } from '@/components/mock/applicationMockData';
import ErrorPage from '@/components/pages/ErrorPage';
import PageHeader from '@/components/pages/global/PageHeader';
import { FilterKeys, isFilterKey } from '@/components/pages/manage/DashboardFilter';
import ManagementDashboard, { FilterState } from '@/components/pages/manage/ManagementDashboard';
import { ApplicationCountMetadata } from '@/global/types';
import { isValidPageNumber } from '@/global/utils';
import { ApplicationResponseData, isApplicationStateValue } from '@pcgl-daco/data-model';

import { Flex, Layout, TablePaginationConfig } from 'antd';
import { Key, SorterResult } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

const { Content } = Layout;

export interface TableProperties {
	pagination: TablePaginationConfig;
}

const ManageApplicationsPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const appliedFilters = searchParams.get('filters');
	const appliedPage = searchParams.get('page');

	const [sorting, setSorting] = useState<ApplicationListSortingOptions[]>();

	const [tableParams, setTableParams] = useState<TableProperties>({
		pagination: {
			current: 1,
			pageSize: 20,
			total: 0,
		},
	});

	const { t: translate } = useTranslation();

	const {
		data: tableData,
		error: tableError,
		isFetching: isTableLoading,
		refetch: tableDataRefetch,
	} = useGetApplicationList({
		userId: mockUserID,
		sort: sorting ? sorting : undefined,
		state: parseFilters(appliedFilters).filter((filter) => isApplicationStateValue(filter)),
		page: parsePageNumber(tableParams.pagination?.current, true),
	});

	const {
		data: filterMetadata,
		error: filterMetaDataError,
		isLoading: areFiltersLoading,
	} = useGetApplicationCounts(mockUserID);

	/**
	 * Gets called whenever `DashboardFilter` updates its state.
	 * @param filtersActive The array of the filters applied.
	 */
	const handleFilterChange = (filtersActive: Array<FilterKeys>) => {
		setSearchParams((prev) => {
			prev.set('filters', filtersActive.flat().toString());
			prev.set('page', '1');
			return prev;
		});
	};

	/**
	 * Is called whenever the table has a change or update in its sorting, pagination or filtering.
	 * @see @link https://ant.design/components/table#table-demo-ajax
	 */
	const handleTableChange = async ({
		pagination,
		sorter,
	}: {
		pagination: TablePaginationConfig;
		sorter: SorterResult<ApplicationResponseData>[] | SorterResult<ApplicationResponseData>;
	}) => {
		const page = pagination.current;
		const sortingOpt: ApplicationListSortingOptions[] = [];

		if (!Array.isArray(sorter)) {
			if (sorter.field && sorter.order) {
				sortingOpt.push({
					column: parseSortingOptions(sorter.field),
					direction: sorter.order === 'ascend' ? 'asc' : 'desc',
				});
			}
			setSorting(sortingOpt);
		} else {
			for (const sortSetting of sorter) {
				if (sortSetting.field && sortSetting.order) {
					sortingOpt.push({
						column: parseSortingOptions(sortSetting.field),
						direction: sortSetting.order === 'ascend' ? 'asc' : 'desc',
					});
				}
			}
			setSorting(sortingOpt);
		}
		setSearchParams((prev) => {
			prev.set('page', parsePageNumber(page, false).toString());
			return prev;
		});
	};

	/**
	 * This effect is required to validate and set state based off our URL on load, and otherwise.
	 */
	useEffect(() => {
		const allUrlParams = new URLSearchParams();

		const missingOrInvalidPageState =
			!appliedFilters || !appliedPage || !isValidPageNumber(Number.parseInt(appliedPage));

		const unknownFilters = !isFilterKeySet(parseFilters(appliedFilters));

		/**
		 * If somehow the user ends up at our page with just `/manage/applications` and no URL set state
		 * we have to reset to a known good state, and exit out with the defaults.
		 *
		 * If they _do_ have a URL-bound state, we can't trust that they have a known set of "good" filters selected.
		 * We should validate this first before continuing.
		 */
		if (missingOrInvalidPageState || unknownFilters) {
			allUrlParams.set('filters', 'TOTAL');
			allUrlParams.set('page', '1');
			setSearchParams(allUrlParams);
			return;
		}

		/**
		 * Once both edge cases have been validated, start providing the parsed state to the table.
		 */
		setTableParams((prev) => {
			return {
				...prev,
				pagination: {
					...prev.pagination,
					current: parsePageNumber(appliedPage, false),
				},
			};
		});
	}, [appliedFilters, appliedPage, setSearchParams]);

	/**
	 * Whenever the table params change we want to ensure we fire off a network request.
	 */
	useEffect(() => {
		tableDataRefetch();
	}, [tableDataRefetch, tableParams, sorting]);

	/**
	 * Once we receive data from the server, reapply it to our table.
	 */
	useEffect(() => {
		const serverPaginationState = tableData?.pagingMetadata;

		if (serverPaginationState) {
			setTableParams((prev) => {
				return {
					...prev,
					pagination: {
						...prev.pagination,
						pageSize: serverPaginationState.pageSize,
						total: serverPaginationState.totalRecords,
					},
				};
			});
		}
	}, [setSearchParams, tableData]);

	return (
		<Content>
			<Flex vertical>
				<PageHeader title={translate('manage.applications.title')} />
				{filterMetaDataError || areFiltersLoading ? (
					<ErrorPage loading={areFiltersLoading} error={filterMetaDataError || tableError} />
				) : (
					<ManagementDashboard
						filterCounts={filterMetadata ? calculateFilterAmounts(filterMetadata) : []}
						loading={isTableLoading}
						data={tableData && tableData.applications ? tableData.applications : []}
						filters={parseFilters(appliedFilters).filter((filter) => isFilterKey(filter))}
						pagination={tableParams.pagination ? tableParams.pagination : {}}
						onTableChange={handleTableChange}
						onFilterChange={(filtersEnabled) => handleFilterChange(filtersEnabled)}
					/>
				)}
			</Flex>
		</Content>
	);
};

export default ManageApplicationsPage;

/**
 * Used to translate between the key that represents each column, and
 * the names of the column's the API expects.
 * @param column The column object passed in by the `antd` table.
 * @returns A `ApplicationListSortingOptions` compatible column name.
 */
const parseSortingOptions = (column: string | Key | readonly Key[]) => {
	let key = column;
	if (Array.isArray(column)) {
		key = column[column.length - 1];
	}

	switch (key) {
		case 'id':
			return 'id';
		case 'applicant':
			return 'user_id';
		case 'createdAt':
			return 'created_at';
		case 'approvedAt':
			return 'approved_at';
		case 'updatedAt':
			return 'updated_at';
		case 'expiresAt':
			return 'expires_at';
		case 'state':
			return 'state';
		default:
			return 'id';
	}
};

/**
 * Calculates the number shown beside the filter at the top of the page.
 * Example: 10 Total | 3 DAC Review, etc...
 * @param data The data provided via the backend `metadata/counts` endpoint.
 * @returns A `FilterState` object, containing the unique key of the filter and how many applications are filed under it.
 */
const calculateFilterAmounts = (countMetadata: ApplicationCountMetadata): FilterState[] => {
	const availableStates: FilterState[] = [];
	for (const appState of Object.keys(countMetadata)) {
		if (isFilterKey(appState))
			availableStates.push({
				key: appState,
				amount: countMetadata[appState],
			});
	}
	return availableStates;
};

/**
 * Processes a page number passed into it, checking if it's valid, and if it needs to be converted into a int.
 *
 * Additionally, since page numbers on the server count from 0, whereas `antd` counts from 1, it can convert from
 * either or using the `forAPI` param.
 * @param pageNumber The current page that the user is on in the UI from the URL
 * @param forAPI If the processed page number you'd like back is being sent to the server (count from zero)
 * @returns A `number` that has been validated and converted.
 */
const parsePageNumber = (pageNumber?: number | string | null, forAPI?: boolean): number => {
	if (pageNumber) {
		const parsedPage = typeof pageNumber === 'string' ? parseInt(pageNumber) : pageNumber;
		if (isValidPageNumber(parsedPage)) {
			return forAPI ? parsedPage - 1 : parsedPage;
		}
	}
	return forAPI ? 0 : 1;
};

/**
 * Gets and parses filters from the URL params. Given that the search param may be null or otherwise invalid
 * this function returns a normalized string array.
 *
 * @param rawFilters The raw string of filters from the query param.
 * @returns A standardized string array of potential filters.
 */
const parseFilters = (rawFilters?: string | null): string[] => {
	if (rawFilters) {
		const decodedFilters = rawFilters.split(',');
		return decodedFilters;
	}
	return [];
};

/**
 * Checks if the set of filters passed into it are a part of the possible filters set.
 * @param appliedFilters A string array containing the filters passed in via URL.
 * @returns `true` if filters are included in possible set, `false` if an unknown filter is encountered.
 */
const isFilterKeySet = (appliedFilters: string[]): appliedFilters is FilterKeys[] => {
	for (const appliedFilter of appliedFilters) {
		if (!isFilterKey(appliedFilter)) {
			return false;
		}
	}
	return true;
};
