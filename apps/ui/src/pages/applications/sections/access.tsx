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
import { agreementsSchema, AgreementsSchemaType } from '@pcgl-daco/validation';
import { Col, Form, Row, Typography } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import CheckboxGroup from '@/components/pages/application/form-components/CheckboxGroup';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { ApplicationOutletContext } from '@/global/types';
import { useOutletContext } from 'react-router';

const { Text } = Typography;
const rule = createSchemaFieldRule(agreementsSchema);

const AccessAgreement = () => {
	const { t: translate } = useTranslation();
	const { isEditMode } = useOutletContext<ApplicationOutletContext>();

	const { handleSubmit, control } = useForm<AgreementsSchemaType>({
		resolver: zodResolver(agreementsSchema),
	});

	const onSubmit: SubmitHandler<AgreementsSchemaType> = (data) => {
		console.log(data);
	};

	const agreementOptions = [
		{
			label: translate('data-access-section.section3.agreement1'),
			value: 'agreement1',
		},
		{
			label: translate('data-access-section.section3.agreement2'),
			value: 'agreement2',
		},
		{
			label: translate('data-access-section.section3.agreement3'),
			value: 'agreement3',
		},
		{
			label: translate('data-access-section.section3.agreement4'),
			value: 'agreement4',
		},
		{
			label: translate('data-access-section.section3.agreement5'),
			value: 'agreement5',
		},
		{
			label: translate('data-access-section.section3.agreement6'),
			value: 'agreement6',
		},
		{
			label: translate('data-access-section.section3.agreement7'),
			value: 'agreement7',
		},
		{
			label: translate('data-access-section.section3.agreement8'),
			value: 'agreement8',
		},
		{
			label: translate('data-access-section.section3.agreement9'),
			value: 'agreement9',
		},
	];

	return (
		<SectionWrapper>
			<Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
				<SectionTitle
					textAbidesNewLines={true}
					title={translate('data-access-section.title')}
					text={[translate('data-access-section.description1')]}
				/>
				<SectionContent title={translate('data-access-section.section1.title')}>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
							<Text>
								{processAsRichText(translate('data-access-section.section1.description'), { treatStarAs: 'BULLET' })}
							</Text>
						</Col>
					</Row>
				</SectionContent>
				<SectionContent title={translate('data-access-section.section2.title')}>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
							<Text>
								{processAsRichText(translate('data-access-section.section2.description'), { treatStarAs: 'BULLET' })}
							</Text>
						</Col>
					</Row>
				</SectionContent>
				<SectionContent title={translate('data-access-section.section3.title')}>
					<Row gutter={26}>
						<Col xs={{ flex: '100%' }} md={{ flex: '100%' }} lg={{ flex: '100%' }}>
							<CheckboxGroup
								control={control}
								rule={rule}
								name="agreements"
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
				<SectionFooter currentRoute="agreement" isEditMode={isEditMode} onSubmit={handleSubmit(onSubmit)} />
			</Form>
		</SectionWrapper>
	);
};

interface TextReplacementRules {
	treatStarAs: 'NORMAL' | 'BULLET';
}
/**
 * Formats the agreement text as bullet points if prepended with "*" chars.
 *
 * Given that our translation files only allows single line strings, this
 * makes it easier for the copywriter.
 * @param text The text from the translation files.
 * @param rules Options regarding how the text should be formatted.
 * @returns A `ReactNode` with the text formatted as a `ul` list or otherwise.
 */
const processAsRichText = (text: string, rules: TextReplacementRules) => {
	if (rules.treatStarAs === 'BULLET') {
		const linesAsList = text.split('*').map((linesWithStars, key) => (
			<li key={`${key}-${linesWithStars}`} style={{ listStyleType: 'disc' }}>
				{linesWithStars.trim()}
			</li>
		));
		return <ul>{linesAsList}</ul>;
	}
	return <>{text}</>;
};

export default AccessAgreement;
