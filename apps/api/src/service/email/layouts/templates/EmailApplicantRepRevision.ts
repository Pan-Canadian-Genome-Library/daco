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

import { getEmailConfig } from '@/config/emailConfig.ts';
import { GenerateApplicantRepRevisionType } from '../../types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

const defaultRevisionText = 'No revisions needed';

// TODO: english and french translations
export const GenerateEmailApplicantRepRevision = ({
	id,
	applicantName,
	institutionalRepFirstName,
	institutionalRepLastName,
	comments,
}: Omit<GenerateApplicantRepRevisionType, 'to'>) => {
	const {
		express: { ui },
	} = getEmailConfig();

	const template = `  
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${applicantName},
                </mj-text>
                <mj-text>                    
                    We hope you are doing well. <br/>
                </mj-text>
                <mj-text>
                    We want to inform you that the institutional representative ${institutionalRepFirstName} ${institutionalRepLastName} has reviewed your PCGL DACO application and has requested some revisions before the process can proceed.                
                </mj-text>
                <mj-text>
                    The following revisions have been requested: <br />
                </mj-text>
                <mj-text>
                    <ol type="A">
                        <li> Applicant Information: ${comments.applicantNotes ?? defaultRevisionText} </li>
                        <li> Institutional Representative: ${comments.institutionalNotes ?? defaultRevisionText} <br /> </li>
                        <li> Collaborator: ${comments.collaboratorNotes ?? defaultRevisionText} </li>
                        <li> Project Information: ${comments.projectNotes ?? defaultRevisionText} </li>
                        <li> Requested Study: ${comments.requestedStudiesNotes ?? defaultRevisionText} </li> 
                        <li> Ethics: ${comments.ethicsNotes ?? defaultRevisionText} </li>
                        <li> Data Access Agreement: ${comments.dataAccessAgreementNotes ?? defaultRevisionText} </li> 
                        <li> Appendices: ${comments.appendicesNotes ?? defaultRevisionText} </li>
                        <li> Sign & Submit: ${comments.signNotes ?? defaultRevisionText} </li> 
                        <li> General Comments: ${comments.generalComments ?? defaultRevisionText} </li>  
                    </ol>
                </mj-text>
                <mj-text>
                    Please go to <a href="${ui}/application/${id}" target="_blank" rel="nofollow">your application</a> to revise the revisions. <br/>
                </mj-text>
                <mj-text>
                    Please make the necessary updates to your application and resubmit it through the <a href="${ui}" target="_blank" rel="nofollow">DACO portal</a>. If you have any questions or need clarification on the requested changes, feel free to reach out to us.<br />
                </mj-text>
                <mj-text>
                    We appreciate your attention to these revisions and your timely response. <br/><br/>
                </mj-text>
                <mj-text>
                    Best regards,<br />
                    The PCGL Data Access Compliance Office
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailApplicantRepRevisionPlain = ({
	id,
	applicantName,
	institutionalRepFirstName,
	institutionalRepLastName,
	comments,
}: Omit<GenerateApplicantRepRevisionType, 'to'>) => {
	const {
		express: { ui },
	} = getEmailConfig();

	return ` Dear ${applicantName},
    \n We hope you are doing well. 
    \n\n We want to inform you that the institutional representative ${institutionalRepFirstName} ${institutionalRepLastName} has reviewed your PCGL DACO application and has requested some revisions before the process can proceed.  
    \n\n The following revisions have been requested:
    \n
    \n A. Applicant Information: ${comments.applicantNotes ?? defaultRevisionText} 
    \n B. Institutional Representative: ${comments.institutionalNotes ?? defaultRevisionText} 
    \n C. Collaborator: ${comments.collaboratorNotes ?? defaultRevisionText} 
    \n D. Project Information: ${comments.projectNotes ?? defaultRevisionText} 
    \n E. Requested Study: ${comments.requestedStudiesNotes ?? defaultRevisionText}
    \n F. Ethics: ${comments.ethicsNotes ?? defaultRevisionText} 
    \n G. Data Access Agreement: ${comments.dataAccessAgreementNotes ?? defaultRevisionText}
    \n H. Appendices: ${comments.appendicesNotes ?? defaultRevisionText}
    \n I. Sign & Submit: ${comments.signNotes ?? defaultRevisionText}
    \n J. General Comments: ${comments.generalComments ?? defaultRevisionText}
    \n\n
    \n Please go to ${ui}/application/${id} to review the revisions.
    \n 
    \n Please make the necessary updates to your application and resubmit it through the DACO Portal. If you have any questions or need clarification on the requested changes, feel free to reach out to us.
    \n
    \n We appreciate your attention to these revisions and your timely response.
    \n
    \n Best regards, \n The PCGL Data Access Compliance Office 
    `;
};
