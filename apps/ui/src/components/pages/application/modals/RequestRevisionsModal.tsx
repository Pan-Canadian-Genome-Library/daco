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

import { RevisionModalStateProps } from '@/components/pages/application/ApplicationViewerHeader';
import TextAreaBox from '@/components/pages/application/form-components/TextAreaBox';
import { useMinWidth } from '@/global/hooks/useMinWidth';

const { Text } = Typography;
const { useToken } = theme;

const rule = createSchemaFieldRule(revisionsModalSchema);

const RequestRevisionsModal = memo(({ isOpen, setIsOpen, onSubmit: onSubmitCallback }: RevisionModalStateProps) => {
	const { t: translate } = useTranslation();
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
			agreements: '',
			appendices: '',
			signature: '',
			general: '',
		},
		resolver: zodResolver(revisionsModalSchema),
	});

	const onSubmit: SubmitHandler<RevisionsModalSchemaType> = (data) => {
		onSubmitCallback(data);
		reset();
	};

	return (
		<Modal
			title={translate('modals.applications.global.revisions.title')}
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
				<Text>{translate('modals.applications.global.revisions.description')}</Text>
				<Form layout="vertical" clearOnDestroy validateTrigger={['onChange']}>
					<Flex vertical>
						<Row>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
								<TextAreaBox
									showCount
									maxWordCount={300}
									rows={2}
									label={translate('modals.applications.global.revisions.applicantInformation')}
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
									label={translate('modals.applications.global.revisions.institutionalRepresentative')}
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
									label={translate('modals.applications.global.revisions.collaborators')}
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
									label={translate('modals.applications.global.revisions.projectInformation')}
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
									label={translate('modals.applications.global.revisions.requestedStudy')}
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
									label={translate('modals.applications.global.revisions.ethics')}
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
									label={translate('modals.applications.global.revisions.agreement')}
									name="agreements"
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
									label={translate('modals.applications.global.revisions.appendices')}
									name="appendices"
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
									label={translate('modals.applications.global.revisions.general')}
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
							{translate('modals.applications.global.revisions.cancel')}
						</Button>
						<Button type="primary" onClick={handleSubmit(onSubmit)} disabled={!formState.isDirty}>
							{translate('modals.applications.global.revisions.sendRequest')}
						</Button>
					</Flex>
				</Form>
			</Flex>
		</Modal>
	);
});

export default RequestRevisionsModal;
