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
import { projectInformationSchema, type ProjectInformationSchemaType } from '@pcgl-daco/validation';
import { Col, Form, Row } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import InputBox from '@/components/pages/application/form-components/InputBox';
import LabelWithExample from '@/components/pages/application/form-components/labels/LabelWithExample';
import TextAreaBox from '@/components/pages/application/form-components/TextAreaBox';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { ApplicationOutletContext, Nullable } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { useEffect } from 'react';

const rule = createSchemaFieldRule(projectInformationSchema);

const Project = () => {
	const { t: translate } = useTranslation();
	const { isEditMode } = useOutletContext<ApplicationOutletContext>();
	const { state, dispatch } = useApplicationContext();
	const [form] = Form.useForm();
	const {
		control,
		getValues,
		formState: { isDirty },
	} = useForm<Nullable<ProjectInformationSchemaType>>({
		defaultValues: {
			projectTitle: state.fields.projectTitle,
			projectWebsite: state.fields.projectWebsite,
			projectBackground: state.fields.projectBackground,
			projectAims: state.fields.projectAims,
			projectMethodology: state.fields.projectMethodology,
			projectSummary: state.fields.projectSummary,
			// relevantPublicationURL1: state.fields.projectPublicationUrls[0] || undefined,
			// relevantPublicationURL2: state.fields.projectPublicationUrls[1] || undefined,
			// relevantPublicationURL3: state.fields.projectPublicationUrls[2] || undefined,
		},
		resolver: zodResolver(projectInformationSchema),
	});

	const onSubmit = () => {
		const data = getValues();
		// let projectPublicationUrls = [];

		dispatch({
			type: 'UPDATE_APPLICATION',
			payload: {
				fields: {
					...state.fields,
					projectTitle: data.projectTitle,
					projectWebsite: data.projectWebsite,
					projectAims: data.projectAims,
					projectBackground: data.projectBackground,
					projectMethodology: data.projectMethodology,
					projectSummary: data.projectSummary,
					projectPublicationUrls: [
						data.relevantPublicationURL1 || '',
						data.relevantPublicationURL2 || '',
						data.relevantPublicationURL3 || '',
					],
				},
				formState: {
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
				<SectionTitle title={translate('project-section.title')} text={[translate('project-section.description')]} />
				<Row gutter={26}>
					<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
						<InputBox
							label={translate('project-section.section0.form.projectTitle')}
							name="projectTitle"
							control={control}
							rule={rule}
							required
							disabled={!isEditMode}
						/>
					</Col>
					<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
						<InputBox
							label={translate('project-section.section0.form.projectWebsite')}
							name="projectWebsite"
							type="url"
							placeHolder="https://"
							control={control}
							rule={rule}
							disabled={!isEditMode}
						/>
					</Col>
				</Row>
				<SectionContent
					title={translate('project-section.section1.title')}
					text={translate('project-section.section1.description')}
				>
					<Row>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
							<TextAreaBox
								showCount
								maxWordCount={200}
								label={translate('project-section.section1.form.background.title')}
								subLabel={
									<LabelWithExample
										text={translate('project-section.section1.form.background.example.text')}
										examples={[
											translate('project-section.section1.form.background.example.exemplar1'),
											translate('project-section.section1.form.background.example.exemplar2'),
										]}
									/>
								}
								name="projectBackground"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<Row>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
							<TextAreaBox
								showCount
								maxWordCount={200}
								label={translate('project-section.section1.form.methodology.title')}
								subLabel={
									<LabelWithExample
										text={translate('project-section.section1.form.methodology.example.text')}
										examples={[
											translate('project-section.section1.form.methodology.example.exemplar1'),
											translate('project-section.section1.form.methodology.example.exemplar2'),
											translate('project-section.section1.form.methodology.example.exemplar3'),
										]}
									/>
								}
								name="projectMethodology"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<Row>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
							<TextAreaBox
								showCount
								maxWordCount={200}
								label={translate('project-section.section1.form.aims.title')}
								subLabel={<LabelWithExample text={translate('project-section.section1.form.aims.example.text')} />}
								name="projectAims"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<SectionContent title={translate('project-section.section2.title')} showDivider={false}>
						<Row>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
								<TextAreaBox
									showCount
									maxWordCount={250}
									label={translate('project-section.section2.form.lay-summary.title')}
									subLabel={
										<LabelWithExample
											text={translate('project-section.section2.form.lay-summary.example.text')}
											examples={[
												translate('project-section.section2.form.lay-summary.example.exemplar1'),
												translate('project-section.section2.form.lay-summary.example.exemplar2'),
												translate('project-section.section2.form.lay-summary.example.exemplar3'),
												translate('project-section.section2.form.lay-summary.example.exemplar4'),
												translate('project-section.section2.form.lay-summary.example.exemplar5'),
											]}
										/>
									}
									name="projectSummary"
									control={control}
									rule={rule}
									required
									disabled={!isEditMode}
								/>
							</Col>
						</Row>
					</SectionContent>
				</SectionContent>
				<SectionContent
					title={translate('project-section.section3.title')}
					text={translate('project-section.section3.description')}
					showDivider={false}
				>
					<Row>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
							<InputBox
								layout="horizontal"
								placeHolder="https://"
								type="url"
								label={translate('project-section.section3.form.urlPage')}
								name="relevantPublicationURL1"
								control={control}
								rule={rule}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
					<Row>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
								<InputBox
									layout="horizontal"
									placeHolder="https://"
									type="url"
									label={translate('project-section.section3.form.urlPage')}
									name="relevantPublicationURL2"
									control={control}
									rule={rule}
									required
									disabled={!isEditMode}
								/>
							</Col>
						</Col>
					</Row>
					<Row>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
							<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
								<InputBox
									layout="horizontal"
									placeHolder="https://"
									type="url"
									label={translate('project-section.section3.form.urlPage')}
									name="relevantPublicationURL3"
									control={control}
									rule={rule}
									required
									disabled={!isEditMode}
								/>
							</Col>
						</Col>
					</Row>
				</SectionContent>
				<SectionFooter currentRoute="project" isEditMode={isEditMode} />
			</Form>
		</SectionWrapper>
	);
};

export default Project;
