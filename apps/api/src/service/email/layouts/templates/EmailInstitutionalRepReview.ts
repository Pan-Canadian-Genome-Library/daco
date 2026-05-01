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
import { GenerateInstitutionalRepType } from '@/service/email/types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

export const GenerateEmailInstitutionalRepReview = ({
	applicantName,
	repName,
	id,
	submittedDate,
}: Omit<GenerateInstitutionalRepType, 'to'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	const template = `
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${repName},
                </mj-text>
                <mj-text>
                    We hope this message finds you well.
                </mj-text>
                <mj-text>
                   <b>${applicantName} has identified you as the Institutional Representative of their&nbsp;<a href="${ui}/application/${id}" target="_blank" rel="nofollow">PCGL DACO application</a>. The application has been submitted and is now awaiting your review.</b> Please login to the DACO portal using your institutional email and review the application. Your timely input and approval are essential for the next steps in the process.
                </mj-text>
                <mj-text>
                    Here are the details of the application:
                </mj-text>
                <mj-text>
                    <ul>
                        <li>
                            Applicant Name: ${applicantName} <br/>
                        </li>
                        <li>
                            Application ID: ${id} <br/>
                        </li>
                        <li>
                            Submission Date: ${submittedDate} <br/>
                        </li>
                    </ul>
                </mj-text>
                <mj-text css-class="bold">
                    Action Required
                </mj-text>
                <mj-text>
                    Please carefully review the application. There are two ways to do so, you can review using the <a href="${ui}" target="_blank" rel="nofollow">DACO Portal</a>, or download the application PDF from the 'Sign & Submit' page.
                </mj-text>
                <mj-text>
                    If you are satisfied with the details, proceed to the 'Sign & Submit' page' provide your e-signature, and click on the 'Submit Application' button to complete the review. The application will be forwarded to the Data Access Committee for further review. The applicant will receive an email notification regarding your submission.
                </mj-text>
                <mj-text>
                    If you are not satisfied with the application and would like to request revisions, click the 'Request Revisions' button. A window will open where you can enter requests. When you are done, click the 'Send Request' button to complete the review. Please do not submit the application if you requested revisions. The applicant will receive an email notification about your requests and comments, and they will update the application based on your feedback. DACO will notify you when the application is re-submitted for your review.
                </mj-text>
                <mj-text>
                    Please access the application through <a href="${ui}" target="_blank" rel="nofollow">DACO Portal</a> at your earliest convenience. If you encounter any issues or have questions, feel free to reach out, and we would be happy to assist.
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
                    Nous espérons que vous vous portez bien.
                </mj-text>
                <mj-text>
                   <b>${applicantName} vous a désigné comme représentant(e) institutionnel(le) pour la&nbsp;<a href="${ui}/application/${id}" target="_blank" rel="nofollow">demande au BCAD de la BGP</a>. La demande a été soumise et attend maintenant votre examen.</b> Veuillez vous connecter au portail BCAD en utilisant votre adresse électronique institutionnelle pour examiner la demande. Votre contribution et votre approbation dans les meilleurs délais sont essentielles pour les prochaines étapes du processus.
                </mj-text>
                <mj-text>
                    Voici les détails de la demande :
                </mj-text>
                <mj-text>
                    <ul>
                        <li>
                            Nom du candidat / de la candidate : ${applicantName} <br/>
                        </li>
                        <li>
                            Identifiant de la demande : ${id} <br/>
                        </li>
                        <li>
                            Date de soumission : ${submittedDate} <br/>
                        </li>
                    </ul>
                </mj-text>
                <mj-text css-class="bold">
                    Action requise
                </mj-text>
                <mj-text>
                    Veuillez examiner attentivement la demande. Deux options s'offrent à vous : vous pouvez effectuer la révision via le portail BCAD <a href="${ui}" target="_blank" rel="nofollow">BCAD</a>, ou télécharger le PDF de la demande depuis la page « Signer et Soumettre ».
                </mj-text>
                <mj-text>
                    Si les détails vous conviennent, accédez à la page « Signer et Soumettre », apposez votre signature électronique et cliquez sur le bouton « Soumettre la demande » pour finaliser l'examen. La demande sera alors transmise au Comité d'accès aux données pour un examen plus approfondi. Le candidat recevra une notification par courriel concernant votre soumission.
                </mj-text>
                <mj-text>
                    Si la demande ne vous satisfait pas et que vous souhaitez demander des révisions, cliquez sur le bouton « Demander des révisions ». Une fenêtre s'ouvrira pour vous permettre de saisir vos demandes. Une fois terminé, cliquez sur le bouton « Envoyer la demande » pour finaliser l'examen. Veuillez ne pas soumettre la demande si vous avez demandé des révisions. Le candidat recevra une notification par courriel concernant vos demandes et commentaires, et mettra à jour la demande en fonction de vos retours. Le BCAD vous informera lorsque la demande sera soumise de nouveau pour votre examen.
                </mj-text>
                <mj-text>
                    Veuillez accéder à la demande via <a href="${ui}" target="_blank" rel="nofollow">BCAD</a> dans les plus brefs délais. Si vous rencontrez des problèmes ou si vous avez des questions, n'hésitez pas à nous contacter. Nous serons ravis de vous aider.
                </mj-text>
                <mj-text>
                    Cordialement,<br />
                    Le Bureau de conformité de l'accès aux données (BCAD) de la BGP
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailInstitutionalRepReviewPlain = ({
	applicantName,
	repName,
	id,
	submittedDate,
}: Omit<GenerateInstitutionalRepType, 'to'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	return ` Dear ${repName},
    \n We hope this message finds you well.
    \n ${applicantName} has identified you as the Institutional Representative of their PCGL DACO application. The application has been submitted and is now awaiting your review. Please login to the DACO portal using your institutional email and review the application. Your timely input and approval are essential for the next steps in the process.
    \n Here are the details of the application:
    \n Applicant Name: ${applicantName}
    \n Application ID: ${id}
    \n Submission Date: ${submittedDate}
    \n\n Action Required
    \n Please carefully review the application. There are two ways to do so, you can review using the ${ui}, or download the application PDF from the 'Sign & Submit' page.
    \n If you are satisfied with the details, proceed to the 'Sign & Submit' page' provide your e-signature, and click on the 'Submit Application' button to complete the review. The application will be forwarded to the Data Access Committee for further review. The applicant will receive an email notification regarding your submission.
    \n If you are not satisfied with the application and would like to request revisions, click the 'Request Revisions' button. A window will open where you can enter requests. When you are done, click the 'Send Request' button to complete the review. Please do not submit the application if you requested revisions. The applicant will receive an email notification about your requests and comments, and they will update the application based on your feedback. DACO will notify you when the application is re-submitted for your review.
    \n Should you have any questions or need assistance, feel free to reach out to us.
    \n Please access the application through ${ui} at your earliest convenience. If you encounter any issues or have questions, feel free to reach out, and we would be happy to assist.
    \n Best regards, \n The PCGL Data Access Compliance Office
    \n
    \m
    \n Cher/Chère ${repName},
    \n Nous espérons que vous vous portez bien.
    \n ${applicantName} vous a désigné comme représentant(e) institutionnel(le) pour la demande au BCAD de la BGP. La demande a été soumise et attend maintenant votre examen. Veuillez vous connecter au portail BCAD en utilisant votre adresse électronique institutionnelle pour examiner la demande. Votre contribution et votre approbation dans les meilleurs délais sont essentielles pour les prochaines étapes du processus.
    \n Voici les détails de la demande :
    \n Nom du candidat / de la candidate : ${applicantName}
    \n Identifiant de la demande : ${id}
    \n Date de soumission : ${submittedDate}
    \n\n Action requise
    \n Veuillez examiner attentivement la demande. Deux options s'offrent à vous : vous pouvez effectuer la révision via le portail BCAD ${ui}, ou télécharger le PDF de la demande depuis la page « Signer et Soumettre ».
    \n Si les détails vous conviennent, accédez à la page « Signer et Soumettre », apposez votre signature électronique et cliquez sur le bouton « Soumettre la demande » pour finaliser l'examen. La demande sera alors transmise au Comité d'accès aux données pour un examen plus approfondi. Le candidat recevra une notification par courriel concernant votre soumission.
    \n Si la demande ne vous satisfait pas et que vous souhaitez demander des révisions, cliquez sur le bouton « Demander des révisions ». Une fenêtre s'ouvrira pour vous permettre de saisir vos demandes. Une fois terminé, cliquez sur le bouton « Envoyer la demande » pour finaliser l'examen. Veuillez ne pas soumettre la demande si vous avez demandé des révisions. Le candidat recevra une notification par courriel concernant vos demandes et commentaires, et mettra à jour la demande en fonction de vos retours. Le BCAD vous informera lorsque la demande sera soumise de nouveau pour votre examen.
    \n Veuillez accéder à la demande via ${ui} dans les plus brefs délais. Si vous rencontrez des problèmes ou si vous avez des questions, n'hésitez pas à nous contacter. Nous serons ravis de vous aider.
    \n Cordialement, \n Le Bureau de conformité de l'accès aux données (BCAD) de la BGP
    `;
};
