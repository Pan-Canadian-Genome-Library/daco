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
import { institutionalRepSchema, requestedStudySchema, type RequestedStudySchemaType } from '@pcgl-daco/validation';
import { Col, Form, Row, Typography } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import SelectBox from '@/components/pages/application/form-components/SelectBox';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { ApplicationOutletContext } from '@/global/types';
import Link from 'antd/es/typography/Link';

const { Text } = Typography;

const rule = createSchemaFieldRule(institutionalRepSchema);

const REQUESTED_STUDY_TEMP_DATA = [
	{
		studyName: 'OICR Study',
		studyID: 1,
	},
	{
		studyName: 'Government of Canada Pan-Canadian Collaboration Study',
		studyID: 2,
	},
];

const RequestedStudy = () => {
	const { t: translate } = useTranslation();
	const { isEditMode } = useOutletContext<ApplicationOutletContext>();

	const { handleSubmit, control } = useForm<RequestedStudySchemaType>({
		resolver: zodResolver(requestedStudySchema),
	});

	const onSubmit: SubmitHandler<RequestedStudySchemaType> = (data) => {
		console.log(data);
	};

	return (
		<SectionWrapper>
			<Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
				<SectionTitle
					title={translate('requested-study.title')}
					text={
						<Col>
							<Text>{translate('requested-study.description1') + ' '}</Text>
							<Link href="#">{translate('requested-study.description-link')}</Link>
						</Col>
					}
				/>
				<SectionContent showDivider={false}>
					<Row>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '25%' }}>
							<SelectBox
								label={translate('requested-study.section1.form.studyName')}
								name="requestedStudy"
								placeholder="Select"
								control={control}
								rule={rule}
								options={REQUESTED_STUDY_TEMP_DATA.map((study) => {
									return { value: study.studyID.toString(), label: study.studyName };
								})}
								required
								disabled={!isEditMode}
							/>
						</Col>
					</Row>
				</SectionContent>
				<SectionFooter currentRoute="study" isEditMode={isEditMode} onSubmit={handleSubmit(onSubmit)} />
			</Form>
		</SectionWrapper>
	);
};

export default RequestedStudy;
