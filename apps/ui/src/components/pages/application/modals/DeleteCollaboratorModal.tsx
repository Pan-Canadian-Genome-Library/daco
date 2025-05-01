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

import useDeleteCollaborator from '@/api/mutations/useDeleteCollaborator';
import { ModalStateProps } from '@/pages/applications/sections/collaborators';

const { Text } = Typography;

interface DeleteCollaboratorModalProps extends ModalStateProps {
	appId: string | number;
}

const DeleteCollaboratorModal = ({ appId, rowData, isOpen, setIsOpen }: DeleteCollaboratorModalProps) => {
	const { t: translate } = useTranslation();
	const { mutate: deleteCollaborator } = useDeleteCollaborator();

	const onSubmit = () => {
		if (rowData?.collaboratorInstitutionalEmail) {
			deleteCollaborator({ applicationId: appId, collaboratorEmail: rowData.collaboratorInstitutionalEmail });
			setIsOpen({ isOpen: false });
		}
	};

	return (
		<Modal
			title={translate('collab-section.deleteModalTitle')}
			okText={translate('button.delete')}
			okButtonProps={{ color: 'danger', variant: 'solid' }}
			cancelText={translate('button.cancel')}
			width={'100%'}
			style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
			open={isOpen}
			onOk={onSubmit}
			onCancel={() => setIsOpen({ isOpen: false })}
			destroyOnClose
		>
			<Flex style={{ height: '100%', marginTop: 20 }} vertical gap={'middle'}>
				<Text>
					{translate('collab-section.deleteModalDescription', {
						firstName: rowData?.collaboratorFirstName,
						lastName: rowData?.collaboratorLastName,
						appId,
					})}
				</Text>
			</Flex>
		</Modal>
	);
};

export default DeleteCollaboratorModal;
