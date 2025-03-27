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

import { ApplicantDTO, InstitutionalRepDTO, SignatureDTO } from '@pcgl-daco/data-model';

import DataItem from '@/service/pdf/components/DataItem.tsx';
import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import Signature from '@/service/pdf/components/Signature.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';

interface SignSubmitProps
	extends Omit<SignatureDTO, 'applicationId'>,
		Pick<
			ApplicantDTO,
			| 'applicantFirstName'
			| 'applicantMiddleName'
			| 'applicantLastName'
			| 'applicantPrimaryAffiliation'
			| 'applicantPositionTitle'
		>,
		Pick<
			InstitutionalRepDTO,
			| 'institutionalRepFirstName'
			| 'institutionalRepMiddleName'
			| 'institutionalRepLastName'
			| 'institutionalRepPrimaryAffiliation'
			| 'institutionalRepPositionTitle'
		> {}

const SignSubmit = ({
	applicantFirstName,
	applicantMiddleName,
	applicantLastName,
	applicantSignature,
	applicantSignedAt,
	applicantPositionTitle,
	applicantPrimaryAffiliation,

	institutionalRepFirstName,
	institutionalRepMiddleName,
	institutionalRepLastName,
	institutionalRepSignature,
	institutionalRepSignedAt,
	institutionalRepPositionTitle,
	institutionalRepPrimaryAffiliation,
}: SignSubmitProps) => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>Sign &amp; Submit</Title>
			<Paragraph>
				You must include BOTH the Principal Investigator and the Institutional Representative signatures in order for
				your application to be reviewed.
			</Paragraph>
			<FormDisplay title="Applicant Authorization">
				<DataItem item="Name">{`${applicantFirstName} ${applicantMiddleName ?? ''}${!applicantMiddleName ? '' : ' '}${applicantLastName}`}</DataItem>
				<DataItem item="Primary Affiliation">{applicantPrimaryAffiliation}</DataItem>
				<DataItem item="Position Title">{applicantPositionTitle}</DataItem>
				<Signature src={applicantSignature} date={applicantSignedAt} />
			</FormDisplay>
			<FormDisplay title="Institutional Representative Authorization">
				<DataItem item="Name">{`${institutionalRepFirstName} ${institutionalRepMiddleName ?? ''}${!institutionalRepMiddleName ? '' : ' '}${institutionalRepLastName}`}</DataItem>
				<DataItem item="Primary Affiliation">{institutionalRepPrimaryAffiliation}</DataItem>
				<DataItem item="Position Title">{institutionalRepPositionTitle}</DataItem>
				<Signature src={institutionalRepSignature} date={institutionalRepSignedAt} />
			</FormDisplay>
		</StandardPage>
	);
};

export default SignSubmit;
