/*
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
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

import { Button, Col, Flex, Modal, Row, theme, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import StatusBannerWrapper from '@/components/layouts/StatusBarWrapper';
import AppStatusSteps from '@/components/pages/application/AppStatusSteps';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { ApplicationStateValues } from '@pcgl-daco/data-model/src/types';

const { Text, Title } = Typography;
const { useToken } = theme;

type AppHeaderProps = {
	id: number;
	state: ApplicationStateValues;
};

const AppHeader = ({ id, state }: AppHeaderProps) => {
	const { t: translate } = useTranslation();
	const { token } = useToken();
	const minWidth = useMinWidth();
	const isLowResDevice = minWidth <= token.screenLG;
	const [openModal, setOpenModal] = useState(false);

	const showCloseApplicationModal = () => {
		setOpenModal(true);
	};

	// TODO: logic to change ApplicationState from current to draft then redirect user to the relevant Application Form page
	const handleOk = () => {
		setOpenModal(false);
	};

	const formatDate = (createdAt: Date, updatedAt: Date) => {
		const createdDate = translate('date.intlDateTime', {
			val: new Date(createdAt),
			formatParams: {
				val: { year: 'numeric', month: 'long', day: 'numeric' },
			},
		});

		const updatedDate = translate('date.intlDateTime', {
			val: new Date(updatedAt),
			formatParams: {
				val: { year: 'numeric', month: 'long', day: 'numeric' },
			},
		});

		return `${translate('label.created')}: ${createdDate} | ${translate('label.updatedExtended')}: ${updatedDate}`;
	};

	return (
		<StatusBannerWrapper>
			<Flex style={{ width: '100%' }} justify="center" align="end" vertical>
				<Row style={{ width: '100%' }} wrap>
					<Col xs={{ flex: '100%' }} lg={{ flex: '50%' }}>
						<Flex style={{ height: '100%' }} vertical justify="center" align="start">
							<Title>
								{translate('dashboard.title')}: PCGL-{id}
							</Title>
							<Text>{formatDate(new Date(), new Date())}</Text>
						</Flex>
					</Col>
					<Col xs={{ flex: '100%' }} lg={{ flex: '50%' }}>
						<Flex style={{ height: '100%' }} justify={isLowResDevice ? 'center' : 'end'} align="center">
							<Flex
								flex={1}
								style={{
									padding: token.paddingLG,
									borderRadius: token.borderRadius,
									margin: isLowResDevice ? `${token.paddingSM}px 0` : 'none',
								}}
								justify="center"
								align="flex-end"
								vertical
								gap={'middle'}
							>
								<AppStatusSteps currentStatus={state} />
							</Flex>
						</Flex>
					</Col>
				</Row>
				<Flex
					gap={'middle'}
					style={{
						paddingInline: token.paddingLG,
						borderRadius: token.borderRadius,
						marginInline: isLowResDevice ? `${token.paddingSM}px 0` : 'none',
					}}
				>
					{/* TODO: Disable for MVP */}
					{/* <Button>{translate('button.history')}</Button> */}
					<Button onClick={showCloseApplicationModal}>{translate('button.closeApp')}</Button>
				</Flex>
				<Modal
					title={translate('modal.closeTitle', { id })}
					okText={translate('button.closeApp')}
					cancelText={translate('button.cancel')}
					width={'100%'}
					style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
					open={openModal}
					onOk={handleOk}
					onCancel={() => setOpenModal(false)}
				>
					<Flex style={{ height: '100%', marginTop: 20 }}>
						<Text>{translate('modal.closeDescription')}</Text>
					</Flex>
				</Modal>
			</Flex>
		</StatusBannerWrapper>
	);
};

export default AppHeader;
