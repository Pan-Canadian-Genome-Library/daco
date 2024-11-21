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

import { Button, Card, Flex, theme, Typography } from 'antd';

import { ApplicationtType } from '@/components/mock/applicationMockData';

const { Title } = Typography;
const { useToken } = theme;

const ApplicationCard = ({ applicationName, applicationStatus }: ApplicationtType) => {
	const { token } = useToken();

	return (
		<Card style={{ backgroundColor: token.colorFillAlter, minHeight: 200 }}>
			<Flex vertical gap="middle">
				<Flex style={{ width: '100%' }} align="center" gap={'middle'}>
					<Flex align="center">
						<Flex style={{ padding: 10, minWidth: 200 }} align="center" justify="center">
							{applicationStatus}
						</Flex>
						Action required
					</Flex>
					<Flex flex={1} justify="flex-end" align="center">
						<Button>Edit</Button>
					</Flex>
				</Flex>
				<Title level={3}>Application: {applicationName}</Title>
			</Flex>
		</Card>
	);
};

export default ApplicationCard;
