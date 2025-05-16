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

import { Flex, Modal, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import useWithdrawApplication from '@/api/mutations/useWithdrawApplication';

interface WithdrawApplicationModalProps {
	currentSection: string;
	applicationId: number | string;
	showEditModal: boolean;
	setShowEditModal: (show: boolean) => void;
}
const WithdrawApplicationModal = ({
	currentSection,
	applicationId,
	showEditModal,
	setShowEditModal,
}: WithdrawApplicationModalProps) => {
	const { Text } = Typography;

	const { t: translate } = useTranslation();
	const navigate = useNavigate();
	const { mutateAsync: withdrawApplication, isPending: isWithdrawing } = useWithdrawApplication();

	const handleWithdrawApplication = () => {
		withdrawApplication({ applicationId: applicationId }).then(() => {
			setShowEditModal(false);
			navigate(`${currentSection}/edit`, { replace: true });
		});
	};

	return (
		<Modal
			title={translate('modals.editApplication.title', { id: applicationId })}
			okText={translate('modals.editApplication.buttons.edit')}
			cancelText={translate('modals.buttons.cancel')}
			width={'100%'}
			style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
			open={showEditModal}
			onOk={handleWithdrawApplication}
			okType="default"
			okButtonProps={{
				disabled: isWithdrawing,
			}}
			cancelButtonProps={{
				type: 'primary',
			}}
			onCancel={() => setShowEditModal(false)}
		>
			<Flex style={{ height: '100%', marginTop: 20 }}>
				<Text>{translate('modals.editApplication.description', { id: applicationId })}</Text>
			</Flex>
		</Modal>
	);
};

export default WithdrawApplicationModal;
