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

export const pcglColours = {
	// Main Colors
	primary: '#843961',
	secondary: '#761248',
	tertiary: '#F2EBEB',

	errorPrimary: '#EC1C24',
	errorSecondary: '#F4A1A4',
	errorBanner: '#FFF2F0',

	warningPrimary: '#FADB14',
	warningSecondary: '#FFFFB8',

	successPrimary: '#52C41A',
	successSecondary: '#D9F7BE',

	// Application States Cards Dashboard
	approved: '#95DE64',
	inProgress: `#FADB14`,
	blocked: '#F4A1A4',

	white: '#FFFFFF',
	offWhite: '#f0f0f0',
	black: '#000000',
	a11yGrey: '#757575',
	grey: '#D9D9D9',
	greyLight: '#FAFAFA',
	darkGrey: 'rgba(0, 0, 0, 0.45)',
	blue: '#2F54EB',
	lighterBlue: '#1677FF',
	geekBlue: '#F0F5FF',
};

// General Theme Configurations
const pcglTheme: ThemeConfig = {
	token: {
		fontFamily:
			"Work Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",

		colorPrimary: pcglColours.primary,
		colorFillAlter: pcglColours.white,
		colorFillSecondary: pcglColours.white,
		colorBgContainer: pcglColours.tertiary,

		// States
		colorSuccess: pcglColours.successPrimary,
		colorWarning: pcglColours.warningPrimary,
		colorError: pcglColours.errorPrimary,

		// Link styles
		colorLink: pcglColours.primary,

		// Text Styles
		colorTextSecondary: pcglColours.white,

		colorIcon: pcglColours.primary,
	},
	components: {
		Checkbox: {
			colorBgContainer: '#fff',
		},
		Table: {
			colorBgContainer: pcglColours.white,
			headerBg: pcglColours.greyLight,
			headerSortActiveBg: pcglColours.offWhite,
			headerSortHoverBg: pcglColours.offWhite,
			rowHoverBg: 'rgba(0, 0, 0, 0.02)',
		},
		Button: {
			fontWeight: 700,
			defaultColor: pcglColours.black,
			defaultBg: pcglColours.white,
		},
		Empty: {
			colorTextDescription: pcglColours.a11yGrey,
		},
		Timeline: {
			dotBorderWidth: 3,
			dotBg: pcglColours.white,
			itemPaddingBottom: 40,
			paddingXXS: 0,
			tailColor: pcglColours.primary,
			tailWidth: 4,
		},
		Typography: {
			fontSize: 16,
		},
		Tag: {
			colorFillSecondary: pcglColours.white,
		},
		Modal: {
			titleFontSize: 24,
			titleLineHeight: 2,
		},
		Menu: {
			// increase icon color animation change to match text color change
			motionDurationSlow: '0.1s',

			itemHoverBg: pcglColours.tertiary,
			itemHoverColor: pcglColours.primary,
			itemSelectedBg: pcglColours.primary,
			itemSelectedColor: pcglColours.white,
			colorBgTextHover: pcglColours.white,
		},
		Progress: {
			remainingColor: pcglColours.primary,
		},
		Divider: {
			colorSplit: pcglColours.grey,
			verticalMarginInline: 20,
		},
		Select: {
			colorBgContainer: pcglColours.white,
			multipleItemBg: pcglColours.greyLight,
			controlItemBgActive: pcglColours.white,
			colorPrimary: pcglColours.primary, // Checkmark icon color
			optionActiveBg: pcglColours.tertiary,
			optionSelectedBg: pcglColours.tertiary,
			colorTextPlaceholder: pcglColours.a11yGrey,
		},
		Input: {
			colorBgContainer: pcglColours.white,
		},
		Radio: {
			colorBgContainer: pcglColours.white,
		},
	},
};

// Header Theme Configurations
export const pcglHeaderTheme: ThemeConfig = {
	token: {
		colorLink: pcglColours.black,
		colorLinkHover: 'rgba(0,0,0,0.5)',
		colorBgContainer: pcglColours.white,
	},
	components: {
		Layout: {
			headerBg: pcglColours.white,
		},
	},
};

// Footer Theme Configurations
export const pcglFooterTheme: ThemeConfig = {
	components: {
		Layout: {
			footerBg: pcglColours.secondary,
		},
		Typography: {
			fontSize: 12,
			colorText: pcglColours.white,
			colorLink: pcglColours.white,
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
			"Work Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",

		colorPrimary: pcglColours.tertiary,
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
