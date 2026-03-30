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

import List from '@/service/pdf/components/List.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';
import { INTRODUCTION } from '@/service/pdf/components/translations/enTranslations.ts';
import { FR_INTRODUCTION } from '../translations/frTranslations.ts';
import { SupportedLangs, SupportedLangsValues } from '../translations/types.ts';

type IntroductionPageProps = {
	lang?: SupportedLangsValues;
};

const IntroductionPage = ({ lang = SupportedLangs.ENGLISH }: IntroductionPageProps) => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>{lang === SupportedLangs.ENGLISH ? INTRODUCTION.TITLE : FR_INTRODUCTION.TITLE}</Title>
			<Paragraph>
				{lang === SupportedLangs.ENGLISH ? INTRODUCTION.QUALIFICATION_INTRO : FR_INTRODUCTION.QUALIFICATION_INTRO}
			</Paragraph>
			<List
				items={lang === SupportedLangs.ENGLISH ? INTRODUCTION.QUALIFICATION_ITEMS : FR_INTRODUCTION.QUALIFICATION_ITEMS}
			/>
			<Paragraph>
				{lang === SupportedLangs.ENGLISH ? INTRODUCTION.RECEIVE_ACCESS_INTRO : FR_INTRODUCTION.RECEIVE_ACCESS_INTRO}
			</Paragraph>
			<List
				isNumbered
				items={
					lang === SupportedLangs.ENGLISH ? INTRODUCTION.RECEIVE_ACCESS_ITEMS : FR_INTRODUCTION.RECEIVE_ACCESS_ITEMS
				}
			/>
			<Paragraph>
				{lang === SupportedLangs.ENGLISH
					? INTRODUCTION.APPROVAL_AND_RENEWAL_PARAGRAPH
					: FR_INTRODUCTION.APPROVAL_AND_RENEWAL_PARAGRAPH}
			</Paragraph>
		</StandardPage>
	);
};

export default IntroductionPage;
