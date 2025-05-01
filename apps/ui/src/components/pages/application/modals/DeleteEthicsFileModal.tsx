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

import useDeleteEthicsFile from '@/api/mutations/useDeleteEthicsFile';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { Modal } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

interface DeleteEthicsFileModalProps {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
	filename: string;
}

const DeleteEthicsFileModal = ({ filename, isOpen, setIsOpen }: DeleteEthicsFileModalProps) => {
	const { t: translate } = useTranslation();
	const { mutateAsync: deleteFile } = useDeleteEthicsFile();
	const { state, dispatch } = useApplicationContext();

	const onSubmit = () => {
		if (state.fields.ethicsLetter) {
			deleteFile({ fileId: state.fields.ethicsLetter }).then(() => {
				dispatch({
					type: 'UPDATE_APPLICATION',
					payload: {
						fields: {
							...state.fields,
							ethicsLetter: null,
						},
						formState: {
							...state.formState,
						},
					},
				});
			});
			setIsOpen(false);
		}
	};

	return (
		<Modal
			title={translate('ethics-section.deleteModalTitle', { filename })}
			okText={translate('button.delete')}
			okButtonProps={{ color: 'danger', variant: 'solid' }}
			cancelText={translate('button.cancel')}
			width={'100%'}
			style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
			open={isOpen}
			onOk={onSubmit}
			onCancel={() => setIsOpen(false)}
			destroyOnClose
		></Modal>
	);
};

export default DeleteEthicsFileModal;
