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

const pcglColors = {
	// Main Colors
	primary: '#C41D7F',
	secondary: '#520339',
	tertiary: '#FFF0F6',
	quaternary: '#FFD6E7',

	errorPrimary: '#FF4D4F',
	errorSecondary: '#FFCCC7',

	warningPrimary: '#FAAD14',
	warningSecondary: '#FFFFB8',

	successPrimary: '#52C41A',
	successSecondary: '#D9F7BE',

	white: '#FFFFFF',
	black: '#000000',
};

// General Theme Configurations
const pcglTheme: ThemeConfig = {
	token: {
		fontFamily:
			"Open Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",

		colorPrimary: pcglColors.primary,
		colorFillAlter: pcglColors.white,
		colorFillSecondary: pcglColors.secondary,
		colorBgContainer: pcglColors.tertiary,

		// States
		colorSuccess: pcglColors.successPrimary,
		colorWarning: pcglColors.warningPrimary,
		colorError: pcglColors.errorPrimary,

		// Link styles
		colorLink: pcglColors.primary,

		// Text Styles
		colorTextSecondary: pcglColors.white,

		colorIcon: pcglColors.primary,
	},
	components: {
		Button: {
			fontWeight: 700,
			defaultColor: pcglColors.black,
			defaultBg: pcglColors.white,
		},
		Typography: {
			fontSize: 16,
		},
	},
};

// Header Theme Configurations
export const pcglHeaderTheme: ThemeConfig = {
	...pcglTheme,
	token: {
		colorLink: pcglColors.black,
		colorLinkHover: 'rgba(0,0,0,0.5)',
		colorBgContainer: pcglColors.white,
	},
	components: {
		Layout: {
			headerBg: pcglColors.white,
		},
	},
};

// Footer Theme Configurations
export const pcglFooterTheme: ThemeConfig = {
	components: {
		Layout: {
			footerBg: pcglColors.secondary,
		},
		Typography: {
			colorText: pcglColors.white,
			colorLink: pcglColors.quaternary,
			colorLinkHover: 'rgba(255, 214, 231, 0.5)',
		},
	},
};

const ThemeProvider = ({ children }: { children: React.ReactElement }) => {
	return <ConfigProvider theme={pcglTheme}>{children}</ConfigProvider>;
};

export default ThemeProvider;
