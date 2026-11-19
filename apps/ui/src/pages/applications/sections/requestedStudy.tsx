/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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
import { Button, Col, ConfigProvider, Flex, Form, Row, Table, Typography } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import useGetAllStudies from '@/api/queries/useGetAllStudies';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import DacComments from '@/components/pages/application/collapse/DacComments';
import SelectBox from '@/components/pages/application/form-components/SelectBox';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { useSectionForm } from '@/components/pages/application/utils/useSectionForm';
import { ApplicationOutletContext, Nullable } from '@/global/types';
import { canEditSection } from '@/pages/applications/utils/canEditSection';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { useNotificationContext } from '@/providers/context/notification/NotificationContext';
import { studyTableTheme } from '@/providers/ThemeProvider';
import { CloseCircleOutlined } from '@ant-design/icons';
import { ApplicationStates, type StudyDacoDTO } from '@pcgl-daco/data-model';
import Link from 'antd/es/typography/Link';

const { Text } = Typography;
const { Item } = Form;

const rule = createSchemaFieldRule(requestedStudiesSchema);

export const AllowedDUOPermissions = {
	GENERAL_RESEARCH_USE: 'DUO:0000042', // general research use
	HEALTH_MEDICAL_BIOMEDICAL_RESEARCH: 'DUO:0000006', // health or medical or biomedical research
	DISEASE_SPECIFIC_MODIFIER: 'DUO:0000007', // disease specific research
	POPULATION_ORIGINS_ANCESTRY_RESEARCH_ONLY: 'DUO:0000011', // population origins or ancestry research only
	NO_RESTRICTION: `DUO:0000004`, // no restriction
} as const;

export type AllowedDUOPermissionsValues = (typeof AllowedDUOPermissions)[keyof typeof AllowedDUOPermissions];

const DUO_PERMISSION_DISPLAY: Record<string, string> = {
	[AllowedDUOPermissions.GENERAL_RESEARCH_USE]: 'DUO:0000042 (general research use)',
	[AllowedDUOPermissions.HEALTH_MEDICAL_BIOMEDICAL_RESEARCH]: 'DUO:0000006 (health or medical or biomedical research)',
	[AllowedDUOPermissions.DISEASE_SPECIFIC_MODIFIER]: 'DUO:0000007 (disease specific research)',
	[AllowedDUOPermissions.POPULATION_ORIGINS_ANCESTRY_RESEARCH_ONLY]:
		'DUO:0000011 (population origins or ancestry research only)',
	[AllowedDUOPermissions.NO_RESTRICTION]: 'DUO:0000004 (no restriction)',
};

