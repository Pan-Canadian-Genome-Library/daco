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

import StatusBannerWrapper from '@/components/layouts/StatusBarWrapper';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { Col, Flex, Row, theme, Typography } from 'antd';
import { PropsWithChildren } from 'react';

const { Text, Title } = Typography;
const { useToken } = theme;

interface PageHeaderProps extends PropsWithChildren {
	title: string;
	description?: string;
}

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
	const { token } = useToken();
	const minWidth = useMinWidth();
	const responsiveMode = minWidth <= token.screenLG;

	return (
		<StatusBannerWrapper style={!description ? { minHeight: 150 } : { minHeight: 300 }}>
			<Row style={{ width: '100%' }} gutter={token.sizeXXL} wrap>
				<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }} xl={{ flex: '50%' }}>
					<Flex style={{ height: '100%' }} vertical justify="center" align="start">
						<Title>{title}</Title>
						{description ? <Text>{description}</Text> : null}
					</Flex>
				</Col>
				<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }} xl={{ flex: '50%' }}>
					<Flex style={{ height: '100%' }} justify={responsiveMode ? 'center' : 'end'} align="center">
						{children ? children : null}
					</Flex>
				</Col>
			</Row>
		</StatusBannerWrapper>
	);
};

export default PageHeader;
