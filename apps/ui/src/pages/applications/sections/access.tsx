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
import { agreementsSchema, type AgreementsSchemaType } from '@pcgl-daco/validation';
import { Col, Form, Row, Typography } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import CheckboxGroup, { type CheckboxGroupOptions } from '@/components/pages/application/form-components/CheckboxGroup';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { useSectionForm } from '@/components/pages/application/utils/useSectionForm';
import { Nullable, type ApplicationOutletContext } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { ApplicationAgreements } from '@pcgl-daco/data-model';

const { Text } = Typography;
const rule = createSchemaFieldRule(agreementsSchema);

const AccessAgreement = () => {
	const { t: translate } = useTranslation();
	const { isEditMode, isLocked } = useOutletContext<ApplicationOutletContext>();
	const { state, dispatch } = useApplicationContext();
	const form = useSectionForm({ section: 'agreement', sectionVisited: state.formState.sectionsVisited.agreement });
	const {
		control,
		getValues,
		formState: { isDirty },
	} = useForm<Nullable<AgreementsSchemaType>>({
		defaultValues: {
			acceptedAgreements: state.fields.acceptedAgreements,
		},
		resolver: zodResolver(agreementsSchema),
	});

	const onSubmit = () => {
		const acceptedAgreements = getValues('acceptedAgreements');

		if (!acceptedAgreements) {
			return;
		}

		dispatch({
			type: 'UPDATE_APPLICATION',
			payload: {
				fields: {
					...state.fields,
					acceptedAgreements,
				},
				formState: {
					...state.formState,
					isDirty,
				},
			},
		});
	};

	const agreementOptions: CheckboxGroupOptions[] = Object.keys(ApplicationAgreements).map((agreement, i) => {
		return {
			label: translate(`data-access-section.section3.agreement${i + 1}`),
			value: agreement.toString(),
		};
	});

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
					textAbidesNewLines={true}
					showLockIcon={isLocked}
					title={translate('data-access-section.title')}
					text={[translate('data-access-section.description1')]}
				/>
				<SectionContent title={translate('data-access-section.section1.title')}>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
							<Text>{processAsRichText(translate('data-access-section.section1.description'))}</Text>
						</Col>
					</Row>
				</SectionContent>
				<SectionContent title={translate('data-access-section.section2.title')}>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
							<Text>{processAsRichText(translate('data-access-section.section2.description'))}</Text>
						</Col>
					</Row>
				</SectionContent>
				<SectionContent title={translate('data-access-section.section3.title')}>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
							<CheckboxGroup
								control={control}
								rule={rule}
								name="acceptedAgreements"
								disabled={!isEditMode}
								label={translate('data-access-section.section3.description')}
								options={agreementOptions}
							/>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}></Col>
					</Row>
				</SectionContent>
				<SectionFooter currentRoute="agreement" isEditMode={isEditMode} />
			</Form>
		</SectionWrapper>
	);
};

/**
 * Formats the agreement text as bullet points if prepended with "*" chars.
 *
 * Given that our translation files only allows single line strings, this
 * makes it easier for the copywriter.
 *
 * @example If the translation file contained the following:
 * ```json
 * {
 * 	 "text": "In signing this Agreement: *The User and the User Institution(s) agree to use the ICGC Controlled Data in compliance with all ICGC Goals*The Data Access Period of two (2) years is the maximum approval time for any application."
 * }
 * ```
 *
 * It would be converted to:
 *
 * ```html
 * In signing this agreement:
 * <ul>
 * 	<li>The User and the User Institution(s) agree to use the ICGC Controlled Data in compliance with all ICGC Goals</li>
 * 	<li>The Data Access Period of two (2) years is the maximum approval time for any application.</li>
 * </ul>
 * ```
 *
 * @param text The text from the translation files.
 * @returns A `ReactNode` with the text formatted as a `ul` list if marked with a *.
 */
const processAsRichText = (text: string) => {
	const nonListElements = [];
	const listElements = [];

	const matchAllStars = new RegExp(/(\*)+[^*]*/g);
	const matchAllNormalText = new RegExp(/^[^*]*/g);

	const allPrecedingText = Array.from(text.matchAll(matchAllNormalText), (capturedText) => capturedText[0]);
	const linesWithStars = Array.from(text.matchAll(matchAllStars), (capturedText) => capturedText[0]);

	/**
	 * Some of the copy sometimes can include lines of text before the start of the list which doesn't have *'s
	 * in this case we want to ensure that we don't convert them into list text
	 */
	for (const line of allPrecedingText) {
		if (line) {
			nonListElements.push(line);
		}
	}

	for (const line of linesWithStars) {
		if (line) {
			listElements.push(
				<li key={`${line}`} style={{ listStyleType: 'disc' }}>
					{/*
					 * Note that the captured group from the regex includes the * char still,
					 * this must be removed, hence the split.
					 */}
					{line.trim().split('*')[1]}
				</li>,
			);
		}
	}

	return (
		<>
			{nonListElements}
			<ul>{listElements}</ul>
		</>
	);
};

export default AccessAgreement;
