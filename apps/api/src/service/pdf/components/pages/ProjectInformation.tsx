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

import { ProjectDTO } from '@pcgl-daco/data-model';

import DataItem from '@/service/pdf/components/DataItem.tsx';
import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';

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
			<Title>Project Information</Title>
			<Paragraph>
				Please fill out the following details for your research project, including the website URL if available.
			</Paragraph>
			<DataItem item="Project Title">{projectTitle}</DataItem>
			<DataItem isLink item="Project Website">
				{projectWebsite}
			</DataItem>

			<FormDisplay title="Research Summary - Scientific Abstract">
				<Paragraph>
					This section should describe the background, aims, and methodology of your research project, as well as plans
					for how you will use the PCGL Controlled Data.
				</Paragraph>
				<DataItem item="Project Background" layout="stacked">
					{projectBackground}
				</DataItem>
				<DataItem item="Use of Data and Methodology" layout="stacked">
					{projectMethodology}
				</DataItem>
				<DataItem item="Aims" layout="stacked">
					{projectAims}
				</DataItem>
			</FormDisplay>
			<FormDisplay title="Project Lay Summary">
				<DataItem item="Lay Summary" layout="stacked">
					{projectSummary}
				</DataItem>
			</FormDisplay>
			<FormDisplay title="Relevant Publications">
				<Paragraph>
					Please provide at least three links to relevant publications, of which the applicant is an author or a
					co-author. These should be links (URLs) to publication websites such as pubmed.gov, biorxiv.org, or
					medrxiv.org.
				</Paragraph>
				{projectPublicationUrls?.map((urls, index) => (
					<DataItem isLink key={urls} item={`Publication ${index + 1}`} layout="horizontal">
						{urls}
					</DataItem>
				))}
			</FormDisplay>
		</StandardPage>
	);
};

export default ProjectInformation;
