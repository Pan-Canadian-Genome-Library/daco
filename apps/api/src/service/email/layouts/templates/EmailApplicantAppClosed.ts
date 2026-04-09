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

import { type EmailReminderTemplateType } from '../../types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

// NOTE: verify english translations
export const GenerateEmailApplicantClosed = ({
	id,
	applicantName,
	userName,
	message,
	state,
	submittedDate,
}: EmailReminderTemplateType) => {
	const template = `
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${applicantName},
                </mj-text>
                <mj-text>
                    We are writing to inform you that your application PCGL-${id} has been closed.
                </mj-text>
                <mj-text>
                    <ul>
                        <li>
                            <b>Closed By:</b> ${userName} <br/>
                        </li>
                        <li>
                            <b>Reason for Closure:</b> ${message} <br/>
                        </li>
                        <li>
                            <b>Status Before Closure:</b> ${state} <br/>
                        </li>
                        <li>
                            <b>Time of Closure:</b> ${submittedDate} <br/>
                        </li>
                    </ul>
                </mj-text>
                <mj-text>
                    Please note that once an application is closed, it cannot be reopened and is no longer valid.
                </mj-text>
                <mj-text>
                    If you believe this application was closed by mistake or if you did not initiate the closure, please contact us as soon as possible.
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
                    Nous vous écrivons pour vous informer que votre demande PCGL-${id} a été fermée.
                </mj-text>
                <mj-text>
                    <ul>
                        <li>
                            <b>Fermée par :</b> ${userName} <br/>
                        </li>
                        <li>
                            <b>Raison de la fermeture :</b> ${message} <br/>
                        </li>
                        <li>
                            <b>Statut avant fermeture :</b> ${state} <br/>
                        </li>
                        <li>
                            <b>Moment de la fermeture :</b> ${submittedDate} <br/>
                        </li>
                    </ul>
                </mj-text>
                <mj-text>
                    Veuillez noter qu'une fois une demande fermée, elle ne peut pas être rouverte et n'est plus valide.
                </mj-text>
                <mj-text>
                    Si vous croyez que cette demande a été fermée par erreur ou si vous n'avez pas initié la fermeture, veuillez nous contacter dès que possible.
                </mj-text>
                <mj-text>
                    Cordialement,<br />
                    Le Bureau de conformité de l'accès aux données de la BGP
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailApplicantClosedPlain = ({
	id,
	applicantName,
	userName,
	message,
	state,
	submittedDate,
}: EmailReminderTemplateType) => {
	return ` Dear ${applicantName},
    \n We are writing to inform you that your application PCGL-${id} has been closed.
    \n Closed By: ${userName}
    \n Reason for Closure: ${message}
    \n Status Before Closure: ${state}
    \n Time of Closure: ${submittedDate}
    \n Please note that once an application is closed, it cannot be reopened and is no longer valid.
    \n If you believe this application was closed by mistake or if you did not initiate the closure, please contact us as soon as possible.
    \n Best regards, \n The PCGL Data Access Compliance Office
    \n
    \n---
    \n
    \n Cher/Chère ${applicantName},
    \n Nous vous écrivons pour vous informer que votre demande PCGL-${id} a été fermée.
    \n Fermée par : ${userName}
    \n Raison de la fermeture : ${message}
    \n Statut avant fermeture : ${state}
    \n Moment de la fermeture : ${submittedDate}
    \n Veuillez noter qu'une fois une demande fermée, elle ne peut pas être rouverte et n'est plus valide.
    \n Si vous croyez que cette demande a été fermée par erreur ou si vous n'avez pas initié la fermeture, veuillez nous contacter dès que possible.
    \n Cordialement, \n Le Bureau de conformité de l'accès aux données de la BGP
    `;
};
