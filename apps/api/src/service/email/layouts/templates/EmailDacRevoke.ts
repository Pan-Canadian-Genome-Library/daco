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
import { GenerateRejectType } from '../../types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

// TODO: english and french translations
export const GenerateEmailDacRevoke = ({ id, name, comment }: Omit<GenerateRejectType, 'to'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	const template = `  
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${name},
                </mj-text>
                <mj-text>
                    We are writing to inform you that you have revoked the <a href="${ui}/application/${id}" target="_blank" rel="nofollow">PCGL-${id}</a> This is the message you left on the revoked application: 
                </mj-text>
                <mj-text>
                    ${comment}
                </mj-text>
                <mj-text>
                    The applicant has been notified and they will no longer have access to PCGL controlled data.                  
                </mj-text>
                <mj-text>
                    Best regards,<br />
                    The PCGL Data Access Compliance Office
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailDacRevokePlain = ({ id, name, comment }: Omit<GenerateRejectType, 'to'>) => {
	return ` Dear ${name},
    \n We are writing to inform you that you have revoked the PCGL-${id}. This is the message you left on the revoked application: 
    \n ${comment}
    \n The applicant has been notified and they will no longer have access to PCGL controlled data.                   
    \n Best regards, \n The PCGL Data Access Compliance Office`;
};
