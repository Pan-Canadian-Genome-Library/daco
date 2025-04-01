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
import { institutionalRepSchema, type InstitutionalRepSchemaType } from '@pcgl-daco/validation';
import { Col, Form, Row } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useEffect } from 'react';
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
import { ApplicationOutletContext, Nullable } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';

const rule = createSchemaFieldRule(institutionalRepSchema);

const Institutional = () => {
	const { t: translate } = useTranslation();
	const { isEditMode } = useOutletContext<ApplicationOutletContext>();
	const { state, dispatch } = useApplicationContext();
	const [form] = Form.useForm();

	const {
		formState: { isDirty },
		getValues,
		control,
	} = useForm<Nullable<InstitutionalRepSchemaType>>({
		defaultValues: {
			institutionalFirstName: state.fields.institutionalRepFirstName,
			institutionalMiddleName: state.fields.institutionalRepMiddleName,
			institutionalLastName: state.fields.institutionalRepLastName,
			institutionalInstituteAffiliation: state.fields.institutionalRepEmail,
			institutionalPositionTitle: state.fields.institutionalRepPositionTitle,
			institutionalPrimaryAffiliation: state.fields.institutionalRepPrimaryAffiliation,
			institutionalProfileUrl: state.fields.institutionalRepProfileUrl,
			institutionalSuffix: state.fields.institutionalRepSuffix,
			institutionalTitle: state.fields.institutionalRepTitle,
			institutionBuilding: state.fields.institutionBuilding,
			institutionCity: state.fields.institutionCity,
			institutionCountry: state.fields.institutionCountry || 'CAN',
			institutionPostalCode: state.fields.institutionPostalCode,
			institutionState: state.fields.institutionState,
			institutionStreetAddress: state.fields.institutionStreetAddress,
		},
		resolver: zodResolver(institutionalRepSchema),
	});

	const onSubmit = () => {
		const data = getValues();

		dispatch({
			type: 'UPDATE_APPLICATION',
			payload: {
				fields: {
					...state.fields,
					institutionalRepFirstName: data.institutionalFirstName,
					institutionalRepMiddleName: data.institutionalMiddleName,
					institutionalRepLastName: data.institutionalLastName,
					institutionalRepEmail: data.institutionalInstituteAffiliation,
					institutionalRepPositionTitle: data.institutionalPositionTitle,
					institutionalRepPrimaryAffiliation: data.institutionalPrimaryAffiliation,
					institutionalRepProfileUrl: data.institutionalProfileUrl,
					institutionalRepSuffix: data.institutionalSuffix,
					institutionalRepTitle: data.institutionalTitle,
					institutionBuilding: data.institutionBuilding,
					institutionCity: data.institutionCity,
					institutionCountry: data.institutionCountry,
					institutionPostalCode: data.institutionPostalCode,
					institutionState: data.institutionState,
					institutionStreetAddress: data.institutionStreetAddress,
				},
				formState: {
					...state.formState,
					isDirty,
				},
			},
		});
	};

	// validate fields that have been dirtied on page load
	useEffect(() => {
		form.validateFields({ dirty: true });
	}, [form]);

	return (
		<SectionWrapper>
			<Form
				form={form}
				layout="vertical"
				onBlur={() => {
					if (isEditMode) {
						onSubmit();
					}
				}}
			>
				<SectionTitle
					title={translate('institutional-section.title')}
					text={[translate('institutional-section.description1')]}
				/>
				<SectionContent title={translate('institutional-section.section1')}>
					<Row>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '25%' }}>
							<SelectBox
								label={translate('form.title')}
								name="institutionalTitle"
								placeholder="Select"
								control={control}
								rule={rule}
								options={PERSONAL_TITLES.map((titles) => {
									return { value: titles.en, label: titles.en };
								})}
								initialValue={getValues('institutionalTitle')}
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.firstName')}
								name="institutionalFirstName"
								control={control}
								autoComplete="given-name"
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.middleName')}
								name="institutionalMiddleName"
								autoComplete="additional-name"
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
								name="institutionalLastName"
								control={control}
								autoComplete="family-name"
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.suffix')}
								name="institutionalSuffix"
								control={control}
								autoComplete="honorific-suffix"
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
								name="institutionalPrimaryAffiliation"
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
								name="institutionalInstituteAffiliation"
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
								name="institutionalProfileUrl"
								autoComplete="url"
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
								name="institutionalPositionTitle"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
				</SectionContent>
				<SectionContent title={translate('institutional-section.section2')} showDivider={false}>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<SelectBox
								label={translate('form.country')}
								name="institutionCountry"
								control={control}
								rule={rule}
								options={GC_STANDARD_GEOGRAPHIC_AREAS.map((areas) => {
									return { value: areas.iso, label: areas.en };
								})}
								initialValue={'CAN'}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.streetAddress')}
								name="institutionStreetAddress"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.building')}
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
								label={translate('form.state')}
								name="institutionState"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<InputBox
								label={translate('form.city')}
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
								label={translate('form.postalCode')}
								name="institutionPostalCode"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
				</SectionContent>
				<SectionFooter currentRoute="institutional" isEditMode={isEditMode} />
			</Form>
		</SectionWrapper>
	);
};

export default Institutional;
