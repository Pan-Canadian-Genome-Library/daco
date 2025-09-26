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
import { requestedStudiesSchema, type RequestedStudiesSchemaType } from '@pcgl-daco/validation';
import { Col, Form, Row, Typography } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import SelectBox from '@/components/pages/application/form-components/SelectBox';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { useSectionForm } from '@/components/pages/application/utils/useSectionForm';
import { ApplicationOutletContext, Nullable } from '@/global/types';
import { canEditSection } from '@/pages/applications/utils/canEditSection';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import Link from 'antd/es/typography/Link';

const { Text } = Typography;

const rule = createSchemaFieldRule(requestedStudiesSchema);

interface RequestedStudy {
	studyName: string;
	studyID: number;
}

const REQUESTED_STUDY_TEMP_DATA: RequestedStudy[] = [
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
	const { isEditMode, revisions } = useOutletContext<ApplicationOutletContext>();
	const canEdit = canEditSection({ revisions, section: 'study', isEditMode });
	const { state, dispatch } = useApplicationContext();
	const form = useSectionForm({ section: 'study', sectionVisited: state.formState.sectionsVisited.study });

	const {
		formState: { isDirty },
		control,
		getValues,
	} = useForm<Nullable<RequestedStudiesSchemaType>>({
		defaultValues: {
			requestedStudies: state.fields.requestedStudies,
		},
		resolver: zodResolver(requestedStudiesSchema),
	});

	const onSubmit = () => {
		const requestedStudies = getValues('requestedStudies');

		dispatch({
			type: 'UPDATE_APPLICATION',
			payload: {
				...state,
				fields: {
					...state.fields,
					requestedStudies,
				},
				formState: {
					...state.formState,
					isDirty,
				},
			},
		});
	};

	return (
		<SectionWrapper>
			<Form
				form={form}
				layout="vertical"
				onBlur={() => {
					if (canEdit) {
						onSubmit();
					}
				}}
			>
				<SectionTitle
					title={translate('requested-study.title')}
					showLockIcon={!canEdit}
					text={
						<Col>
							<Text>{translate('requested-study.description1') + ' '}</Text>
							<Link href="#">{translate('requested-study.description-link')}</Link>
						</Col>
					}
				/>
				<SectionContent showDivider={false}>
					<Row>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '50%' }}>
							<SelectBox
								label={translate('requested-study.section1.form.studyName')}
								name="requestedStudies"
								placeholder="Select"
								control={control}
								rule={rule}
								mode="multiple"
								options={REQUESTED_STUDY_TEMP_DATA.map((study) => {
									return { value: study.studyName, label: study.studyName };
								})}
								required
								disabled={!canEdit}
							/>
						</Col>
					</Row>
				</SectionContent>
				<SectionFooter currentRoute="study" isEditMode={canEdit} />
			</Form>
		</SectionWrapper>
	);
};

export default RequestedStudy;
