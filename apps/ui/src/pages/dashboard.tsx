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

import { Alert, Col, Flex, Layout, Modal, Row, Typography, theme } from 'antd';
import { useEffect, useState } from 'react';

import { contentWrapperStyles } from '@/components/layouts/ContentWrapper';
import { mockUserID } from '@/components/mock/applicationMockData';
import ApplicationStatusBar from '@/components/pages/dashboard/ApplicationStatusBar';
import ApplicationCard from '@/components/pages/dashboard/cards/ApplicationCard';
import LoadingApplicationCard from '@/components/pages/dashboard/cards/LoadingApplicationCard';
import NewApplicationCard from '@/components/pages/dashboard/cards/NewApplicationCard';
import { fetch } from '@/global/FetchClient';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { Application, ServerError } from '@/global/types';

const { Content } = Layout;
const { Text } = Typography;

const DashboardPage = () => {
	const { useToken } = theme;
	const [openModal, setOpenModal] = useState(false);
	const [modalAppId, setModalAppId] = useState('');

	const [applicationData, setApplicationData] = useState<Array<Application> | undefined>(undefined);
	const [error, setError] = useState<ServerError | undefined>(undefined);

	const { token } = useToken();
	const minWidth = useMinWidth();
	const showDeviceRestriction = minWidth <= 1024;

	const showEditApplicationModal = (id: string) => {
		setModalAppId(id);
		setOpenModal(true);
	};

	// TODO: logic to change ApplicationState from current to draft then redirect user to the relevant Application Form page
	const handleOk = () => {
		setOpenModal(false);
	};

	useEffect(() => {
		async function getApplicationData() {
			const result = await fetch(`/applications?userId=${mockUserID}`);
			if (result.ok) {
				return await result.json();
			} else {
				const serverError: ServerError = await result.json();

				setError({
					message: serverError.message,
					errors: serverError.errors ?? result.statusText,
				});

				return [];
			}
		}
		const data = getApplicationData();

		data
			.then((data: Application[]) => setApplicationData(data))
			.catch((error: TypeError) => {
				setError({
					message: 'Unable to talk to API',
					errors: `Failed to get applications, please check your internet connection. - ${error.message}`,
				});
				setApplicationData([]);
			});
	}, []);

	return (
		<>
			{error ? (
				// TODO: Temporary, until we get guidance on how to display error states.
				<Alert
					message={error.errors ? error.message : 'An Error Occurred.'}
					description={error.errors ?? error.message}
					showIcon
					type="error"
				/>
			) : null}
			{showDeviceRestriction ? (
				<Alert
					message="This website may not be supported by your device."
					description="Please visit this website using a device with a wider screen for optimal experience and access to all features."
					type="error"
					style={{ width: '100%' }}
					showIcon
				/>
			) : null}
			<Content>
				<Flex style={{ height: '100%' }} vertical>
					<ApplicationStatusBar />
					<div
						style={{
							...contentWrapperStyles,
							width: showDeviceRestriction ? '100%' : '90%',
							padding: showDeviceRestriction ? token.paddingSM : token.paddingXL,
						}}
					>
						<Row
							gutter={[
								showDeviceRestriction ? token.size : token.sizeXL,
								showDeviceRestriction ? token.size : token.sizeXL,
							]}
							align={'middle'}
							justify={'center'}
							wrap
						>
							{applicationData === undefined ? (
								<>
									<Col span={showDeviceRestriction ? 24 : 12}>
										<NewApplicationCard />
									</Col>
									<Col span={showDeviceRestriction ? 24 : 12}>
										<LoadingApplicationCard />
									</Col>
									<Col span={showDeviceRestriction ? 24 : 12}>
										<LoadingApplicationCard />
									</Col>
									<Col span={showDeviceRestriction ? 24 : 12}>
										<LoadingApplicationCard />
									</Col>
								</>
							) : (
								<>
									<Col xs={24} md={24} lg={12}>
										<NewApplicationCard />
									</Col>
									{applicationData.map((applicationItem) => {
										return (
											<Col key={applicationItem.id} xs={24} md={24} lg={12}>
												<ApplicationCard application={applicationItem} openEdit={showEditApplicationModal} />
											</Col>
										);
									})}
								</>
							)}
						</Row>
					</div>
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
		</>
	);
};

export default DashboardPage;
