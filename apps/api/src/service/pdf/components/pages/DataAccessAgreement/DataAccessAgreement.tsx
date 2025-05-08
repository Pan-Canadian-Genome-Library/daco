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

import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import List from '@/service/pdf/components/List.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';

const DataAccessAgreement = () => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>Data Access Agreement</Title>
			<Paragraph>
				This application form must be completed by the applicant and the legal entity with which you are affiliated
				(You) prior to being granted access to Pan Canadian Genome Library (PCGL) controlled data (the PCGL Controlled
				Data as further defined in Section F of this application). To receive access, You must complete this entire
				application form and agree to its terms by signing this application. All sections, as well as Appendices I
				through III, are integral components of this application. Your Research Project (as defined below) will be
				checked for conformity with the goals and policies of PCGL including, but not limited to, policies concerning
				the purpose and relevance of the research, the protection of the participants and the security of the
				participants' data.
			</Paragraph>
			<Paragraph>
				If the Data Access Compliance Office of the PCGL (the DACO), approves your application, access to the PCGL
				Controlled Data will be granted starting from the date You are approved for access.
			</Paragraph>
			<Paragraph>
				If your application is approved, You agree that Your application information will be included in a public
				registry containing project details and lay summaries of the scientific abstracts of applicants having been
				granted access to PCGL Controlled Data.
			</Paragraph>
			<Paragraph>
				You agree you have read the DACO Policies and Procedures document prior to completing this application. This
				agreement governs the terms of access to the PCGL Controlled Data (further defined below). In signing this
				agreement, you agree to be bound by the terms and conditions of access set out therein.
			</Paragraph>
			<Paragraph>
				For the sake of clarity, the terms of access set out in this agreement apply to the User and to the User
				Institution(s) (as defined below). The current agreement is limited to the PCGL Controlled Data (as defined
				below) and does not cover other data generated at the different centres participating in the project. A list of
				PCGL members can be found on the PCGL website. Data Producer: An PCGL participating center, responsible for the
				development, organization, and oversight of a local database. Collaborator: A collaborator of the User, working
				for the same institution as the User Institution(s) (see below for definitions of User and User Institution(s)).
				PCGL Controlled Data: The Controlled Access Datasets of the library as defined in section E8.1 Data Access
				Framework of the Library’s Policies and Guidelines. Publications: Includes, without limitation, articles
				published in print journals, electronic journals, reviews, books, posters and other written and verbal
				presentations of research. Research Participant: An individual having contributed their personal data to an PCGL
				project, also referred to as a Donor. User: An applicant (principal investigator), having signed this Data
				Access Agreement, whose User Institution has cosigned this Data Access Agreement, both of them having received
				acknowledgement of its acceptance. User Institution(s): Institution(s) at which the User is employed, affiliated
				or enrolled. A representative of it has cosigned this Data Access Agreement with the User and received
				acknowledgement of its acceptance.
			</Paragraph>
			<FormDisplay title="Definitions">
				<List
					items={[
						"Library: The Pan Canadian Genome Library, an initiative to unify Canada's genome sequencing efforts, aiming to harness the potential of genomic medicine and maintain Canada's leadership in genomic research.",
						'Data Producer: A PCGL participating center, responsible for the development, organization, and oversight of a local database.',
						'Collaborator: A collaborator of the User, working for the same institution as the User Institution(s) (see below for definitions of User and User Institution(s)).',
						"PCGL Controlled Data: The Controlled Access Datasets of the Library as defined in section E8.1 Data Access Framework of the Library's Policies and Guidelines.",
						'Publications: Includes, without limitation, articles published in print journals, electronic journals, reviews, books, posters and other written and verbal presentations of research.',
						'Research Participant: An individual having contributed their personal data to an PCGL project.',
						'User: An applicant (principal investigator), having signed this Data Access Agreement, whose User Institution has cosigned this Data Access Agreement, both of them having received acknowledgement of its acceptance.',
						'User Institution(s): Institution(s) at which the User is employed, affiliated or enrolled. A representative of it has cosigned this Data Access Agreement with the User and received acknowledgement of its acceptance.',
					]}
				/>
			</FormDisplay>
		</StandardPage>
	);
};

export default DataAccessAgreement;
