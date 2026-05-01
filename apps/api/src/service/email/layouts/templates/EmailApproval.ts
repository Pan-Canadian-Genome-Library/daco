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
import { GenerateApproveType } from '@/service/email/types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

export const GenerateEmailApproval = ({ id, name }: Omit<GenerateApproveType, 'to' | 'actionId'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	const template = `
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${name},
                </mj-text>
                <mj-text>
                    We are pleased to inform you that your <a href="${ui}/application/${id}" target="_blank" rel="nofollow">DACO application</a> has been successfully approved by the PCGL Data Access Committee. <br /> <br />
                </mj-text>
                <mj-text>
                    Should you have any questions or need assistance, feel free to reach out to us. <br /> <br />
                </mj-text>
                <mj-text>
                    Best regards,<br />
                    The PCGL Data Access Compliance Office
                </mj-text>

                <mj-divider padding-bottom="40px" padding-top="40px" border-width="1px" border-color="lightgrey" />

                <mj-text>
                    Cher/Chère ${name},
                </mj-text>
                <mj-text>
                    Nous avons le plaisir de vous informer que votre <a href="${ui}/application/${id}" target="_blank" rel="nofollow">demande au BCAD</a> a été approuvée avec succès par le Comité d'accès aux données de la BGP. <br /> <br />
                </mj-text>
                <mj-text>
                    Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter. <br /> <br />
                </mj-text>
                <mj-text>
                    Cordialement,<br />
                    Le Bureau de conformité de l'accès aux données de la BGP
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailApprovalPlain = ({ name }: Omit<GenerateApproveType, 'to' | 'actionId'>) => {
	return ` Dear ${name},
    \n We are pleased to inform you that your DACO application has been successfully approved by the PCGL Data Access Committee.
    \n Should you have any questions or need assistance, feel free to reach out to us.
    \n Best regards, \n The PCGL Data Access Compliance Office
    \n
    \n---
    \n
    \n Cher/Chère ${name},
    \n Nous avons le plaisir de vous informer que votre demande au BCAD a été approuvée avec succès par le Comité d'accès aux données de la BGP.
    \n Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter.
    \n Cordialement, \n Le Bureau de conformité de l'accès aux données de la BGP
    `;
};
