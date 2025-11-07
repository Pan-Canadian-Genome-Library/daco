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

import useGetApplicationList, { ApplicationListSortingOptions } from '@/api/queries/useGetApplicationList';
import ErrorPage from '@/components/pages/global/ErrorPage';
import PageHeader from '@/components/pages/global/PageHeader';
import { isFilterKey, type FilterKeys } from '@/components/pages/manage/DashboardFilter';
import ManagementDashboard from '@/components/pages/manage/ManagementDashboard';
import {
	calculateFilterAmounts,
	DEFAULT_FILTER_STATE,
	DEFAULT_NUMBER_OF_ROWS,
	isFilterKeySet,
	isValidRowNumber,
	parseFilters,
	parsePageNumber,
	parseRowNumber,
	parseSortingOptions,
	transformSearchText,
} from '@/components/pages/manage/utils/manageUtils';
import { isValidPageNumber } from '@/global/utils';
import { ApplicationListSummary, isApplicationStateValue } from '@pcgl-daco/data-model';

import { Flex, Layout, TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';

import { CloseCircleOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

const { Content } = Layout;

const { Search } = Input;

export interface TableProperties {
	pagination: TablePaginationConfig;
}

const ManageApplicationsPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const appliedFilters = searchParams.get('filters');
	const appliedPage = searchParams.get('page');
	const appliedRows = Number(searchParams.get('rows'));
	const appliedSearch = searchParams.get('search');

	const [sorting, setSorting] = useState<ApplicationListSortingOptions[]>();
	const [search, setSearchText] = useState<string>('');

	const [tableParams, setTableParams] = useState<TableProperties>({
		pagination: {
			showSizeChanger: false,
			current: 1,
			pageSize: DEFAULT_NUMBER_OF_ROWS,
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
		sort: sorting ? sorting : undefined,
		state: parseFilters(appliedFilters).filter((filter) => isApplicationStateValue(filter)),
		page: parsePageNumber(tableParams.pagination?.current, true),
		pageSize: parseRowNumber(appliedRows),
		search: appliedSearch || '',
	});

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
	 * Gets called whenever the "show X rows" toggle is changed.
	 * @param pageCount The currently selected count (20, 50, 100)
	 */
	const handleRowChange = (pageCount: number) => {
		setSearchParams((prev) => {
			prev.set('rows', String(pageCount));
			return prev;
		});
	};
	/**
	 * Gets called whenever user inputs text into searchbar
	 * @param searchText String of user input
	 */
	const handleSearchChange = (searchText: string) => {
		setSearchParams((prev) => {
			prev.set('search', transformSearchText(searchText));
			return prev;
		});
		setSearchText(searchText);
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
		sorter: SorterResult<ApplicationListSummary>[] | SorterResult<ApplicationListSummary>;
	}) => {
		const page = pagination.current;
		const pageSize = pagination.pageSize;
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
			prev.set('rows', parsePageNumber(pageSize, false).toString());
			return prev;
		});
	};

	/**
	 * This effect is required to validate and set state based off our URL on load, and otherwise.
	 */
	useEffect(() => {
		const allUrlParams = new URLSearchParams();

		const missingOrInvalidPageState =
			!appliedFilters ||
			!appliedPage ||
			!appliedRows ||
			!isValidPageNumber(Number(appliedPage)) ||
			!isValidRowNumber(Number(appliedRows));

		const unknownFilters = !isFilterKeySet(parseFilters(appliedFilters));

		/**
		 * If somehow the user ends up at our page with just `/manage/applications` and no URL set state
		 * we have to reset to a known good state, and exit out with the defaults.
		 *
		 * If they _do_ have a URL-bound state, we can't trust that they have a known set of "good" filters selected.
		 * We should validate this first before continuing.
		 */
		if (missingOrInvalidPageState || unknownFilters) {
			allUrlParams.set('filters', DEFAULT_FILTER_STATE);
			allUrlParams.set('page', '1');
			allUrlParams.set('rows', DEFAULT_NUMBER_OF_ROWS.toString());
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
					pageSize: parseRowNumber(appliedRows),
					current: parsePageNumber(appliedPage, false),
				},
			};
		});
	}, [appliedFilters, appliedPage, appliedRows, setSearchParams]);

	/**
	 * Whenever the table params change we want to ensure we fire off a network request.
	 */
	useEffect(() => {
		tableDataRefetch();
	}, [tableDataRefetch, searchParams]);

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
				<PageHeader title={translate('manage.applications.title')}>
					{!isTableLoading || !tableError ? (
						<Search
							placeholder={translate('manage.search')}
							enterButton
							onSearch={(value) => {
								handleSearchChange(value);
							}}
							allowClear={{ clearIcon: <CloseCircleOutlined /> }}
						/>
					) : null}
				</PageHeader>
				{isTableLoading ? (
					<ErrorPage loading={isTableLoading} error={tableError} />
				) : (
					<ManagementDashboard
						filterCounts={tableData?.totals ? calculateFilterAmounts(tableData?.totals) : []}
						loading={isTableLoading}
						rowsCount={tableParams.pagination.pageSize}
						onRowsChange={handleRowChange}
						data={tableData && tableData.applications ? tableData.applications : []}
						filters={parseFilters(appliedFilters).filter((filter) => isFilterKey(filter))}
						pagination={tableParams.pagination ? tableParams.pagination : {}}
						onTableChange={handleTableChange}
						onFilterChange={(filtersEnabled) => handleFilterChange(filtersEnabled)}
						search={search}
					/>
				)}
			</Flex>
		</Content>
	);
};

export default ManageApplicationsPage;
