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

import Checkbox from '@/service/pdf/components/Checkbox.tsx';
import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import List from '@/service/pdf/components/List.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import { TERMS_AND_CONDITIONS } from '@/service/pdf/components/translations/enTranslations.ts';
import { ApplicationAgreements, type AgreementDTO } from '@pcgl-daco/data-model';
import { FR_TERMS_AND_CONDITIONS } from '../../translations/frTranslations.ts';
import { LanguagProps, SupportedLangs } from '../../translations/types.ts';

type TermsAndConditionsProps = LanguagProps & AgreementDTO;

const TermsAndConditions = ({ acceptedAgreements, lang = SupportedLangs.ENGLISH }: TermsAndConditionsProps) => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<FormDisplay title={lang === SupportedLangs.ENGLISH ? TERMS_AND_CONDITIONS.TITLE : FR_TERMS_AND_CONDITIONS.TITLE}>
				<Paragraph>
					{lang === SupportedLangs.ENGLISH ? TERMS_AND_CONDITIONS.SIGNING_INTRO : FR_TERMS_AND_CONDITIONS.SIGNING_INTRO}
				</Paragraph>
				<List
					items={
						lang === SupportedLangs.ENGLISH ? TERMS_AND_CONDITIONS.TERMS_ITEMS : FR_TERMS_AND_CONDITIONS.TERMS_ITEMS
					}
				/>
			</FormDisplay>
			<FormDisplay
				title={
					lang === SupportedLangs.ENGLISH
						? TERMS_AND_CONDITIONS.AGREEMENTS_TITLE
						: FR_TERMS_AND_CONDITIONS.AGREEMENTS_TITLE
				}
				wrap={false}
			>
				<Paragraph>
					{lang === SupportedLangs.ENGLISH
						? TERMS_AND_CONDITIONS.AGREEMENTS_INTRO
						: FR_TERMS_AND_CONDITIONS.AGREEMENTS_INTRO}
				</Paragraph>
				<Checkbox
					unchecked={
						!acceptedAgreements?.find((agreement) => agreement === ApplicationAgreements.dac_agreement_software_updates)
					}
				>
					{lang === SupportedLangs.ENGLISH
						? TERMS_AND_CONDITIONS.SOFTWARE_UPDATES
						: FR_TERMS_AND_CONDITIONS.SOFTWARE_UPDATES}
				</Checkbox>
				<Checkbox
					unchecked={
						!acceptedAgreements?.find((agreement) => agreement === ApplicationAgreements.dac_agreement_non_disclosure)
					}
				>
					{lang === SupportedLangs.ENGLISH
						? TERMS_AND_CONDITIONS.NON_DISCLOSURE
						: FR_TERMS_AND_CONDITIONS.NON_DISCLOSURE}
				</Checkbox>
				<Checkbox
					unchecked={
						!acceptedAgreements?.find(
							(agreement) => agreement === ApplicationAgreements.dac_agreement_monitor_individual_access,
						)
					}
				>
					{lang === SupportedLangs.ENGLISH
						? TERMS_AND_CONDITIONS.MONITOR_INDIVIDUAL_ACCESS
						: FR_TERMS_AND_CONDITIONS.MONITOR_INDIVIDUAL_ACCESS}
				</Checkbox>
				<Checkbox
					unchecked={
						!acceptedAgreements?.find((agreement) => agreement === ApplicationAgreements.dac_agreement_destroy_data)
					}
				>
					{lang === SupportedLangs.ENGLISH ? TERMS_AND_CONDITIONS.DESTROY_DATA : FR_TERMS_AND_CONDITIONS.DESTROY_DATA}
				</Checkbox>
				<Checkbox
					unchecked={
						!acceptedAgreements?.find(
							(agreement) => agreement === ApplicationAgreements.dac_agreement_familiarize_restrictions,
						)
					}
				>
					{lang === SupportedLangs.ENGLISH
						? TERMS_AND_CONDITIONS.FAMILIARIZE_RESTRICTIONS
						: FR_TERMS_AND_CONDITIONS.FAMILIARIZE_RESTRICTIONS}
				</Checkbox>
				<Checkbox
					unchecked={
						!acceptedAgreements?.find(
							(agreement) => agreement === ApplicationAgreements.dac_agreement_provide_it_policy,
						)
					}
				>
					{lang === SupportedLangs.ENGLISH
						? TERMS_AND_CONDITIONS.PROVIDE_IT_POLICY
						: FR_TERMS_AND_CONDITIONS.PROVIDE_IT_POLICY}
				</Checkbox>
				<Checkbox
					unchecked={
						!acceptedAgreements?.find(
							(agreement) => agreement === ApplicationAgreements.dac_agreement_notify_unauthorized_access,
						)
					}
				>
					{lang === SupportedLangs.ENGLISH
						? TERMS_AND_CONDITIONS.NOTIFY_UNAUTHORIZED_ACCESS
						: FR_TERMS_AND_CONDITIONS.NOTIFY_UNAUTHORIZED_ACCESS}
				</Checkbox>
				<Checkbox
					unchecked={
						!acceptedAgreements?.find(
							(agreement) => agreement === ApplicationAgreements.dac_agreement_certify_application,
						)
					}
				>
					{lang === SupportedLangs.ENGLISH
						? TERMS_AND_CONDITIONS.CERTIFY_APPLICATION
						: FR_TERMS_AND_CONDITIONS.CERTIFY_APPLICATION}
				</Checkbox>
				<Checkbox
					unchecked={
						!acceptedAgreements?.find((agreement) => agreement === ApplicationAgreements.dac_agreement_read_and_agreed)
					}
				>
					{lang === SupportedLangs.ENGLISH
						? TERMS_AND_CONDITIONS.READ_AND_AGREED
						: FR_TERMS_AND_CONDITIONS.READ_AND_AGREED}
				</Checkbox>
			</FormDisplay>
		</StandardPage>
	);
};

export default TermsAndConditions;
