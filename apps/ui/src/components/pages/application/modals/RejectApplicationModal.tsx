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

import useRejectApplication from '@/api/mutations/useRejectApplication';
import TextAreaBox from '@/components/pages/application/form-components/TextAreaBox';
import { zodResolver } from '@hookform/resolvers/zod';
import { RejectionSchemaType, rejectionSchema } from '@pcgl-daco/validation';
import { Flex, Form, Modal, Typography } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
const rule = createSchemaFieldRule(rejectionSchema);

const { Text } = Typography;

type RejectApplicationModalProps = {
	id: number;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
};

const RejectApplicationModal = ({ id, isOpen, setIsOpen }: RejectApplicationModalProps) => {
	const { t: translate } = useTranslation();
	const navigate = useNavigate();
	const { mutateAsync: rejectApplication } = useRejectApplication();

	const { handleSubmit, control, reset, formState } = useForm<RejectionSchemaType>({
		defaultValues: { rejectionReason: '' },
		resolver: zodResolver(rejectionSchema),
	});

	const handleRejectApplicationRequest: SubmitHandler<RejectionSchemaType> = async (data) => {
		await rejectApplication({ applicationId: data.id, rejectionReason: data.rejectionReason });
		setIsOpen(false);
		reset();
		navigate('/dashboard');
	};

	return (
		<Modal
			title={translate('modals.rejectApplication.title', { id })}
			okText={translate('button.rejectApp')}
			cancelText={translate('modals.buttons.cancel')}
			width="100%"
			style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
			open={isOpen}
			onOk={handleSubmit(handleRejectApplicationRequest)}
			onCancel={() => {
				setIsOpen(false);
				reset();
			}}
			okButtonProps={{ disabled: !formState.isDirty }}
		>
			<Flex vertical gap="middle" style={{ marginTop: 20 }}>
				<Text>{translate('modals.rejectApplication.description')}</Text>
				<Form layout="vertical">
					<TextAreaBox
						name="rejectionReason"
						label={translate('modals.rejectApplication.rejectionReasonLabel')}
						control={control}
						showCount
						rows={4}
						maxWordCount={300}
						rule={rule}
					/>
				</Form>
			</Flex>
		</Modal>
	);
};

export default RejectApplicationModal;
