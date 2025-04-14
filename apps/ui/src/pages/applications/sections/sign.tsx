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
import { useEffect, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router';
import SignatureCanvas from 'react-signature-canvas';

import useCreateSignature from '@/api/mutations/useCreateSignature';
import useSubmitApplication from '@/api/mutations/useSubmitApplication';
import useGetSignatures from '@/api/queries/useGetSignatures';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import ESignature from '@/components/pages/application/form-components/ESignature';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { ValidateAllSections } from '@/components/pages/application/utils/validatorFunctions';
import { type ApplicationOutletContext } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { useUserContext } from '@/providers/UserProvider';

const { Text } = Typography;

const SignAndSubmit = () => {
	const { t: translate } = useTranslation();
	const { isEditMode, appId } = useOutletContext<ApplicationOutletContext>();
	const [openModal, setOpenModal] = useState(false);
	const {
		state: { fields },
	} = useApplicationContext();
	const navigation = useNavigate();
	const signatureRef = useRef<SignatureCanvas>(null);
	const { mutateAsync: submitApplication, isPending: isSubmitting } = useSubmitApplication();
	const { handleSubmit, control, setValue, formState, watch, clearErrors, reset, getValues } =
		useForm<eSignatureSchemaType>({
			resolver: zodResolver(esignatureSchema),
		});
	const { mutateAsync: createSignature } = useCreateSignature();
	const { data, isLoading } = useGetSignatures({ applicationId: appId });
	const { role } = useUserContext();

	const onSubmit: SubmitHandler<eSignatureSchemaType> = () => {
		setOpenModal(true);
	};

	const onSaveClicked = async () => {
		const signature = getValues('signature');

		if (signature && role) {
			await createSignature({ applicationId: appId, signature, signee: 'APPLICANT' }).then(() => {
				if (signatureRef.current) {
					signatureRef.current.clear();
				}
			});
		}
	};

	const modalSubmission = () => {
		submitApplication({ applicationId: appId }).then(() => {
			setOpenModal(false);
		});
	};

	// TODO: we have institutional rep signatures to be implemented. Currently only allows APPLICANT roles
	useEffect(() => {
		if (data && data.applicantSignature && signatureRef.current) {
			signatureRef.current.fromDataURL(data.applicantSignature);
		}
	}, [data, setValue]);

	// Push user back to intro if they did not complete the remaning sections
	useEffect(() => {
		if (!ValidateAllSections(fields)) {
			navigation(`/application/${appId}/intro${isEditMode ? '/edit' : ''}`, { replace: true });
		}
	}, [appId, fields, isEditMode, navigation]);

	const watchSignature = watch('signature');

	return (
		<>
			<SectionWrapper>
				<Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
					<SectionTitle
						title={translate('sign-and-submit-section.title')}
						text={translate('sign-and-submit-section.description')}
						showDivider={false}
					/>
					<SectionContent
						showDivider={false}
						title={translate('sign-and-submit-section.section.title')}
						text={translate('sign-and-submit-section.section.description')}
					>
						<Row>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
								<input disabled type="hidden" name="createdAt" />
								{!isLoading ? (
									<ESignature
										disabled={!isEditMode}
										signatureRef={signatureRef}
										name="signature"
										control={control}
										watch={watch}
										formState={formState}
										setValue={setValue}
										reset={reset}
										clearErrors={clearErrors}
										disableSaveButton={!watchSignature}
										onSaveClicked={onSaveClicked}
										downloadButtonText={translate('sign-and-submit-section.section.buttons.download')}
										saveButtonText={translate('sign-and-submit-section.section.buttons.save')}
										clearButtonText={translate('sign-and-submit-section.section.buttons.clear')}
									/>
								) : null}
							</Col>
						</Row>
						<Row style={{ minHeight: '40vh' }} />
					</SectionContent>
					<SectionFooter currentRoute="sign" isEditMode={isEditMode} signSubmitHandler={handleSubmit(onSubmit)} />
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
				okButtonProps={{ disabled: isSubmitting }}
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
