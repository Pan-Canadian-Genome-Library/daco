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

import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Col, Flex, Typography, theme } from 'antd';

import StatusBarWrapper from '@/components/layouts/StatusBarWrapper';

const { Text, Title } = Typography;
const { useToken } = theme;

// TODO: properly type and verify incoming data once API service is completed
interface ApplicationStatusBarType {
	expireDate?: string;
}

const ApplicationStatusBar = ({ expireDate }: ApplicationStatusBarType) => {
	const { token } = useToken();

	return (
		<StatusBarWrapper>
			<>
				<Col span={12}>
					<Flex style={{ height: '100%' }} vertical justify="center">
						<Title>My Applications</Title>
						<Text>
							This is where you can manage your Applications for Access to PCGL Controlled Data. Access will be granted
							starting from the date of approval by the PCGL DACO.
						</Text>
					</Flex>
				</Col>
				<Col span={12}>
					<Flex style={{ height: '100%' }} justify="center" align="center">
						<Flex
							style={{
								padding: token.paddingLG,
								backgroundColor: token.colorBgContainer,
								borderRadius: token.borderRadius,
							}}
							justify="center"
							align="center"
							gap={20}
						>
							{expireDate ? (
								<>
									<CheckCircleFilled style={{ color: token.colorPrimary, fontSize: 30 }} />
									<Flex vertical>
										<Text strong>You have access to PCGL Controlled Data</Text>
										<Text>Expires: {expireDate}</Text>
									</Flex>
								</>
							) : (
								<Flex align="center" gap={10}>
									<CloseCircleFilled style={{ color: token.colorPrimary, fontSize: 30 }} />
									<Text strong>You do not have access to PCGL Controlled Data</Text>
								</Flex>
							)}
						</Flex>
					</Flex>
				</Col>
			</>
		</StatusBarWrapper>
	);
};

export default ApplicationStatusBar;
