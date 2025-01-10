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
import DashboardFilter, { FilterKeyType } from '@/components/pages/manage/DashboardFilter';
import StatusTableColumn from '@/components/pages/manage/StatusTableColumn';
import { pcglTableTheme } from '@/components/providers/ThemeProvider';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { ApplicationStateValues } from '@pcgl-daco/data-model/src/types';

import { ConfigProvider, Flex, Table, theme, Typography } from 'antd';

import { useTranslation } from 'react-i18next';

const { Text, Link } = Typography;
const { useToken } = theme;

export interface TableData {
	id: number;
	institution: string;
	institution_country: string;
	applicant_full_name: string;
	updated_at: number;
	applicant_institutional_email: string;
	state: string;
}

export interface FilterState {
	key: FilterKeyType;
	amount: number;
}

interface ManagementDashboardProps {
	onFilterChange: (filtersEnabled: FilterKeyType[]) => void;
	filterCounts: FilterState[];
	filters: FilterKeyType[];
	data: TableData[];
}

const tableColumnConfiguration = [
	{
		title: 'Application #',
		dataIndex: 'id',
		key: 'id',
		render: (value: string) => (
			<Link href={`/application/${value}`} style={{ textDecoration: 'underline' }}>
				PCGL-{value}
			</Link>
		),
		sorter: (a: { id: number }, b: { id: number }) => a.id - b.id,
	},
	{
		title: 'Institution',
		dataIndex: 'institution',
		key: 'institution',
	},
	{
		title: 'Country',
		dataIndex: 'institution_country',
		key: 'institution_country',
	},
	{
		title: 'Applicant',
		dataIndex: 'applicant_full_name',
		key: 'applicant_full_name',
	},
	{
		title: 'Email',
		dataIndex: 'applicant_institutional_email',
		key: 'applicant_institutional_email',
	},
	{
		title: 'Updated',
		dataIndex: 'updated_at',
		key: 'updated_at',
		render: (value: number) => new Date(value).toLocaleDateString('en-CA'),
		sorter: (a: { updated_at: number }, b: { updated_at: number }) => {
			return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
		},
	},
	{
		title: 'Status',
		dataIndex: 'state',
		key: 'state',
		render: (value: ApplicationStateValues) => <StatusTableColumn value={value} />,
		sorter: (a: { state: string }, b: { state: string }) => (a.state < b.state ? -1 : a.state > b.state ? 1 : 0),
	},
];

const ManagementDashboard = ({ onFilterChange, filterCounts, filters, data }: ManagementDashboardProps) => {
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
						rowKey={(record: TableData) => `PCGL-${record.id}-${record.institution}`}
						pagination={{ pageSize: 10 }}
						dataSource={data}
						columns={tableColumnConfiguration}
						style={{ width: '100%', height: '100%' }}
					/>
				</ConfigProvider>
			</Flex>
		</Flex>
	);
};

export default ManagementDashboard;
