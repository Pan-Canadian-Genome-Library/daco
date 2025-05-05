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

import { Button, Flex, Layout, theme, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { pcglColours } from '@/providers/ThemeProvider';
import { useMatch, useNavigate } from 'react-router';

const { useToken } = theme;
const { Content } = Layout;
const { Text, Title } = Typography;

const InstitutionalRepLogin = () => {
	const { token } = useToken();
	const { t: translate } = useTranslation();
	const navigation = useNavigate();

	const match = useMatch('review/:applicationId');

	const landingPageOuter: React.CSSProperties = {
		backgroundColor: pcglColours.white,
		display: 'flex',
	};

	const landingPageInner: React.CSSProperties = {
		backgroundColor: pcglColours.tertiary,
		margin: token.marginLG,
		padding: token.marginLG,
	};

	const landingPageDescription: React.CSSProperties = {
		maxWidth: '35rem',
	};

	const onLoginClick = () => {
		/**
		 * TODO: This should go to the Login Provider.
		 * Instead of directly to the application.
		 */
		if (match?.params.applicationId) {
			const redirectTo = `/application/${match.params.applicationId}/`;
			navigation(redirectTo);
		} else {
			navigation('/');
		}
	};

	return (
		<Content
			style={{
				...landingPageOuter,
			}}
		>
			<Flex justify="center" align="center" vertical flex={1} style={{ ...landingPageInner }}>
				<Flex flex={1} justify="center" vertical gap={'3rem'}>
					<Flex align="flex-start" justify="center" vertical gap={'1rem'}>
						<Title level={1}>{translate('repView.title')}</Title>
						<Text style={landingPageDescription}>{translate('repView.description')}</Text>
					</Flex>
					<div>
						<Button type="primary" onClick={onLoginClick}>
							{translate('repView.login')}
						</Button>
					</div>
				</Flex>
			</Flex>
		</Content>
	);
};

export default InstitutionalRepLogin;
