/* eslint-disable react-refresh/only-export-components */
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

import { ConfigProvider, notification, ThemeConfig } from 'antd';

export const pcglColors = {
	// Main Colors
	primary: '#C41D7F',
	secondary: '#520339',
	tertiary: '#FFF0F6',
	quaternary: '#FFD6E7',

	errorPrimary: '#FF4D4F',
	errorSecondary: '#FFCCC7',

	warningPrimary: '#FADB14',
	warningSecondary: '#FFFFB8',

	successPrimary: '#52C41A',
	successSecondary: '#D9F7BE',

	white: '#FFFFFF',
	offWhite: '#f0f0f0',
	black: '#000000',
	grey: '#D9D9D9',
	greyLight: '#FAFAFA',
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
		Checkbox: {
			colorBgContainer: '#fff',
		},
		Table: {
			colorBgContainer: pcglColors.white,
			headerBg: pcglColors.greyLight,
			headerSortActiveBg: pcglColors.offWhite,
			headerSortHoverBg: pcglColors.offWhite,
			rowHoverBg: 'rgba(0, 0, 0, 0.02)',
		},
		Button: {
			fontWeight: 700,
			defaultColor: pcglColors.black,
			defaultBg: pcglColors.white,
		},
		Typography: {
			fontSize: 16,
		},
		Tag: {
			colorFillSecondary: pcglColors.white,
		},
		Modal: {
			titleFontSize: 24,
			titleLineHeight: 2,
		},
		Menu: {
			// increase icon color animation change to match text color change
			motionDurationSlow: '0.1s',

			itemHoverBg: pcglColors.tertiary,
			itemHoverColor: pcglColors.primary,
			itemSelectedBg: pcglColors.primary,
			itemSelectedColor: pcglColors.white,
			colorBgTextHover: pcglColors.white,
		},
		Progress: {
			remainingColor: pcglColors.primary,
		},
		Divider: {
			colorSplit: pcglColors.grey,
			verticalMarginInline: 20,
		},
		Select: {
			colorBgContainer: pcglColors.white,
		},
		Input: {
			colorBgContainer: pcglColors.white,
		},
		Radio: {
			colorBgContainer: pcglColors.white,
		},
	},
};

// Header Theme Configurations
export const pcglHeaderTheme: ThemeConfig = {
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
			fontSize: 12,
			colorText: pcglColors.white,
			colorLink: pcglColors.quaternary,
			colorLinkHover: 'rgba(255, 214, 231, 0.5)',
		},
	},
};

//Table Themes
export const pcglTableTheme: ThemeConfig = {
	token: {
		colorBgContainer: '#fff',
	},
	components: {
		Table: {
			headerBg: '#fafafa',
			headerSortActiveBg: '#f0f0f0',
			headerSortHoverBg: '#f0f0f0',
			rowHoverBg: 'rgba(0, 0, 0, 0.02)',
		},
	},
};

export const pcglSkeletonTheme: ThemeConfig = {
	token: {
		fontFamily:
			"Open Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",

		colorPrimary: pcglColors.tertiary,
		colorFillSecondary: '#f5f5f5',
	},
};

notification.config({
	placement: 'top',
	top: 10,
	duration: 10,
});

const ThemeProvider = ({ children }: { children: React.ReactElement }) => {
	return <ConfigProvider theme={pcglTheme}>{children}</ConfigProvider>;
};

export default ThemeProvider;
