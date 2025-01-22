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

import { ConfigProvider, Flex, Grid, Image, Layout, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';

import PCGLFOOTER from '@/assets/pcgl-logo-footer.png';
import { contentWrapperStyles } from '@/components/layouts/ContentWrapper';
import { pcglFooterTheme } from '@/components/providers/ThemeProvider';
import { useMinWidth } from '@/global/hooks/useMinWidth';

const { Footer } = Layout;
const { Text, Link } = Typography;
const { useToken } = theme;
const { useBreakpoint } = Grid;
interface LinkType {
	name: string;
	href?: string;
}

const FooterComponent = () => {
	const { t: translate } = useTranslation();
	const minWidth = useMinWidth();
	const { token } = useToken();
	const breakpoints = useBreakpoint();

	const pcglLinks: LinkType[] = [
		{
			name: translate('links.contact'),
		},
		{
			name: translate('links.policies'),
		},
		{
			name: translate('links.helpGuides'),
		},
		{
			name: translate('links.controlledDataUsers'),
		},
		{
			name: translate('links.pcglWebsite'),
		},
		{
			name: translate('links.dataPlatform'),
		},
	];

	const policiesConditionsLinks: LinkType[] = [
		{
			name: translate('links.privacy'),
		},
		{
			name: translate('links.termsConditions'),
		},
		{
			name: translate('links.publicationPolicy'),
		},
	];

	const linkStyle: React.CSSProperties = {
		textAlign: 'center',
		textWrap: 'nowrap',
	};

	const complianceTextStyle: React.CSSProperties = {
		textAlign: minWidth <= token.screenXL ? 'start' : 'center',
		alignSelf: 'center',
	};

	const footerStyle: React.CSSProperties = {
		display: 'flex',
		flexDirection: minWidth <= token.screenXL ? 'column' : 'row',
		justifyItems: 'center',
		alignItems: 'center',
		padding: minWidth <= token.screenLG ? `2rem 1.75rem` : token.Layout?.footerPadding,
		gap: minWidth <= token.screenXL ? token.paddingXL : '0rem',
	};

	const logoStyles: React.CSSProperties = {
		margin: (() => {
			if (breakpoints.md) return '1rem auto 0 0';
			if (breakpoints.xl) return '0 -8rem 0 0';
			return '1rem 0 0 0';
		})(),
	};

	return (
		<ConfigProvider theme={pcglFooterTheme}>
			<Footer style={footerStyle}>
				<Link target="_blank" style={logoStyles}>
					<Image
						width={200}
						src={PCGLFOOTER}
						preview={false}
						alt="Pan-Canadian Genome Library / Librairie Pancanadienne de Génomique"
					/>
				</Link>
				<Flex style={{ ...contentWrapperStyles, width: '100%' }} flex={1} vertical gap={token.paddingMD}>
					<Flex
						gap={token.paddingMD}
						style={{ width: '100%' }}
						vertical={minWidth <= token.screenXL ? false : true}
						justify={minWidth <= token.screenXL ? 'space-between' : 'center'}
						align={minWidth <= token.screenXL ? 'flex-start' : 'center'}
					>
						<Flex
							gap={token.paddingMD}
							justify="center"
							align={minWidth <= token.screenXL ? 'start' : 'center'}
							vertical={minWidth <= token.screenXL ? true : false}
						>
							{pcglLinks.map((itemLink) => (
								<Link key={itemLink.name} style={linkStyle} underline target="_blank">
									{itemLink.name}
								</Link>
							))}
						</Flex>
						<Flex
							gap={token.paddingMD}
							justify="center"
							align={minWidth <= token.screenXL ? 'start' : 'center'}
							vertical={minWidth <= token.screenXL ? true : false}
						>
							{policiesConditionsLinks.map((itemLink) => (
								<Link key={itemLink.name} style={linkStyle} underline target="_blank">
									{itemLink.name}
								</Link>
							))}
						</Flex>
					</Flex>
					<Text style={complianceTextStyle}>
						&copy; {new Date().getFullYear()} PCGL Data Access Compliance Office. All rights reserved. UI v1.0 - API
						v1.0
					</Text>
				</Flex>
			</Footer>
		</ConfigProvider>
	);
};

export default FooterComponent;
