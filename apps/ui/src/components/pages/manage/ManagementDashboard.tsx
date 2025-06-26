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

import { contentWrapperStyles } from '@/components/layouts/ContentWrapper';
import StatusTableColumn from '@/components/pages/manage/ApplicationStatusColumn';
import DashboardFilter, { type FilterKeys } from '@/components/pages/manage/DashboardFilter';
import RowCount from '@/components/pages/manage/RowCount';
import { GC_STANDARD_GEOGRAPHIC_AREAS } from '@/global/constants';
import { pcglTableTheme } from '@/providers/ThemeProvider';
import { type ApplicationListSummary, type ApplicationStateValues } from '@pcgl-daco/data-model/src/types';

import { ConfigProvider, Flex, Table, TablePaginationConfig, theme, Typography } from 'antd';
import { FilterValue, SorterResult } from 'antd/es/table/interface';

const { Link } = Typography;
const { useToken } = theme;

export interface FilterState {
	key: FilterKeys;
	amount: number;
}

export interface TableParams {
	pagination?: TablePaginationConfig;
}

interface ManagementDashboardProps {
	onFilterChange: (filtersEnabled: FilterKeys[]) => void;
	onRowsChange: (pageCount: number) => void;
	onTableChange: ({
		pagination,
		filters,
		sorter,
	}: {
		pagination: TablePaginationConfig;
		filters: Record<string, FilterValue | null>;
		sorter: SorterResult<ApplicationListSummary>[] | SorterResult<ApplicationListSummary>;
	}) => void;
	filterCounts: FilterState[];
	rowsCount: number | undefined;
	filters: FilterKeys[];
	data: ApplicationListSummary[];
	loading: boolean;
	pagination: TablePaginationConfig;
}

const tableColumnConfiguration = [
	{
		title: 'Application #',
		dataIndex: 'id',
		render: (value: number) => (
			<Link href={`/application/${value}`} style={{ textDecoration: 'underline' }}>
				PCGL-{value}
			</Link>
		),
		sorter: { multiple: 1 },
	},
	{
		title: 'Institution',
		dataIndex: ['applicant', 'institution'],
		key: 'institution',
		render: (value: string, record: ApplicationListSummary) =>
			record.applicant?.institution ? record.applicant.institution : '-',
	},
	{
		title: 'Country',
		dataIndex: ['applicant', 'country'],
		key: 'country',
		render: (value: string, record: ApplicationListSummary) =>
			//FIXME: i18n: When french support is added, we need to make this toggle dynamic somehow
			record.applicant?.country
				? (GC_STANDARD_GEOGRAPHIC_AREAS.find((country) => country.iso === record.applicant?.country)?.en ?? '-')
				: '-',
	},
	{
		title: 'Applicant',
		dataIndex: ['applicant', 'firstName'],
		key: 'applicant',
		render: (value: string, record: ApplicationListSummary) =>
			record.applicant?.firstName && record.applicant.lastName
				? `${record.applicant.firstName} ${record.applicant.lastName}`
				: '-',
	},
	{
		title: 'Email',
		dataIndex: ['applicant', 'email'],
		key: 'email',
		render: (value: string, record: ApplicationListSummary) => (record.applicant?.email ? record.applicant.email : '-'),
	},
	{
		title: 'Updated',
		dataIndex: 'updatedAt',
		key: 'updatedAt',
		render: (value?: string) => (value ? new Date(value).toLocaleDateString('en-CA') : '-'),
		sorter: { multiple: 2 },
	},
	{
		title: 'Status',
		dataIndex: 'state',
		key: 'state',
		render: (value: ApplicationStateValues) => <StatusTableColumn value={value} />,
		sorter: { multiple: 3 },
	},
];

const ManagementDashboard = ({
	onFilterChange,
	onTableChange,
	onRowsChange,
	rowsCount,
	filterCounts,
	filters,
	pagination,
	data,
	loading,
}: ManagementDashboardProps) => {
	const { token } = useToken();

	return (
		<Flex
			style={{ ...contentWrapperStyles, padding: `${token.paddingLG}px ${token.paddingLG}px` }}
			gap={token.paddingSM}
			vertical
		>
			<Flex justify="right" align="center">
				<DashboardFilter
					onFilterChange={(filtersActive) => onFilterChange(filtersActive)}
					filters={filters}
					availableStates={filterCounts}
				/>
			</Flex>
			<Flex style={{ width: '100%', height: '100%', margin: '.5rem 0' }} vertical>
				<ConfigProvider theme={pcglTableTheme}>
					<Table
						rowKey={(record) => {
							return `${record.id}-${record.createdAt}`;
						}}
						dataSource={data}
						loading={loading}
						columns={tableColumnConfiguration}
						pagination={pagination}
						onChange={(pagination, filters, sorter) => onTableChange({ pagination, filters, sorter })}
						style={{ width: '100%', height: '100%' }}
					/>
				</ConfigProvider>
				<RowCount
					rowCount={rowsCount}
					onRowsChange={onRowsChange}
					style={{ translate: '.75rem -2.5rem', display: data.length ? 'block' : 'none' }}
				/>
			</Flex>
		</Flex>
	);
};

export default ManagementDashboard;
