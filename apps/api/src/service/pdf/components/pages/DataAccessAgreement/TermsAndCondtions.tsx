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

import Checkbox from '@/service/pdf/components/Checkbox.tsx';
import FormDisplay from '@/service/pdf/components/FormDisplay.tsx';
import List from '@/service/pdf/components/List.tsx';
import Paragraph from '@/service/pdf/components/Paragraph.tsx';
import StandardPage from '@/service/pdf/components/StandardPage.tsx';

const TermsAndConditions = () => {
	return (
		<StandardPage useVerticalStackLayout showAttribution alternatingAttribution showPageNumbers>
			<FormDisplay title="Terms and Conditions">
				<Paragraph>In signing this Agreement:</Paragraph>
				<List
					items={[
						'The User and the User Institution(s) agree to use the PCGL Controlled Data in compliance with all PCGL Goals, Structures, Policies and Guidelines including section E. Ethics and Appendix I of this application.',
						'The User and the User Institution(s) agree to only use the PCGL Controlled Data for the objectives and analyses outlined in section D. Project Information.',
						'The User and the User Institution(s) assumes responsibility for maintaining appropriate Ethical approval (if so required). Ethical approval must be current for the duration of the approved Data Access Period.',
						'The User and the User Institution(s) agree to preserve, at all times, the confidentiality of the information and PCGL Controlled Data. In particular, they undertake not to use, or attempt to use the PCGL Controlled Data to compromise or otherwise infringe the confidentiality of information on Research Participants.',
						'The User and the User Institution(s) agree to protect the confidentiality of Research Participants in any research papers or publications that they prepare by taking all reasonable care to limit the possibility of identification.',
						'The User and the User Institution(s) agree not to link or combine the PCGL Controlled Data provided under this agreement to other information or archived data available in a way that could re-identify the Research Participants, even if access to that data has been formally granted to the User and the User Institution(s), or is freely available without restriction.',
						'The User and the User Institution(s) agree not to transfer or disclose the PCGL Controlled Data, in whole or part, or any material derived from the PCGL Controlled Data, to anyone not listed in section C. Collaborators of this application, except where prior written permission for such transfer or disclosure has been agreed to by the University. Should the User or the User Institution(s) wish to share the PCGL Controlled Data with an External Collaborator, the External Collaborator must complete a separate application for Access to the PCGL Controlled Data.',
						'The User and the User Institution(s) accept that the Consortium, the member institutions including producers, depositors or copyright holders, or the funders of the PCGL Controlled Data or any part of the PCGL Controlled Data supplied bear no responsibility for the further analysis or interpretation of these PCGL Controlled Data, over and above that published by the Consortium.',
						'The User and the User Institution(s) agree to follow the Fort Lauderdale Guidelines, the Toronto Statement, as well as the GA4GH Framework for Responsible Sharing of Genomic and Health-Related Data included as linked Appendix II of this application. This includes but is not limited to recognizing the contribution of the Consortium including an acknowledgement in all reports or publications resulting from the User and the User Institutions use of the PCGL Controlled Data.',
						'The User agrees to confirm as requested submit ongoing compliance with this agreement and its conditions each year on the anniversary of the approval date.',
						'The User agrees to submit a final report at the completion of the Data Access Period, or if a study is closed, upon request by the DACO Officer.',
						'The User and the User Institution(s) agree to follow the Consortium Publication Policy.',
						'The User and the User Institution(s) agree to destroy, remove or revoke access to any controlled data where they have been notified that consent has been withdrawn.',
						'The User and the User Institution(s) agree not to make intellectual property claims on the PCGL Controlled Data (including somatic mutations) and not to use intellectual property protection in ways that would prevent or block access to, or use of, any element of the PCGL Controlled Data, or conclusion drawn directly from the PCGL Controlled Data.',
						"The User and the User Institution(s) can elect to perform further research that would add intellectual and resource capital to the PCGL Controlled Data and decide to obtain intellectual property rights on these downstream discoveries. In this case, the User and the User Institution(s) agree to implement licensing policies that will not obstruct further research and to follow the U.S. National Institutes of Health's, Best Practices for the Licensing of Genomic Inventions or a similar national guideline that is in conformity with the OECD, Guidelines for the Licensing of the Genetic Inventions. These two policies (NIH and OECD) are included as part of the linked Appendix III of this application. ",
						'The User and the User Institution (s) shall implement and maintain, at its cost and expense, appropriate technical and organisational measures in relation to the processing of PCGL Controlled Data and Personal Information. The User will ensure that the security it implements in respect of Personal Information processed by it is appropriate to the risks that are presented by the processing, in particular from accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to Personal Information transmitted, stored or otherwise processed.',
						'The User and the User Institution(s) agree to destroy/discard any PCGL Controlled Data held, once it is no longer used for the project described in this application unless obligated to retain the PCGL Controlled Data for archival purposes in conformity with national audits or legal requirements.',
						'The User and the User Institution(s) will update the Section C. Collaborators to reflect any changes or departures in researchers, collaborators and personnel within 30 days of the changes made.',
						"The User and the User Institution(s) must notify the DACO prior to any significant changes to the Research Project's protocol of the User.",
						'The User and the User Institution(s) will notify the DACO as soon as they become aware of a breach of the terms or conditions of this agreement. All security incidents are to be reported without delay as outlined in the Data Breach Policy.',
						'The User and the User Institution(s) accept that this agreement may terminate upon any breach of this agreement from the User, the User Institution(s) or any authorized personnel mentioned in section C. Collaborators of this application. In this case, The User and the User Institution(s) will be required to destroy/discard any PCGL Controlled Data held, including copies and backup copies. This clause does not prevent the User and the User Institution(s) from retaining the PCGL Controlled Data for archival purposes in conformity with national audits or legal requirements.',
						'The User and the User Institution(s) accept that it may be necessary for the Consortium or its appointed agent to alter the terms of this agreement from time to time. In this event, the Consortium or its appointed agent will contact the User and the User Institution(s) to inform them of any changes. The revised terms shall be binding upon the User and the User Institution(s) upon notification to the User or the User Institution(s) or the continued use of the PCGL Controlled Data by the User or the User Institution(s) after any such revision.',
						'The User and the User Institution(s) agree to distribute a copy of this agreement and explain its content to any person mentioned in section C. Collaborators.',
						'The University as Data Controller (Regulation (EU) 2016/679 (General Data Protection Regulation) governs PCGL operations and management, including the DACO and Data Coordination Centre and associated Regional Data Processing Centres.',
					]}
				/>
			</FormDisplay>
			<FormDisplay title="Agreements" wrap={false}>
				<Paragraph>
					You MUST agree to the following procedures in order to have access to the PCGL Controlled Data:
				</Paragraph>
				<Checkbox>
					Yes, You will keep all computer systems on which PCGL Controlled Data reside, or which provide access to such
					data, up-to-date with respect to software patches and antivirus file definitions (if applicable).
				</Checkbox>
				<Checkbox>
					Yes, You will protect PCGL Controlled Data against disclosure to and use by unauthorized individuals.
				</Checkbox>
				<Checkbox>Yes, You will monitor and control which individuals have access to PCGL controlled Data.</Checkbox>
				<Checkbox>
					Yes, You will securely destroy all copies of PCGL Controlled Data in accordance with the terms and conditions
					of the Data Access Agreement.
				</Checkbox>
				<Checkbox>
					Yes, You will familiarize all individuals who have access to PCGL Controlled Data with the restrictions on its
					use.
				</Checkbox>
				<Checkbox>
					Yes, You agree to swiftly provide a copy of both your institutional and Research Project related IT policy
					documents upon request from a DACO representative.
				</Checkbox>
				<Checkbox>
					Yes, You will notify the DACO immediately if you become aware or suspect that someone has gained unauthorized
					access to the PCGL Controlled Data.
				</Checkbox>
				<Checkbox>
					Yes, You certify that the contents in the application are true and correct to the best of your knowledge and
					belief.
				</Checkbox>
				<Checkbox>
					Yes, You have read and agree to abide by the terms and conditions outlined in the Data Access Agreement.
				</Checkbox>
			</FormDisplay>
		</StandardPage>
	);
};

export default TermsAndConditions;
