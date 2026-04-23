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
import { LanguagProps, SupportedLangs, translations } from '../translations/types.ts';

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
	const t = translations[lang];

	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>{t.project.TITLE}</Title>
			<Paragraph>{t.project.DESCRIPTION}</Paragraph>
			<DataItem item={t.project.PROJECT_TITLE_LABEL}>{projectTitle}</DataItem>
			<DataItem isLink item={t.project.PROJECT_WEBSITE_LABEL}>
				{projectWebsite}
			</DataItem>

			<FormDisplay title={t.project.RESEARCH_SUMMARY_TITLE}>
				<Paragraph>{t.project.RESEARCH_SUMMARY_DESCRIPTION}</Paragraph>
				<DataItem item={t.project.PROJECT_BACKGROUND_LABEL} layout="stacked">
					{projectBackground}
				</DataItem>
				<DataItem item={t.project.USE_OF_DATA_METHODOLOGY_LABEL} layout="stacked">
					{projectMethodology}
				</DataItem>
				<DataItem item={t.project.AIMS_LABEL} layout="stacked">
					{projectAims}
				</DataItem>
			</FormDisplay>
			<FormDisplay title={t.project.LAY_SUMMARY_TITLE}>
				<DataItem item={t.project.LAY_SUMMARY_LABEL} layout="stacked">
					{projectSummary}
				</DataItem>
			</FormDisplay>
			<FormDisplay title={t.project.PUBLICATIONS_TITLE}>
				<Paragraph>{t.project.PUBLICATIONS_DESCRIPTION}</Paragraph>
				{projectPublicationUrls?.map((urls, index) => (
					<DataItem isLink key={urls} item={`${t.project.PUBLICATION_LABEL} ${index + 1}`} layout="horizontal">
						{urls}
					</DataItem>
				))}
			</FormDisplay>
		</StandardPage>
	);
};

export default ProjectInformation;
