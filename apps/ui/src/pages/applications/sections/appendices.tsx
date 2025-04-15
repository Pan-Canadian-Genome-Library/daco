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
import { Form } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import CheckboxGroup from '@/components/pages/application/form-components/CheckboxGroup';
import { LabelWithLink } from '@/components/pages/application/form-components/labels/LabelWithLink';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { useSectionForm } from '@/components/pages/application/utils/useSectionForm';
import { ApplicationOutletContext, Nullable } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { appendicesEnum } from '@pcgl-daco/data-model';
import { appendicesSchema, type AppendicesSchemaType } from '@pcgl-daco/validation';

const rule = createSchemaFieldRule(appendicesSchema);

const Appendices = () => {
	const { t: translate } = useTranslation();
	const { isEditMode, revisions } = useOutletContext<ApplicationOutletContext>();
	const canEdit = !revisions.appendices?.isApproved || isEditMode;
	const { state, dispatch } = useApplicationContext();
	const {
		control,
		getValues,
		formState: { isDirty },
	} = useForm<Nullable<AppendicesSchemaType>>({
		defaultValues: {
			acceptedAppendices: state.fields.acceptedAppendices,
		},
		resolver: zodResolver(appendicesSchema),
	});
	const form = useSectionForm({ section: 'appendices', sectionVisited: state.formState.sectionsVisited.appendices });

	const onSubmit = () => {
		const acceptedAppendices = getValues('acceptedAppendices');

		if (!acceptedAppendices) {
			return;
		}

		dispatch({
			type: 'UPDATE_APPLICATION',
			payload: {
				fields: {
					...state.fields,
					acceptedAppendices,
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
			<>
				<SectionTitle
					title={translate('appendices.title')}
					showDivider={true}
					showLockIcon={!canEdit}
					text={[translate('appendices.description')]}
				/>
				<SectionContent title={translate('appendices.section1')} showDivider={false}>
					<Form
						form={form}
						onBlur={() => {
							if (canEdit) {
								onSubmit();
							}
						}}
					>
						<CheckboxGroup
							control={control}
							rule={rule}
							name="acceptedAppendices"
							disabled={!canEdit}
							gap={50}
							options={[
								{
									description: (
										<LabelWithLink
											label={translate('appendices.appendix1')}
											link={{ label: translate('appendices.readAppendix'), href: '#' }}
										/>
									),
									label: translate('appendices.haveReadAppendix', { value: 'APPENDIX I' }),
									value: appendicesEnum[0],
								},
								{
									description: (
										<LabelWithLink
											label={translate('appendices.appendix2')}
											link={{ label: translate('appendices.readAppendix'), href: '#' }}
										/>
									),
									label: translate('appendices.haveReadAppendix', { value: 'APPENDIX II' }),
									value: appendicesEnum[1],
								},
								{
									description: (
										<LabelWithLink
											label={translate('appendices.appendix3')}
											link={{ label: translate('appendices.readAppendix'), href: '#' }}
										/>
									),
									label: translate('appendices.haveReadAppendix', { value: 'APPENDIX III' }),
									value: appendicesEnum[2],
								},
							]}
						/>
					</Form>
				</SectionContent>

				<SectionFooter currentRoute="appendices" isEditMode={canEdit} />
			</>
		</SectionWrapper>
	);
};

export default Appendices;
