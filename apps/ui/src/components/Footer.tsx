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

import { ConfigProvider, Flex, Image, Layout, Typography } from 'antd';

import PCGLFOOTER from '@/assets/pcgl-logo-footer.png';
import { pcglFooterTheme } from '@/components/providers/ThemeProvider';
import { Breakpoints, useMinWidth } from '@/global/hooks/useMinWidth';

const { Footer } = Layout;
const { Text, Link } = Typography;

interface LinkType {
	name: string;
	href?: string;
}

const pcglLinks: LinkType[] = [
	{
		name: 'Contact Us',
	},
	{
		name: 'Policies & Guidelines',
	},
	{
		name: 'Help Guides',
	},
	{
		name: 'Controlled Data Users',
	},
	{
		name: 'PCGL Website',
	},
	{
		name: 'Data Platform',
	},
];

const policiesConditionsLinks: LinkType[] = [
	{
		name: 'Privacy Policy',
	},
	{
		name: 'Terms & Conditions',
	},
	{
		name: 'Publication Policy',
	},
];

const FooterComponent = () => {
	const minWidth = useMinWidth();

	const linkStyle: React.CSSProperties = {
		textAlign: 'center',
		textWrap: 'nowrap',
		fontSize: minWidth <= Breakpoints.LG ? '.75rem' : '1rem',
	};

	const textStyle: React.CSSProperties = {
		textAlign: minWidth <= Breakpoints.LG ? 'start' : 'center',
		fontSize: minWidth <= Breakpoints.LG ? '.75rem' : '1rem',
		alignSelf: 'center',
	};

	const footerStyle: React.CSSProperties = {
		display: 'flex',
		flexDirection: minWidth <= Breakpoints.LG ? 'column' : 'row',
		justifyItems: 'center',
		alignItems: 'center',
		gap: minWidth <= Breakpoints.LG ? '2rem' : '0',
	};

	return (
		<ConfigProvider theme={pcglFooterTheme}>
			<Footer style={footerStyle}>
				<Link target="_blank" style={{ margin: minWidth <= Breakpoints.LG ? '1rem 0 0 0' : '0 -8rem 0 0' }}>
					<Image width={200} src={PCGLFOOTER} preview={false} />
				</Link>
				<Flex flex={1} vertical gap={20}>
					<Flex
						gap={10}
						vertical={minWidth <= Breakpoints.LG ? false : true}
						justify={minWidth <= Breakpoints.LG ? 'space-between' : 'center'}
						align={minWidth <= Breakpoints.LG ? 'flex-start' : 'center'}
					>
						<Flex
							gap={20}
							justify="center"
							align={minWidth <= Breakpoints.LG ? 'start' : 'center'}
							vertical={minWidth <= Breakpoints.LG ? true : false}
						>
							{pcglLinks.map((itemLink) => (
								<Link key={itemLink.name} style={linkStyle} underline target="_blank">
									{itemLink.name}
								</Link>
							))}
						</Flex>
						<Flex
							gap={20}
							justify="center"
							align={minWidth <= Breakpoints.LG ? 'start' : 'center'}
							vertical={minWidth <= Breakpoints.LG ? true : false}
						>
							{policiesConditionsLinks.map((itemLink) => (
								<Link key={itemLink.name} style={linkStyle} underline target="_blank">
									{itemLink.name}
								</Link>
							))}
						</Flex>
					</Flex>
					<Text style={textStyle}>
						&copy; 2026 PCGL Data Access Compliance Office. All rights reserved. UI v1.0 - API v1.0
					</Text>
				</Flex>
			</Footer>
		</ConfigProvider>
	);
};

export default FooterComponent;
