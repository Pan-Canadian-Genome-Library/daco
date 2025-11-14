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

import { Button, Col, Flex, Row, theme } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import useGetDownload from '@/api/queries/useGetDownload';
import ApplicationStatusSteps from '@/components/pages/application/ApplicationStatusSteps';
import ApproveApplicationModal from '@/components/pages/application/modals/ApproveApplicationModal';
import CloseApplicationModal from '@/components/pages/application/modals/CloseApplicationModal';
import HistoryModal from '@/components/pages/application/modals/HistoryModal';
import RejectApplicationModal from '@/components/pages/application/modals/RejectApplicationModal';
import RequestRevisionsModal from '@/components/pages/application/modals/RequestRevisionsModal';
import RevokeApplicationModal from '@/components/pages/application/modals/RevokeApplicationModal';
import SuccessModal from '@/components/pages/application/modals/SuccessModal';
import WithdrawApplicationModal from '@/components/pages/application/modals/WithdrawApplicationModal';
import PageHeader from '@/components/pages/global/PageHeader';
import ProtectedComponent from '@/components/ProtectedComponent';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { ApplicationStates } from '@pcgl-daco/data-model';
import { ApplicationStateValues } from '@pcgl-daco/data-model/src/types';
import { RevisionsModalSchemaType } from '@pcgl-daco/validation';
import { useNavigate } from 'react-router';

const { useToken } = theme;

type AppHeaderProps = {
	id: number;
	appState: ApplicationStateValues;
	currentSection: string;
	isEditMode: boolean;
};

export interface RevisionModalStateProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	onSubmit: (data: RevisionsModalSchemaType) => void;
}

