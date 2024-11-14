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

import { Button, ConfigProvider, Flex, Image, Layout, Typography } from 'antd';

import PCGL from '@/assets/pcgl-logo-full.png';

import { pcglHeaderTheme } from '@/components/providers/ThemeProvider';

const { Link } = Typography;
const { Header } = Layout;

const linkStyle: React.CSSProperties = {
	minWidth: 100,
	textAlign: 'center',
};

const HeaderComponent = () => {
	return (
		<ConfigProvider theme={pcglHeaderTheme}>
			<Header>
				<Flex style={{ height: '100%' }} justify="center" align="center" gap={40}>
					<Flex flex={1}>
						<Flex justify="space-around" align="center" gap={40}>
							<Link target="_blank">
								<Image width={200} src={PCGL} preview={false} />
							</Link>
							<Link style={linkStyle} target="_blank">
								Policies & Guidelines
							</Link>
							<Link style={linkStyle} target="_blank">
								Help Guides
							</Link>
							<Link style={linkStyle} target="_blank">
								Controlled Data Users
							</Link>
						</Flex>
					</Flex>
					<Flex justify="flex-end" align="center" gap={20}>
						<Link style={linkStyle} target="_blank">
							Apply For Access
						</Link>
						<Button variant="solid" color="primary">
							Login
						</Button>
					</Flex>
				</Flex>
			</Header>
		</ConfigProvider>
	);
};

export default HeaderComponent;
