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

import useRepRevisions from '@/api/mutations/useRepRevisions';
import ApplicationStatusSteps from '@/components/pages/application/ApplicationStatusSteps';
import RequestRevisionsModal from '@/components/pages/application/modals/RequestRevisionsModal';
import SuccessModal from '@/components/pages/application/modals/SuccessModal';
import PageHeader from '@/components/pages/global/PageHeader';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { useNotificationContext } from '@/providers/context/notification/NotificationContext';
import { ApplicationStateValues } from '@pcgl-daco/data-model/src/types';
import { RevisionsModalSchemaType } from '@pcgl-daco/validation';

const { Text } = Typography;
const { useToken } = theme;

type AppHeaderProps = {
	id: number;
	state: ApplicationStateValues;
};

export interface RevisionModalStateProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	onSubmit: (data: RevisionsModalSchemaType) => void;
}

const ApplicationViewerHeader = ({ id, state }: AppHeaderProps) => {
	const { t: translate } = useTranslation();
	const { token } = useToken();
	const minWidth = useMinWidth();
	const isLowResDevice = minWidth <= token.screenLG;
	const [showCloseApplicationModal, setShowCloseApplicationModal] = useState(false);
	const [openRevisionsModal, setOpenRevisionsModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const { mutateAsync: repRevision } = useRepRevisions();
	const notification = useNotificationContext();

	const onRevisionsSubmit = (data: RevisionsModalSchemaType) => {
		repRevision(data)
			.then(() => {
				setOpenRevisionsModal(false);
				setShowSuccessModal(true);
			})
			.catch((error) => {
				notification.openNotification({
					type: 'error',
					message: 'Submission Failed',
					description: translate('modals.applications.global.failure.text'),
				});
			});
	};

	// TODO: logic to change ApplicationState from current to draft then redirect user to the relevant Application Form page
	const handleCloseApplicationRequest = () => {
		setShowCloseApplicationModal(false);
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
		<PageHeader
			title={translate('applicationViewer.title', { id: id })}
			description={`${formatDate(new Date(), new Date())}`}
		>
			<Flex style={{ width: '100%' }} justify="center" align="end" vertical>
				<Row style={{ width: '100%' }} justify={'end'} wrap>
					<Col xs={{ flex: '100%' }} lg={{ flex: '50%' }}>
						<Flex
							style={{ height: '100%', width: '100%' }}
							justify={isLowResDevice ? 'center' : 'end'}
							align="flex-end"
						>
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
								<ApplicationStatusSteps currentStatus={state} />
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
					<Button onClick={() => setShowCloseApplicationModal(true)}>{translate('button.closeApp')}</Button>
					<Button onClick={() => setOpenRevisionsModal(true)}>{translate('button.requestRevisions')}</Button>
				</Flex>
				<Modal
					title={translate('modals.closeApplication.title', { id })}
					okText={translate('button.closeApp')}
					cancelText={translate('modals.buttons.cancel')}
					width={'100%'}
					style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
					open={showCloseApplicationModal}
					onOk={handleCloseApplicationRequest}
					onCancel={() => setShowCloseApplicationModal(false)}
				>
					<Flex style={{ height: '100%', marginTop: 20 }}>
						<Text>{translate('modals.closeApplication.description')}</Text>
					</Flex>
				</Modal>
				<RequestRevisionsModal
					onSubmit={onRevisionsSubmit}
					isOpen={openRevisionsModal}
					setIsOpen={setOpenRevisionsModal}
				/>
			</Flex>
			<SuccessModal
				successText={translate('modals.applications.global.success.text', { id })}
				okText={translate('modals.buttons.ok')}
				isOpen={showSuccessModal}
				onOk={() => setShowSuccessModal(false)}
			/>
		</PageHeader>
	);
};

export default ApplicationViewerHeader;
