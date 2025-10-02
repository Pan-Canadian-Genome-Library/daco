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
export const GenerateEmailRejection = ({ id, name, comment }: Omit<GenerateRejectType, 'to'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	const template = `  
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${name},
                </mj-text>
                <mj-text>
                    Thank you for submitting <a href="${ui}/application/${id}" target="_blank" rel="nofollow">your application</a> to the PCGL DACO. After careful review, we regret to inform you that your application has not been approved. As a result, you will not have access to the requested data.
                </mj-text>
                <mj-text>
                    This is the Data Access Committee's comment on your application: ${comment}
                </mj-text>
                <mj-text>
                    We appreciate your interest in the PCGL controlled data, thank you again for your time!        
                </mj-text>
                <mj-text>
                    Best regards,<br />
                    The PCGL Data Access Compliance Office
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailRejectionPlain = ({ name, comment }: Omit<GenerateRejectType, 'id' | 'to'>) => {
	return ` Dear ${name},
    \n Thank you for submitting your application to the PCGL DACO. After careful review, we regret to inform you that your application has not been approved. As a result, you will not have access to the requested data.
    \n This is the Data Access Committee's comment on your application: ${comment}
    \n We appreciate your interest in the PCGL controlled data, thank you again for your time! 
    \n Best regards, \n The PCGL Data Access Compliance Office`;
};
