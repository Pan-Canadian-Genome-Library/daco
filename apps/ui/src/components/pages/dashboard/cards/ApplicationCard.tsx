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

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Card, Flex, theme, Typography } from 'antd';

import { ApplicationtType } from '@/components/mock/applicationMockData';
import { getApplicationStatusProperties } from '@/components/pages/dashboard/getApplicationStateProps';
import { formatDate } from '@/global/utils';

const { Title, Text } = Typography;
const { useToken } = theme;

type ApplicationCardProps = {
	openEdit: (id: string) => void;
	application: ApplicationtType;
};

const ApplicationCard = (props: ApplicationCardProps) => {
	const { id, userId, status, createdAt, expiresAt } = props.application;
	const { showEdit, color, showActionRequired } = getApplicationStatusProperties(status);
	const { token } = useToken();

	return (
		<Card style={{ backgroundColor: token.colorWhite, minHeight: 200 }} hoverable>
			<Flex vertical gap="middle">
				<Flex style={{ width: '100%' }} align="center" gap={'middle'}>
					<Flex align="center" gap="middle">
						<Flex
							style={{ backgroundColor: color, padding: 10, minWidth: 200, borderRadius: token.borderRadius }}
							align="center"
							justify="center"
						>
							<Text strong>{status}</Text>
						</Flex>
						{showActionRequired ? (
							<Flex align="center" gap={'small'}>
								<ExclamationCircleFilled style={{ color: token.colorPrimary, fontSize: 20 }} />
								<Text strong>Action Required</Text>
							</Flex>
						) : null}
					</Flex>
					<Flex flex={1} justify="flex-end" align="center">
						{showEdit ? <Button onClick={() => props.openEdit(id)}>Edit</Button> : null}
					</Flex>
				</Flex>
				<Title style={{ margin: 0 }} level={3}>
					Application: {userId}
				</Title>
				<Text>
					Created: {formatDate(createdAt)} | Expires: {formatDate(expiresAt)}
				</Text>
			</Flex>
		</Card>
	);
};

export default ApplicationCard;
