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

import { Col, Flex, Row, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';

import StatusBannerWrapper from '@/components/layouts/StatusBarWrapper';
import { useMinWidth } from '@/global/hooks/useMinWidth';

const { Text, Title } = Typography;
const { useToken } = theme;

const AppViewerStatusBar = () => {
	const { t: translate } = useTranslation();
	const { token } = useToken();
	const minWidth = useMinWidth();
	const isLowResDevice = minWidth <= token.screenLG;

	const formatDate = (createdAt: Date, updatedAt: Date) => {
		const createdDate = translate('date.intlDateTime', {
			val: new Date(createdAt),
			formatParams: {
				val: { year: 'numeric', month: 'long', day: 'numeric' },
			},
		});

		const updatedDate = translate('date.intlDateTime', {
			val: new Date(updatedAt),
			formatParams: {
				val: { year: 'numeric', month: 'long', day: 'numeric' },
			},
		});

		return `${translate('label.created')}: ${createdDate} | ${translate('label.updatedExtended')}: ${updatedDate}`;
	};

	return (
		<StatusBannerWrapper>
			<Row style={{ width: '100%' }} gutter={token.sizeXXL} wrap>
				<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
					<Flex style={{ height: '100%' }} vertical justify="center" align="start">
						<Title>{translate('dashboard.title')}</Title>
						<Text>{formatDate(new Date(), new Date())}</Text>
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
							<Text>Application Status</Text>
						</Flex>
					</Flex>
				</Col>
			</Row>
		</StatusBannerWrapper>
	);
};

export default AppViewerStatusBar;
