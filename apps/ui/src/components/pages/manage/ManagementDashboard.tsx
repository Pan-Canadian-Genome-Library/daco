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
import DashboardFilter, { FilterKeys } from '@/components/pages/manage/DashboardFilter';
import StatusTableColumn from '@/components/pages/manage/ApplicationStatusColumn';
import { pcglTableTheme } from '@/components/providers/ThemeProvider';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { ApplicationWithApplicantInformation } from '@/global/types';
import { ApplicationStateValues } from '@pcgl-daco/data-model/src/types';

import { ConfigProvider, Flex, Table, TablePaginationConfig, theme, Typography } from 'antd';
import { FilterValue, SorterResult } from 'antd/es/table/interface';

import { useTranslation } from 'react-i18next';

const { Text, Link } = Typography;
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
	onTableChange: ({
		pagination,
		filters,
		sorter,
	}: {
		pagination: TablePaginationConfig;
		filters: Record<string, FilterValue | null>;
		sorter: SorterResult<ApplicationWithApplicantInformation>[] | SorterResult<ApplicationWithApplicantInformation>;
	}) => void;
	filterCounts: FilterState[];
	filters: FilterKeys[];
	data: ApplicationWithApplicantInformation[];
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
		sorter: { multiple: 3 },
	},
	{
		title: 'Institution',
		dataIndex: ['applicantInformation', 'institution'],
		key: 'institution',
		render: (value: string, record: ApplicationWithApplicantInformation) =>
			record.applicantInformation.institution ? record.applicantInformation.institution : '-',
	},
	{
		title: 'Country',
		dataIndex: ['applicantInformation', 'country'],
		key: 'country',
		render: (value: string, record: ApplicationWithApplicantInformation) =>
			record.applicantInformation.country ? record.applicantInformation.country : '-',
	},
	{
		title: 'Applicant',
		dataIndex: ['applicantInformation', 'firstName'],
		key: 'applicant',
		render: (value: string, record: ApplicationWithApplicantInformation) =>
			record.applicantInformation.firstName && record.applicantInformation.lastName
				? `${record.applicantInformation.firstName} ${record.applicantInformation.lastName}`
				: '-',
		sorter: { multiple: 3 },
	},
	{
		title: 'Email',
		dataIndex: ['applicantInformation', 'email'],
		key: 'email',
		render: (value: string, record: ApplicationWithApplicantInformation) =>
			record.applicantInformation.email ? record.applicantInformation.email : '-',
	},
	{
		title: 'Updated',
		dataIndex: 'updatedAt',
		key: 'updatedAt',
		render: (value?: string) => (value ? new Date(value).toLocaleDateString('en-CA') : '-'),
		sorter: { multiple: 3 },
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
	filterCounts,
	filters,
	pagination,
	data,
	loading,
}: ManagementDashboardProps) => {
	const { t: translate } = useTranslation();
	const { token } = useToken();
	const minWidth = useMinWidth();

	return (
		<Flex
			style={{ ...contentWrapperStyles, padding: `${token.paddingLG}px ${token.paddingLG}px` }}
			gap={token.paddingSM}
			vertical
		>
			<Flex
				justify="space-between"
				align="center"
				vertical={minWidth <= token.screenLGMax}
				gap={minWidth <= token.screenLGMax ? token.paddingSM : 0}
			>
				<Text>{translate('manage.applications.listTitle')}</Text>
				<DashboardFilter
					onFilterChange={(filtersActive) => onFilterChange(filtersActive)}
					filters={filters}
					availableStates={filterCounts}
				/>
			</Flex>
			<Flex style={{ width: '100%', height: '100%' }}>
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
			</Flex>
		</Flex>
	);
};

export default ManagementDashboard;
