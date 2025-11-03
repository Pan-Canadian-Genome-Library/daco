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

import ESignature from '@/components/pages/application/form-components/ESignature';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import SignatureViewer from '@/components/pages/application/SignatureViewer';
import { useSignatureForm } from '@/components/pages/application/utils/useSignatureForm';
import RevisionsAlert from '@/components/RevisionsAlert';
import TextList from '@/components/TextList';
import { ApplicationOutletContext } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { SignatureDTO } from '@pcgl-daco/data-model';
import { Col, Flex, Row, Typography } from 'antd';
import { Trans, useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

const { Text } = Typography;

type Props = {
	signatureData?: SignatureDTO;
	signatureLoading: boolean;
	setOpenModal: (bool: boolean) => void;
};

const RepSignatureView = ({ signatureData, signatureLoading, setOpenModal }: Props) => {
	const { t: translate } = useTranslation();
	const {
		state: { fields },
	} = useApplicationContext();
	const { revisions } = useOutletContext<ApplicationOutletContext>();

	const { applicantFirstName, applicantLastName } = fields;

	const { form, disableSignature, disableSubmit, signatureRef, onSaveClicked } = useSignatureForm({
		signatureData: signatureData,
	});
	const { control, setValue, formState, watch, clearErrors, reset } = form;

	const watchSignature = watch('signature');

	const PointArray = [
		<Trans i18nKey={'sign-and-submit-section.rep-section.point1'} components={{ bold: <strong /> }} />,
		<Trans i18nKey={'sign-and-submit-section.rep-section.point2'} components={{ bold: <strong /> }} />,
	];

	return (
		<>
			<SectionTitle
				title={translate('sign-and-submit-section.title')}
				showLockIcon={disableSignature}
				showDivider={false}
			>
				<Flex vertical>
					<Text>{translate('sign-and-submit-section.rep-section.desc1')}</Text>
					<TextList data={PointArray} />
				</Flex>
			</SectionTitle>
			<Row>
				<RevisionsAlert sectionRevisions={revisions['sign']} />
			</Row>
			<SectionContent showDivider={true}>
				{!signatureLoading ? (
					<SignatureViewer
						title="Applicant"
						name={`${applicantFirstName} ${applicantLastName}`}
						signature={signatureData?.applicantSignature}
						date={signatureData?.applicantSignedAt}
					/>
				) : null}
			</SectionContent>
			<SectionContent
				title={translate('sign-and-submit-section.section.title')}
				text={translate('sign-and-submit-section.section.description')}
			>
				<Row>
					<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
						<input disabled type="hidden" name="createdAt" />
						{!signatureLoading ? (
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
		</>
	);
};

export default RepSignatureView;
