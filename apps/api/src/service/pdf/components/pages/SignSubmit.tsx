/*
 * Copyright (c) 2026
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
import { LanguagProps, SupportedLangs, translations } from '../translations/types.ts';

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
		>,
		LanguagProps {}

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
	lang = SupportedLangs.ENGLISH,
}: SignSubmitProps) => {
	const t = translations[lang];

	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>{t.sign.TITLE}</Title>
			<Paragraph>{t.sign.SIGNATURE_REQUIREMENT}</Paragraph>
			<FormDisplay title={t.sign.APPLICANT_AUTHORIZATION_TITLE}>
				<DataItem
					item={t.sign.NAME_LABEL}
				>{`${applicantFirstName} ${applicantMiddleName ?? ''}${!applicantMiddleName ? '' : ' '}${applicantLastName}`}</DataItem>
				<DataItem item={t.sign.PRIMARY_AFFILIATION_LABEL}>{applicantPrimaryAffiliation}</DataItem>
				<DataItem item={t.sign.POSITION_TITLE_LABEL}>{applicantPositionTitle}</DataItem>
				<Signature src={applicantSignature} date={applicantSignedAt} />
			</FormDisplay>
			<FormDisplay title={t.sign.INSTITUTIONAL_REP_AUTHORIZATION_TITLE}>
				<DataItem
					item={t.sign.NAME_LABEL}
				>{`${institutionalRepFirstName} ${institutionalRepMiddleName ?? ''}${!institutionalRepMiddleName ? '' : ' '}${institutionalRepLastName}`}</DataItem>
				<DataItem item={t.sign.PRIMARY_AFFILIATION_LABEL}>{institutionalRepPrimaryAffiliation}</DataItem>
				<DataItem item={t.sign.POSITION_TITLE_LABEL}>{institutionalRepPositionTitle}</DataItem>
				<Signature src={institutionalRepSignature} date={institutionalRepSignedAt} />
			</FormDisplay>
		</StandardPage>
	);
};

export default SignSubmit;
