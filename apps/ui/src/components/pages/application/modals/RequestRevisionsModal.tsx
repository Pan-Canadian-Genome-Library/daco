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
import { revisionsModalSchema, RevisionsModalSchemaType } from '@pcgl-daco/validation';

import { Button, Col, Flex, Form, Modal, Row, theme, Typography } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { memo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import TextAreaBox from '@/components/pages/application/form-components/TextAreaBox';
import { useMinWidth } from '@/global/hooks/useMinWidth';

import useRequestRevisions from '@/api/mutations/useRequestRevisions';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { useNotificationContext } from '@/providers/context/notification/NotificationContext';

const { Text } = Typography;
const { useToken } = theme;

const rule = createSchemaFieldRule(revisionsModalSchema);

export interface RevisionModalStateProps {
	isOpen: boolean;
	id: number;
	setIsOpen: (isOpen: boolean) => void;
	setSuccessModalOpen: (isOpen: boolean) => void;
}

const RequestRevisionsModal = memo(({ isOpen, setIsOpen, id, setSuccessModalOpen }: RevisionModalStateProps) => {
	const { state: application } = useApplicationContext();
	const { mutateAsync: requestRevisions, isPending: isRequestingRevisions } = useRequestRevisions(
		application.applicationState,
	);
	const { t: translate } = useTranslation();
	const notification = useNotificationContext();

	const { token } = useToken();
	const minWidth = useMinWidth();

	const isLowResDevice = minWidth <= token.screenLGMax;

	const { handleSubmit, control, reset, formState } = useForm<RevisionsModalSchemaType>({
		defaultValues: {
			applicantInformation: '',
			institutionalRep: '',
			collaborators: '',
			projectInformation: '',
			requestedStudy: '',
			ethics: '',
			signature: '',
			general: '',
		},
		resolver: zodResolver(revisionsModalSchema),
	});

	const onSubmit: SubmitHandler<RevisionsModalSchemaType> = (data) => {
		const payload = { ...data, applicationId: id };
		requestRevisions(payload)
			.then(() => {
				setIsOpen(false);
				setSuccessModalOpen(true);
			})
			.catch(() => {
				notification.openNotification({
					type: 'error',
					message: translate('modals.requestRevisions.notifications.failure.title'),
					description: translate('modals.requestRevisions.notifications.failure.text'),
				});
			});
		reset();
	};

	return (
		<Modal
			title={translate('modals.requestRevisions.title')}
			width={'100%'}
			centered={true}
			style={{
				paddingInline: 10,
			}}
			styles={{
				header: {
					paddingLeft: '1rem',
				},
				content: {
					left: !isLowResDevice ? 'calc(50vw - 36em)' : '0',
					maxWidth: '1000px',
				},
				body: {
					maxHeight: '70vh',
					maxWidth: '1000px',
					overflowX: 'hidden',
					overflowY: 'auto',
					paddingLeft: '1rem',
					paddingRight: '1rem',
				},
				footer: {
					position: 'absolute',
					width: '100%',
					height: '10rem',
					padding: 0,
					bottom: 0,
					left: 0,
					border: 'transparent',
					borderRadius: token.borderRadiusLG,
					background: 'linear-gradient(360deg, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 90%)',
					zIndex: 2, //Fixes a weird issue where selected textboxes overlapped the gradient and caused it to disappear.
				},
			}}
			open={isOpen}
			onCancel={(prev) => setIsOpen(!prev)}
			footer={[]}
			destroyOnClose
		>
			<Flex style={{ height: '10%', marginTop: 20 }} vertical gap={'middle'}>
				<Text>{translate('modals.requestRevisions.description')}</Text>
				<Form layout="vertical" clearOnDestroy validateTrigger={['onChange']} disabled={isRequestingRevisions}>
					<Flex vertical>
						<Row>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
								<TextAreaBox
									showCount
									maxWordCount={300}
									rows={2}
									label={translate('modals.requestRevisions.applicantInformation')}
									name="applicantInformation"
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
									label={translate('modals.requestRevisions.institutionalRepresentative')}
									name="institutionalRep"
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
									label={translate('modals.requestRevisions.collaborators')}
									name="collaborators"
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
									label={translate('modals.requestRevisions.projectInformation')}
									name="projectInformation"
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
									label={translate('modals.requestRevisions.requestedStudy')}
									name="requestedStudy"
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
									label={translate('modals.requestRevisions.ethics')}
									name="ethics"
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
									label={translate('modals.requestRevisions.signSubmit')}
									name="signature"
									control={control}
									rule={rule}
								/>
							</Col>
						</Row>
						<Row>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }} style={{ marginBottom: '7rem' }}>
								<TextAreaBox
									showCount
									maxWordCount={300}
									rows={2}
									label={translate('modals.requestRevisions.general')}
									name="general"
									control={control}
									rule={rule}
								/>
							</Col>
						</Row>
					</Flex>
					<Flex
						align="center"
						justify="flex-end"
						gap={'middle'}
						style={{
							position: 'absolute',
							bottom: '2rem',
							right: '2.5rem',
							zIndex: 100,
						}}
					>
						<Button
							htmlType="button"
							onClick={(prev) => {
								setIsOpen(!prev);
								reset();
							}}
						>
							{translate('modals.buttons.cancel')}
						</Button>
						<Button
							type="primary"
							onClick={handleSubmit(onSubmit)}
							disabled={!formState.isDirty || isRequestingRevisions}
						>
							{translate('modals.requestRevisions.buttons.sendRequest')}
						</Button>
					</Flex>
				</Form>
			</Flex>
		</Modal>
	);
});

export default RequestRevisionsModal;
