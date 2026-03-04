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
import { Col, Flex, Form, Input, Row, Tag, Typography } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import useGetStudies from '@/api/queries/useGetStudies';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import DacComments from '@/components/pages/application/collapse/DacComments';
import CheckboxGroupStudies, {
	CheckboxGroupOptionsStudy,
} from '@/components/pages/application/form-components/CheckboxGroupStudies';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { useSectionForm } from '@/components/pages/application/utils/useSectionForm';
import RevisionsAlert from '@/components/RevisionsAlert';
import { ApplicationOutletContext, Nullable } from '@/global/types';
import { canEditSection } from '@/pages/applications/utils/canEditSection';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { StudyDTO } from '@pcgl-daco/data-model/src/types';
import Link from 'antd/es/typography/Link';

const { Text } = Typography;

const rule = createSchemaFieldRule(requestedStudiesSchema);

/**
 * Checks whether the selected studies span more than one DAC.
 * @param requestedStudies - Array of selected studyId strings from the form.
 * @param studies - Full list of StudyDTOs fetched from the server.
 * @returns `true` if two or more distinct dacIds are found, `false` otherwise.
 */
const getDacIds = (requestedStudies: string[] | null | undefined, studies: StudyDTO[]) => {
	if (!requestedStudies || requestedStudies.length === 0) return [];

	const dacIds = requestedStudies.map((studyName) => studies.find((study) => study.studyName === studyName)?.dacId);

	return dacIds;
};

const RequestedStudy = () => {
	const [searchText, setSearchText] = useState<string | undefined>(); // Prevent dropdown from closing
	const [studyArray, setStudyArray] = useState<CheckboxGroupOptionsStudy[]>([]);
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
	const form = useSectionForm({ section: 'study', sectionVisited: state.formState.sectionsVisited.study });

	const {
		control,
		formState: { isDirty },
		watch,
		getValues,
	} = useForm<Nullable<RequestedStudiesSchemaType>>({
		defaultValues: {
			requestedStudies: state.fields.requestedStudies,
		},
		resolver: zodResolver(requestedStudiesSchema),
	});
	const requestedStudies = watch('requestedStudies');

	useEffect(() => {
		if (data) {
			const dacId = getDacIds(requestedStudies, data);
			const dacSet = new Set(dacId);

			const shouldDisbableAll = dacSet.size > 1;

			let newArray: CheckboxGroupOptionsStudy[] = data.map((study) => {
				const shouldDisable = dacId.length !== 0 && study.dacId !== dacId[0];
				return {
					id: study.studyId,
					name: study.studyName,
					displayName: (
						<>
							<Text disabled={shouldDisable || !canEdit} style={{ fontSize: '0.75rem' }} strong>
								{study.studyName}
							</Text>
							, {study.dacId}
						</>
					),
					dacId: study.dacId,
					value: study.studyName,
					disabled: shouldDisable || shouldDisbableAll,
				};
			});

			if (searchText) {
				newArray = newArray.filter(
					(study) =>
						study.value.toLowerCase().includes(searchText.toLowerCase()) ||
						study.dacId.toLowerCase().includes(searchText.toLowerCase()),
				);
			}
			setStudyArray(newArray);
		}
	}, [data, canEdit, searchText, requestedStudies]);

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
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
					}
				}}
				onChange={() => {
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
							<Flex vertical gap={'middle'}>
								<Flex vertical>
									<Text style={{ fontSize: '0.9rem' }}>{translate('requested-study.section1.form.studyName')}</Text>
									<Text style={{ fontSize: '0.75rem' }}>{translate('requested-study.section1.form.studyLabel')}</Text>
								</Flex>
								<Flex style={{ height: '23px' }}>
									{requestedStudies
										? requestedStudies.map((study) => {
												return <Tag key={study}>{study}</Tag>;
											})
										: null}
								</Flex>
								<Input.Search
									placeholder="Search study name..."
									allowClear
									onChange={(e) => {
										e.stopPropagation();
										setSearchText(e.target.value);
									}}
									disabled={!canEdit}
									onSearch={(value) => setSearchText(value)}
								/>
								{!isPending && data ? (
									<div>
										<CheckboxGroupStudies
											control={control}
											rule={rule}
											name="requestedStudies"
											disabled={!canEdit}
											options={studyArray}
										/>
									</div>
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
