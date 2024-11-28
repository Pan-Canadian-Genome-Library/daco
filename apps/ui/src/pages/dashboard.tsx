/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import { Col, Flex, Layout, Modal, Row, Typography } from 'antd';
import { useState } from 'react';

import ContentWrapper from '@/components/layouts/ContentWrapper';
import { applications } from '@/components/mock/applicationMockData';
import ApplicationStatusBar from '@/components/pages/dashboard/ApplicationStatusBar';
import ApplicationCard from '@/components/pages/dashboard/cards/ApplicationCard';
import NewApplicationCard from '@/components/pages/dashboard/cards/NewApplicationCard';

const { Content } = Layout;
const { Text } = Typography;

const DashboardPage = () => {
	const [openModal, setOpenModal] = useState(false);
	const [modalAppId, setModalAppId] = useState('');

	const showEditApplicationModal = (id: string) => {
		setModalAppId(id);
		setOpenModal(true);
	};

	// TODO: logic to change status from current to draft then redirect user
	const handleOk = () => {
		setOpenModal(false);
	};

	return (
		<Content>
			<Flex style={{ height: '100%' }} vertical>
				<ApplicationStatusBar />
				<ContentWrapper style={{ padding: 40 }}>
					<Row gutter={[48, 48]} align={'middle'} justify={'center'}>
						{applications.length > 0 ? (
							<>
								<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
									<NewApplicationCard />
								</Col>
								{applications.map((applicationItem) => {
									return (
										<Col key={applicationItem.id} xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
											<ApplicationCard application={applicationItem} openEdit={showEditApplicationModal} />
										</Col>
									);
								})}
							</>
						) : (
							<Col span={12}>
								<NewApplicationCard />
							</Col>
						)}
					</Row>
				</ContentWrapper>
			</Flex>
			<Modal
				title={`Are you sure you want to edit Applications: PCGL-${modalAppId}?`}
				okText={'Edit Application'}
				width={'100%'}
				style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
				open={openModal}
				onOk={handleOk}
				onCancel={() => setOpenModal(false)}
			>
				<Flex style={{ height: '100%', marginTop: 20 }}>
					<Text>
						If so, the application will move back into Draft status and you will need to resubmit the application for
						review.
					</Text>
				</Flex>
			</Modal>
		</Content>
	);
};

export default DashboardPage;
