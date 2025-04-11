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

import { GenerateInstitutionalRepType } from '../../types.ts';
import { basicLayout } from '../renderBaseHtml.ts';

// TODO: english and french translations
export const GenerateEmailInstitutionalRepReview = ({
	applicantName,
	repName,
}: Omit<GenerateInstitutionalRepType, 'to'>) => {
	const template = `  
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${repName},
                </mj-text>
                <mj-text>
                    We hope this message finds you well.
                </mj-text>
                <mj-text>
                    A new PCGL <a href="" target="_blank" rel="nofollow">DACO application</a> has been submitted and is now awaiting your review. Please login to the DACO portal using your institutional email and review the application. Your timely input and approval are essential for the next steps in the process.
                </mj-text>
                <mj-text>
                    Here are the details of the application: <br/>
                </mj-text>
                <mj-text>
                    Best regards,<br />
                    The PCGL Data Access Compliance Office
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};

export const GenerateEmailInstitutionalRepReviewPlain = ({ repName }: Omit<GenerateInstitutionalRepType, 'to'>) => {
	return ` Dear ${repName},
    \n I am pleased to inform you that your DACO application has been successfully approved by the PCGL Data Access Committee. 
    \n Should you have any questions or need assistance, feel free to reach out to us. 
    \n Best regards, \n The PCGL Data Access Compliance Office 
    `;
};
