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

import useEditCollaborator from '@/api/mutations/useEditCollaborator';
import InputBox from '@/components/pages/application/form-components/InputBox';
import { ModalStateProps } from '@/pages/applications/sections/collaborators';

const { Text } = Typography;

const rule = createSchemaFieldRule(collaboratorsSchema);

const EditCollaboratorModal = memo(({ rowData, isOpen, setIsOpen }: ModalStateProps) => {
	const { t: translate } = useTranslation();
	const { appId, isEditMode } = useOutletContext<ApplicationOutletContext>();
	const { mutate: editCollaborator } = useEditCollaborator();

	const { handleSubmit, control, reset } = useForm<CollaboratorsSchemaType>({
		defaultValues: {
			collaboratorFirstName: rowData?.collaboratorFirstName || undefined,
			collaboratorMiddleName: rowData?.collaboratorMiddleName || undefined,
			collaboratorLastName: rowData?.collaboratorLastName || undefined,
			collaboratorInstitutionalEmail: rowData?.collaboratorInstitutionalEmail || undefined,
			collaboratorPositionTitle: rowData?.collaboratorPositionTitle || undefined,
		},
		resolver: zodResolver(collaboratorsSchema),
	});

	/**
	 * This is only needed on the modal component specifically because we are utilizing ONE modal component and updating its values via useState (editState).
	 * Since useState is async, need a useEffect to properly update the fields without delay
	 */
	useEffect(() => {
		reset({
			collaboratorFirstName: rowData?.collaboratorFirstName || undefined,
			collaboratorMiddleName: rowData?.collaboratorMiddleName || undefined,
			collaboratorLastName: rowData?.collaboratorLastName || undefined,
			collaboratorInstitutionalEmail: rowData?.collaboratorInstitutionalEmail || undefined,
			collaboratorPositionTitle: rowData?.collaboratorPositionTitle || undefined,
			collaboratorSuffix: rowData?.collaboratorSuffix || undefined,
		});
	}, [rowData, reset]);

	const onSubmit: SubmitHandler<CollaboratorsSchemaType> = (data) => {
		if (rowData?.collaboratorInstitutionalEmail) {
			editCollaborator({
				applicationId: appId,
				institutionalEmail: rowData.collaboratorInstitutionalEmail,
				collaboratorUpdates: { ...data },
			});
			setIsOpen({ isOpen: false });
		}
	};

	return (
		<Modal
			title={translate('collab-section.editModalTitle')}
			okText={translate('button.addCollab')}
			cancelText={translate('button.cancel')}
			width={'100%'}
			style={{ top: '20%', maxWidth: '1000px', paddingInline: 10 }}
			open={isOpen}
			onCancel={(prev) => setIsOpen({ ...prev, isOpen: false })}
			footer={[]}
			destroyOnClose
		>
			<Flex style={{ height: '100%', marginTop: 20 }} vertical gap={'middle'}>
				<Text>{translate('collab-section.editModalDescription')}</Text>
				<Form layout="vertical" clearOnDestroy>
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
									label={translate('form.middleName')}
									name="collaboratorMiddleName"
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
									subLabel={translate('collab-section.primaryEmailLabel')}
									name="collaboratorInstitutionalEmail"
									control={control}
									rule={rule}
									required
									disabled={!isEditMode}
								/>
							</Col>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
								<InputBox
									style={{ marginTop: '27px' }} // accounting for sublabel extra size from primaryEmail
									label={translate('form.positionTitle')}
									name="collaboratorPositionTitle"
									control={control}
									rule={rule}
									disabled={!isEditMode}
								/>
							</Col>
						</Row>
					</Flex>
					<Flex align="center" justify="flex-end" gap={'middle'}>
						<Button htmlType="button" onClick={(prev) => setIsOpen({ ...prev, isOpen: false })}>
							{translate('button.cancel')}
						</Button>
						<Button type="primary" onClick={handleSubmit(onSubmit)}>
							{translate('button.save')}
						</Button>
					</Flex>
				</Form>
			</Flex>
		</Modal>
	);
});

export default EditCollaboratorModal;
