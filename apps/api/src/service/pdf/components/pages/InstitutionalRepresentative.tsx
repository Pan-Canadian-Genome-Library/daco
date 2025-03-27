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

import { InstitutionalRepDTO, InstitutionDTO } from '@pcgl-daco/data-model';

import DataItem from '@/service/pdf/components/DataItem.tsx';
import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';

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
			<Title>Institutional Representative</Title>
			<Paragraph>
				An Institutional Representative is a qualified representative of a legal entity who has the administrative power
				to legally commit that entity to the terms and conditions in Section F: Data Access Agreement (e.g.
				Vice-President Research, a Research Director, or a Contracts Officer for the entity). The Institutional
				Representative's signature will be required at the end of this application before being reviewed by PCGL DACO.
			</Paragraph>
			<FormDisplay title="Institutional Representative">
				<DataItem item="Title">{institutionalRepTitle}</DataItem>
				<DataItem item="First Name">{institutionalRepFirstName}</DataItem>
				<DataItem item="Middle Name">{institutionalRepMiddleName}</DataItem>
				<DataItem item="Last Name">{institutionalRepLastName}</DataItem>
				<DataItem item="Suffix">{institutionalRepSuffix}</DataItem>
				<DataItem item="Primary Affiliation">{institutionalRepPrimaryAffiliation}</DataItem>
				<DataItem isLink linkPrefix="mailto:" item="Institutional Email">
					{institutionalRepEmail}
				</DataItem>
				<DataItem isLink item="Researcher Profile">
					{institutionalRepProfileUrl}
				</DataItem>
				<DataItem item="Position Title">{institutionalRepPositionTitle}</DataItem>
			</FormDisplay>
			<FormDisplay title="Institution/Company Mailing Address">
				<DataItem item="Country">{institutionCountry}</DataItem>
				<DataItem item="Street Address">{institutionStreetAddress}</DataItem>
				<DataItem item="Building">{institutionBuilding}</DataItem>
				<DataItem item="Province">{institutionState}</DataItem>
				<DataItem item="City">{institutionCity}</DataItem>
				<DataItem item="Postal Code / ZIP Code">{institutionPostalCode}</DataItem>
			</FormDisplay>
		</StandardPage>
	);
};

export default InstitutionalRepresentative;
