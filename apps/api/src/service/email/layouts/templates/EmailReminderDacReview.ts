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

// NOTE: verify english translations
export const GenerateEmailReminderDacReview = ({
	applicantName,
	repName,
	id,
	submittedDate,
}: EmailReminderTemplateType) => {
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

                <mj-divider padding-bottom="40px" padding-top="40px" border-width="1px" border-color="lightgrey" />

                <mj-text>
                    Cher/Chère ${repName},
                </mj-text>
                <mj-text>
                    Ceci est un rappel amical concernant une ou plusieurs demandes qui vous sont assignées sur le portail du <u>Bureau de conformité de l'accès aux données de la BGP</u> et qui sont en attente de votre examen depuis plus de 7 jours.
                </mj-text>
                <mj-text>
                   Un examen rapide des demandes nous aide à maintenir un traitement efficace et à respecter les normes de conformité.
                </mj-text>
                <mj-text>
                    <b>Demande(s) en attente :</b>
                </mj-text>
                <mj-text>
                    <ul>
                        <li>
                            <b>ID de la demande :</b> ${id} <br/>
                        </li>
                        <li>
                            <b>Demandeur/Demandeuse :</b> ${applicantName} <br/>
                        </li>
                        <li>
                            <b>Date de soumission :</b> ${submittedDate} <br/>
                        </li>
                    </ul>
                </mj-text>
                <mj-text>
                    Veuillez vous connecter au portail BCAD pour procéder à l'examen : ${ui}
                </mj-text>
                <mj-text>
                    Cordialement,<br />
                    Le Bureau de conformité de l'accès aux données de la BGP
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailReminderDacReviewPlain = ({
	applicantName,
	repName,
	id,
	submittedDate,
}: EmailReminderTemplateType) => {
	const {
		express: { ui },
	} = getEmailConfig;

	return ` Dear ${repName},
    \n This is a friendly reminder that there is one or more applications assigned to you on the PCGL Data Access Compliance Office portal that have been awaiting your review for over 7 days.
    \n Timely review of applications helps us maintain efficient processing and meet compliance standards.
    \n Pending Application(s):
    \n Application ID: ${id}
    \n Applicant Name: ${applicantName}
    \n Submission Date: ${submittedDate}
    \n Please log in to the DACO portal to review: ${ui}
    \n Best regards, \n The PCGL Data Access Compliance Office
    \n
    \n---
    \n
    \n Cher/Chère ${repName},
    \n Ceci est un rappel amical concernant une ou plusieurs demandes qui vous sont assignées sur le portail du Bureau de conformité de l'accès aux données de la BGP et qui sont en attente de votre examen depuis plus de 7 jours.
    \n Un examen rapide des demandes nous aide à maintenir un traitement efficace et à respecter les normes de conformité.
    \n Demande(s) en attente :
    \n ID de la demande : ${id}
    \n Demandeur/Demandeuse : ${applicantName}
    \n Date de soumission : ${submittedDate}
    \n Veuillez vous connecter au portail BCAD pour procéder à l'examen : ${ui}
    \n Cordialement, \n Le Bureau de conformité de l'accès aux données de la BGP
    `;
};
