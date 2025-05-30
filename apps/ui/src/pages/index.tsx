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

import { AuditOutlined, FileOutlined, SignatureOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Flex, Layout, Row, Typography, theme } from 'antd';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { contentWrapperStyles } from '@/components/layouts/ContentWrapper';
import { useMinWidth } from '@/global/hooks/useMinWidth';

import ApplyForAccessModal from '@/components/modals/ApplyForAccessModal';

const { Content } = Layout;
const { Title, Paragraph, Link, Text } = Typography;
const { useToken } = theme;

const heroStyle: React.CSSProperties = {
	...contentWrapperStyles,
	minHeight: 400,
	paddingBottom: 50,
	paddingTop: 50,
};

const HomePage = () => {
	const { t: translate } = useTranslation();
	const { token } = useToken();
	const minWidth = useMinWidth();
	const [openModal, setOpenModal] = useState(false);

	const isResponsiveMode = minWidth <= token.screenLG;

	return (
		<Content>
			<Row className="hero-background-image" align="middle">
				<Row align="middle" style={{ ...heroStyle, width: isResponsiveMode ? '95%' : '90%' }} gutter={[90, 60]}>
					<Col span={24} lg={12}>
						<Flex vertical>
							<Title style={{ color: token.colorTextSecondary }}> {translate('homepage.title')}</Title>
							<Paragraph style={{ color: token.colorTextSecondary }}>{translate('homepage.introduction')}</Paragraph>
							<Col span={6} style={{ padding: 0 }}>
								<Button type="link" color="primary" variant="solid" onClick={() => setOpenModal(true)}>
									{translate('button.getStarted')}
								</Button>
							</Col>
						</Flex>
					</Col>
				</Row>
			</Row>
			<Row style={{ ...heroStyle, width: isResponsiveMode ? '95%' : '90%' }} align={'top'} gutter={[90, 60]}>
				<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
					<Flex vertical gap={'middle'}>
						<Title level={2}>{translate('homepage.overviewTitle')}</Title>
						<Paragraph>{translate('homepage.authorizationText')}</Paragraph>
						<Paragraph>
							<Trans
								i18nKey={'homepage.dataAccessInfo'}
								components={{
									link1: <Link href="#" underline />,
								}}
							/>
						</Paragraph>
					</Flex>
				</Col>
				<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
					<Flex vertical gap={'large'}>
						<Title level={2}>{translate('homepage.processTitle')}</Title>
						<Flex align="center" gap={'middle'}>
							<Flex justify="center" align="center">
								<Avatar
									style={{ backgroundColor: '#C0DCF3', color: 'rgba(0,0,0,0.5)' }}
									size={60}
									icon={<FileOutlined />}
								/>
							</Flex>
							<Text>{translate('homepage.description1')}</Text>
						</Flex>
						<Flex align="center" gap={'middle'}>
							<Flex justify="center" align="center">
								<Avatar
									style={{ backgroundColor: '#FDD6CB', color: 'rgba(0,0,0,0.5)' }}
									size={60}
									icon={<SignatureOutlined />}
								/>
							</Flex>
							<Text>{translate('homepage.description2')}</Text>
						</Flex>
						<Flex align="center" gap={'middle'}>
							<Flex justify="center" align="center">
								<Avatar
									style={{ backgroundColor: '#D3F7F0', color: 'rgba(0,0,0,0.5)' }}
									size={60}
									icon={<AuditOutlined />}
								/>
							</Flex>
							<Text>{translate('homepage.description3')}</Text>
						</Flex>
					</Flex>
				</Col>
			</Row>
			<ApplyForAccessModal openModal={openModal} setOpenModal={setOpenModal} />
		</Content>
	);
};

export default HomePage;
