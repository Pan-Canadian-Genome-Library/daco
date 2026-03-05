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
import { Col, Flex, Form, Row, Tag, Typography } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import useGetStudies from '@/api/queries/useGetStudies';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import DacComments from '@/components/pages/application/collapse/DacComments';
import SelectBox from '@/components/pages/application/form-components/SelectBox';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { useSectionForm } from '@/components/pages/application/utils/useSectionForm';
import RevisionsAlert from '@/components/RevisionsAlert';
import { ApplicationOutletContext, Nullable } from '@/global/types';
import { canEditSection } from '@/pages/applications/utils/canEditSection';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { useNotificationContext } from '@/providers/context/notification/NotificationContext';
import { pcglColours } from '@/providers/ThemeProvider';
import { StudyDTO } from '@pcgl-daco/data-model/src/types';
import Link from 'antd/es/typography/Link';

const { Text } = Typography;

const rule = createSchemaFieldRule(requestedStudiesSchema);
const { Item } = Form;

const getDacIds = (requestedStudies: string[] | null | undefined, studies: StudyDTO[]) => {
	if (!requestedStudies || requestedStudies.length === 0) return [];

	const dacIds = requestedStudies.map((studyName) => studies.find((study) => study.studyName === studyName)?.dacId);

	return dacIds;
};

const RequestedStudy = () => {
	const { t: translate } = useTranslation();
	const { isEditMode, revisions, dacComments } = useOutletContext<ApplicationOutletContext>();
	const { state, dispatch } = useApplicationContext();
	const { data, isPending } = useGetStudies();

	const canEdit = canEditSection({
		revisions,
		section: 'study',
		isEditMode,
		userPermissions: state.applicationUserPermissions,
	});
	const notification = useNotificationContext();

	const form = useSectionForm({ section: 'study', sectionVisited: state.formState.sectionsVisited.study });

	const { control, watch, getValues, setValue, handleSubmit } = useForm<Nullable<RequestedStudiesSchemaType>>({
		defaultValues: {
			requestedStudies: state.fields.requestedStudies,
		},
		resolver: zodResolver(requestedStudiesSchema),
	});

	const alterData = () => {
		const requestedStudies = getValues('requestedStudies');

		if (!data) return [];
		const dacSet = new Set(getDacIds(requestedStudies, data));

		const shouldDisableAll = dacSet.size > 1;

		if (shouldDisableAll) {
			notification.openNotification({
				type: 'error',
				message: translate('notifications.requestedStudies.errorTitle'),
				description: translate('notifications.requestedStudies.errorMessage'),
			});
		}

		return data.map((study) => {
			const shouldDisable = dacSet.size !== 0 && study.dacId !== dacSet.values().next().value;
			return {
				label: (
					<>
						<Text disabled={shouldDisable || !canEdit} style={{ fontSize: '0.75rem' }} strong>
							{study.studyName}
						</Text>
						, {study.dacId}
					</>
				),
				dacId: study.dacId,
				value: study.studyName,
				disabled: shouldDisable || shouldDisableAll,
			};
		});
	};

	const onSubmit = handleSubmit(() => {
		const requestedStudies = getValues('requestedStudies');

		form.setFieldValue('requestedStudies', requestedStudies);
		form.validateFields();

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
					isDirty: true,
				},
			},
		});
	});

	const removeTag = (value: string) => {
		const requestedStudies = getValues('requestedStudies');
		const filteredStudies = requestedStudies?.filter((study) => study !== value) || null;

		setValue('requestedStudies', filteredStudies);
		form.setFieldValue('requestedStudies', filteredStudies);
		form.validateFields();

		dispatch({
			type: 'UPDATE_APPLICATION',
			payload: {
				...state,
				fields: {
					...state.fields,
					requestedStudies: filteredStudies,
				},
				formState: {
					...state.formState,
					isDirty: true,
				},
			},
		});
	};

	const studies = watch('requestedStudies');

	return (
		<SectionWrapper>
			<Form
				form={form}
				layout="vertical"
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
					}
				}}
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
				<Row>
					<DacComments sectionComments={dacComments} section="study" />
					<RevisionsAlert sectionRevisions={revisions['study']} />
				</Row>
				<SectionContent showDivider={false}>
					<Row>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '75%' }}>
							<Flex vertical gap={'small'}>
								<Flex vertical>
									<Item
										label={translate('requested-study.section1.form.studyName')}
										required={true}
										style={{ margin: 0 }}
									>
										<Text style={{ fontSize: '0.65rem', height: '10px' }}>
											{translate('requested-study.section1.form.studyLabel')}
										</Text>
									</Item>
								</Flex>
								<Flex wrap style={{ minHeight: '23px' }} gap={'small'}>
									{studies
										? studies.map((study) => {
												return (
													<Tag
														key={study}
														style={{ color: !canEdit ? pcglColours.darkGrey : undefined }}
														closable={canEdit}
														onClose={() => removeTag(study)}
													>
														{study}
													</Tag>
												);
											})
										: null}
								</Flex>

								{!isPending && data ? (
									<SelectBox
										name="requestedStudies"
										mode="multiple"
										showSearch={true}
										allowClear={false}
										control={control}
										rule={rule}
										placeholder="Search study name..."
										tagRender={() => <></>}
										disabled={!canEdit}
										options={alterData()}
									/>
								) : null}
							</Flex>
						</Col>
					</Row>
				</SectionContent>
				<SectionFooter currentRoute="study" isEditMode={canEdit} />
			</Form>
		</SectionWrapper>
	);
};

export default RequestedStudy;
