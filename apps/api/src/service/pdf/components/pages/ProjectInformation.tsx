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
import { PROJECT_INFORMATION } from '@/service/pdf/components/enTranslations.ts';

const ProjectInformation = ({
	projectTitle,
	projectWebsite,
	projectBackground,
	projectAims,
	projectMethodology,
	projectSummary,
	projectPublicationUrls,
}: ProjectDTO) => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>{PROJECT_INFORMATION.TITLE}</Title>
			<Paragraph>{PROJECT_INFORMATION.DESCRIPTION}</Paragraph>
			<DataItem item={PROJECT_INFORMATION.PROJECT_TITLE_LABEL}>{projectTitle}</DataItem>
			<DataItem isLink item={PROJECT_INFORMATION.PROJECT_WEBSITE_LABEL}>
				{projectWebsite}
			</DataItem>

			<FormDisplay title={PROJECT_INFORMATION.RESEARCH_SUMMARY_TITLE}>
				<Paragraph>{PROJECT_INFORMATION.RESEARCH_SUMMARY_DESCRIPTION}</Paragraph>
				<DataItem item={PROJECT_INFORMATION.PROJECT_BACKGROUND_LABEL} layout="stacked">
					{projectBackground}
				</DataItem>
				<DataItem item={PROJECT_INFORMATION.USE_OF_DATA_METHODOLOGY_LABEL} layout="stacked">
					{projectMethodology}
				</DataItem>
				<DataItem item={PROJECT_INFORMATION.AIMS_LABEL} layout="stacked">
					{projectAims}
				</DataItem>
			</FormDisplay>
			<FormDisplay title={PROJECT_INFORMATION.LAY_SUMMARY_TITLE}>
				<DataItem item={PROJECT_INFORMATION.LAY_SUMMARY_LABEL} layout="stacked">
					{projectSummary}
				</DataItem>
			</FormDisplay>
			<FormDisplay title={PROJECT_INFORMATION.PUBLICATIONS_TITLE}>
				<Paragraph>{PROJECT_INFORMATION.PUBLICATIONS_DESCRIPTION}</Paragraph>
				{projectPublicationUrls?.map((urls, index) => (
					<DataItem
						isLink
						key={urls}
						item={`${PROJECT_INFORMATION.PUBLICATION_LABEL} ${index + 1}`}
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
