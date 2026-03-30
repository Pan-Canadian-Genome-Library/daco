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

import { InstitutionalRepDTO, InstitutionDTO } from '@pcgl-daco/data-model';

import DataItem from '@/service/pdf/components/DataItem.tsx';
import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';
import { INSTITUTIONAL_REPRESENTATIVE } from '@/service/pdf/components/enTranslations.ts';
import { View } from '@react-pdf/renderer';
import { standardStyles } from '../standardStyling.ts';

const InstitutionalRepresentative = ({
	institutionalRepTitle,
	institutionalRepFirstName,
	institutionalRepMiddleName,
	institutionalRepLastName,
	institutionalRepSuffix,
	institutionalRepPrimaryAffiliation,
	institutionalRepEmail,
	institutionalRepProfileUrl,
	institutionalRepPositionTitle,
	institutionCountry,
	institutionState,
	institutionStreetAddress,
	institutionBuilding,
	institutionCity,
	institutionPostalCode,
}: Pick<
	InstitutionalRepDTO,
	| 'institutionalRepTitle'
	| 'institutionalRepFirstName'
	| 'institutionalRepMiddleName'
	| 'institutionalRepLastName'
	| 'institutionalRepSuffix'
	| 'institutionalRepPrimaryAffiliation'
	| 'institutionalRepEmail'
	| 'institutionalRepProfileUrl'
	| 'institutionalRepPositionTitle'
> &
	Pick<
		InstitutionDTO,
		| 'institutionCountry'
		| 'institutionState'
		| 'institutionStreetAddress'
		| 'institutionBuilding'
		| 'institutionCity'
		| 'institutionPostalCode'
	>) => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>{INSTITUTIONAL_REPRESENTATIVE.TITLE}</Title>
			<Paragraph>{INSTITUTIONAL_REPRESENTATIVE.DESCRIPTION}</Paragraph>
			<FormDisplay title={INSTITUTIONAL_REPRESENTATIVE.INSTITUTIONAL_REP_TITLE_LABEL}>
				<DataItem item={INSTITUTIONAL_REPRESENTATIVE.TITLE_LABEL}>{institutionalRepTitle}</DataItem>
				<DataItem item={INSTITUTIONAL_REPRESENTATIVE.FIRST_NAME_LABEL}>{institutionalRepFirstName}</DataItem>
				<DataItem item={INSTITUTIONAL_REPRESENTATIVE.MIDDLE_NAME_LABEL}>{institutionalRepMiddleName}</DataItem>
				<DataItem item={INSTITUTIONAL_REPRESENTATIVE.LAST_NAME_LABEL}>{institutionalRepLastName}</DataItem>
				<DataItem item={INSTITUTIONAL_REPRESENTATIVE.SUFFIX_LABEL}>{institutionalRepSuffix}</DataItem>
				<DataItem item={INSTITUTIONAL_REPRESENTATIVE.PRIMARY_AFFILIATION_LABEL}>
					{institutionalRepPrimaryAffiliation}
				</DataItem>
				<DataItem isLink linkPrefix="mailto:" item={INSTITUTIONAL_REPRESENTATIVE.INSTITUTIONAL_EMAIL_LABEL}>
					{institutionalRepEmail}
				</DataItem>
				<DataItem isLink item={INSTITUTIONAL_REPRESENTATIVE.RESEARCHER_PROFILE_LABEL}>
					{institutionalRepProfileUrl}
				</DataItem>
				<DataItem item={INSTITUTIONAL_REPRESENTATIVE.POSITION_TITLE_LABEL}>{institutionalRepPositionTitle}</DataItem>
			</FormDisplay>
			<FormDisplay title={INSTITUTIONAL_REPRESENTATIVE.INSTITUTION_MAILING_ADDRESS_TITLE}>
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
						<DataItem item={INSTITUTIONAL_REPRESENTATIVE.COUNTRY_LABEL}>{institutionCountry}</DataItem>
						<DataItem item={INSTITUTIONAL_REPRESENTATIVE.STREET_ADDRESS_LABEL}>{institutionStreetAddress}</DataItem>
						<DataItem item={INSTITUTIONAL_REPRESENTATIVE.BUILDING_LABEL}>{institutionBuilding}</DataItem>
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
						<DataItem item={INSTITUTIONAL_REPRESENTATIVE.PROVINCE_LABEL}>{institutionState}</DataItem>
						<DataItem item={INSTITUTIONAL_REPRESENTATIVE.CITY_LABEL}>{institutionCity}</DataItem>
						<DataItem item={INSTITUTIONAL_REPRESENTATIVE.POSTAL_CODE_LABEL}>{institutionPostalCode}</DataItem>
					</View>
				</View>
			</FormDisplay>
		</StandardPage>
	);
};

export default InstitutionalRepresentative;
