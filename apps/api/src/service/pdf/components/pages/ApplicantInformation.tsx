/*
 * Copyright (c) 202 The Ontario Institute for Cancer Research. All rights reserved
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

import DataItem from '@/service/pdf/components/DataItem.tsx';
import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';
import { APPLICANT_INFORMATION } from '@/service/pdf/components/translations/enTranslations.ts';
import { ApplicantDTO } from '@pcgl-daco/data-model';
import { View } from '@react-pdf/renderer';
import { standardStyles } from '../standardStyling.ts';
import { FR_APPLICANT_INFORMATION } from '../translations/frTranslations.ts';
import { LanguagProps, SupportedLangs } from '../translations/types.ts';

type ApplicantInformationProps = LanguagProps &
	Pick<
		ApplicantDTO,
		| 'applicantFirstName'
		| 'applicantLastName'
		| 'applicantMiddleName'
		| 'applicantTitle'
		| 'applicantSuffix'
		| 'applicantPrimaryAffiliation'
		| 'applicantInstitutionalEmail'
		| 'applicantProfileUrl'
		| 'applicantPositionTitle'
		| 'applicantInstitutionCountry'
		| 'applicantInstitutionState'
		| 'applicantInstitutionStreetAddress'
		| 'applicantInstitutionBuilding'
		| 'applicantInstitutionCity'
		| 'applicantInstitutionPostalCode'
	>;

const ApplicantInformation = ({
	applicantFirstName,
	applicantLastName,
	applicantMiddleName,
	applicantTitle,
	applicantSuffix,
	applicantPrimaryAffiliation,
	applicantInstitutionalEmail,
	applicantProfileUrl,
	applicantPositionTitle,
	applicantInstitutionCountry,
	applicantInstitutionState,
	applicantInstitutionStreetAddress,
	applicantInstitutionBuilding,
	applicantInstitutionCity,
	applicantInstitutionPostalCode,
	lang = SupportedLangs.ENGLISH,
}: ApplicantInformationProps) => {
	return (
		<StandardPage fixed useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>{lang === SupportedLangs.ENGLISH ? APPLICANT_INFORMATION.TITLE : FR_APPLICANT_INFORMATION.TITLE}</Title>
			<Paragraph>
				{lang === SupportedLangs.ENGLISH
					? APPLICANT_INFORMATION.QUALIFIED_APPLICANTS_PARAGRAPH
					: FR_APPLICANT_INFORMATION.QUALIFIED_APPLICANTS_PARAGRAPH}
			</Paragraph>
			<Paragraph>
				{lang === SupportedLangs.ENGLISH
					? APPLICANT_INFORMATION.INSTITUTIONAL_EMAIL_PARAGRAPH
					: FR_APPLICANT_INFORMATION.INSTITUTIONAL_EMAIL_PARAGRAPH}
			</Paragraph>
			<FormDisplay
				title={
					lang === SupportedLangs.ENGLISH
						? APPLICANT_INFORMATION.PRINCIPAL_INVESTIGATOR_INFO_TITLE
						: FR_APPLICANT_INFORMATION.PRINCIPAL_INVESTIGATOR_INFO_TITLE
				}
			>
				<DataItem
					item={
						lang === SupportedLangs.ENGLISH ? APPLICANT_INFORMATION.TITLE_LABEL : FR_APPLICANT_INFORMATION.TITLE_LABEL
					}
				>
					{applicantTitle}
				</DataItem>
				<DataItem
					item={
						lang === SupportedLangs.ENGLISH
							? APPLICANT_INFORMATION.FIRST_NAME_LABEL
							: FR_APPLICANT_INFORMATION.FIRST_NAME_LABEL
					}
				>
					{applicantFirstName}
				</DataItem>
				<DataItem
					item={
						lang === SupportedLangs.ENGLISH
							? APPLICANT_INFORMATION.MIDDLE_NAME_LABEL
							: FR_APPLICANT_INFORMATION.MIDDLE_NAME_LABEL
					}
				>
					{applicantMiddleName}
				</DataItem>
				<DataItem
					item={
						lang === SupportedLangs.ENGLISH
							? APPLICANT_INFORMATION.LAST_NAME_LABEL
							: FR_APPLICANT_INFORMATION.LAST_NAME_LABEL
					}
				>
					{applicantLastName}
				</DataItem>
				<DataItem
					item={
						lang === SupportedLangs.ENGLISH ? APPLICANT_INFORMATION.SUFFIX_LABEL : FR_APPLICANT_INFORMATION.SUFFIX_LABEL
					}
				>
					{applicantSuffix}
				</DataItem>
				<DataItem
					item={
						lang === SupportedLangs.ENGLISH
							? APPLICANT_INFORMATION.PRIMARY_AFFILIATION_LABEL
							: FR_APPLICANT_INFORMATION.PRIMARY_AFFILIATION_LABEL
					}
				>
					{applicantPrimaryAffiliation}
				</DataItem>
				<DataItem
					isLink
					linkPrefix="mailto:"
					item={
						lang === SupportedLangs.ENGLISH
							? APPLICANT_INFORMATION.INSTITUTIONAL_EMAIL_LABEL
							: FR_APPLICANT_INFORMATION.INSTITUTIONAL_EMAIL_LABEL
					}
				>
					{applicantInstitutionalEmail}
				</DataItem>
				<DataItem
					isLink
					item={
						lang === SupportedLangs.ENGLISH
							? APPLICANT_INFORMATION.RESEARCHER_PROFILE_LABEL
							: FR_APPLICANT_INFORMATION.RESEARCHER_PROFILE_LABEL
					}
				>
					{applicantProfileUrl}
				</DataItem>
				<DataItem
					item={
						lang === SupportedLangs.ENGLISH
							? APPLICANT_INFORMATION.POSITION_TITLE_LABEL
							: FR_APPLICANT_INFORMATION.POSITION_TITLE_LABEL
					}
				>
					{applicantPositionTitle}
				</DataItem>
			</FormDisplay>
			<FormDisplay
				title={
					lang === SupportedLangs.ENGLISH
						? APPLICANT_INFORMATION.INSTITUTION_MAILING_ADDRESS_TITLE
						: FR_APPLICANT_INFORMATION.INSTITUTION_MAILING_ADDRESS_TITLE
				}
			>
				<View
					style={{
						display: 'flex',
						justifyContent: 'center',
						flexDirection: 'row',
						gap: standardStyles.textStyles.sizes.md,
						marginTop: standardStyles.textStyles.sizes.md,
					}}
				>
					<View
						style={{
							flex: 1.5,
							display: 'flex',
							gap: standardStyles.textStyles.sizes.md,
						}}
					>
						<DataItem
							item={
								lang === SupportedLangs.ENGLISH
									? APPLICANT_INFORMATION.COUNTRY_LABEL
									: FR_APPLICANT_INFORMATION.COUNTRY_LABEL
							}
						>
							{applicantInstitutionCountry}
						</DataItem>
						<DataItem
							item={
								lang === SupportedLangs.ENGLISH
									? APPLICANT_INFORMATION.STREET_ADDRESS_LABEL
									: FR_APPLICANT_INFORMATION.STREET_ADDRESS_LABEL
							}
						>
							{applicantInstitutionStreetAddress}
						</DataItem>
						<DataItem
							item={
								lang === SupportedLangs.ENGLISH
									? APPLICANT_INFORMATION.BUILDING_LABEL
									: FR_APPLICANT_INFORMATION.BUILDING_LABEL
							}
						>
							{applicantInstitutionBuilding}
						</DataItem>
					</View>
					<View
						style={{
							flex: 1,
							display: 'flex',
							justifyContent: 'center',
							gap: standardStyles.textStyles.sizes.md,
							marginLeft: standardStyles.textStyles.sizes.md,
						}}
					>
						<DataItem
							item={
								lang === SupportedLangs.ENGLISH
									? APPLICANT_INFORMATION.PROVINCE_LABEL
									: FR_APPLICANT_INFORMATION.PROVINCE_LABEL
							}
						>
							{applicantInstitutionState}
						</DataItem>
						<DataItem
							item={
								lang === SupportedLangs.ENGLISH ? APPLICANT_INFORMATION.CITY_LABEL : FR_APPLICANT_INFORMATION.CITY_LABEL
							}
						>
							{applicantInstitutionCity}
						</DataItem>
						<DataItem
							item={
								lang === SupportedLangs.ENGLISH
									? APPLICANT_INFORMATION.POSTAL_CODE_LABEL
									: FR_APPLICANT_INFORMATION.POSTAL_CODE_LABEL
							}
						>
							{applicantInstitutionPostalCode}
						</DataItem>
					</View>
				</View>
			</FormDisplay>
		</StandardPage>
	);
};

export default ApplicantInformation;
