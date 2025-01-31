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

import SectionWrapper from '@/components/layouts/SectionWrapper';
import InputBox from '@/components/pages/application/form-components/InputBox';
import LabelWithExample from '@/components/pages/application/form-components/labels/LabelWithExample';
import TextAreaBox from '@/components/pages/application/form-components/TextAreaBox';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { ApplicationOutletContext } from '@/global/types';
import { projectInformationSchema, ProjectInformationSchemaType } from '@pcgl-daco/validation';
import { useOutletContext } from 'react-router';

const rule = createSchemaFieldRule(projectInformationSchema);

const Project = () => {
	const { t: translate } = useTranslation();
	const { isEditMode } = useOutletContext<ApplicationOutletContext>();

	const { handleSubmit, control } = useForm<ProjectInformationSchemaType>({
		resolver: zodResolver(projectInformationSchema),
	});

	const onSubmit: SubmitHandler<ProjectInformationSchemaType> = (data) => {
		console.log(data);
	};

	return (
		<SectionWrapper>
			<Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
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
									name="projectLaySummary"
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
					<Row style={{ margin: '1rem 0' }}>
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
