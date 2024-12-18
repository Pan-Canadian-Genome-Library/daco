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

import {
	getApplicationStateProperties,
	getFriendlyStateName,
} from '@/components/pages/dashboard/getApplicationStateProps';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { Application } from '@/global/types';
import { formatDate } from '@/global/utils';

const { Title, Text } = Typography;
const { useToken } = theme;

type ApplicationCardProps = {
	openEdit: (id: string) => void;
	application: Application;
};

const ApplicationCard = (props: ApplicationCardProps) => {
	const { id, state, createdAt, expiresAt } = props.application;
	const { showEdit, color, showActionRequired } = getApplicationStateProperties(state);
	const { token } = useToken();
	const minWidth = useMinWidth();
	const isLowResDevice = minWidth <= token.screenLGMax;

	return (
		<Card style={{ backgroundColor: token.colorWhite, minHeight: 200 }} hoverable>
			<Flex vertical gap="middle">
				<Flex style={{ width: '100%' }} align="center" gap={'middle'}>
					<Flex align={isLowResDevice ? 'start' : 'center'} vertical={isLowResDevice} gap="middle">
						<Flex
							style={{
								backgroundColor: color,
								padding: 10,
								minWidth: minWidth <= token.screenLG ? 100 : 200,
								borderRadius: token.borderRadius,
							}}
							align="left"
							justify="center"
						>
							<Text strong>{getFriendlyStateName(state)}</Text>
						</Flex>
						{showActionRequired ? (
							<Flex align={'center'} gap={'small'}>
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
					Application: PCGL-{id}
				</Title>
				<Text>
					Created: {formatDate(new Date(createdAt))} | Expires: {expiresAt ? formatDate(new Date(expiresAt)) : 'N/A'}
				</Text>
			</Flex>
		</Card>
	);
};

export default ApplicationCard;
