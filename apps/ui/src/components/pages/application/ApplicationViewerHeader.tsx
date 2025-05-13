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

import ApplicationStatusSteps from '@/components/pages/application/ApplicationStatusSteps';
import ApproveApplicationModal from '@/components/pages/application/modals/ApproveApplicationModal';
import CloseApplicationModal from '@/components/pages/application/modals/CloseApplicationModal';
import RejectApplicationModal from '@/components/pages/application/modals/RejectApplicationModal';
import RequestRevisionsModal from '@/components/pages/application/modals/RequestRevisionsModal';
import RevokeApplicationModal from '@/components/pages/application/modals/RevokeApplicationModal';
import SuccessModal from '@/components/pages/application/modals/SuccessModal';
import WithdrawApplicationModal from '@/components/pages/application/modals/WithdrawApplicationModal';
import PageHeader from '@/components/pages/global/PageHeader';
import ProtectedComponent from '@/components/ProtectedComponent';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { ApplicationStates } from '@pcgl-daco/data-model';
import { ApplicationStateValues } from '@pcgl-daco/data-model/src/types';
import { useNavigate } from 'react-router';

const { useToken } = theme;

type AppHeaderProps = {
	id: number;
	state: ApplicationStateValues;
	currentSection: string;
	isEditMode: boolean;
};

const ApplicationViewerHeader = ({ id, state, currentSection, isEditMode }: AppHeaderProps) => {
	const { t: translate } = useTranslation();
	const { token } = useToken();
	const minWidth = useMinWidth();
	const isLowResDevice = minWidth <= token.screenLG;
	const [showCloseApplicationModal, setShowCloseApplicationModal] = useState(false);
	const [openRevisionsModal, setOpenRevisionsModal] = useState(false);
	const [showReqRevisionsSuccessModal, setShowReqRevisionsSuccessModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [showRevokeModal, setShowRevokeModal] = useState(false);
	const [showApprovalModal, setShowApprovalModal] = useState(false);
	const [showRejectSuccessModal, setShowRejectSuccessModal] = useState(false);
	const [showSuccessApproveModal, setShowSuccessApproveModal] = useState(false);

	const isWithdrawable = state === ApplicationStates.INSTITUTIONAL_REP_REVIEW || state === ApplicationStates.DAC_REVIEW;

	const navigate = useNavigate();

	const onEditButtonClick = () => {
		if (isWithdrawable) {
			setShowEditModal(true);
		} else if (state === 'DRAFT') {
			navigate(`${currentSection}/edit`, { replace: true });
		}
	};

	const renderHeaderButtons = () => {
		const buttons = [];

		if ((state === ApplicationStates.DRAFT || isWithdrawable) && !isEditMode) {
			buttons.push(
				<ProtectedComponent requiredRoles={['APPLICANT']}>
					<Button onClick={() => onEditButtonClick()}>{translate('button.edit')}</Button>
				</ProtectedComponent>,
			);
		}

		buttons.push(
			<ProtectedComponent requiredRoles={['DAC_MEMBER', 'APPLICANT']} requiredStates={['APPROVED']}>
				<Button onClick={() => setShowRevokeModal(true)}>{translate('button.revoke')}</Button>
			</ProtectedComponent>,
			<ProtectedComponent requiredRoles={['INSTITUTIONAL_REP']} requiredStates={['INSTITUTIONAL_REP_REVIEW']}>
				<Button onClick={() => setOpenRevisionsModal(true)}>{translate('button.requestRevisions')}</Button>
			</ProtectedComponent>,
			<ProtectedComponent
				requiredRoles={['APPLICANT']}
				requiredStates={['DRAFT', 'INSTITUTIONAL_REP_REVIEW', 'DAC_REVIEW']}
			>
				<Button onClick={() => setShowCloseApplicationModal(true)}>{translate('button.closeApp')}</Button>
			</ProtectedComponent>,
			<ProtectedComponent requiredRoles={['DAC_MEMBER']} requiredStates={['DAC_REVIEW']}>
				<Button onClick={() => setOpenRevisionsModal(true)}>{translate('button.requestRevisions')}</Button>
				<Button onClick={() => setShowCloseApplicationModal(true)}>{translate('button.closeApp')}</Button>
				<Button onClick={() => setShowRejectModal(true)}>{translate('button.rejectApplication')}</Button>
				<Button onClick={() => setShowApprovalModal(true)}>{translate('button.approveApplication')}</Button>
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
			<Flex style={{ width: '100%' }} justify="center" align="end" vertical>
				<Row style={{ width: '100%' }} justify={'end'} wrap>
					<Col xs={{ flex: '100%' }} lg={{ flex: '50%' }} flex={1}>
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
					{renderHeaderButtons()}
				</Flex>
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
				{/* Close Modal */}

				{/* Revoke Modal */}
				<RejectApplicationModal
					id={id}
					isOpen={showRejectModal}
					setIsOpen={setShowRejectModal}
					setShowSuccessRejectsModal={setShowRejectSuccessModal}
				/>
				<SuccessModal
					successText={translate('modals.rejectApplication.notifications.rejectApplicationSuccess', { id })}
					okText={translate('modals.buttons.ok')}
					isOpen={showRejectSuccessModal}
					onOk={() => setShowRejectSuccessModal(false)}
				/>
				{/* Revoke Modal */}

				{/* Revisions Modal */}
				<RequestRevisionsModal
					id={id}
					setSuccessModalOpen={setShowReqRevisionsSuccessModal}
					isOpen={openRevisionsModal}
					setIsOpen={setOpenRevisionsModal}
				/>
				<SuccessModal
					successText={translate('modals.applications.global.success.text', { id })}
					okText={translate('modals.buttons.ok')}
					isOpen={showReqRevisionsSuccessModal}
					onOk={() => setShowReqRevisionsSuccessModal(false)}
				/>
				{/* Revisions Modal */}

				{/* Revoke Modal */}
				<RevokeApplicationModal
					applicationId={id}
					showRevokeModal={showRevokeModal}
					setShowRevokeModal={setShowRevokeModal}
				/>
				{/* Revoke Modal */}

				{/* Approval Modal */}
				<ApproveApplicationModal
					id={id}
					isOpen={showApprovalModal}
					setIsOpen={setShowApprovalModal}
					setShowSuccessApproveModal={setShowSuccessApproveModal}
				/>
				<SuccessModal
					successText={translate('modals.approveApplication.notifications.applicationApproveSuccess', { id })}
					okText={translate('modals.buttons.ok')}
					isOpen={showSuccessApproveModal}
					onOk={() => setShowSuccessApproveModal(false)}
				/>
				{/* Approval Modal */}
			</Flex>
		</PageHeader>
	);
};

export default ApplicationViewerHeader;
