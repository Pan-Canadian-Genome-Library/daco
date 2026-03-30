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

import { ApplicantDTO } from '@pcgl-daco/data-model';

import DataItem from '@/service/pdf/components/DataItem.tsx';
import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';
import { APPLICANT_INFORMATION } from '@/service/pdf/components/enTranslations.ts';
import { View } from '@react-pdf/renderer';
import { standardStyles } from '../standardStyling.ts';

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
}: Pick<
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
>) => {
	return (
		<StandardPage fixed useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>{APPLICANT_INFORMATION.TITLE}</Title>
			<Paragraph>{APPLICANT_INFORMATION.QUALIFIED_APPLICANTS_PARAGRAPH}</Paragraph>
			<Paragraph>{APPLICANT_INFORMATION.INSTITUTIONAL_EMAIL_PARAGRAPH}</Paragraph>
			<FormDisplay title={APPLICANT_INFORMATION.PRINCIPAL_INVESTIGATOR_INFO_TITLE}>
				<DataItem item={APPLICANT_INFORMATION.TITLE_LABEL}>{applicantTitle}</DataItem>
				<DataItem item={APPLICANT_INFORMATION.FIRST_NAME_LABEL}>{applicantFirstName}</DataItem>
				<DataItem item={APPLICANT_INFORMATION.MIDDLE_NAME_LABEL}>{applicantMiddleName}</DataItem>
				<DataItem item={APPLICANT_INFORMATION.LAST_NAME_LABEL}>{applicantLastName}</DataItem>
				<DataItem item={APPLICANT_INFORMATION.SUFFIX_LABEL}>{applicantSuffix}</DataItem>
				<DataItem item={APPLICANT_INFORMATION.PRIMARY_AFFILIATION_LABEL}>{applicantPrimaryAffiliation}</DataItem>
				<DataItem isLink linkPrefix="mailto:" item={APPLICANT_INFORMATION.INSTITUTIONAL_EMAIL_LABEL}>
					{applicantInstitutionalEmail}
				</DataItem>
				<DataItem isLink item={APPLICANT_INFORMATION.RESEARCHER_PROFILE_LABEL}>
					{applicantProfileUrl}
				</DataItem>
				<DataItem item={APPLICANT_INFORMATION.POSITION_TITLE_LABEL}>{applicantPositionTitle}</DataItem>
			</FormDisplay>
			<FormDisplay title={APPLICANT_INFORMATION.INSTITUTION_MAILING_ADDRESS_TITLE}>
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
						<DataItem item={APPLICANT_INFORMATION.COUNTRY_LABEL}>{applicantInstitutionCountry}</DataItem>
						<DataItem item={APPLICANT_INFORMATION.STREET_ADDRESS_LABEL}>{applicantInstitutionStreetAddress}</DataItem>
						<DataItem item={APPLICANT_INFORMATION.BUILDING_LABEL}>{applicantInstitutionBuilding}</DataItem>
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
						<DataItem item={APPLICANT_INFORMATION.PROVINCE_LABEL}>{applicantInstitutionState}</DataItem>
						<DataItem item={APPLICANT_INFORMATION.CITY_LABEL}>{applicantInstitutionCity}</DataItem>
						<DataItem item={APPLICANT_INFORMATION.POSTAL_CODE_LABEL}>{applicantInstitutionPostalCode}</DataItem>
					</View>
				</View>
			</FormDisplay>
		</StandardPage>
	);
};

export default ApplicantInformation;
