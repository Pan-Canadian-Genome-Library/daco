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

import { zodResolver } from '@hookform/resolvers/zod';
import { type CollaboratorsSchemaType, collaboratorsSchema } from '@pcgl-daco/validation';
import { Button, Col, Flex, Form, Modal, Row, Typography, theme } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { memo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useMinWidth } from '@/global/hooks/useMinWidth';
import { RevisionModalStateProps } from '../AppHeader';
import TextAreaBox from '../form-components/TextAreaBox';

const { Text } = Typography;
const { useToken } = theme;

const rule = createSchemaFieldRule(collaboratorsSchema);

const AddRevisionsModal = memo(({ isOpen, setIsOpen }: RevisionModalStateProps) => {
	const { t: translate } = useTranslation();
	const { token } = useToken();
	const minWidth = useMinWidth();

	const isLowResDevice = minWidth <= token.screenLGMax;

	const { handleSubmit, control, reset } = useForm<CollaboratorsSchemaType>({
		resolver: zodResolver(collaboratorsSchema),
	});

	/**
	 * This is only needed on the modal component specifically because we are utilizing ONE modal component and updating its values via useState (editState).
	 * Since useState is async, need a useEffect to properly update the fields without delay
	 */
	// useEffect(() => {
	// 	// reset({
	// 	// 	collaboratorFirstName: rowData?.firstName || '',
	// 	// 	collaboratorMiddleName: rowData?.lastName || '',
	// 	// 	collaboratorLastName: rowData?.lastName || '',
	// 	// 	collaboratorInstitutionalEmail: rowData?.institutionalEmail || '',
	// 	// 	collaboratorPositionTitle: rowData?.title || '',
	// 	// 	collaboratorSuffix: rowData?.suffix || '',
	// 	// });
	// }, [reset]);

	const onSubmit: SubmitHandler<CollaboratorsSchemaType> = (data) => {
		console.log(data);
	};

	return (
		<Modal
			title={translate('modals.applications.global.revisions.title')}
			width={'100%'}
			style={{
				paddingInline: 10,
			}}
			styles={{
				content: {
					top: '10%',
					left: !isLowResDevice ? 'calc(50vw - 35em)' : '0',
					maxHeight: '100%',
					maxWidth: '1000px',
				},
				body: {
					maxHeight: '70vh',
					overflowX: 'hidden',
					overflowY: 'scroll',
					maxWidth: '1000px',
				},
			}}
			open={isOpen}
			onCancel={(prev) => setIsOpen({ ...prev, isOpen: false })}
			footer={[]}
			destroyOnClose
		>
			<Flex style={{ height: '10%', marginTop: 20 }} vertical gap={'middle'}>
				<Text>{translate('modals.applications.global.revisions.description')}</Text>
				<Form layout="vertical" clearOnDestroy>
					<Flex vertical>
						<Row>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
								<TextAreaBox
									showCount
									maxWordCount={300}
									rows={2}
									label={translate('modals.applications.global.revisions.applicantInformation')}
									name="collaboratorFirstName"
									control={control}
									rule={rule}
								/>
							</Col>
						</Row>
						<Row>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
								<TextAreaBox
									showCount
									maxWordCount={300}
									rows={2}
									label={translate('modals.applications.global.revisions.institutionalRepresentative')}
									name="collaboratorMiddleName"
									control={control}
									rule={rule}
								/>
							</Col>
						</Row>
						<Row>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
								<TextAreaBox
									showCount
									maxWordCount={300}
									rows={2}
									label={translate('modals.applications.global.revisions.collaborators')}
									name="collaboratorLastName"
									control={control}
									rule={rule}
								/>
							</Col>
						</Row>
						<Row>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
								<TextAreaBox
									showCount
									maxWordCount={300}
									rows={2}
									label={translate('modals.applications.global.revisions.projectInformation')}
									name="collaboratorSuffix"
									control={control}
									rule={rule}
								/>
							</Col>
						</Row>
						<Row>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
								<TextAreaBox
									showCount
									maxWordCount={300}
									rows={2}
									label={translate('modals.applications.global.revisions.requestedStudy')}
									name="collaboratorPositionTitle"
									control={control}
									rule={rule}
								/>
							</Col>
						</Row>
						<Row>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
								<TextAreaBox
									showCount
									maxWordCount={300}
									rows={2}
									label={translate('modals.applications.global.revisions.ethics')}
									name="collaboratorPositionTitle"
									control={control}
									rule={rule}
								/>
							</Col>
						</Row>
						<Row>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
								<TextAreaBox
									showCount
									maxWordCount={300}
									rows={2}
									label={translate('modals.applications.global.revisions.signSubmit')}
									name="collaboratorPositionTitle"
									control={control}
									rule={rule}
								/>
							</Col>
						</Row>
						<Row>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }} style={{ marginBottom: '1rem' }}>
								<TextAreaBox
									showCount
									maxWordCount={300}
									rows={2}
									label={translate('modals.applications.global.revisions.general')}
									name="collaboratorPositionTitle"
									control={control}
									rule={rule}
								/>
							</Col>
						</Row>
					</Flex>
					<Flex align="center" justify="flex-end" gap={'middle'}>
						<Button htmlType="button" onClick={(prev) => setIsOpen({ ...prev, isOpen: false })}>
							{translate('modals.applications.global.revisions.cancel')}
						</Button>
						<Button type="primary" onClick={handleSubmit(onSubmit)}>
							{translate('modals.applications.global.revisions.sendRequest')}
						</Button>
					</Flex>
				</Form>
			</Flex>
		</Modal>
	);
});

export default AddRevisionsModal;
