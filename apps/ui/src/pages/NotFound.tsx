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

import { errorStyles, errorStylesCondensed } from '@/components/pages/global/ErrorPage';
import { useMinWidth } from '@/global/hooks/useMinWidth';

const { Content } = Layout;
const { Title, Text } = Typography;
const { useToken } = theme;

const NotFound = () => {
	const minWidth = useMinWidth();
	const { t: translate } = useTranslation();
	const { token } = useToken();

	const isLowResDevice = minWidth <= token.screenLGMin;

	const buttonContainerStyles: React.CSSProperties = {
		margin: isLowResDevice ? '2rem 0' : '2.5rem 0',
	};

	return (
		<Content style={{ ...(isLowResDevice ? errorStylesCondensed : errorStyles) }}>
			<Flex vertical>
				<Title>{translate('notFound.title')}</Title>
				<Text>{translate('notFound.description')}</Text>
				<div style={{ ...buttonContainerStyles }}>
					{/*
					 * This will redirect the appropriate "homepage" for the user
					 * since protected routes redirect to /login/redirect on role match failure
					 *  which determines the correct routing action for the user type.
					 */}
					<Button href="/dashboard" type="primary">
						{translate('notFound.buttons.home')}
					</Button>
				</div>
			</Flex>
		</Content>
	);
};

export default NotFound;
