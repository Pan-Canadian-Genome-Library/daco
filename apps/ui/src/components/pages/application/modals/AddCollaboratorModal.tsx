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

import { ApplicationOutletContext } from '@/global/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Col, Flex, Form, Modal, Row, Typography } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';
import { z } from 'zod';

import InputBox from '@/components/pages/application/form-components/InputBox';

const { Text } = Typography;

type AddCollaboratorModalProps = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
};

const schema = z.object({
	firstName: z.string().min(1, { message: 'Required' }),
	middleName: z.string().min(1, { message: 'Required' }),
	lastName: z.string().min(1, { message: 'Required' }),
	suffix: z.string().min(1, { message: 'Required' }),
	primaryEmail: z.string().min(1, { message: 'Required' }),
	positionTitle: z.string().min(1, { message: 'Required' }),
});

const rule = createSchemaFieldRule(schema);

const AddCollaboratorModal = ({ isOpen, setIsOpen }: AddCollaboratorModalProps) => {
	const { t: translate } = useTranslation();
	const { isEditMode } = useOutletContext<ApplicationOutletContext>();

	const { handleSubmit, control } = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
		console.log(data);
	};

	return (
		<Modal
			title={translate('collab-section.addModalTitle')}
			okText={translate('button.addCollab')}
			cancelText={translate('button.cancel')}
			width={'100%'}
			style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
			open={isOpen}
			onOk={() => setIsOpen(false)}
			onCancel={() => setIsOpen(false)}
		>
			<Flex style={{ height: '100%', marginTop: 20 }} vertical gap={'middle'}>
				<Text>{translate('collab-section.addModalDescription')}</Text>
				<Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
					<Flex vertical>
						<Row gutter={26}>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
								<InputBox
									label={translate('collab-section.form.firstName')}
									name="firstName"
									control={control}
									rule={rule}
									required
									disabled={!isEditMode}
								/>
							</Col>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
								<InputBox
									label={translate('collab-section.form.middleName')}
									name="middleName"
									control={control}
									rule={rule}
									disabled={!isEditMode}
								/>
							</Col>
						</Row>
						<Row gutter={26}>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
								<InputBox
									label={translate('collab-section.form.lastName')}
									name="lastName"
									control={control}
									rule={rule}
									required
									disabled={!isEditMode}
								/>
							</Col>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
								<InputBox
									label={translate('collab-section.form.suffix')}
									name="suffix"
									control={control}
									rule={rule}
									disabled={!isEditMode}
								/>
							</Col>
						</Row>
						<Row gutter={26}>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
								<InputBox
									label={translate('collab-section.form.primaryEmail')}
									name="primaryEmail"
									control={control}
									rule={rule}
									required
									disabled={!isEditMode}
								/>
							</Col>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
								<InputBox
									label={translate('collab-section.form.positionTitle')}
									name="positionTitle"
									control={control}
									rule={rule}
									required
									disabled={!isEditMode}
								/>
							</Col>
						</Row>
					</Flex>
				</Form>
			</Flex>
		</Modal>
	);
};

export default AddCollaboratorModal;
