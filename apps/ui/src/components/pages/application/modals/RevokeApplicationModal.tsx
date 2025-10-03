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

import { Flex, Form, Modal, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import useRevokeApplication from '@/api/mutations/useRevokeApplication';
import { zodResolver } from '@hookform/resolvers/zod';
import { revokeSchema, RevokeSchemaType } from '@pcgl-daco/validation';
import { createSchemaFieldRule } from 'antd-zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import TextAreaBox from '../form-components/TextAreaBox';

interface RevokeApplicationModalProps {
	id: number | string;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	setShowRevokeSuccessModal: (isOpen: boolean) => void;
}

const rule = createSchemaFieldRule(revokeSchema);

const RevokeApplicationModal = ({ id, isOpen, setIsOpen, setShowRevokeSuccessModal }: RevokeApplicationModalProps) => {
	const { Text } = Typography;

	const { t: translate } = useTranslation();
	const { mutateAsync: revokeApplication, isPending: isRevoking } = useRevokeApplication();

	const { handleSubmit, control, reset } = useForm<RevokeSchemaType>({
		defaultValues: { revokeReason: '' },
		resolver: zodResolver(revokeSchema),
	});

	const handleWithdrawApplication: SubmitHandler<RevokeSchemaType> = async (data) => {
		revokeApplication({ applicationId: id, revokeReason: data.revokeReason }).then(() => {
			setIsOpen(false);
			reset();
			setShowRevokeSuccessModal(true);
		});
	};

	return (
		<Modal
			title={translate('modals.revokeApplication.title', { id })}
			okText={translate('modals.revokeApplication.buttons.revoke')}
			cancelText={translate('modals.buttons.cancel')}
			width={'100%'}
			style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
			open={isOpen}
			onOk={handleSubmit(handleWithdrawApplication)}
			okType="danger"
			okButtonProps={{
				disabled: isRevoking,
			}}
			cancelButtonProps={{
				type: 'default',
			}}
			onCancel={() => setIsOpen(false)}
		>
			<Flex vertical style={{ height: '100%', marginTop: 20 }}>
				<Text>{translate('modals.revokeApplication.description', { id })}</Text>
				<Flex vertical gap="middle" style={{ marginTop: 20 }}>
					<Form layout="vertical">
						<TextAreaBox
							name="revokeReason"
							label={translate('modals.revokeApplication.revokeLabel')}
							control={control}
							showCount
							rows={4}
							maxWordCount={300}
							rule={rule}
						/>
					</Form>
				</Flex>
			</Flex>
		</Modal>
	);
};

export default RevokeApplicationModal;
