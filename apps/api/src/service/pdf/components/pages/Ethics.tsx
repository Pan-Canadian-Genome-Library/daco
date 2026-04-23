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

import { View } from '@react-pdf/renderer';

import Checkbox from '@/service/pdf/components/Checkbox.tsx';
import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';
import { EthicsLetterDTO } from '@pcgl-daco/data-model/src/types.ts';
import { LanguagProps, SupportedLangs, translations } from '../translations/types.ts';

type EthicsProps = LanguagProps & EthicsLetterDTO;

const Ethics = ({ ethicsReviewRequired, lang = SupportedLangs.ENGLISH }: EthicsProps) => {
	const t = translations[lang];

	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>{t.ethics.TITLE}</Title>
			<Paragraph>{t.ethics.ETHICS_AWARENESS_PARAGRAPH}</Paragraph>
			<Paragraph>{t.ethics.DACO_RESPONSIBILITY_PARAGRAPH}</Paragraph>
			<FormDisplay title={t.ethics.ETHICS_APPROVAL_TITLE}>
				<Checkbox
					unchecked={
						ethicsReviewRequired === true || ethicsReviewRequired === null || ethicsReviewRequired === undefined
					}
				>
					{t.ethics.NO_REVIEW_REQUIRED}
				</Checkbox>
				<Checkbox unchecked={!ethicsReviewRequired}>{t.ethics.REVIEW_REQUIRED}</Checkbox>
				{ethicsReviewRequired !== undefined && ethicsReviewRequired !== null ? (
					<View
						wrap={false}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							height: '50%',
						}}
					>
						<Paragraph notice>
							&mdash;&nbsp;Ethics{' '}
							{ethicsReviewRequired === true
								? t.ethics.APPROVAL_LETTER_MESSAGE_APPROVAL
								: t.ethics.APPROVAL_LETTER_MESSAGE_EXEMPTION}
							&nbsp;&mdash;
						</Paragraph>
					</View>
				) : null}
			</FormDisplay>
		</StandardPage>
	);
};

export default Ethics;
