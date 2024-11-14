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

import { Button, Col, Flex, Layout, Typography, theme } from 'antd';
import HeaderComponent from '../components/Header';

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { useToken } = theme;

const footerStyle: React.CSSProperties = {
	textAlign: 'center',
	color: '#FFFFFF',
	backgroundColor: '#520339',
};

const heroStyle: React.CSSProperties = {
	width: '90%',
	marginInline: 'auto',
	minHeight: 400,
};

export const HomePage = () => {
	const { token } = useToken();

	return (
		<Layout>
			<HeaderComponent />
			<Content>
				<Flex className="hero-background-image" justify="center">
					<Flex align="center" style={heroStyle}>
						<Col span={12}>
							<Flex vertical>
								<Title style={{ color: token.colorTextSecondary }}> Apply for Access to Controlled Data</Title>
								<Paragraph style={{ color: token.colorTextSecondary }}>
									The PCGL Data Access Compliance Office (PCGL DACO) handles requests from scientists, researchers and
									commercial teams for access to PCGL Controlled Data.
								</Paragraph>
								<Col span={6}>
									<Button type="link" color="primary" variant="solid">
										Get Started
									</Button>
								</Col>
							</Flex>
						</Col>
					</Flex>
				</Flex>
				<Flex style={{ ...heroStyle, height: '100%' }}>Temporary</Flex>
			</Content>
			<Footer style={footerStyle}>PCGL Footer</Footer>
		</Layout>
	);
};
