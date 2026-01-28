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

import { getEmailConfig } from '@/config/emailConfig.ts';
import { type GenerateReviewReminderEmailType } from '@/service/email/types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

// TODO: english and french translations
export const GenerateEmailReminderRepReview = ({
	applicantName,
	repName,
	id,
	submittedDate,
}: Omit<GenerateReviewReminderEmailType, 'to' | 'actionId'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	const template = `  
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${repName},
                </mj-text>
                <mj-text>
                    This is a friendly reminder that there is one or more applications assigned to you on the <u>PCGL Data Access Compliance Office portal</u> that have been <b>awaiting your review for over 7 days</b>.
                </mj-text>
                <mj-text>
                   Timely review of applications helps us maintain efficient processing and meet compliance standards.
                </mj-text>
                <mj-text>
                    <b>Pending Application:</b>
                </mj-text>
                <mj-text>
                    <ul>
                        <li>
                            <b>Application ID:</b> ${id} <br/>
                        </li>
                        <li>
                            <b>Applicant:</b> ${applicantName} <br/>
                        </li>
                        <li>
                            <b>Date Submitted:</b> ${submittedDate} <br/>
                        </li>
                    </ul>
                </mj-text>
                <mj-text>
                    Please log in to the DACO portal to review: ${ui}
                </mj-text>
                <mj-text>
                    Best regards,<br />
                    The PCGL Data Access Compliance Office
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailReminderRepReviewPlain = ({
	applicantName,
	repName,
	id,
	submittedDate,
}: Omit<GenerateReviewReminderEmailType, 'to' | 'actionId'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	return ` Dear ${repName},
    \n We hope this message finds you well.
    \n This is a friendly reminder that there is one or more applications assigned to you on the PCGL Data Access Compliance Office portal that have been awaiting your review for over 7 days.
    \n Timely review of applications helps us maintain efficient processing and meet compliance standards.
    \n Pending Application(s):
    \n Application ID: ${id}
    \n Applicant Name: ${applicantName}
    \n Submission Date: ${submittedDate}
    \n Please log in to the DACO portal to review: ${ui}
    \n Best regards, \n The PCGL Data Access Compliance Office 
    `;
};
