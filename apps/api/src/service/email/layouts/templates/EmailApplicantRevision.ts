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
import { GenerateApplicantRevisionType } from '../../types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

const defaultRevisionText = 'No revisions needed';

// TODO: english and french translations
export const GenerateEmailApplicantRevision = ({
	id,
	applicantName,
	submittedDate,
	comments,
}: Omit<GenerateApplicantRevisionType, 'to'>) => {
	const {
		express: { ui },
	} = getEmailConfig();

	const template = `  
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${applicantName},
                </mj-text>
                <mj-text>                    
                    We hope you are doing well. <br/> <br/>
                </mj-text>
                <mj-text>
                    We want to inform you that the PCGL Data Access Committee has reviewed your PCGL DACO application and has requested some revisions before the process can proceed. <br/> <br/>
                </mj-text>
                <mj-text>
                    The following revisions have been requested: <br /> <br />
                </mj-text>
                <mj-text>
                    A. Applicant Information: ${comments.applicantNotes ?? defaultRevisionText} <br /> 
                    B. Institutional Representative: ${comments.institutionalNotes ?? defaultRevisionText} <br /> 
                    C. Collaborator: ${comments.collaboratorNotes ?? defaultRevisionText} <br /> 
                    D. Project Information: ${comments.projectNotes ?? defaultRevisionText} <br /> 
                    E. Requested Study: ${comments.requestedStudiesNotes ?? defaultRevisionText} <br /> 
                    F. Ethics: ${comments.ethicsNotes ?? defaultRevisionText} <br /> 
                    G. Data Access Agreement: ${comments.dataAccessAgreementNotes ?? defaultRevisionText} <br /> 
                    H. Appendices: ${comments.dataAccessAgreementNotes ?? defaultRevisionText} <br /> 
                    I. Sign & Submit: ${comments.dataAccessAgreementNotes ?? defaultRevisionText} <br /> 
                    J. General Comments: ${comments.dataAccessAgreementNotes ?? defaultRevisionText} <br /> <br /> 
                </mj-text>
                <mj-text>
                    Please go to <a href="${ui}/application/${id}" target="_blank" rel="nofollow">your application</a> to review the revisions. <br/> <br/>
                </mj-text>
                <mj-text>
                    Please make the necessary updates to your application and resubmit it through the <a href="${ui}" target="_blank" rel="nofollow">DACO portal</a>. If you have any questions or need clarification on the requested changes, feel free to reach out to us.<br /><br />
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

export const GenerateEmailApplicantRevisionPlain = ({
	id,
	applicantName,
	submittedDate,
	comments,
}: Omit<GenerateApplicantRevisionType, 'to'>) => {
	const {
		express: { ui },
	} = getEmailConfig();

	return ` Dear ${applicantName},
    \n We hope you are doing well. 
    \n\n We want to inform you that the PCGL Data Access Committee has reviewed your PCGL DACO application and has requested some revisions before the process can proceed.
    \n\n The following revisions have been requested:
    \n
    \n A. Applicant Information: ${comments.applicantNotes ?? defaultRevisionText} <br /> 
    \n B. Institutional Representative: ${comments.institutionalNotes ?? defaultRevisionText} <br /> 
    \n C. Collaborator: ${comments.collaboratorNotes ?? defaultRevisionText} <br /> 
    \n D. Project Information: ${comments.projectNotes ?? defaultRevisionText} <br /> 
    \n E. Requested Study: ${comments.requestedStudiesNotes ?? defaultRevisionText} <br /> 
    \n F. Ethics: ${comments.ethicsNotes ?? defaultRevisionText} <br /> 
    \n G. Data Access Agreement: ${comments.dataAccessAgreementNotes ?? defaultRevisionText} <br /> 
    \n H. Appendices: ${comments.dataAccessAgreementNotes ?? defaultRevisionText} <br /> 
    \n I. Sign & Submit: ${comments.dataAccessAgreementNotes ?? defaultRevisionText} <br /> 
    \n J. General Comments: ${comments.dataAccessAgreementNotes ?? defaultRevisionText} <br /> <br /> 
    \n\n
    \n Please go to your application to review the revisions.
    \n 
    \n Please make the necessary updates to your application and resubmit it through the DACO Portal. If you have any questions or need clarification on the requested changes, feel free to reach out to us.
    \n
    \n We appreciate your attention to these revisions and your timely response.
    \n
    \n Best regards, \n The PCGL Data Access Compliance Office 
    `;
};
