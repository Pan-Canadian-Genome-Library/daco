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

import useRevokeApplication from '@/api/mutations/useRevokeApplication';

interface RevokeApplicationModalProps {
	applicationId: number | string;
	showRevokeModal: boolean;
	setShowRevokeModal: (show: boolean) => void;
}
const RevokeApplicationModal = ({
	applicationId,
	showRevokeModal,
	setShowRevokeModal,
}: RevokeApplicationModalProps) => {
	const { Text } = Typography;

	const { t: translate } = useTranslation();
	const { mutateAsync: revokeApplication, isPending: isRevoking } = useRevokeApplication();

	const handleWithdrawApplication = () => {
		revokeApplication({ applicationId: applicationId }).then(() => {
			setShowRevokeModal(false);
		});
	};

	return (
		<Modal
			title={translate('modals.revokeApplication.title', { id: applicationId })}
			okText={translate('modals.revokeApplication.buttons.revoke')}
			cancelText={translate('modals.buttons.cancel')}
			width={'100%'}
			style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
			open={showRevokeModal}
			onOk={handleWithdrawApplication}
			okType="danger"
			okButtonProps={{
				disabled: isRevoking,
			}}
			cancelButtonProps={{
				type: 'default',
			}}
			onCancel={() => setShowRevokeModal(false)}
		>
			<Flex style={{ height: '100%', marginTop: 20 }}>
				<Text>{translate('modals.revokeApplication.description', { id: applicationId })}</Text>
			</Flex>
		</Modal>
	);
};

export default RevokeApplicationModal;
