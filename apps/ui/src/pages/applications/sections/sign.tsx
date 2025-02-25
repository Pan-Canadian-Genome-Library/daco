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
import { esignatureSchema, type eSignatureSchemaType } from '@pcgl-daco/validation';
import { Col, Flex, Form, Modal, Row, Typography } from 'antd';
import { useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import ESignature from '@/components/pages/application/form-components/ESignature';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { type ApplicationOutletContext } from '@/global/types';

const { Text } = Typography;

const SignAndSubmit = () => {
	const { t: translate } = useTranslation();
	const { isEditMode, appId } = useOutletContext<ApplicationOutletContext>();
	const [openModal, setOpenModal] = useState(false);
	const [validatedData, setValidatedData] = useState<eSignatureSchemaType | undefined>(undefined);
	const signatureRef = useRef(null);

	const { handleSubmit, control, setValue, formState, watch, clearErrors, reset } = useForm<eSignatureSchemaType>({
		resolver: zodResolver(esignatureSchema),
	});

	const onSubmit: SubmitHandler<eSignatureSchemaType> = (data) => {
		setOpenModal(true);
		setValidatedData(data);
	};

	const modalSubmission = () => {
		console.log('Submit Clicked!');
		console.log(validatedData);
	};

	const watchSignature = watch('signature');
	const watchCreatedAt = watch('createdAt');

	return (
		<>
			<SectionWrapper>
				<Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
					<SectionTitle title={translate('sign-and-submit-section.title')} showDivider={false} />
					<SectionContent
						showDivider={false}
						title={translate('sign-and-submit-section.section1.title')}
						text={translate('sign-and-submit-section.section1.description')}
					>
						<Row>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
								<input disabled type="hidden" name="createdAt" />
								<ESignature
									signatureRef={signatureRef}
									name="signature"
									control={control}
									watch={watch}
									formState={formState}
									setValue={setValue}
									reset={reset}
									clearErrors={clearErrors}
									disableSaveButton={!watchSignature || !!(watchSignature && watchCreatedAt)}
									disablePreviewButton={!watchSignature}
									downloadButtonText={translate('sign-and-submit-section.section1.buttons.download')}
									saveButtonText={translate('sign-and-submit-section.section1.buttons.save')}
									clearButtonText={translate('sign-and-submit-section.section1.buttons.clear')}
									previewButtonText={translate('sign-and-submit-section.section1.buttons.view')}
								/>
							</Col>
						</Row>
						<Row style={{ minHeight: '40vh' }} />
					</SectionContent>
					<SectionFooter currentRoute="sign" isEditMode={isEditMode} onSubmit={handleSubmit(onSubmit)} />
				</Form>
			</SectionWrapper>
			<Modal
				title={translate('sign-and-submit-section.modal.title')}
				okText={translate('sign-and-submit-section.modal.submit')}
				cancelText={translate('sign-and-submit-section.modal.cancel')}
				width={'100%'}
				style={{ top: '20%', maxWidth: '800px', paddingInline: 10 }}
				open={openModal}
				onOk={modalSubmission}
				onCancel={() => setOpenModal(false)}
			>
				<Flex style={{ height: '100%', marginTop: 20 }}>
					<Text>{translate('sign-and-submit-section.modal.description', { id: appId })}</Text>
				</Flex>
			</Modal>
		</>
	);
};

export default SignAndSubmit;
