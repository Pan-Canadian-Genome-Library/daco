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
import { Col, Form, Row } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';
import * as z from 'zod';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import InputBox from '@/components/pages/application/form-components/InputBox';
import SelectBox from '@/components/pages/application/form-components/SelectBox';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { ApplicationOutletContext } from '@/global/types';

type FieldType = {
	applicantTitle: string;
	applicantFirstName: string;
	applicantLastName: string;
	applicantSuffix: string;
	applicantPrimaryAffiliation: string;
	applicantInstitutAffiliation: string;
	applicantProfileUrl: string;
	applicantPositionTitle: string;
	institutionCountry: string;
	institutionState: string;
	institutionCity: string;
	institutionStreetAddress: string;
	institutionPostalCode: string;
	institutionBuilding: string;
};

const schema = z.object({
	applicantTitle: z.string().min(1, { message: 'Required' }),
	applicantFirstName: z
		.string()
		.min(1, { message: 'Required' })
		.max(15, { message: 'First name should be less than 15 characters' }),
});

const rule = createSchemaFieldRule(schema);

const Applicant = () => {
	const { t: translate } = useTranslation();
	const { isEditMode } = useOutletContext<ApplicationOutletContext>();

	const { handleSubmit, control } = useForm<FieldType>({
		resolver: zodResolver(schema),
	});

	const onSubmit: SubmitHandler<FieldType> = (data) => {
		console.log(data);
	};

	return (
		<SectionWrapper>
			<Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
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
								required
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
								name="applicantInstitutAffiliation"
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
								name="institutionCountry"
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
								name="institutionStreetAddress"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('applicant-section.form.building')}
								name="institutionBuilding"
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
								name="institutionState"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('applicant-section.form.city')}
								name="institutionCity"
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
								name="institutionPostalCode"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
				</SectionContent>
				<SectionFooter />
			</Form>
		</SectionWrapper>
	);
};

export default Applicant;
