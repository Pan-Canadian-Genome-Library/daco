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

import { EthicsFileEnum, ethicsSchema, type EthicsSchemaType } from '@pcgl-daco/validation';
import { Button, Form } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import BlockRadioBox from '@/components/pages/application/form-components/BlockRadioBox';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { ApplicationOutletContext } from '@/global/types';

const rule = createSchemaFieldRule(ethicsSchema);

const Ethics = () => {
	const { t: translate } = useTranslation();
	const { isEditMode } = useOutletContext<ApplicationOutletContext>();
	const { control } = useForm<EthicsSchemaType>({});

	return (
		<SectionWrapper>
			<>
				<SectionTitle
					title={translate('ethics-section.title')}
					text={[translate('ethics-section.description1'), translate('ethics-section.description2')]}
					showDivider={true}
				/>
				<SectionContent title="Ethical Approval">
					<Form layout="vertical">
						<BlockRadioBox
							label={'Please choose one of the following options'}
							name="ethicsApproval"
							control={control}
							rule={rule}
							required
							options={[
								{
									value: EthicsFileEnum.EXEMPTION,
									label:
										'You represent and warrant that your country/region does not require your research project to undergo ethics review.',
								},
								{
									value: EthicsFileEnum.ETHICS_LETTER,
									label:
										'Your country/region requires your Research Project to undergo ethics review, and therefore, this research project has been approved by an IRB/REC formally designated to approve and/or monitor research involving humans. As per the Data Access Agreement (see Section F) current and applicable ethical approval is the responsibility of the Principal Investigator.',
								},
							]}
						/>
						<Button htmlType="submit" />
					</Form>
				</SectionContent>
				<SectionFooter currentRoute="ethics" isEditMode={isEditMode} />
			</>
		</SectionWrapper>
	);
};

export default Ethics;