const ApplicationViewerHeader = ({ id, appState, currentSection, isEditMode }: AppHeaderProps) => {
	const { t: translate } = useTranslation();
	const { token } = useToken();
	const minWidth = useMinWidth();
	const isLowResDevice = minWidth <= token.screenLGMax;

	const [showCloseApplicationModal, setShowCloseApplicationModal] = useState(false);
	const [openRevisionsModal, setOpenRevisionsModal] = useState(false);
	const [showReqRevisionsSuccessModal, setShowReqRevisionsSuccessModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [showRevokeModal, setShowRevokeModal] = useState(false);
	const [showApprovalModal, setShowApprovalModal] = useState(false);
	const [showHistoryModal, setShowHistoryModal] = useState(false);
	const [showRejectSuccessModal, setShowRejectSuccessModal] = useState(false);
	const [showRevokeSuccessModal, setShowRevokeSuccessModal] = useState(false);
	const [showSuccessApproveModal, setShowSuccessApproveModal] = useState(false);

	const {
		state: { fields },
	} = useApplicationContext();
	const { refetch: getDownload } = useGetDownload({ fileId: fields.signedPdf });

	const isWithdrawable =
		appState === ApplicationStates.INSTITUTIONAL_REP_REVIEW || appState === ApplicationStates.DAC_REVIEW;

	const navigate = useNavigate();

	const onEditButtonClick = () => {
		if (isWithdrawable) {
			setShowEditModal(true);
		} else if (appState === 'DRAFT') {
			navigate(`${currentSection}/edit`, { replace: true });
		}
	};

	const onHistoryButtonClick = () => {
		setShowHistoryModal(!showHistoryModal);
	};

	// Generate download url and then remove the link after downloading
	const onPDFDownload = async () => {
		const response = await getDownload();

		const { data: responseData } = response;

		// If there is no response data OR the file name does not exist, fail the download procedure
		if (!responseData || responseData.filename === null) {
			return;
		}

		const bufferArray = new Uint8Array(responseData.content.data).buffer;

		const blob = new Blob([bufferArray], {
			type: 'pdf',
		});

		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;

		a.download = responseData.filename;
		document.body.appendChild(a);
		a.click();

		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const renderHeaderButtons = () => {
		const buttons = [];
		const canShowEdit = (appState === ApplicationStates.DRAFT || isWithdrawable) && !isEditMode;

		buttons.push(
			<Button onClick={() => onHistoryButtonClick()}>{translate('button.history')}</Button>,
			<Button onClick={() => onEditButtonClick()}>{translate('button.edit')}</Button>,
		);

		if (canShowEdit) {
			buttons.push(
				<ProtectedComponent key={'header-edit'} requiredRoles={['APPLICANT']}>
					<Button onClick={() => onEditButtonClick()}>{translate('button.edit')}</Button>
				</ProtectedComponent>,
			);
		}

		buttons.push(
			<ProtectedComponent
				key={'header-revoke'}
				requiredRoles={['DAC_MEMBER', 'APPLICANT']}
				requiredStates={['APPROVED']}
			>
				<Button onClick={() => setShowRevokeModal(true)}>{translate('button.revoke')}</Button>
			</ProtectedComponent>,
			<ProtectedComponent
				key={'header-rep-controls'}
				requiredRoles={['INSTITUTIONAL_REP']}
				requiredStates={['INSTITUTIONAL_REP_REVIEW']}
			>
				<Button onClick={() => setOpenRevisionsModal(true)}>{translate('button.requestRevisions')}</Button>
			</ProtectedComponent>,
			<ProtectedComponent
				key={'header-close'}
				requiredRoles={['APPLICANT']}
				requiredStates={['DRAFT', 'INSTITUTIONAL_REP_REVIEW', 'DAC_REVIEW']}
			>
				<Button onClick={() => setShowCloseApplicationModal(true)}>{translate('button.closeApp')}</Button>
			</ProtectedComponent>,
			<ProtectedComponent key={'header-dac-controls'} requiredRoles={['DAC_MEMBER']} requiredStates={['DAC_REVIEW']}>
				<Button onClick={() => setShowApprovalModal(true)}>{translate('button.approveApplication')}</Button>
				<Button onClick={() => setOpenRevisionsModal(true)}>{translate('button.requestRevisions')}</Button>
				<Button onClick={() => setShowRejectModal(true)}>{translate('button.rejectApplication')}</Button>
				<Button onClick={() => setShowCloseApplicationModal(true)}>{translate('button.closeApp')}</Button>
			</ProtectedComponent>,
			<ProtectedComponent
				key={'header-download'}
				requiredRoles={['DAC_MEMBER', 'APPLICANT', 'INSTITUTIONAL_REP']}
				requiredStates={['INSTITUTIONAL_REP_REVIEW', 'DAC_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED', 'REVOKED']}
			>
				<Button onClick={() => onPDFDownload()}>{translate('sign-and-submit-section.section.buttons.download')}</Button>
			</ProtectedComponent>,
		);

		return buttons;
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
			<Flex style={{ position: 'relative', width: '100%' }} justify="center" align="end" vertical gap={'middle'}>
				<Row style={{ width: '100%', flexWrap: isLowResDevice ? 'wrap' : 'nowrap' }} justify={'end'}>
					<Col xs={{ flex: '100%' }} lg={{ flex: '50%' }} flex={1}>
						<Flex
							style={{ height: '100%', width: '100%' }}
							justify={isLowResDevice ? 'center' : 'end'}
							align="flex-end"
						>
							<Flex
								flex={1}
								style={{
									padding: `${token.paddingLG} 0`,
									borderRadius: token.borderRadius,
									margin: isLowResDevice ? `1.5rem 0` : 'none',
								}}
								justify="center"
								align="flex-end"
								vertical
								gap={'middle'}
							>
								<ApplicationStatusSteps currentStatus={appState} />
							</Flex>
						</Flex>
					</Col>
				</Row>
				<Row
					style={{ width: '100%', flexWrap: isLowResDevice ? 'wrap' : 'nowrap' }}
					justify={isLowResDevice ? 'start' : 'end'}
				>
					<Flex>
						<Flex
							gap={'middle'}
							style={{
								transform: isLowResDevice ? '' : 'translate(0rem, 1.75rem)',
								borderRadius: token.borderRadius,
								marginRight: isLowResDevice ? 'auto' : `${token.paddingSM}px 0`,
								marginLeft: isLowResDevice ? 'none' : `${token.paddingSM}px 0`,
							}}
						>
							{renderHeaderButtons()}
						</Flex>
					</Flex>
				</Row>
			</Flex>
			{/* Withdraw model */}
			<WithdrawApplicationModal
				applicationId={id}
				currentSection={currentSection}
				showEditModal={showEditModal}
				setShowEditModal={setShowEditModal}
			/>
			{/* Close Modal */}
			<CloseApplicationModal
				id={id}
				setShowCloseApplicationModal={setShowCloseApplicationModal}
				showCloseApplicationModal={showCloseApplicationModal}
			/>
			{/* Reject Modal */}
			<RejectApplicationModal
				id={id}
				isOpen={showRejectModal}
				setIsOpen={setShowRejectModal}
				setShowSuccessRejectsModal={setShowRejectSuccessModal}
			/>
			{/* Revisions Modal */}
			<RequestRevisionsModal
				id={id}
				setSuccessModalOpen={setShowReqRevisionsSuccessModal}
				isOpen={openRevisionsModal}
				setIsOpen={setOpenRevisionsModal}
			/>
			{/* Revoke Modal */}
			<RevokeApplicationModal
				id={id}
				isOpen={showRevokeModal}
				setIsOpen={setShowRevokeModal}
				setShowRevokeSuccessModal={setShowRevokeSuccessModal}
			/>
			{/* Approval Modal */}
			<ApproveApplicationModal
				id={id}
				isOpen={showApprovalModal}
				setIsOpen={setShowApprovalModal}
				setShowSuccessApproveModal={setShowSuccessApproveModal}
			/>
			{/* Success Modals */}
			<SuccessModal
				successText={translate('modals.rejectApplication.notifications.rejectApplicationSuccess', { id })}
				okText={translate('modals.buttons.ok')}
				isOpen={showRejectSuccessModal}
				onOk={() => setShowRejectSuccessModal(false)}
			/>
			<SuccessModal
				successText={translate('modals.requestRevisions.notifications.revisionsRequested', { id })}
				okText={translate('modals.buttons.ok')}
				isOpen={showReqRevisionsSuccessModal}
				onOk={() => {
					setShowReqRevisionsSuccessModal(false);
					navigate('/dashboard');
				}}
			/>
			<SuccessModal
				successText={translate('modals.revokeApplication.notifications.successTitle', { id })}
				okText={translate('modals.buttons.ok')}
				isOpen={showRevokeSuccessModal}
				onOk={() => setShowRevokeSuccessModal(false)}
			/>
			<SuccessModal
				successText={translate('modals.approveApplication.notifications.applicationApproveSuccess', { id })}
				okText={translate('modals.buttons.ok')}
				isOpen={showSuccessApproveModal}
				onOk={() => setShowSuccessApproveModal(false)}
			/>
			<HistoryModal id={id} isOpen={showHistoryModal} onOk={() => setShowHistoryModal(false)} />
		</PageHeader>
	);
};

export default ApplicationViewerHeader;
