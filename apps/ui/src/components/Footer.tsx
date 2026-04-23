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

import { Col, ConfigProvider, Flex, Grid, Image, Layout, Row, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';

import PCGL_FOOTER_CIHR from '@/assets/pcgl-logo-footer-cihr.png';
import PCGL_FOOTER from '@/assets/pcgl-logo-footer.png';

import { contentWrapperStyles } from '@/components/layouts/ContentWrapper';
import { pcglFooterTheme } from '@/providers/ThemeProvider';

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
		textAlign: 'left',
		textWrap: 'nowrap',
	};

	const complianceTextStyle: React.CSSProperties = {
		textAlign: 'start',
		alignSelf: 'center',
		width: '100%',
	};

	const footerStyle: React.CSSProperties = {
		display: 'flex',
		flexDirection: breakpoints.lg ? 'row' : 'column',
		justifyItems: 'center',
		width: '100%',
		alignItems: 'center',
		padding: breakpoints.lg ? token.Layout?.footerPadding : `2rem 1.75rem`,
		gap: breakpoints.lg ? '0rem' : token.paddingXL,
	};

	const logoStyles: React.CSSProperties = {
		margin: (() => {
			if (breakpoints.lg) {
				return 'auto 0';
			}
			if (breakpoints.xl) {
				return '0 -8rem 0 0';
			}
			return '1rem auto';
		})(),
	};

	return (
		<ConfigProvider theme={pcglFooterTheme}>
			<Footer style={footerStyle}>
				{breakpoints.lg ? (
					<Flex justify="space-around" style={{ width: '100%' }} gap={30}>
						<Flex vertical style={{ width: '100%' }}>
							<Flex justify={'start'} gap={'40px'}>
								<Link target="_blank" style={logoStyles}>
									<Image width={200} src={PCGL_FOOTER} preview={false} alt={translate('global.PCGL')} />
								</Link>
								<Link target="_blank" style={logoStyles}>
									<Image width={200} src={PCGL_FOOTER_CIHR} preview={false} alt={translate('global.')} />
								</Link>
							</Flex>
							<Flex vertical gap={'small'} style={{ marginTop: '15px' }}>
								<Text style={complianceTextStyle}>{translate('global.Supported-CIHR')}</Text>
								<Text style={complianceTextStyle}>
									&copy; {translate('global.copyright', { date: new Date().getFullYear() })}
								</Text>
							</Flex>
						</Flex>
						<Row align={'middle'} justify={'center'} gutter={[24, 24]}>
							{pcglLinks.map((itemLink) => (
								<Col span={12} key={itemLink.name} md={{ flex: '33%' }} sm={{ flex: '50%' }} xs={{ flex: '50%' }}>
									<Flex justify={'flex-start'}>
										<Link key={itemLink.name} style={{ ...linkStyle }} underline target="_blank">
											{itemLink.name}
										</Link>
									</Flex>
								</Col>
							))}
						</Row>
					</Flex>
				) : (
					<>
						<Flex
							style={{ ...contentWrapperStyles, width: '100%' }}
							flex={1}
							gap={token.paddingMD}
							justify={'center'}
							vertical={true}
						>
							<Flex align="center" justify="center">
								<Link target="_blank" style={logoStyles}>
									<Image width={200} src={PCGL_FOOTER} preview={false} alt={translate('global.PCGL')} />
								</Link>
								<Link target="_blank" style={logoStyles}>
									<Image width={200} src={PCGL_FOOTER_CIHR} preview={false} alt={translate('global.CIHR')} />
								</Link>
							</Flex>
							<Row align={'middle'} justify={'center'} gutter={[0, token.padding]} wrap>
								{pcglLinks.map((itemLink) => (
									<Col span={12} key={itemLink.name} md={{ flex: '40%' }} sm={{ flex: '50%' }} xs={{ flex: '50%' }}>
										<Flex justify={'center'}>
											<Link key={itemLink.name} style={{ ...linkStyle, width: 100 }} underline target="_blank">
												{itemLink.name}
											</Link>
										</Flex>
									</Col>
								))}
							</Row>
						</Flex>
						<Text style={{ ...complianceTextStyle, textAlign: 'center' }}>{translate('global.Supported-CIHR')}</Text>
						<Text style={{ ...complianceTextStyle, textAlign: 'center' }}>
							&copy; {translate('global.copyright', { date: new Date().getFullYear() })}
						</Text>
					</>
				)}
			</Footer>
		</ConfigProvider>
	);
};

export default FooterComponent;
