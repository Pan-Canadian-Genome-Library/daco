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

import { ProjectDTO } from '@pcgl-daco/data-model';

import DataItem from '@/service/pdf/components/DataItem.tsx';
import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';
import { PROJECT_INFORMATION } from '@/service/pdf/components/translations/enTranslations.ts';
import { FR_PROJECT_INFORMATION } from '../translations/frTranslations.ts';
import { LanguagProps, SupportedLangs } from '../translations/types.ts';

type ProjectInformationProps = LanguagProps & ProjectDTO;

const ProjectInformation = ({
	projectTitle,
	projectWebsite,
	projectBackground,
	projectAims,
	projectMethodology,
	projectSummary,
	projectPublicationUrls,
	lang = SupportedLangs.ENGLISH,
}: ProjectInformationProps) => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>{lang === SupportedLangs.ENGLISH ? PROJECT_INFORMATION.TITLE : FR_PROJECT_INFORMATION.TITLE}</Title>
			<Paragraph>
				{lang === SupportedLangs.ENGLISH ? PROJECT_INFORMATION.DESCRIPTION : FR_PROJECT_INFORMATION.DESCRIPTION}
			</Paragraph>
			<DataItem
				item={
					lang === SupportedLangs.ENGLISH
						? PROJECT_INFORMATION.PROJECT_TITLE_LABEL
						: FR_PROJECT_INFORMATION.PROJECT_TITLE_LABEL
				}
			>
				{projectTitle}
			</DataItem>
			<DataItem
				isLink
				item={
					lang === SupportedLangs.ENGLISH
						? PROJECT_INFORMATION.PROJECT_WEBSITE_LABEL
						: FR_PROJECT_INFORMATION.PROJECT_WEBSITE_LABEL
				}
			>
				{projectWebsite}
			</DataItem>

			<FormDisplay
				title={
					lang === SupportedLangs.ENGLISH
						? PROJECT_INFORMATION.RESEARCH_SUMMARY_TITLE
						: FR_PROJECT_INFORMATION.RESEARCH_SUMMARY_TITLE
				}
			>
				<Paragraph>
					{lang === SupportedLangs.ENGLISH
						? PROJECT_INFORMATION.RESEARCH_SUMMARY_DESCRIPTION
						: FR_PROJECT_INFORMATION.RESEARCH_SUMMARY_DESCRIPTION}
				</Paragraph>
				<DataItem
					item={
						lang === SupportedLangs.ENGLISH
							? PROJECT_INFORMATION.PROJECT_BACKGROUND_LABEL
							: FR_PROJECT_INFORMATION.PROJECT_BACKGROUND_LABEL
					}
					layout="stacked"
				>
					{projectBackground}
				</DataItem>
				<DataItem
					item={
						lang === SupportedLangs.ENGLISH
							? PROJECT_INFORMATION.USE_OF_DATA_METHODOLOGY_LABEL
							: FR_PROJECT_INFORMATION.USE_OF_DATA_METHODOLOGY_LABEL
					}
					layout="stacked"
				>
					{projectMethodology}
				</DataItem>
				<DataItem
					item={lang === SupportedLangs.ENGLISH ? PROJECT_INFORMATION.AIMS_LABEL : FR_PROJECT_INFORMATION.AIMS_LABEL}
					layout="stacked"
				>
					{projectAims}
				</DataItem>
			</FormDisplay>
			<FormDisplay
				title={
					lang === SupportedLangs.ENGLISH
						? PROJECT_INFORMATION.LAY_SUMMARY_TITLE
						: FR_PROJECT_INFORMATION.LAY_SUMMARY_TITLE
				}
			>
				<DataItem
					item={
						lang === SupportedLangs.ENGLISH
							? PROJECT_INFORMATION.LAY_SUMMARY_LABEL
							: FR_PROJECT_INFORMATION.LAY_SUMMARY_LABEL
					}
					layout="stacked"
				>
					{projectSummary}
				</DataItem>
			</FormDisplay>
			<FormDisplay
				title={
					lang === SupportedLangs.ENGLISH
						? PROJECT_INFORMATION.PUBLICATIONS_TITLE
						: FR_PROJECT_INFORMATION.PUBLICATIONS_TITLE
				}
			>
				<Paragraph>
					{lang === SupportedLangs.ENGLISH
						? PROJECT_INFORMATION.PUBLICATIONS_DESCRIPTION
						: FR_PROJECT_INFORMATION.PUBLICATIONS_DESCRIPTION}
				</Paragraph>
				{projectPublicationUrls?.map((urls, index) => (
					<DataItem
						isLink
						key={urls}
						item={`${lang === SupportedLangs.ENGLISH ? PROJECT_INFORMATION.PUBLICATION_LABEL : FR_PROJECT_INFORMATION.PUBLICATION_LABEL} ${index + 1}`}
						layout="horizontal"
					>
						{urls}
					</DataItem>
				))}
			</FormDisplay>
		</StandardPage>
	);
};

export default ProjectInformation;
