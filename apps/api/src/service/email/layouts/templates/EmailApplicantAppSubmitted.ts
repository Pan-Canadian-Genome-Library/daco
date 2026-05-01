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
import { EmailReminderTemplateType } from '../../types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

export const GenerateEmailApplicantAppSubmitted = ({ id, applicantName }: EmailReminderTemplateType) => {
	const {
		express: { ui },
	} = getEmailConfig;

	const template = `
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${applicantName},
                </mj-text>
                <mj-text>
                    We are pleased to inform you that your <a href="${ui}/application/${id}" target="_blank" rel="nofollow">DACO application</a> has been successfully submitted for DAC review by the institutional representative. The review process is now underway, and you will be notified once any updates or decisions are made.<br /> <br />
                </mj-text>
                <mj-text>
                    If you have any questions or need further information during this time, please do not hesitate to contact us. <br /> <br />
                </mj-text>
                <mj-text>
                    Thank you for your continued patience and cooperation.<br /> <br />
                </mj-text>
                <mj-text>
                    Best regards,<br />
                    The PCGL Data Access Compliance Office
                </mj-text>

                <mj-divider padding-bottom="40px" padding-top="40px" border-width="1px" border-color="lightgrey" />

                <mj-text>
                    Cher/Chère ${applicantName},
                </mj-text>
                <mj-text>
                    Nous avons le plaisir de vous informer que votre <a href="${ui}/application/${id}" target="_blank" rel="nofollow">demande au BCAD de la BGP</a> a été soumise avec succès pour examen par le Comité d'accès aux données (CAD) par le représentant institutionnel. Le processus d'examen est maintenant en cours, et vous serez informé(e) dès qu'une mise à jour ou une décision sera disponible.<br /> <br />
                </mj-text>
                <mj-text>
                    Si vous avez des questions ou si vous avez besoin de plus amples informations durant cette période, n'hésitez pas à nous contacter. <br /> <br />
                </mj-text>
                <mj-text>
                    Merci pour votre patience et votre collaboration continues.<br /> <br />
                </mj-text>
                <mj-text>
                    Cordialement,<br />
                    Le Bureau de la conformité en matière d'accès aux données du PCGL
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailApplicantAppSubmittedPlain = ({ applicantName }: EmailReminderTemplateType) => {
	return ` Dear ${applicantName},
    \n We are pleased to inform you that your DACO application has been successfully submitted for DAC review by the institutional representative. The review process is now underway, and you will be notified once any updates or decisions are made.
    \n If you have any questions or need further information during this time, please do not hesitate to contact us.
    \n Thank you for your continued patience and cooperation.
    \n\n Best regards, \n The PCGL Data Access Compliance Office
    \n
    \n---
    \n
    \n Cher/Chère ${applicantName},
    \n Nous avons le plaisir de vous informer que votre demande au BCAD de la BGP a été soumise avec succès pour examen par le Comité d'accès aux données (CAD) par le représentant institutionnel. Le processus d'examen est maintenant en cours, et vous serez informé(e) dès qu'une mise à jour ou une décision sera disponible.
    \n Si vous avez des questions ou si vous avez besoin de plus amples informations durant cette période, n'hésitez pas à nous contacter.
    \n Merci pour votre patience et votre collaboration continues.
    \n\n Cordialement, \n Le Bureau de la conformité en matière d'accès aux données du PCGL
    `;
};
