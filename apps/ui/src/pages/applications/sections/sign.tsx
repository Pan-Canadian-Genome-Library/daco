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
import { Col, Form, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router';
import SignatureCanvas from 'react-signature-canvas';

import useCreateSignature from '@/api/mutations/useCreateSignature';
import useGetDownload from '@/api/queries/useGetDownload';
import useGetSignatures from '@/api/queries/useGetSignatures';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import ESignature from '@/components/pages/application/form-components/ESignature';
import SubmitApplicationModal from '@/components/pages/application/modals/SubmitApplicationModal';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { ValidateAllSections } from '@/components/pages/application/utils/validatorFunctions';
import { type ApplicationOutletContext } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { useUserContext } from '@/providers/UserProvider';
import { canSignSection } from '../utils/canSignSection';

const SignAndSubmit = () => {
	const { t: translate } = useTranslation();
	const { isEditMode, appId, revisions, state } = useOutletContext<ApplicationOutletContext>();
	const [openModal, setOpenModal] = useState(false);
	const {
		state: { fields },
	} = useApplicationContext();
	const navigation = useNavigate();
	const signatureRef = useRef<SignatureCanvas>(null);

	const { refetch: getDownload } = useGetDownload({ fileId: fields.signedPdf });
	const { data, isLoading } = useGetSignatures({ applicationId: appId });
	const { mutateAsync: createSignature } = useCreateSignature();

	const { role } = useUserContext();
	const { control, setValue, formState, watch, clearErrors, reset, getValues } = useForm<eSignatureSchemaType>({
		resolver: zodResolver(esignatureSchema),
	});

	// Logic
	const { disableSignature, disableSubmit } = canSignSection({
		revisions,
		isEditMode,
		role,
		state,
		signatures: data,
	});
	const watchSignature = watch('signature');

	// Load the proper signature based off type of user
	useEffect(() => {
		if (data && data.applicantSignature && signatureRef.current && role === 'APPLICANT') {
			signatureRef.current.fromDataURL(data.applicantSignature, { ratio: 1 });
			setValue('signature', data.applicantSignature);
		} else if (data && data.institutionalRepSignature && signatureRef.current && role === 'INSTITUTIONAL_REP') {
			signatureRef.current.fromDataURL(data.institutionalRepSignature, { ratio: 1 });
			setValue('signature', data.institutionalRepSignature);
		}
	}, [data, role, setValue]);

	// Push user back to intro if they did not complete/fix all the sections
	useEffect(() => {
		if (!ValidateAllSections(fields) && state === 'DRAFT') {
			navigation(`/application/${appId}/intro${isEditMode ? '/edit' : ''}`, { replace: true });
		}
	}, [appId, fields, isEditMode, navigation, state]);

	const onSaveClicked = async () => {
		const signature = getValues('signature');

		if (signature) {
			await createSignature({ applicationId: appId, signature }).then(() => {
				if (signatureRef.current) {
					signatureRef.current.clear();
				}
			});
		}
	};

	// Generate download url and then remove the link after downloading
	const onPDFDownload = async () => {
		const response = await getDownload();

		const { data: responseData } = response;

		// If there is no response data OR the file name does not exist, fail the download procedure
		if (!responseData || responseData.filename === null) {
			return;
		}

		const bufferArray = new Uint8Array(responseData.content.data).buffer;

		const blob = new Blob([bufferArray], {
			type: 'pdf',
		});

		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;

		a.download = responseData.filename;
		document.body.appendChild(a);
		a.click();

		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<>
			<SectionWrapper>
				<Form layout="vertical" onFinish={() => setOpenModal(true)}>
					<SectionTitle
						title={translate('sign-and-submit-section.title')}
						showLockIcon={disableSignature}
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
										disabled={disableSignature}
										signatureRef={signatureRef}
										name="signature"
										control={control}
										watch={watch}
										formState={formState}
										setValue={setValue}
										reset={reset}
										clearErrors={clearErrors}
										disableSaveButton={!watchSignature || disableSignature}
										onSaveClicked={onSaveClicked}
										onDownloadClicked={onPDFDownload}
										disableDownloadPDF={fields.signedPdf === undefined}
										downloadButtonText={translate('sign-and-submit-section.section.buttons.download')}
										saveButtonText={translate('sign-and-submit-section.section.buttons.save')}
										clearButtonText={translate('sign-and-submit-section.section.buttons.clear')}
									/>
								) : null}
							</Col>
						</Row>
						<Row style={{ minHeight: '40vh' }} />
					</SectionContent>
					<SectionFooter
						currentRoute="sign"
						isEditMode={disableSubmit}
						signSubmitHandler={() => {
							setOpenModal(true);
						}}
						submitDisabled={disableSubmit}
					/>
				</Form>
			</SectionWrapper>
			<SubmitApplicationModal isOpen={openModal} setIsOpen={setOpenModal} />
		</>
	);
};

export default SignAndSubmit;
