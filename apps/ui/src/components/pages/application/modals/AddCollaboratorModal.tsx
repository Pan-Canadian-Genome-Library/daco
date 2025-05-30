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
import { type CollaboratorsSchemaType, collaboratorsSchema } from '@pcgl-daco/validation';
import { Button, Col, Flex, Form, Modal, Row, Typography } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { memo, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import useAddCollaborator from '@/api/mutations/useAddCollaborator';
import InputBox from '@/components/pages/application/form-components/InputBox';
import { ModalStateProps } from '@/pages/applications/sections/collaborators';

const { Text } = Typography;

const rule = createSchemaFieldRule(collaboratorsSchema);

const AddCollaboratorModal = memo(({ isOpen, setIsOpen }: ModalStateProps) => {
	const { t: translate } = useTranslation();
	const { isEditMode, appId } = useOutletContext<ApplicationOutletContext>();
	const { mutateAsync: addCollaborator } = useAddCollaborator();

	const { handleSubmit, control, reset, setFocus } = useForm<CollaboratorsSchemaType>({
		resolver: zodResolver(collaboratorsSchema),
	});

	const onSubmit: SubmitHandler<CollaboratorsSchemaType> = async (data) => {
		addCollaborator({ applicationId: appId, collaborators: [data] })
			.then(() => {
				reset(); // Clear form after submit
				setIsOpen({ isOpen: false });
			})
			.catch(() => {
				setFocus('collaboratorInstitutionalEmail');
			});
	};

	useEffect(() => {
		return () => {
			reset();
		};
	}, []);

	return (
		<Modal
			title={translate('collab-section.addModalTitle')}
			okText={translate('button.addCollab')}
			cancelText={translate('button.cancel')}
			width={'100%'}
			style={{ top: '20%', maxWidth: '1000px', paddingInline: 10 }}
			open={isOpen}
			onCancel={() => setIsOpen({ isOpen: false })}
			footer={[]}
			destroyOnClose
		>
			<Flex style={{ height: '100%', marginTop: 20 }} vertical gap={'middle'}>
				<Text>{translate('collab-section.addModalDescription')}</Text>
				<Form layout="vertical" clearOnDestroy onFinish={handleSubmit(onSubmit)} preserve={false}>
					<Flex vertical>
						<Row gutter={26}>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
								<InputBox
									label={translate('form.firstName')}
									name="collaboratorFirstName"
									control={control}
									rule={rule}
									required
									disabled={!isEditMode}
								/>
							</Col>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
								<InputBox
									name="collaboratorMiddleName"
									label={translate('form.middleName')}
									control={control}
									rule={rule}
									disabled={!isEditMode}
								/>
							</Col>
						</Row>
						<Row gutter={26}>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
								<InputBox
									label={translate('form.lastName')}
									name="collaboratorLastName"
									control={control}
									rule={rule}
									required
									disabled={!isEditMode}
								/>
							</Col>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
								<InputBox
									label={translate('form.suffix')}
									name="collaboratorSuffix"
									control={control}
									rule={rule}
									disabled={!isEditMode}
								/>
							</Col>
						</Row>
						<Row gutter={26} align={'middle'}>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
								<InputBox
									label={translate('form.primaryEmail')}
									name="collaboratorInstitutionalEmail"
									subLabel={translate('collab-section.primaryEmailLabel')}
									control={control}
									rule={rule}
									required
									disabled={!isEditMode}
								/>
							</Col>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
								<InputBox
									label={translate('form.positionTitle')}
									name="collaboratorPositionTitle"
									style={{ marginTop: '27px' }} // accounting for sublabel extra size from primaryEmail
									control={control}
									rule={rule}
									disabled={!isEditMode}
								/>
							</Col>
						</Row>
					</Flex>
					<Flex align="center" justify="flex-end" gap={'middle'}>
						<Button htmlType="button" onClick={() => setIsOpen({ isOpen: false })}>
							{translate('button.cancel')}
						</Button>
						<Button type="primary" htmlType="submit">
							{translate('button.addCollab')}
						</Button>
					</Flex>
				</Form>
			</Flex>
		</Modal>
	);
});

export default AddCollaboratorModal;
