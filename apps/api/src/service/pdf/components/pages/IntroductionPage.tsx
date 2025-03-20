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

import List from '@/service/pdf/components/List.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';
import Title from '@/service/pdf/components/Title.tsx';

const IntroductionPage = () => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<Title>Introduction</Title>
			<Paragraph>
				While all PCGL data sources contain open data, sensitive genomic and clinical data is controlled and requires
				permission to access. To qualify for access, you must:
			</Paragraph>
			<List
				items={[
					'be an independent researcher affiliated with a legal entity (e.g. university professor, researcher in a private company, independent researchers able to apply for federal research grants, etc.),',
					'have an institutional representative at your institution,',
					'have a scientific abstract and lay summary outlining the desired use of the PCGL Controlled Data,',
					'have at least 3 qualifying publications of which you were an author/co-author,',
					'include an ethics letter, if ethics approval for use of PCGL Controlled Data is required in your country/region.',
				]}
			/>
			<Paragraph>To receive access, you must:</Paragraph>
			<List
				isNumbered
				items={[
					'Complete all required sections on this application form and agree to its terms',
					'Have the Principal Investigator and Institutional Representative who represents your institutions legal entity sign the finalized application.',
					'Submit the signed application for review by the Data Access Compliance Office (DACO) in the “Sign and Submit” section of this application.',
				]}
			/>
			<Paragraph>
				During the application process, you must submit a summary of your research project. Your project will be checked
				for conformity with the goals and policies of PCGL including, but not limited to, policies concerning the
				purpose and relevance of the research, the protection of the donors and the security of the donors' data. If
				your application is approved, you agree that your applicant's name, institution, and scientific lay summary may
				be included in a public registry of projects that have been granted access to PCGL Controlled Data.
			</Paragraph>
			<Paragraph>
				If the Data Access Compliance Office (DACO) approves your application, access to the PCGL Controlled Data will
				be granted starting from the date you are approved for access. An annual agreement must be made by the applicant
				and a bi-annual renewal must be completed in order to access/use controlled data beyond that two-year time
				period.
			</Paragraph>
		</StandardPage>
	);
};

export default IntroductionPage;
