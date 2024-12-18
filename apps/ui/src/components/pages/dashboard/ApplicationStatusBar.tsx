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

import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Col, Flex, Row, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';

import StatusBarWrapper from '@/components/layouts/StatusBarWrapper';
import { useMinWidth } from '@/global/hooks/useMinWidth';

const { Text, Title } = Typography;
const { useToken } = theme;

// TODO: properly type and verify incoming data once API service is completed
type ApplicationStatusBarProps = {
	expiresAt?: Date;
};

const ApplicationStatusBar = ({ expiresAt }: ApplicationStatusBarProps) => {
	const { t } = useTranslation();
	const { token } = useToken();
	const minWidth = useMinWidth();
	const isLowResDevice = minWidth <= token.screenLG;

	const formatDate = (expiresAt: Date) => {
		const expiresDate = t('date.intlDateTime', {
			val: new Date(expiresAt),
			formatParams: {
				val: { year: 'numeric', month: 'long', day: 'numeric' },
			},
		});

		return `${t('label.expires')}: ${expiresDate}`;
	};

	return (
		<StatusBarWrapper>
			<Row style={{ width: '100%' }} gutter={token.sizeXXL} wrap>
				<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
					<Flex style={{ height: '100%' }} vertical justify="center" align="start">
						<Title>{t('dashboard.title')}</Title>
						<Text>{t('dashboard.description')}</Text>
					</Flex>
				</Col>
				<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
					<Flex style={{ height: '100%' }} justify={isLowResDevice ? 'center' : 'end'} align="center">
						<Flex
							style={{
								padding: token.paddingLG,
								backgroundColor: token.colorBgContainer,
								borderRadius: token.borderRadius,
								margin: isLowResDevice ? `${token.paddingMD}px 0` : 'none',
							}}
							justify="center"
							align="center"
							gap={20}
						>
							{expiresAt ? (
								<>
									<CheckCircleFilled style={{ color: token.colorPrimary, fontSize: 30 }} />
									<Flex vertical>
										<Text strong>{t('dashboard.hasAccess')}</Text>
										<Text>{formatDate(expiresAt)}</Text>
									</Flex>
								</>
							) : (
								<Flex align="center" gap={10}>
									<CloseCircleFilled style={{ color: token.colorPrimary, fontSize: 30 }} />
									<Text strong>{t('dashboard.noAccess')}</Text>
								</Flex>
							)}
						</Flex>
					</Flex>
				</Col>
			</Row>
		</StatusBarWrapper>
	);
};

export default ApplicationStatusBar;
