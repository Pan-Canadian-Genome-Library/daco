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
import { type GenerateErrorApproveType } from '@/service/email/types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

export const GenerateEmailDACApprovalWithError = ({
	id,
	applicantName,
	errors,
}: Omit<GenerateErrorApproveType, 'to'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	const template = `  
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear DAC Member,
                </mj-text>
                <mj-text>
                    We are writing to inform you that the following PCGL DACO application has been approved; However, an error occurred while processing the data access request. <br/> <br/>
                </mj-text>
                <mj-text>
                    Here are the application details:
                </mj-text>
                <mj-text>
                    <ul>
                        <li>Applicant Name: ${applicantName}</li>
                        <li>Application ID: ${id}</li>
                        <li>Link to the application: <a href="${ui}/application/${id}" target="_blank" rel="nofollow">Application-${id}</a> </li>
                    </ul>
                </mj-text>
                <mj-text>
                    Your attention is required to review and address the following issue(s):
                </mj-text>
                <mj-text>
                    <ul>
                        ${errors.map((error) => `<li>${error}</li>`).join('')}
                    </ul>
                </mj-text>
                <mj-text>
                    Thank you for your time and attention to this matter.<br /><br />
                </mj-text>
                <mj-text>
                    Best regards,<br />
                    The PCGL Data Access Compliance Office
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailDACApprovalWithErrorPlain = ({
	id,
	applicantName,
	errors,
}: Omit<GenerateErrorApproveType, 'to'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	return ` Dear DAC Member,
    \n We are writing to inform you that the following PCGL DACO application has been approved; However, an error occurred while processing the data access request.
    \n\n Here are the application details:
    \n Applicant Name: ${applicantName}
    \n Application ID: ${id}
    \n Link to the application: ${ui}/application/${id}
    \n
    \n Your attention is required to review and address the following issue(s):
    \n ${errors.map((error) => `- ${error}`).join('\n')}
    \n 
    \n Thank you for your time and attention to this matter.
    \n Best regards, \n The PCGL Data Access Compliance Office 
    `;
};
