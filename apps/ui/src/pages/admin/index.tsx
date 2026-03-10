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

import { DashboardOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Flex, Row, Spin, Typography } from 'antd';
import { useNavigate } from 'react-router';

import useImportStudies from '@/api/mutations/useImportStudies';
import ContentWrapper from '@/components/layouts/ContentWrapper';
import { pcglColours } from '@/providers/ThemeProvider';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;

const cardStyle: React.CSSProperties = {
	borderTop: `4px solid ${pcglColours.primary}`,
	borderRadius: 8,
	boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
	height: '100%',
	minWidth: 320,
};

const AdminDashboardPage = () => {
	const { mutateAsync: syncStudies, isPending } = useImportStudies();
	const navigate = useNavigate();
	const { t: translate } = useTranslation();

	const handleSyncStudies = async () => {
		await syncStudies();
	};

	const adminActions = [
		{
			key: 'import',
			title: translate('admin.dashboard.card.import.title'),
			description: translate('admin.dashboard.card.import.description'),
			action: handleSyncStudies,
			buttonLabel: translate('admin.dashboard.card.import.button'),
			buttonDisabled: isPending,
			buttonIcon: isPending ? <Spin size="small" /> : undefined,
		},
		{
			key: 'studies',
			title: translate('admin.dashboard.card.activateStudies.title'),
			description: translate('admin.dashboard.card.activateStudies.description'),
			action: () => navigate('/admin/studies'),
			buttonLabel: translate('admin.dashboard.card.activateStudies.button'),
			buttonDisabled: false,
			buttonIcon: undefined,
		},
	];

	return (
		<ContentWrapper style={{ padding: '3rem 0', height: '100%' }}>
			<Flex vertical gap={32} style={{ width: '100%' }}>
				<Flex vertical gap={4}>
					<Flex align="center" gap={12}>
						<DashboardOutlined style={{ fontSize: 28, color: pcglColours.primary }} />
						<Title level={2} style={{ margin: 0, color: pcglColours.secondary }}>
							{translate('admin.dashboard.pageTitle')}
						</Title>
					</Flex>
					<Paragraph style={{ margin: 0, color: pcglColours.darkGrey, fontSize: 15, paddingLeft: 40 }}>
						{translate('admin.dashboard.pageDescription')}
					</Paragraph>
				</Flex>
				<Divider style={{ margin: 0 }} />
				<Flex vertical gap={16}>
					<Text
						strong
						style={{ fontSize: 13, letterSpacing: '0.06em', color: pcglColours.darkGrey, textTransform: 'uppercase' }}
					>
						{translate('admin.dashboard.quickActions')}
					</Text>
					<Row gutter={[24, 24]}>
						{adminActions.map(({ key, title, description, action, buttonLabel, buttonDisabled, buttonIcon }) => (
							<Col key={key} xs={24} sm={24} md={12} lg={10} xl={8}>
								<Card
									style={cardStyle}
									styles={{ body: { height: '100%', display: 'flex', flexDirection: 'column', gap: 16 } }}
								>
									<Flex vertical gap={8} flex={1}>
										<Title level={4} style={{ margin: 0, color: pcglColours.secondary }}>
											{title}
										</Title>
										<Paragraph style={{ margin: 0, color: pcglColours.darkGrey, fontSize: 14, lineHeight: 1.6 }}>
											{description}
										</Paragraph>
									</Flex>
									<Button
										type="primary"
										size="large"
										icon={buttonIcon}
										disabled={buttonDisabled}
										onClick={action}
										style={{ alignSelf: 'flex-start', marginTop: 8 }}
									>
										{buttonLabel}
									</Button>
								</Card>
							</Col>
						))}
					</Row>
				</Flex>
			</Flex>
		</ContentWrapper>
	);
};

export default AdminDashboardPage;
