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
import { type GenerateSubmitRevisionReminderEmailType } from '@/service/email/types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

// TODO: english and french translations
export const GenerateEmailReminderSubmitRepRevisions = ({
	applicantName,
	repName,
	id,
	submittedDate,
}: Omit<GenerateSubmitRevisionReminderEmailType, 'to' | 'actionId'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	const template = `  
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${applicantName},
                </mj-text>
                <mj-text>
                    This is a reminder that revisions were requested for your application on the <u>PCGL Data Access Compliance Office portal</u>, and we have not yet received a response.
                </mj-text>
                <mj-text>
                   To proceed with the review process, please log in to review the comments and submit the required updates.
                </mj-text>
                <mj-text>
                    <ul>
                        <li>
                            <b>Application ID:</b> ${id} <br/>
                        </li>
                        <li>
                            <b>Revision Requested By:</b> ${repName} <br/>
                        </li>
                        <li>
                            <b>Date of Request:</b> ${submittedDate} <br/>
                        </li>
                    </ul>
                </mj-text>
                <mj-text>
                    You can view and respond to the revision request here: ${ui}
                </mj-text>
                <mj-text>
                    Best regards,<br />
                    The PCGL Data Access Compliance Office
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailReminderSubmitRepRevisionsPlain = ({
	applicantName,
	repName,
	id,
	submittedDate,
}: Omit<GenerateSubmitRevisionReminderEmailType, 'to' | 'actionId'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	return ` Dear ${applicantName},
    \n This is a reminder that revisions were requested for your application on the PCGL Data Access Compliance Office portal, and we have not yet received a response.
    \n To proceed with the review process, please log in to review the comments and submit the required updates.
    \n\n Application ID: ${id}
    \n Revision Requested By: ${repName}
    \n Submission Date: ${submittedDate}
    \n\n You can view and respond to the revision request here: ${ui}
    \n Best regards, \n The PCGL Data Access Compliance Office 
    `;
};
