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
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import InputBox from '@/components/pages/application/form-components/InputBox';
import SelectBox from '@/components/pages/application/form-components/SelectBox';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { ApplicationOutletContext } from '@/global/types';

const rule = createSchemaFieldRule(applicantInformationSchema);

const Applicant = () => {
	const { t: translate } = useTranslation();
	const { isEditMode } = useOutletContext<ApplicationOutletContext>();

	const { handleSubmit, control } = useForm<ApplicantInformationSchemaType>({
		resolver: zodResolver(applicantInformationSchema),
	});

	const onSubmit: SubmitHandler<ApplicantInformationSchemaType> = (data) => {
		console.log(data);
	};

	return (
		<SectionWrapper>
			<Form layout="vertical">
				<SectionTitle
					title={translate('applicant-section.title')}
					text={[translate('applicant-section.description1'), translate('applicant-section.description2')]}
				/>
				<SectionContent title={translate('applicant-section.section1')}>
					<Row>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '25%' }}>
							<SelectBox
								label={translate('applicant-section.form.title')}
								name="applicantTitle"
								placeholder="Select"
								control={control}
								rule={rule}
								options={[
									{ value: 'dr', label: 'Dr' },
									{ value: 'miss', label: 'Miss' },
									{ value: 'mr', label: 'Mr' },
									{ value: 'mrs', label: 'Mrs' },
									{ value: 'ms', label: 'Ms' },
									{ value: 'prof', label: 'Prof' },
								]}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('applicant-section.form.firstName')}
								name="applicantFirstName"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('applicant-section.form.middleName')}
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
								label={translate('applicant-section.form.lastName')}
								name="applicantLastName"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('applicant-section.form.suffix')}
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
								label={translate('applicant-section.form.primaryAffiliation')}
								subLabel={translate('applicant-section.form.primaryAffiliationSubLabel')}
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
								label={translate('applicant-section.form.primaryEmail')}
								subLabel={translate('applicant-section.form.primaryEmailLabel')}
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
								label={translate('applicant-section.form.researcherProfile')}
								subLabel={translate('applicant-section.form.researcherProfileLabel')}
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
								label={translate('applicant-section.form.positionTitle')}
								name="applicantPositionTitle"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
				</SectionContent>
				<SectionContent title={translate('applicant-section.section2')}>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('applicant-section.form.country')}
								name="applicantInstituteCountry"
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
								label={translate('applicant-section.form.streetAddress')}
								name="applicantInstituteStreetAddress"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('applicant-section.form.building')}
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
								label={translate('applicant-section.form.state')}
								name="applicantInstituteState"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('applicant-section.form.city')}
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
								label={translate('applicant-section.form.postalCode')}
								name="applicantInstitutePostalCode"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
				</SectionContent>
				<SectionFooter currentRoute="applicant" isEditMode={isEditMode} onSubmit={handleSubmit(onSubmit)} />
			</Form>
		</SectionWrapper>
	);
};

export default Applicant;
