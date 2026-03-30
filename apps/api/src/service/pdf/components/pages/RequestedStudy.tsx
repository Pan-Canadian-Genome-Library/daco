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

import { Link } from '@react-pdf/renderer';

import { RequestedStudiesDTO } from '@pcgl-daco/data-model';

import DataItem from '@/service/pdf/components/DataItem.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import { standardStyles } from '@/service/pdf/components/standardStyling.ts';
import Title from '@/service/pdf/components/Title.tsx';
import { REQUESTED_STUDY } from '@/service/pdf/components/translations/enTranslations.ts';
import { FR_REQUESTED_STUDY } from '../translations/frTranslations.ts';
import { LanguagProps, SupportedLangs } from '../translations/types.ts';

type RequestedStudyProps = LanguagProps & RequestedStudiesDTO;

const RequestedStudy = ({ requestedStudies, lang = SupportedLangs.ENGLISH }: RequestedStudyProps) => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>{lang === SupportedLangs.ENGLISH ? REQUESTED_STUDY.TITLE : FR_REQUESTED_STUDY.TITLE}</Title>
			<Paragraph>
				{lang === SupportedLangs.ENGLISH ? REQUESTED_STUDY.DESCRIPTION : FR_REQUESTED_STUDY.DESCRIPTION}
				{/**TODO: Add Link to this once that's figured out. */}
				<Link style={{ color: standardStyles.colours.primary }}>PCGL Research Portal - Studies.</Link>
			</Paragraph>
			<DataItem
				item={lang === SupportedLangs.ENGLISH ? REQUESTED_STUDY.STUDY_NAME_LABEL : FR_REQUESTED_STUDY.STUDY_NAME_LABEL}
			>
				{requestedStudies?.map((study, index) => `${study}${requestedStudies.length !== index + 1 ? ', ' : ''}`)}
			</DataItem>
		</StandardPage>
	);
};

export default RequestedStudy;
