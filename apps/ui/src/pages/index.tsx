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

import { contentWrapperStyles } from '@/components/layouts/ContentWrapper';
import { AuditOutlined, FileOutlined, SignatureOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Flex, Layout, Typography, theme } from 'antd';

const { Content } = Layout;
const { Title, Paragraph, Link, Text } = Typography;
const { useToken } = theme;

const heroStyle: React.CSSProperties = {
	...contentWrapperStyles,
	minHeight: 400,
	paddingBottom: 50,
	paddingTop: 50,
};

const HomePage = () => {
	const { token } = useToken();

	return (
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
			<Flex align="center" style={heroStyle}>
				<Flex gap={20}>
					<Col span={12}>
						<Flex vertical gap={10}>
							<Title level={2}>Overview</Title>
							<Paragraph>
								Authorization for access to Pan-Canadian Genome Library controlled data is study based and is reviewed
								for compliance with PCGL Policies and Guidelines. The PCGL DACO is the overarching authority to ensure
								that data from the PCGL will only be used by qualified individuals for public health objectives.
							</Paragraph>
							<Paragraph>
								Before starting your application, learn more about Data Access and Use Policies and review our
								<Link underline> frequently asked questions</Link>.
							</Paragraph>
						</Flex>
					</Col>
					<Col span={12}>
						<Flex vertical gap={20}>
							<Title level={2}>The Application Process is Simple</Title>
							<Flex align="center" gap={10}>
								<Flex justify="center" align="center">
									<Avatar
										style={{ backgroundColor: '#C0DCF3', color: 'rgba(0,0,0,0.5)' }}
										size={60}
										icon={<FileOutlined />}
									/>
								</Flex>
								<Text>
									Log in and start an application. Carefully complete all required sections and review all policies and
									agreements.
								</Text>
							</Flex>
							<Flex align="center" gap={10}>
								<Flex justify="center" align="center">
									<Avatar
										style={{ backgroundColor: '#FDD6CB', color: 'rgba(0,0,0,0.5)' }}
										size={60}
										icon={<SignatureOutlined />}
									/>
								</Flex>
								<Text>
									When completed, obtain the required signatures and submit the signed application for review.
								</Text>
							</Flex>
							<Flex align="center" gap={10}>
								<Flex justify="center" align="center">
									<Avatar
										style={{ backgroundColor: '#D3F7F0', color: 'rgba(0,0,0,0.5)' }}
										size={60}
										icon={<AuditOutlined />}
									/>
								</Flex>
								<Text>
									The PCGL DACO will review the application and approved project teams will be granted access to PCGL
									Controlled Data.
								</Text>
							</Flex>
						</Flex>
					</Col>
				</Flex>
			</Flex>
		</Content>
	);
};

export default HomePage;
