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
import { GenerateDacRevisionType } from '../../types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

// TODO: english and french translations
export const GenerateEmailDacForReview = ({
	id,
	applicantName,
	submittedDate,
}: Omit<GenerateDacRevisionType, 'to'>) => {
	const {
		express: { ui },
	} = getEmailConfig();

	const template = `  
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear DAC Members,
                </mj-text>
                <mj-text>                    
                    We are writing to inform you that a <a href="" target="_blank" rel="nofollow">PCGL DACO application</a> is now ready for your review. The institutional representative has completed their part of the process, and we kindly request that you review the application at your earliest convenience. <br/> <br/>
                <mj-text>
                    Here are the application details: <br /> <br />
                </mj-text>
                <mj-text>
                    Applicant Name: ${applicantName}<br />
                    Application ID: ${id}<br />
                    Submission Date: ${submittedDate}<br />
                    Link to the application: <a href="${ui}/application/${id}" target="_blank" rel="nofollow">Application-${id}</a> <br /> <br />
                </mj-text>
                <mj-text>
                    Please access the application through the PCGL DACO portal to proceed with the review. If you encounter any issues or have any questions, please feel free to reach out.
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

export const GenerateEmailDacForReviewPlain = ({
	id,
	applicantName,
	submittedDate,
}: Omit<GenerateDacRevisionType, 'to'>) => {
	const {
		express: { ui },
	} = getEmailConfig();

	return ` Dear DAC Members,
    \n We are writing to inform you that a PCGL DACO application is now ready for your review. The institutional representative has completed their part of the process, and we kindly request that you review the application at your earliest convenience.
    \n\n Here are the application details:
    \n Applicant Name: ${applicantName}
    \n Application ID: ${id}
    \n Submission Date: ${submittedDate}
    \n Link to the application: ${ui}/application/${id}
    \n
    \n Please access the application through the PCGL DACO portal to proceed with the review. If you encounter any issues or have any questions, please feel free to reach out.
    \n Thank you for your time and attention to this matter.
    \n Best regards, \n The PCGL Data Access Compliance Office 
    `;
};
