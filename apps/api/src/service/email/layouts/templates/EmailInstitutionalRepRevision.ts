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
import { GenerateDacRevisionType } from '@/service/email/types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

// NOTE: verify english translations and generated text
export const GenerateEmailRepForSubmittedRevision = ({
	id,
	applicantName,
	submittedDate,
}: Omit<GenerateDacRevisionType, 'to' | 'actionId'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	const template = `
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear Institutional Representative,
                </mj-text>
                <mj-text>
                    We are writing to inform you that the <a href="${ui}/application/${id}" target="_blank" rel="nofollow">PCGL DACO application</a> that you requested revisions on is now ready for your review. The applicant has resubmitted the application based on your feedback, and we kindly request that you review the application at your earliest convenience. <br /> <br />
                </mj-text>
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

                <mj-divider padding-bottom="40px" padding-top="40px" border-width="1px" border-color="lightgrey" />

                <mj-text>
                    Cher/Chère représentant(e) institutionnel(le),
                </mj-text>
                <mj-text>
                    Nous vous informons que la demande au BCAD de la BGP pour laquelle vous aviez demandé des révisions est maintenant prête pour votre examen. Le demandeur / La demandeuse a de nouveau soumis la demande en tenant compte de vos commentaires. Nous vous prions de bien vouloir l'examiner dans les plus brefs délais. <br /> <br />
                </mj-text>
                <mj-text>
                    Voici les détails de la demande : <br /> <br />
                </mj-text>
                <mj-text>
                    Nom du demandeur/demandeuse : ${applicantName}<br />
                    ID de la demande : ${id}<br />
                    Date de soumission : ${submittedDate}<br />
                    Lien vers la demande : <a href="${ui}/application/${id}" target="_blank" rel="nofollow">Demande-${id}</a> <br /> <br />
                </mj-text>
                <mj-text>
                    Veuillez accéder à la demande via le portail du BCAD de la BGP pour procéder à l'examen. Si vous rencontrez des problèmes ou avez des questions, n'hésitez pas à nous contacter.
                </mj-text>
                <mj-text>
                    Nous vous remercions de votre temps et de votre attention.<br /><br />
                </mj-text>
                <mj-text>
                    Cordialement,<br />
                    Le Bureau de conformité de l'accès aux données de la BGP (BCAD)
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailRepForSubmittedRevisionPlain = ({
	id,
	applicantName,
	submittedDate,
}: Omit<GenerateDacRevisionType, 'to' | 'actionId'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	return ` Dear Institutional Representative,
    \n We are writing to inform you that the PCGL DACO application that you requested revisions on is now ready for your review. The applicant has resubmitted the application based on your feedback, and we kindly request that you review the application at your earliest convenience.
    \n\n Here are the application details:
    \n Applicant Name: ${applicantName}
    \n Application ID: ${id}
    \n Submission Date: ${submittedDate}
    \n Link to the application: ${ui}/application/${id}
    \n
    \n Please access the application through the PCGL DACO portal to proceed with the review. If you encounter any issues or have any questions, please feel free to reach out.
    \n Thank you for your time and attention to this matter.
    \n Best regards, \n The PCGL Data Access Compliance Office
    \n
    \n---
    \n
    \n Cher/Chère représentant(e) institutionnel(le),
    \n Nous vous informons que la demande au BCAD de la BGP pour laquelle vous aviez demandé des révisions est maintenant prête pour votre examen. Le demandeur / La demandeuse a de nouveau soumis la demande en tenant compte de vos commentaires. Nous vous prions de bien vouloir l'examiner dans les plus brefs délais.
    \n\n Voici les détails de la demande :
    \n Nom du demandeur/demandeuse : ${applicantName}
    \n ID de la demande : ${id}
    \n Date de soumission : ${submittedDate}
    \n Lien vers la demande : ${ui}/application/${id}
    \n
    \n Veuillez accéder à la demande via le portail du BCAD de la BGP pour procéder à l'examen. Si vous rencontrez des problèmes ou avez des questions, n'hésitez pas à nous contacter.
    \n Nous vous remercions de votre temps et de votre attention.
    \n Cordialement, \n Le Bureau de conformité de l'accès aux données de la BGP (BCAD)
    `;
};
