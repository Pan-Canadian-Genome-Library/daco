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
import { GenerateInstitutionalRepType } from '../../types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

// TODO: english and french translations
export const GenerateEmailInstitutionalRepReview = ({
	applicantName,
	repName,
	id,
	submittedDate,
}: Omit<GenerateInstitutionalRepType, 'to'>) => {
	const {
		express: { ui },
	} = getEmailConfig();

	const template = `  
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${repName},
                </mj-text>
                <mj-text>
                    We hope this message finds you well.
                </mj-text>
                <mj-text>
                    A new PCGL <a href="" target="_blank" rel="nofollow">DACO application</a> has been submitted and is now awaiting your review. Please login to the DACO portal using your institutional email and review the application. Your timely input and approval are essential for the next steps in the process.
                </mj-text>
                <mj-text>
                    Here are the details of the application:
                </mj-text>
                <mj-text>
                <ul>
                    <li>
                        Applicant Name: ${applicantName} <br/>
                    </li>
                    <li>
                        Application ID: ${id} <br/>
                    </li>
                    <li>
                        Submission Date: ${submittedDate} <br/>
                    </li>
                </ul>
                </mj-text>
                <mj-text css-class="bold">
                    Action Required
                </mj-text>
                <mj-text>
                    Please carefully review the application. There are two ways to do so, you can review using the <a href="${ui}" target="_blank" rel="nofollow">DACO portal </a>, or download the application PDF from the 'Sign & Submit' page. 
                </mj-text>
                <mj-text>
                    If you are satisfied with the details, proceed to the 'ign & Submit' page' provide your e-signature, and click on the 'Submit Application' button to complete the review. The application will be forwarded to the Data Access Committee for further review. The applicant will receive an email notification regarding your submission.
                </mj-text>
                <mj-text>
                    If you are not satisfied with the application and would like to request revisions, click the 'Request Revisions' button. A window will open where you can enter requests. When you are done, click the 'Send Request' button to complete the review. Please do not submit the application if you requested revisions. The applicant will receive an email notification about your requests and comments, and they will update the application based on your feedback. DACO will notify you when the application is re-submitted for your review. 
                </mj-text>
                <mj-text>
                    Please access the application through <a href="${ui}" target="_blank" rel="nofollow">DACO portal </a> at your earliest convenience. If you encounter any issues or have questions, feel free to reach out, and we would be happy to assist.
                </mj-text>
                <mj-text>
                    Best regards,<br />
                    The PCGL Data Access Compliance Office
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailInstitutionalRepReviewPlain = ({
	applicantName,
	repName,
	id,
	submittedDate,
}: Omit<GenerateInstitutionalRepType, 'to'>) => {
	const {
		express: { ui },
	} = getEmailConfig();

	return ` Dear ${repName},
    \n We hope this message finds you well.
    \n A new PCGL DACO application has been submitted and is now awaiting your review. Please login to the DACO portal using your institutional email and review the application. Your timely input and approval are essential for the next steps in the process.
    \n Here are the details of the application:
    \n Applicant Name: ${applicantName}
    \n Application ID: ${id}
    \n Submission Date: ${submittedDate}
    \n\n Action Required
    \n Please carefully review the application. There are two ways to do so, you can review using the ${ui}, or download the application PDF from the 'Sign & Submit' page.
    \n If you are satisfied with the details, proceed to the 'ign & Submit' page' provide your e-signature, and click on the 'Submit Application' button to complete the review. The application will be forwarded to the Data Access Committee for further review. The applicant will receive an email notification regarding your submission.
    \n If you are not satisfied with the application and would like to request revisions, click the 'Request Revisions' button. A window will open where you can enter requests. When you are done, click the 'Send Request' button to complete the review. Please do not submit the application if you requested revisions. The applicant will receive an email notification about your requests and comments, and they will update the application based on your feedback. DACO will notify you when the application is re-submitted for your review.  
    \n Should you have any questions or need assistance, feel free to reach out to us. 
    \n Please access the application through ${ui} at your earliest convenience. If you encounter any issues or have questions, feel free to reach out, and we would be happy to assist.
    \n Best regards, \n The PCGL Data Access Compliance Office 
    `;
};
