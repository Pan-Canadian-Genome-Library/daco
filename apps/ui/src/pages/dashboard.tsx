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

import { Alert, Col, Flex, Layout, Row, theme } from 'antd';
import { useTranslation } from 'react-i18next';

import useGetApplicationList from '@/api/queries/useGetApplicationList';

import ContentWrapper, { contentWrapperStyles } from '@/components/layouts/ContentWrapper';
import ApplicationStatusBar from '@/components/pages/dashboard/ApplicationStatusBar';
import ApplicationCard from '@/components/pages/dashboard/cards/ApplicationCard';
import LoadingApplicationCard from '@/components/pages/dashboard/cards/LoadingApplicationCard';
import NewApplicationCard from '@/components/pages/dashboard/cards/NewApplicationCard';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { type ApplicationDTO } from '@pcgl-daco/data-model';

const { Content } = Layout;

const DashboardPage = () => {
	const { useToken } = theme;
	const { t: translate } = useTranslation();

	const { token } = useToken();
	const minWidth = useMinWidth();
	const showDeviceRestriction = minWidth <= 1024;

	const { data: applicationData, error } = useGetApplicationList({
		sort: [
			{
				column: 'created_at',
				direction: 'desc',
			},
		],
		pageSize: 100,
		isApplicantView: true,
	});

	return (
		<>
			{error ? (
				// TODO: Temporary, until we get guidance on how to display error states.
				<Alert
					message={error.error ? error.message : 'An Error Occurred.'}
					description={error.error ?? error.message}
					showIcon
					type="error"
				/>
			) : null}
			{showDeviceRestriction ? (
				<Alert
					message={translate('alert.sizeWarning')}
					description={translate('alert.sizeDescription')}
					type="error"
					style={{ width: '100%' }}
					showIcon
				/>
			) : null}
			<Content>
				<Flex style={{ height: '100%' }} vertical>
					<ApplicationStatusBar />
					<ContentWrapper style={{ padding: '40px 0 40px 0' }}>
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
										{applicationData?.applications.map((applicationItem: ApplicationDTO) => {
											return (
												<Col key={applicationItem.id} xs={24} md={24} lg={12}>
													<ApplicationCard application={applicationItem} />
												</Col>
											);
										})}
									</>
								)}
							</Row>
						</div>
					</ContentWrapper>
				</Flex>
			</Content>
		</>
	);
};

export default DashboardPage;
