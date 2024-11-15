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

const linkStyle: React.CSSProperties = {
	textAlign: 'center',
	textWrap: 'nowrap',
};

const textStyle: React.CSSProperties = {
	textAlign: 'center',
};

const FooterComponent = () => {
	return (
		<ConfigProvider theme={pcglFooterTheme}>
			<Footer>
				<Flex justify="center" align="center">
					<Link target="_blank">
						<Image width={200} src={PCGLFOOTER} preview={false} />
					</Link>
					<Flex flex={1} vertical justify="center" align="center" gap={10} wrap>
						<Flex gap={20} justify="center" align="center" wrap>
							{pcglLinks.map((itemLink) => (
								<Link style={linkStyle} underline target="_blank">
									{itemLink.name}
								</Link>
							))}
						</Flex>
						<Text style={textStyle}>
							© 2026 PCGL Data Access Compliance Office. All rights reserved. UI v1.0 - API v1.0
						</Text>
						<Flex gap={20} justify="center" align="center">
							{policiesConditionsLinks.map((itemLink) => (
								<Link style={linkStyle} underline target="_blank">
									{itemLink.name}
								</Link>
							))}
						</Flex>
					</Flex>
				</Flex>
			</Footer>
		</ConfigProvider>
	);
};

export default FooterComponent;
