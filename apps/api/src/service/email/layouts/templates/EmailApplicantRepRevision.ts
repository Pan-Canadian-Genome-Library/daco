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
import { GenerateApplicantRepRevisionType } from '../../types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

export const GenerateEmailApplicantRepRevision = ({
	id,
	applicantName,
	institutionalRepFirstName,
	institutionalRepLastName,
	comments,
}: Omit<GenerateApplicantRepRevisionType, 'to' | 'actionId'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	const {
		applicant_notes,
		institution_rep_notes,
		collaborators_notes,
		project_notes,
		ethics_notes,
		agreements_notes,
		appendices_notes,
		sign_and_submit_notes,
		comments: generalComments,
	} = comments;

	const template = `
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${applicantName},
                </mj-text>
                <mj-text>
                    We hope you are doing well. <br/>
                </mj-text>
                <mj-text>
                    We would like to inform you that the institutional representative ${institutionalRepFirstName} ${institutionalRepLastName} has reviewed your PCGL DACO application and has requested some revisions before the process can proceed.
                </mj-text>
                <mj-text>
                    The following revisions have been requested: <br />
                </mj-text>
                <mj-text>
                    <ol type="A">
                        <li> Applicant Information: ${applicant_notes ?? ''} </li>
                        <li> Institutional Representative: ${institution_rep_notes ?? ''} <br /> </li>
                        <li> Collaborator: ${collaborators_notes ?? ''} </li>
                        <li> Project Information: ${project_notes ?? ''} </li>
                        <li> Ethics: ${ethics_notes ?? ''} </li>
                        <li> Data Access Agreement: ${agreements_notes ?? ''} </li>
                        <li> Appendices: ${appendices_notes ?? ''} </li>
                        <li> Sign & Submit: ${sign_and_submit_notes ?? ''} </li>
                        <li> General Comments: ${generalComments ?? ''} </li>
                    </ol>
                </mj-text>
                <mj-text>
                    Please go to <a href="${ui}/application/${id}" target="_blank" rel="nofollow">your application</a> to revise the revisions. <br/>
                </mj-text>
                <mj-text>
                    Please make the necessary updates to your application and resubmit it through the <a href="${ui}" target="_blank" rel="nofollow">DACO portal</a>. If you have any questions or need clarification on the requested changes, feel free to reach out to us.<br />
                </mj-text>
                <mj-text>
                    We appreciate your attention to these revisions and your timely response. <br/><br/>
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
                    Nous espérons que vous allez bien.
                </mj-text>
                <mj-text>
                    Nous souhaitons vous informer que le/la représentant(e) institutionnel(le), ${institutionalRepFirstName} ${institutionalRepLastName}, a examiné votre demande au BCAD de la BGP et a demandé certaines révisions avant que le processus puisse se poursuivre.
                </mj-text>
                <mj-text>
                    Les révisions suivantes ont été demandées : <br />
                </mj-text>
                <mj-text>
                    <ol type="A">
                        <li> Informations sur le/la demandeur/demandeuse : ${applicant_notes ?? ''} </li>
                        <li> Représentant(e) institutionnel(le) : ${institution_rep_notes ?? ''} <br /> </li>
                        <li> Collaborateur/Collaboratrice : ${collaborators_notes ?? ''} </li>
                        <li> Informations sur le projet : ${project_notes ?? ''} </li>
                        <li> Éthique : ${ethics_notes ?? ''} </li>
                        <li> Entente d'accès aux données : ${agreements_notes ?? ''} </li>
                        <li> Annexes : ${appendices_notes ?? ''} </li>
                        <li> Signature et soumission : ${sign_and_submit_notes ?? ''} </li>
                        <li> Commentaires généraux : ${generalComments ?? ''} </li>
                    </ol>
                </mj-text>
                <mj-text>
                    Veuillez accéder à <a href="${ui}/application/${id}" target="_blank" rel="nofollow">votre demande</a> afin d'y apporter les modifications requises. <br/>
                </mj-text>
                <mj-text>
                    Merci d'effectuer les mises à jour nécessaires et de soumettre de nouveau votre demande par l'intermédiaire du <a href="${ui}" target="_blank" rel="nofollow">portail BCAD</a>. Si vous avez des questions ou avez besoin de précisions concernant les modifications demandées, n'hésitez pas à communiquer avec nous.<br />
                </mj-text>
                <mj-text>
                    Nous vous remercions de l'attention portée à ces révisions et de votre diligence à y répondre dans les meilleurs délais. <br/><br/>
                </mj-text>
                <mj-text>
                    Cordialement,<br />
                    Le Bureau de conformité de l'accès aux données de la BGP
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailApplicantRepRevisionPlain = ({
	id,
	applicantName,
	institutionalRepFirstName,
	institutionalRepLastName,
	comments,
}: Omit<GenerateApplicantRepRevisionType, 'to' | 'actionId'>) => {
	const {
		express: { ui },
	} = getEmailConfig;

	const {
		applicant_notes,
		institution_rep_notes,
		collaborators_notes,
		project_notes,
		ethics_notes,
		agreements_notes,
		appendices_notes,
		sign_and_submit_notes,
		comments: generalComments,
	} = comments;

	return ` Dear ${applicantName},
    \n We hope you are doing well.
    \n\n We would like to inform you that the Institutional Representative ${institutionalRepFirstName} ${institutionalRepLastName} has reviewed your PCGL DACO application and has requested some revisions before the process can proceed.
    \n\n The following revisions have been requested:
    \n
    \n A. Applicant Information: ${applicant_notes ?? ''}
    \n B. Institutional Representative: ${institution_rep_notes ?? ''}
    \n C. Collaborator: ${collaborators_notes ?? ''}
    \n D. Project Information: ${project_notes ?? ''}
    \n F. Ethics: ${ethics_notes ?? ''}
    \n G. Data Access Agreement: ${agreements_notes ?? ''}
    \n H. Appendices: ${appendices_notes ?? ''}
    \n I. Sign & Submit: ${sign_and_submit_notes ?? ''}
    \n J. General Comments: ${generalComments ?? ''}
    \n\n
    \n Please go to ${ui}/application/${id} to review the revisions.
    \n
    \n Please make the necessary updates to your application and resubmit it through the DACO Portal. If you have any questions or need clarification on the requested changes, feel free to reach out to us.
    \n
    \n We appreciate your attention to these revisions and your timely response.
    \n
    \n Best regards, \n The PCGL Data Access Compliance Office
    \n
    \n---
    \n
    \n Cher/Chère ${applicantName},
    \n Nous espérons que vous allez bien.
    \n\n Nous souhaitons vous informer que le/la représentant(e) institutionnel(le), ${institutionalRepFirstName} ${institutionalRepLastName}, a examiné votre demande au BCAD de la BGP et a demandé certaines révisions avant que le processus puisse se poursuivre.
    \n\n Les révisions suivantes ont été demandées :
    \n
    \n A. Informations sur le/la demandeur/demandeuse : ${applicant_notes ?? ''}
    \n B. Représentant(e) institutionnel(le) : ${institution_rep_notes ?? ''}
    \n C. Collaborateur/Collaboratrice : ${collaborators_notes ?? ''}
    \n D. Informations sur le projet : ${project_notes ?? ''}
    \n E. Étude demandée : [Note non fournie]
    \n F. Éthique : ${ethics_notes ?? ''}
    \n G. Entente d'accès aux données : ${agreements_notes ?? ''}
    \n H. Annexes : ${appendices_notes ?? ''}
    \n I. Signature et soumission : ${sign_and_submit_notes ?? ''}
    \n J. Commentaires généraux : ${generalComments ?? ''}
    \n\n
    \n Veuillez accéder à votre demande afin d'y apporter les modifications requises.
    \n
    \n Merci d'effectuer les mises à jour nécessaires et de soumettre de nouveau votre demande par l'intermédiaire du portail BCAD ${ui}/application/${id}. Si vous avez des questions ou avez besoin de précisions concernant les modifications demandées, n'hésitez pas à communiquer avec nous.
    \n
    \n Nous vous remercions de l'attention portée à ces révisions et de votre diligence à y répondre dans les meilleurs délais.
    \n
    \n Cordialement, \n Le Bureau de conformité de l'accès aux données de la BGP
    `;
};
