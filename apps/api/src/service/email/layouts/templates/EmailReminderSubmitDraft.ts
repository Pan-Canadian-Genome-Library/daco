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
import { type EmailReminderTemplateType } from '@/service/email/types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

export const GenerateEmailReminderSubmitDraft = ({ applicantName, id, submittedDate }: EmailReminderTemplateType) => {
	const {
		express: { ui },
	} = getEmailConfig;
	const template = `
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${applicantName},
                </mj-text>
                <mj-text>
                    We noticed that your application on the <u>PCGL Data Access Compliance Office</u> portal has been in draft status for over 7 days.
                </mj-text>
                <mj-text>
                   To ensure timely processing and avoid delays, please review and submit your application at your earliest convenience.
                </mj-text>
                <mj-text>
                    <ul>
                        <li>
                            Application ID: ${id} <br/>
                        </li>
                        <li>
                            Last Modified: ${submittedDate} <br/>
                        </li>
                    </ul>
                </mj-text>
                <mj-text>
                    You can access your draft application here: ${ui}
                </mj-text>
                <mj-text>
                    If you no longer intend to submit this application, you may disregard this reminder and close the application from your portal dashboard.
                </mj-text>
                <mj-text>
                    If you have any questions or need assistance, feel free to contact us!
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
                    Nous avons remarqué que votre demande sur le portail du <u>Bureau de la conformité en matière d'accès aux données de la BGP</u> est en statut ébauche depuis plus de 7 jours.
                </mj-text>
                <mj-text>
                   Afin d'assurer un traitement rapide et d'éviter tout retard, veuillez examiner et soumettre votre demande dès que possible.
                </mj-text>
                <mj-text>
                    <ul>
                        <li>
                            ID de la demande : ${id} <br/>
                        </li>
                        <li>
                            Dernière modification : ${submittedDate} <br/>
                        </li>
                    </ul>
                </mj-text>
                <mj-text>
                    Vous pouvez accéder à votre demande en cours d'ébauche ici : ${ui}
                </mj-text>
                <mj-text>
                    Si vous n'avez plus l'intention de soumettre cette demande, vous pouvez ignorer ce rappel et fermer la demande depuis votre tableau de bord du portail.
                </mj-text>
                <mj-text>
                    Si vous avez des questions ou avez besoin d'assistance, n'hésitez pas à nous contacter!
                </mj-text>
                <mj-text>
                    Cordialement,<br />
                    Le Bureau de conformité de l'accès aux données de la BGP
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailReminderSubmitDraftPlain = ({
	applicantName,
	id,
	submittedDate,
}: EmailReminderTemplateType) => {
	const {
		express: { ui },
	} = getEmailConfig;

	return ` Dear ${applicantName},
    \n We noticed that your application on the PCGL Data Access Compliance Office portal has been in draft status for over 7 days.
    \n To ensure timely processing and avoid delays, please review and submit your application at your earliest convenience.
    \n\n Application ID: ${id}
    \n Last Modified: ${submittedDate}
    \n\n You can access your draft application here: ${ui}
    \n If you no longer intend to submit this application, you may disregard this reminder and close the application from your portal dashboard.
    \n If you have any questions or need assistance, feel free to contact us!
    \n Best regards, \n The PCGL Data Access Compliance Office
    \n
    \n---
    \n
    \n Cher/Chère ${applicantName},
    \n Nous avons remarqué que votre demande sur le portail du Bureau de la conformité en matière d'accès aux données de la BGP est en statut ébauche depuis plus de 7 jours.
    \n Afin d'assurer un traitement rapide et d'éviter tout retard, veuillez examiner et soumettre votre demande dès que possible.
    \n\n ID de la demande : ${id}
    \n Dernière modification : ${submittedDate}
    \n\n Vous pouvez accéder à votre demande en cours d'ébauche ici : ${ui}
    \n Si vous n'avez plus l'intention de soumettre cette demande, vous pouvez ignorer ce rappel et fermer la demande depuis votre tableau de bord du portail.
    \n Si vous avez des questions ou avez besoin d'assistance, n'hésitez pas à nous contacter!
    \n Cordialement, \n Le Bureau de conformité de l'accès aux données de la BGP
    `;
};
