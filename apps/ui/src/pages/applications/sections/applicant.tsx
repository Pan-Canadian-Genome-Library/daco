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
import { applicantInformationSchema, type ApplicantInformationSchemaType } from '@pcgl-daco/validation';
import { Col, Form, Row } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import InputBox from '@/components/pages/application/form-components/InputBox';
import SelectBox from '@/components/pages/application/form-components/SelectBox';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { GC_STANDARD_GEOGRAPHIC_AREAS, PERSONAL_TITLES } from '@/global/constants';
import { ApplicationOutletContext } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';

const rule = createSchemaFieldRule(applicantInformationSchema);

const Applicant = () => {
	const { t: translate } = useTranslation();
	const { isEditMode } = useOutletContext<ApplicationOutletContext>();
	const { state, dispatch } = useApplicationContext();

	const {
		formState: { isDirty },
		getValues,
		control,
	} = useForm<ApplicantInformationSchemaType>({
		defaultValues: {
			applicantInstituteCountry: 'CAN',
			applicantTitle: state?.fields?.applicantTitle || undefined,
			applicantFirstName: state?.fields?.applicantFirstName || undefined,
			applicantMiddleName: state?.fields?.applicantMiddleName || undefined,
			applicantLastName: state?.fields?.applicantLastName || undefined,
			applicantSuffix: state?.fields?.applicantSuffix || undefined,
			applicantPrimaryAffiliation: state?.fields?.applicantPrimaryAffiliation || undefined,
			applicantInstituteEmail: state?.fields?.applicantInstitutionalEmail || undefined,
			applicantProfileUrl: state?.fields?.applicantProfileUrl || undefined,
			applicantPositionTitle: state?.fields?.applicantPositionTitle || undefined,
		},
		resolver: zodResolver(applicantInformationSchema),
	});

	const onSubmit = () => {
		const data = getValues();

		dispatch({
			type: 'UPDATE_APPLICATION',
			payload: {
				fields: {
					...state?.fields,
					applicantTitle: data.applicantTitle,
					applicantFirstName: data.applicantFirstName,
					applicantMiddleName: data.applicantMiddleName,
					applicantLastName: data.applicantLastName,
					applicantSuffix: data.applicantSuffix,
					applicantPrimaryAffiliation: data.applicantPrimaryAffiliation,
					applicantInstitutionalEmail: data.applicantInstituteEmail,
					applicantProfileUrl: data.applicantProfileUrl,
					applicantPositionTitle: data.applicantPositionTitle,
					// TODO: currently database does not have mailing address for applicant section, once fields are migrated into db, add the fields here
				},
				formState: {
					isDirty,
				},
			},
		});
	};

	return (
		<SectionWrapper>
			<Form
				layout="vertical"
				onBlur={() => {
					if (isEditMode) {
						onSubmit();
					}
				}}
			>
				<SectionTitle
					title={translate('applicant-section.title')}
					text={[translate('applicant-section.description1'), translate('applicant-section.description2')]}
				/>
				<SectionContent title={translate('applicant-section.section1')}>
					<Row>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '25%' }}>
							<SelectBox
								label={translate('form.title')}
								name="applicantTitle"
								placeholder="Select"
								control={control}
								rule={rule}
								options={PERSONAL_TITLES.map((titles) => {
									return { value: titles.en, label: titles.en };
								})}
								required
								initialValue={getValues('applicantTitle')}
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.firstName')}
								name="applicantFirstName"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.middleName')}
								name="applicantMiddleName"
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
								name="applicantLastName"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.suffix')}
								name="applicantSuffix"
								control={control}
								rule={rule}
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.primaryAffiliation')}
								subLabel={translate('form.primaryAffiliationSubLabel')}
								name="applicantPrimaryAffiliation"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.primaryEmail')}
								subLabel={translate('form.primaryEmailLabel')}
								name="applicantInstituteEmail"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.researcherProfile')}
								subLabel={translate('form.researcherProfileLabel')}
								name="applicantProfileUrl"
								placeHolder="https://"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.positionTitle')}
								name="applicantPositionTitle"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
				</SectionContent>
				<SectionContent title={translate('applicant-section.section2')} showDivider={false}>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<SelectBox
								label={translate('form.country')}
								name="applicantInstituteCountry"
								control={control}
								options={GC_STANDARD_GEOGRAPHIC_AREAS.map((areas) => {
									return { value: areas.iso, label: areas.en };
								})}
								initialValue={'CAN'}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.streetAddress')}
								name="applicantInstituteStreetAddress"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.building')}
								name="applicantInstituteBuilding"
								control={control}
								rule={rule}
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.state')}
								name="applicantInstituteState"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.city')}
								name="applicantInstituteCity"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.postalCode')}
								name="applicantInstitutePostalCode"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
				</SectionContent>
				<SectionFooter currentRoute="applicant" isEditMode={isEditMode} />
			</Form>
		</SectionWrapper>
	);
};

export default Applicant;
