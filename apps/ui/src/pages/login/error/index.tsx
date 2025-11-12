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
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH D
 */
import { Button, Flex, Layout, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';

import ApplyForAccessModal from '@/components/modals/ApplyForAccessModal';
import { errorStyles, errorStylesCondensed } from '@/components/pages/global/ErrorPage';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

const { Content } = Layout;
const { Title, Text } = Typography;
const { useToken } = theme;

const LoginError = () => {
	const minWidth = useMinWidth();
	const { t: translate } = useTranslation();
	const { token } = useToken();
	const [searchParams] = useSearchParams();
	const isLowResDevice = minWidth <= token.screenLGMin;
	const [applyForAccessOpen, setApplyForAccessOpen] = useState(false);

	const code = searchParams.get('code');

	const buttonContainerStyles: React.CSSProperties = {
		margin: isLowResDevice ? '2rem 0' : '3rem 0',
	};

	return (
		<Content
			style={{
				...(isLowResDevice ? errorStylesCondensed : { ...errorStyles }),
			}}
		>
			<Flex vertical>
				<Title>{translate('global.loginError.title')}</Title>
				<Flex vertical gap={'1rem'}>
					<Title level={2} style={{ marginTop: '-.2rem', fontSize: token.fontSizeHeading4 }}>
						{translate([
							`global.loginError.descriptions.${code}.subheading`,
							'global.loginError.descriptions.SYSTEM_ERROR.subheading',
						])}
					</Title>
					<Text>
						{translate([
							`global.loginError.descriptions.${code}.description`,
							'global.loginError.descriptions.SYSTEM_ERROR.description',
						])}
					</Text>

					{(code === 'NOT_FOUND' || code === 'SELF_REGISTRATION_SENT') && (
						<>
							<Text>{translate([`global.loginError.descriptions.${code}.description2`])}</Text>
						</>
					)}
				</Flex>
				<Flex style={{ ...buttonContainerStyles }}>
					{code === 'NOT_FOUND' ? (
						<>
							<Button type="link" color="primary" variant="solid" onClick={() => setApplyForAccessOpen(true)}>
								{translate('button.getStarted')}
							</Button>
							<ApplyForAccessModal openModal={applyForAccessOpen} setOpenModal={setApplyForAccessOpen} />
						</>
					) : (
						<>
							<Button href="/" type="primary">
								{translate('global.loginError.buttons.home')}
							</Button>
						</>
					)}
				</Flex>
			</Flex>
		</Content>
	);
};

export default LoginError;
