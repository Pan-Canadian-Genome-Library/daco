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

import DataItem from '@/service/pdf/components/DataItem.tsx';
import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';
import { ApplicantDTO } from '@pcgl-daco/data-model';
import { View } from '@react-pdf/renderer';
import { standardStyles } from '../standardStyling.ts';
import { LanguagProps, SupportedLangs, translations } from '../translations/types.ts';

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
	const t = translations[lang];
	return (
		<StandardPage fixed useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>{t.applicant.TITLE}</Title>
			<Paragraph>{t.applicant.QUALIFIED_APPLICANTS_PARAGRAPH}</Paragraph>
			<Paragraph>{t.applicant.INSTITUTIONAL_EMAIL_PARAGRAPH}</Paragraph>
			<FormDisplay title={t.applicant.PRINCIPAL_INVESTIGATOR_INFO_TITLE}>
				<DataItem item={t.applicant.TITLE_LABEL}>{applicantTitle}</DataItem>
				<DataItem item={t.applicant.FIRST_NAME_LABEL}>{applicantFirstName}</DataItem>
				<DataItem item={t.applicant.MIDDLE_NAME_LABEL}>{applicantMiddleName}</DataItem>
				<DataItem item={t.applicant.LAST_NAME_LABEL}>{applicantLastName}</DataItem>
				<DataItem item={t.applicant.SUFFIX_LABEL}>{applicantSuffix}</DataItem>
				<DataItem item={t.applicant.PRIMARY_AFFILIATION_LABEL}>{applicantPrimaryAffiliation}</DataItem>
				<DataItem isLink linkPrefix="mailto:" item={t.applicant.INSTITUTIONAL_EMAIL_LABEL}>
					{applicantInstitutionalEmail}
				</DataItem>
				<DataItem isLink item={t.applicant.RESEARCHER_PROFILE_LABEL}>
					{applicantProfileUrl}
				</DataItem>
				<DataItem item={t.applicant.POSITION_TITLE_LABEL}>{applicantPositionTitle}</DataItem>
			</FormDisplay>
			<FormDisplay title={t.applicant.INSTITUTION_MAILING_ADDRESS_TITLE}>
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
						<DataItem item={t.applicant.COUNTRY_LABEL}>{applicantInstitutionCountry}</DataItem>
						<DataItem item={t.applicant.STREET_ADDRESS_LABEL}>{applicantInstitutionStreetAddress}</DataItem>
						<DataItem item={t.applicant.BUILDING_LABEL}>{applicantInstitutionBuilding}</DataItem>
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
						<DataItem item={t.applicant.PROVINCE_LABEL}>{applicantInstitutionState}</DataItem>
						<DataItem item={t.applicant.CITY_LABEL}>{applicantInstitutionCity}</DataItem>
						<DataItem item={t.applicant.POSTAL_CODE_LABEL}>{applicantInstitutionPostalCode}</DataItem>
					</View>
				</View>
			</FormDisplay>
		</StandardPage>
	);
};

export default ApplicantInformation;
