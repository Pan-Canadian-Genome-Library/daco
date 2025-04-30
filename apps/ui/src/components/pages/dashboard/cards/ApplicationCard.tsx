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
import { Card, Flex, theme, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { getApplicationStateProperties } from '@/components/pages/dashboard/getApplicationStateProps';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { Application } from '@/global/types';
import { ApplicationStates } from '@pcgl-daco/data-model/src/types';
import { useNavigate } from 'react-router';

const { Title, Text } = Typography;
const { useToken } = theme;

type ApplicationCardProps = {
	application: Application;
};

const ApplicationCard = (props: ApplicationCardProps) => {
	const { t: translate } = useTranslation();
	const { id, state, createdAt, expiresAt } = props.application;
	const { colour, showActionRequired } = getApplicationStateProperties(state);

	const navigate = useNavigate();
	const minWidth = useMinWidth();
	const { token } = useToken();

	const isLowResDevice = minWidth <= token.screenLGMax;

	const formatDate = (createdAt: string, expiresAt: string) => {
		const createdDate = translate('date.intlDateTime', {
			val: new Date(createdAt),
			formatParams: {
				val: { year: 'numeric', month: 'long', day: 'numeric' },
			},
		});

		const expiresDate = expiresAt
			? translate('date.intlDateTime', {
					val: new Date(expiresAt),
					formatParams: {
						val: { year: 'numeric', month: 'long', day: 'numeric' },
					},
				})
			: translate('generic.notApplicable');

		return `${translate('label.created')}: ${createdDate} | ${translate('label.expires')}: ${expiresDate}`;
	};

	const handleCardClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
		/**
		 * For keyboard navigation we need to make sure we abide by AIRA best practices. Check for the
		 * enter key or the space bar.
		 *
		 * See for more info: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
		 */
		if (('key' in event && (event.key === 'Enter' || event.key === ' ')) || event.type === 'click') {
			event.stopPropagation();
			if (state === ApplicationStates.DRAFT) {
				navigate(`/application/${id}/intro/edit`);
			} else {
				navigate(`/application/${id}/intro/`);
			}
		}
	};

	return (
		<Card
			style={{ backgroundColor: token.colorWhite, minHeight: 200 }}
			hoverable
			tabIndex={0} //Required for making the cards keyboard navigable
			onClick={handleCardClick}
			onKeyDown={handleCardClick}
		>
			<Flex vertical gap="middle">
				<Flex style={{ width: '100%' }} align="center" gap={'middle'}>
					<Flex align={isLowResDevice ? 'start' : 'center'} vertical={isLowResDevice} gap="middle">
						<Flex
							style={{
								backgroundColor: colour,
								padding: 10,
								minWidth: minWidth <= token.screenLG ? 100 : 200,
								borderRadius: token.borderRadius,
							}}
							align="left"
							justify="center"
						>
							<Text strong>{translate(`application.states.${state}`)}</Text>
						</Flex>
						{showActionRequired ? (
							<Flex align={'center'} gap={'small'}>
								<ExclamationCircleFilled style={{ color: token.colorPrimary, fontSize: 20 }} />
								<Text strong>{translate('alert.actionRequired')}</Text>
							</Flex>
						) : null}
					</Flex>
				</Flex>
				<Title style={{ margin: 0 }} level={3}>
					Application: PCGL-{id}
				</Title>
				<Text>{formatDate(createdAt, expiresAt)}</Text>
			</Flex>
		</Card>
	);
};

export default ApplicationCard;
