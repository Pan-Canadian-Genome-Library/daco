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

import mjml2html from 'mjml';

export const basicLayout = ({ body }: { body?: string; lang?: string }) => {
	const template = mjml2html(
		`<mjml>
			<mj-head>
				<mj-include path="./head.mjml" />
				<mj-include path="./styles.mjml" />
			</mj-head>
			<mj-body background-color="lightgrey">
			${HeaderRender()}
			<mj-wrapper mj-class="section-background">
				<mj-section css-class="main-content">
					${body}
				</mj-section>
			</mj-wrapper>
			${FooterRender()}
			</mj-body>
		</mjml>`,
		{ filePath: './src/service/email/layouts/mjml' },
	);

	return template;
};

const HeaderRender = () => {
	return `
		<mj-wrapper mj-class="header-background">
			<mj-section>
				<mj-column css-class="logo-wrapper">
				<mj-image css-class="logo" src="cid:PCGL_LOGO" alt="PCGL-LOGO" />
				</mj-column>
			</mj-section>
		</mj-wrapper>
	`;
};

const FooterRender = () => {
	return `
		<mj-wrapper mj-class="footer-background">
			<mj-section>
				<mj-column css-class="footer-wrapper">
				<mj-text css-class="footer-text">© 2024 PCGL DACO. All rights reserved. |<a href="" target="_blank"> Privacy Policy </a>
					| <a href="" target="_blank">Terms and Conditions </a>
				</mj-text>
				</mj-column>
			</mj-section>
		</mj-wrapper>
	`;
};
