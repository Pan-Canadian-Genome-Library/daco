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

import { Col, ConfigProvider, Flex, Grid, Image, Layout, Row, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';

import PCGLFOOTER from '@/assets/pcgl-logo-footer.png';
import { contentWrapperStyles } from '@/components/layouts/ContentWrapper';
import { pcglFooterTheme } from '@/components/providers/ThemeProvider';

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
		textAlign: breakpoints.md ? 'center' : 'left',
		textWrap: 'nowrap',
	};

	const complianceTextStyle: React.CSSProperties = {
		textAlign: breakpoints.lg ? 'center' : 'start',
		alignSelf: 'center',
		width: '100%',
	};

	const footerStyle: React.CSSProperties = {
		display: 'flex',
		flexDirection: breakpoints.lg ? 'row' : 'column',
		justifyItems: 'center',
		alignItems: 'center',
		padding: breakpoints.lg ? token.Layout?.footerPadding : `2rem 1.75rem`,
		gap: breakpoints.lg ? '0rem' : token.paddingXL,
	};

	const logoStyles: React.CSSProperties = {
		margin: (() => {
			if (breakpoints.md) return '1rem auto 0 0';
			if (breakpoints.xl) return '0 -8rem 0 0';
			return '1rem auto';
		})(),
	};

	return (
		<ConfigProvider theme={pcglFooterTheme}>
			<Footer style={footerStyle}>
				{breakpoints.lg ? (
					<>
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
								vertical={breakpoints.lg ? true : false}
								justify={breakpoints.lg ? 'center' : 'space-between'}
								align={breakpoints.lg ? 'center' : 'flex-start'}
							>
								<Flex
									gap={token.paddingMD}
									justify="center"
									align={breakpoints.lg ? 'center' : 'start'}
									vertical={breakpoints.lg ? false : true}
								>
									{pcglLinks.map((itemLink) => (
										<Link key={itemLink.name} style={linkStyle} underline target="_blank">
											{itemLink.name}
										</Link>
									))}
								</Flex>
								<Text style={complianceTextStyle}>
									&copy; {new Date().getFullYear()} PCGL Data Access Compliance Office. All rights reserved. UI v1.0 -
									API v1.0
								</Text>
								<Flex
									gap={token.paddingMD}
									justify="center"
									align={breakpoints.lg ? 'center' : 'start'}
									vertical={breakpoints.lg ? false : true}
								>
									{policiesConditionsLinks.map((itemLink) => (
										<Link key={itemLink.name} style={linkStyle} underline target="_blank">
											{itemLink.name}
										</Link>
									))}
								</Flex>
							</Flex>
						</Flex>
					</>
				) : (
					<>
						<Flex
							style={{ ...contentWrapperStyles, width: '100%' }}
							flex={1}
							gap={token.paddingMD}
							justify={breakpoints.md ? 'space-between' : 'center'}
							vertical={breakpoints.md ? false : true}
						>
							<Link target="_blank" style={logoStyles}>
								<Image
									width={200}
									src={PCGLFOOTER}
									preview={false}
									alt="Pan-Canadian Genome Library / Librairie Pancanadienne de Génomique"
								/>
							</Link>
							<Row align={'middle'} justify={'center'} gutter={[0, token.padding]} wrap>
								{pcglLinks.concat(policiesConditionsLinks).map((itemLink) => (
									<Col key={itemLink.name} md={{ flex: '33%' }} sm={{ flex: '50%' }} xs={{ flex: '50%' }}>
										<Flex justify={breakpoints.md ? 'flex-start' : 'center'}>
											<Link
												key={itemLink.name}
												style={{ ...linkStyle, width: breakpoints.md ? 'auto' : 100 }}
												underline
												target="_blank"
											>
												{itemLink.name}
											</Link>
										</Flex>
									</Col>
								))}
							</Row>
						</Flex>
						<Text style={complianceTextStyle}>
							&copy; {new Date().getFullYear()} PCGL Data Access Compliance Office. All rights reserved. UI v1.0 - API
							v1.0
						</Text>
					</>
				)}
			</Footer>
		</ConfigProvider>
	);
};

export default FooterComponent;
