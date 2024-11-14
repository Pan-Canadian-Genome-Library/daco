/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import { ConfigProvider, ThemeConfig } from 'antd';

// General Theme Configurations
const pcglTheme: ThemeConfig = {
	token: {
		fontFamily:
			"Open Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
		colorPrimary: '#C41D7F',
		colorBgContainer: '#FFF0F6',
		colorFillSecondary: '#520339',
		colorWarning: '#FADB14',
		colorSuccess: '#73D13D',
		colorLink: '#C41D7F',
		colorTextSecondary: '#ffffff',
	},
	components: {
		Button: {
			fontWeight: 700,
		},
		Typography: {
			fontSize: 18,
		},
	},
};

// Header Theme Configurations
export const pcglHeaderTheme: ThemeConfig = {
	...pcglTheme,
	token: {
		colorLink: '#000000',
		colorLinkHover: 'rgba(0,0,0,0.5)',
		colorBgContainer: '#FFFFFF',
	},
	components: {
		Layout: {
			headerBg: '#FFFFFF',
		},
	},
};

// Footer Theme Configurations
export const pcglFooterTheme: ThemeConfig = {
	components: {
		Layout: {
			footerBg: '#520339',
		},
		Typography: {
			colorText: '#FFFFFF',
			colorLink: '#FFD6E7',
			colorLinkHover: 'rgba(255, 214, 231, 0.5)',
		},
	},
};

const ThemeProvider = ({ children }: { children: React.ReactElement }) => {
	return <ConfigProvider theme={pcglTheme}>{children}</ConfigProvider>;
};

export default ThemeProvider;
