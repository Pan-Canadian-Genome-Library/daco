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
import { type GenerateRejectType } from '@/service/email/types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

// TODO: english and french translations
export const GenerateEmailApplicantRevoke = ({
	id,
	name,
	comment,
	dacRevoked,
}: Omit<GenerateRejectType, 'to'> & { dacRevoked: boolean }) => {
	const {
		express: { ui },
	} = getEmailConfig;

	const template = `  
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${name},
                </mj-text>
                <mj-text>
                    ${dacRevoked ? `We are writing to inform you that your <a href="${ui}/application/${id}" target="_blank" rel="nofollow">PCGL-${id}</a> has been revoked by the PCGL Data Access Committee` : `We are writing to inform you that you have revoked <a href="${ui}/application/${id}" target="_blank" rel="nofollow">PCGL-${id}.</a>`} This is the message you left on the revoked application: 
                </mj-text>
                <mj-text>
                    ${comment}
                </mj-text>
                <mj-text>
                    You and all the collaborators will no longer have access to PCGL controlled data.
                </mj-text>
                <mj-text>
                    ${dacRevoked ? `If you disagree with the decision to revoke the application, or have any questions, please reach out to us.` : `We appreciate your interest in the PCGL controlled data, thank you again for your time!`} 
                </mj-text>
                <mj-text>
                    Best regards,<br />
                    The PCGL Data Access Compliance Office
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailApplicantRevokePlain = ({
	id,
	name,
	comment,
	dacRevoked,
}: Omit<GenerateRejectType, 'to'> & { dacRevoked: boolean }) => {
	return ` Dear ${name},
    \n ${dacRevoked ? `We are writing to inform you that your PCGL-${id} has been revoked by the PCGL Data Access Committee` : `We are writing to inform you that you have revoked PCGL-${id}.`} This is the message you left on the revoked application: 
    \n ${comment}
    \n You and all the collaborators will no longer have access to PCGL controlled data.  
    \n ${dacRevoked ? `If you disagree with the decision to revoke the application, or have any questions, please reach out to us.` : `We appreciate your interest in the PCGL controlled data, thank you again for your time!`} 
    \n Best regards, \n The PCGL Data Access Compliance Office`;
};
