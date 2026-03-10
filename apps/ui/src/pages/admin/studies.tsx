/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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

import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined, ExperimentOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Flex, Result, Table, TableColumnsType, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router';

import useToggleAccptingStudies from '@/api/mutations/useToggleAcceptingStudies';
import useGetStudies from '@/api/queries/useGetStudies';
import ContentWrapper from '@/components/layouts/ContentWrapper';
import { pcglColours } from '@/providers/ThemeProvider';
import { StudyDTO } from '@pcgl-daco/data-model';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;

const AdminStudiesPage = () => {
	const { data, isLoading, isError } = useGetStudies();
	const { mutate: toggleStudy } = useToggleAccptingStudies();
	const navigate = useNavigate();
	const { t: translate } = useTranslation();

	const columns: TableColumnsType<StudyDTO> = [
		{
			key: 'names',
			title: 'Study Name',
			dataIndex: 'studyName',
			render: (name: string) => <Text strong>{name}</Text>,
		},
		{
			key: 'status',
			title: 'Status',
			dataIndex: 'acceptingApplications',
			width: 180,
			align: 'center',
			render: (_, record) => {
				const isAccepting = record.acceptingApplications;
				return (
					<Tag
						icon={isAccepting ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
						color={isAccepting ? 'success' : 'error'}
						style={{ fontSize: 13, padding: '3px 10px' }}
					>
						{isAccepting ? 'Accepting' : 'Not Accepting'}
					</Tag>
				);
			},
		},
		{
			key: 'acceptingsStatus',
			title: 'Toggle',
			dataIndex: 'acceptingStatus',
			width: 200,
			align: 'center',
			render: (_, record) => {
				const isAccepting = record.acceptingApplications;
				return (
					<Button
						onClick={() => {
							toggleStudy({ studyId: record.studyId, enabled: !record.acceptingApplications });
						}}
						color={isAccepting ? 'danger' : 'green'}
						variant="outlined"
						style={{ width: '150px' }}
					>
						{isAccepting ? 'Deactivate' : 'Activate'}
					</Button>
				);
			},
		},
	];

	return (
		<ContentWrapper style={{ height: '100%', width: '100%', padding: '3rem 0' }}>
			<Flex vertical gap={32} style={{ width: '100%' }}>
				{/* Page Header */}
				<Flex vertical gap={4}>
					<Button
						type="text"
						icon={<ArrowLeftOutlined />}
						onClick={() => navigate('/admin')}
						style={{
							alignSelf: 'flex-start',
							color: pcglColours.darkGrey,
							padding: '0 4px',
							marginBottom: 4,
						}}
					>
						{translate('admin.activate.backToDashboard')}
					</Button>

					<Flex align="center" gap={12}>
						<ExperimentOutlined style={{ fontSize: 28, color: pcglColours.primary }} />
						<Title level={2} style={{ margin: 0, color: pcglColours.secondary }}>
							{translate('admin.activate.pageTitle')}
						</Title>
					</Flex>
					<Paragraph style={{ margin: 0, color: pcglColours.darkGrey, fontSize: 15, paddingLeft: 40 }}>
						{translate('admin.activate.pageDescription')}
					</Paragraph>
				</Flex>

				<Divider style={{ margin: 0 }} />

				{isError ? (
					<Result
						status="error"
						title="Failed to load studies"
						subTitle="There was a problem fetching the study list."
					/>
				) : (
					<Card
						style={{
							borderRadius: 8,
							boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
							borderTop: `4px solid ${pcglColours.primary}`,
						}}
						styles={{ body: { padding: 0 } }}
					>
						<Table rowKey="studyId" style={{ width: '100%' }} dataSource={data} columns={columns} loading={isLoading} />
					</Card>
				)}
			</Flex>
		</ContentWrapper>
	);
};

export default AdminStudiesPage;