const RequestedStudy = () => {
	const { t: translate } = useTranslation();
	const { isEditMode, revisions, dacComments, disabledDacComments } = useOutletContext<ApplicationOutletContext>();
	const { state, dispatch } = useApplicationContext();
	const notification = useNotificationContext();
	const { data: allStudies, isPending: isAllStudiesPending } = useGetAllStudies();
	const canEditFromPermissions = canEditSection({
		revisions,
		section: 'study',
		isEditMode,
		userPermissions: state.applicationUserPermissions,
		currentApplicationState: state.applicationState,
	});
	const form = useSectionForm({ section: 'study', sectionVisited: state.formState.sectionsVisited.study });
	const { control, watch, getValues, setValue, handleSubmit } = useForm<Nullable<RequestedStudiesSchemaType>>({
		defaultValues: {
			requestedStudies: state.fields.requestedStudies,
		},
		resolver: zodResolver(requestedStudiesSchema),
	});
	const studies = watch('requestedStudies');
	// Should be able to change the requested studies while in DRAFT, once past this, the user should not be able to change them
	const canEdit = canEditFromPermissions && state.applicationState === ApplicationStates.DRAFT;

	const alterAllStudiesData = () => {
		const getDacIds = (requestedStudies: string[] | null, studies: StudyDacoDTO[]): (string | null)[] => {
			if (!requestedStudies?.length) {
				return [];
			}

			const dacIds = requestedStudies
				.map((studyId) => studies.find((study) => study.studyId === studyId)?.dacId)
				.filter((study) => study !== undefined);

			return dacIds;
		};
		const requestedStudies = getValues('requestedStudies');

		if (!allStudies) return [];
		const dacSet = new Set(getDacIds(requestedStudies, allStudies));

		const shouldDisableAll = dacSet.size > 1;

		if (shouldDisableAll) {
			notification.openNotification({
				type: 'error',
				message: translate('notifications.requestedStudies.errorTitle'),
				description: translate('notifications.requestedStudies.errorMessage'),
			});
		}

		return allStudies
			.filter((study) => study.acceptingApplications)
			.map((study) => {
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
					value: study.studyId,
					disabled: shouldDisable || shouldDisableAll,
					searchValue: study.studyName,
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
						<Flex vertical>
							<Text>{translate('requested-study.description1')}</Text>
							<Text style={{ marginTop: '1rem' }}>{translate('requested-study.description2')}</Text>
							<Text style={{ marginTop: '1rem' }}>{translate('requested-study.description3')}</Text>
							<Link href="#">{translate('requested-study.description-link')}</Link>
						</Flex>
					}
				/>
				<Row>
					<DacComments sectionComments={dacComments} section="study" disabled={disabledDacComments} />
				</Row>
				<SectionContent showDivider={false}>
					<Row>
						<Col xs={{ flex: '100%' }}>
							<Flex vertical gap={'small'}>
								<Flex vertical>
									<Item
										label={translate('requested-study.section1.form.studyName')}
										required={true}
										style={{ margin: 0 }}
									>
										<Text style={{ fontSize: '0.8rem', height: '10px' }}>
											{translate('requested-study.section1.form.studyLabel')}
										</Text>
									</Item>
								</Flex>

								{!isAllStudiesPending && allStudies ? (
									<SelectBox
										name="requestedStudies"
										mode="multiple"
										filterOption={(input, option) => {
											return (option?.searchValue ?? '').toLowerCase().includes(input.toLowerCase());
										}}
										showSearch={true}
										allowClear={false}
										control={control}
										rule={rule}
										label={'Search study name...'}
										placeholder="Search study name..."
										tagRender={() => <></>}
										disabled={!canEdit}
										options={alterAllStudiesData()}
									/>
								) : null}
							</Flex>
							<ConfigProvider theme={studyTableTheme}>
								{/*TABLE*/}
								{studies && allStudies && (
									<Table
										dataSource={studies.map((studyId) => {
											const study = allStudies.find((s) => s.studyId === studyId);
											if (!study) return null;

											return {
												study: study.studyName,
												duo: DUO_PERMISSION_DISPLAY[study.duoPermission] ?? study.duoPermission, // Display with additional description if found, otherwise just the DUO code
												diseaseSpecificModifier: study.diseaseSpecificModifier,
												deleteStudy: (
													<Flex>
														<Button
															color="default"
															onClick={() => removeTag(study.studyId)}
															variant="text"
															icon={<CloseCircleOutlined style={{ fontSize: '20px' }} />}
															shape="circle"
															disabled={!canEdit}
														/>
													</Flex>
												),
											};
										})}
										columns={[
											{
												title: 'Study',
												dataIndex: 'study',
												key: 'study',
											},
											{
												title: 'Duo Permission',
												dataIndex: 'duo',
												key: 'duo',
											},
											{
												title: 'Disease Specific Modifier',
												dataIndex: 'diseaseSpecificModifier',
												key: 'diseaseSpecificModifier',
											},
											{
												title: '',
												dataIndex: 'deleteStudy',
												key: 'deleteStudy',
											},
										]}
									/>
								)}
							</ConfigProvider>
						</Col>
					</Row>
				</SectionContent>
				<SectionFooter currentRoute="study" isEditMode={canEdit} />
			</Form>
		</SectionWrapper>
	);
};

export default RequestedStudy;
