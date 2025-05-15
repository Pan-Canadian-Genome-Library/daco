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

import useCloseApplication from '@/api/mutations/useCloseApplication';

const { Text } = Typography;

interface CloseApplicationModalProps {
	id: number;
	showCloseApplicationModal: boolean;
	setShowCloseApplicationModal: (isOpen: boolean) => void;
}

const CloseApplicationModal = ({
	setShowCloseApplicationModal,
	showCloseApplicationModal,
	id,
}: CloseApplicationModalProps) => {
	const { t: translate } = useTranslation();
	const { mutateAsync: closeApplication, isPending: isClosing } = useCloseApplication();
	const navigate = useNavigate();

	const handleCloseApplicationRequest = () => {
		closeApplication({ applicationId: id }).then(() => {
			navigate('/dashboard');
		});
	};

	return (
		<Modal
			title={translate('modals.closeApplication.title', { id })}
			okText={translate('button.closeApp')}
			cancelText={translate('modals.buttons.cancel')}
			width={'100%'}
			style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
			open={showCloseApplicationModal}
			onOk={handleCloseApplicationRequest}
			okButtonProps={{ disabled: isClosing }}
			onCancel={() => setShowCloseApplicationModal(false)}
		>
			<Flex style={{ height: '100%', marginTop: 20 }}>
				<Text>{translate('modals.closeApplication.description')}</Text>
			</Flex>
		</Modal>
	);
};

export default CloseApplicationModal;
