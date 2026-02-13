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

import { Button, Flex, Table, TableColumnsType } from 'antd';

import useGetStudies from '@/api/queries/useGetStudies';
import ContentWrapper from '@/components/layouts/ContentWrapper';
import { StudyDTO } from '@pcgl-daco/data-model';

const AdminStudiesPage = () => {
	const { data, isLoading, isError } = useGetStudies();

	const columns: TableColumnsType<StudyDTO> = [
		{
			key: 'names',
			title: 'Study Name',
			dataIndex: 'studyName',

			colSpan: 1,
		},
		{
			key: 'acceptingsStatus',
			title: 'Accepting Status',
			dataIndex: 'acceptingStatus',
			width: '400px',
			align: 'center',
			render: (_, record) => {
				const isAccepting = record.acceptingApplications;
				return (
					<Button
						onClick={() => {}}
						color={isAccepting ? 'green' : 'danger'}
						variant="solid"
						style={{ width: '150px' }}
					>
						{isAccepting ? 'Accepting' : 'Not Accepting'}
					</Button>
				);
			},
		},
	];

	if (isLoading || isError) return <>Loading</>;
	return (
		<ContentWrapper style={{ height: '100%', width: '100%', padding: '2em 0', gap: '3rem' }}>
			<Flex flex={1} vertical justify="center" align="center" gap={'large'}>
				<Table rowKey="studyId" style={{ width: '100%' }} dataSource={data} columns={columns} />;
			</Flex>
		</ContentWrapper>
	);
};

export default AdminStudiesPage;
