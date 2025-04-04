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

import { ApplicantDTO, InstitutionDTO } from '@pcgl-daco/data-model';

import DataItem from '@/service/pdf/components/DataItem.tsx';
import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';
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
> &
	Pick<
		InstitutionDTO,
		| 'applicantInstitutionCountry'
		| 'applicantInstitutionState'
		| 'applicantInstitutionStreetAddress'
		| 'applicantInstitutionBuilding'
		| 'applicantInstitutionCity'
		| 'applicantInstitutionPostalCode'
	>) => {
	return (
		<StandardPage fixed useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>Applicant Information (Principal Investigator)</Title>
			<Paragraph>
				Qualified applicants for access to the PCGL Controlled Data must be independent researchers who are affiliated
				with a legal entity (e.g. university professor, researcher in a private company, independent researchers able to
				apply for federal research grants, etc.).
			</Paragraph>
			<Paragraph>
				Please include a valid institutional email address that will be used to log in to PCGL and will be the email
				address associated with PCGL Controlled Data access.
			</Paragraph>
			<FormDisplay title="Principal Investigator Information">
				<DataItem item="Title">{applicantTitle}</DataItem>
				<DataItem item="First Name">{applicantFirstName}</DataItem>
				<DataItem item="Middle Name">{applicantMiddleName}</DataItem>
				<DataItem item="Last Name">{applicantLastName}</DataItem>
				<DataItem item="Suffix">{applicantSuffix}</DataItem>
				<DataItem item="Primary Affiliation">{applicantPrimaryAffiliation}</DataItem>
				<DataItem isLink linkPrefix="mailto:" item="Institutional Email">
					{applicantInstitutionalEmail}
				</DataItem>
				<DataItem isLink item="Researcher Profile">
					{applicantProfileUrl}
				</DataItem>
				<DataItem item="Position Title">{applicantPositionTitle}</DataItem>
			</FormDisplay>
			<FormDisplay title="Institution/Company Mailing Address">
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
						<DataItem item="Country">{applicantInstitutionCountry}</DataItem>
						<DataItem item="Street Address">{applicantInstitutionStreetAddress}</DataItem>
						<DataItem item="Building">{applicantInstitutionBuilding}</DataItem>
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
						<DataItem item="Province">{applicantInstitutionState}</DataItem>
						<DataItem item="City">{applicantInstitutionCity}</DataItem>
						<DataItem item="Postal Code / ZIP Code">{applicantInstitutionPostalCode}</DataItem>
					</View>
				</View>
			</FormDisplay>
		</StandardPage>
	);
};

export default ApplicantInformation;
