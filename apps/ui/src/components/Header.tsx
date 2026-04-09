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

import { CloseOutlined, DownOutlined, MenuOutlined, UpOutlined } from '@ant-design/icons';
import { Button, ButtonProps, ConfigProvider, Drawer, Flex, Image, Layout, theme, Typography } from 'antd';
import React, { useState, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import { API_PATH_LOGIN } from '@/api/paths';
import PCGL from '@/assets/pcgl-logo-full.png';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { pcglColours, pcglHeaderTheme } from '@/providers/ThemeProvider';
import { useUserContext } from '@/providers/UserProvider';

import {
	clearLangSessionInformation,
	getLangSessionInformation,
	setLangSessionInformation,
	SupportedLangs,
} from '@/global/localStorage';
import UserInfo from './header-components/UserInfo';
import ApplyForAccessModal from './modals/ApplyForAccessModal';

const { Link } = Typography;
const { Header } = Layout;
const { useToken } = theme;

interface MenuItem {
	name: string;
	position: 'left' | 'right';
}

interface MenuButton extends PropsWithChildren<MenuItem> {
	buttonProps: ButtonProps;
	onClickAction?: VoidFunction;
}

interface MenuLink extends MenuItem {
	href: string;
	target?: '_self' | '_blank' | '_parent' | '_top';
}

const linkStyle: React.CSSProperties = {
	minWidth: 100,
	textAlign: 'center',
};

const HeaderComponent = () => {
	const { t: translate, i18n } = useTranslation();
	const minWidth = useMinWidth();
	const { token } = useToken();
	const { isLoggedIn, user } = useUserContext();
	const [isLogoutOpen, setLogoutOpen] = useState(false);
	const [isLogoutHover, setLogoutHover] = useState(false);
	const [responsiveMenuOpen, setResponsiveMenuOpen] = useState(false);
	const [applyForAccessOpen, setApplyForAccessOpen] = useState(false);
	const { lang } = getLangSessionInformation();

	const isResponsiveMode = minWidth <= token.screenXL;

	/**
	 * Default action when a button in the menu is clicked, used particularly for the mobile menu which should close after click.
	 * @param buttonAction The function for the action needed to be performed.
	 */
	const onMenuButtonClick = (buttonAction: VoidFunction) => {
		if (isResponsiveMode) {
			setResponsiveMenuOpen(false);
		}
		buttonAction();
	};

	/**
	 * Determines how the Applications Button is rendered (if at all), depending on the logged in
	 * state, and the user's role.
	 *
	 * @returns `MenuLink` | `undefined` - returns `undefined` if the user is a Institutional Rep
	 */
	const determineIfApplicationsShown = (): (MenuLink | MenuButton) | (MenuLink | MenuButton)[] => {
		if (isLoggedIn && user) {
			if (user.dacChair.length > 0 || user.dacMember.length > 0) {
				const adminButton: MenuLink = {
					name: translate('links.admin'),
					href: '/admin',
					position: 'right',
					target: '_self',
				};
				const manageButton: MenuLink = {
					name: translate('links.manageApplications'),
					href: '/manage/applications',
					position: 'right',
					target: '_self',
				};
				return user.dacoAdmin ? [adminButton, manageButton] : [manageButton];
			} else if (user.dacoAdmin) {
				return {
					name: translate('links.admin'),
					href: '/admin',
					position: 'right',
					target: '_self',
				};
			} else {
				return {
					name: translate('links.myApplications'),
					href: '/dashboard',
					position: 'right',
					target: '_self',
				};
			}
		}

		return {
			name: translate('links.apply'),
			buttonProps: {
				style: {
					fontWeight: 'normal',
					fontSize: token.fontSizeLG,
					justifyContent: isResponsiveMode ? 'start' : 'center',
					padding: isResponsiveMode ? '0 0' : '1rem',
				},
				variant: 'text',
				type: 'text',
			},
			onClickAction: () => setApplyForAccessOpen(true),
			position: 'right',
			target: '_self',
		};
	};

	const languageButton: MenuButton = {
		name: translate('button.languageToggle'),
		onClickAction: () => {
			if (lang === SupportedLangs.FRENCH) {
				clearLangSessionInformation();
				i18n.changeLanguage(SupportedLangs.ENGLISH);
			} else {
				setLangSessionInformation({ lang: SupportedLangs.FRENCH });
				i18n.changeLanguage(SupportedLangs.FRENCH);
			}
		},
		buttonProps: {
			type: 'default',
			color: 'default',
			variant: 'outlined',
			iconPosition: 'end',
		},
		position: 'right',
	};

	const loginButton: MenuButton = {
		name: translate(`button.login`),
		buttonProps: {
			type: 'default',
			color: 'primary',
			variant: 'solid',
			iconPosition: 'end',
			href: API_PATH_LOGIN,
		},
		position: 'right',
	};

	const logoutButton: MenuButton = {
		name: translate(`button.logout`),
		children: <UserInfo isLogoutOpen={isLogoutOpen} isLogoutHover={isLogoutHover} setLogoutHover={setLogoutHover} />,
		buttonProps: {
			onMouseOver: () => {
				setLogoutOpen(true);
			},
			onMouseOut: () => {
				setLogoutOpen(false);
			},
			onKeyDown: (e) => {
				if (e.key === 'Enter') {
					setLogoutOpen(!isLogoutOpen);
				}
			},
			tabIndex: 0,
			type: 'text',
			variant: 'text',
			icon: isResponsiveMode ? null : isLogoutOpen ? (
				<DownOutlined style={{ color: pcglColours.primary }} />
			) : (
				<UpOutlined style={{ color: pcglColours.primary }} />
			),
			iconPosition: 'end',
			style: {
				height: 'auto',
				justifyContent: isResponsiveMode ? 'left' : 'center',
				lineHeight: 0.5,
				padding: 0,
				textAlign: 'left',
			},
		},
		position: 'right',
	};

	/**
	 * Generates the links to display in the mobile and desktop menus.
	 * @param position The 'side' of links you want in the menu, left (next to the logo) or right (away from the logo on the other side of the screen)
	 * @returns JSX Element array containing the link elements or `null` if the link is not shown.
	 */
	const displayMenuItems = (position: 'left' | 'right' | 'both'): (JSX.Element | null)[] => {
		const userMenuItems = determineIfApplicationsShown();

		const menuItems = [
			{
				name: translate('links.policies'),
				href: '#',
				position: 'left',
			},
			{
				name: translate('links.helpGuides'),
				href: '#',
				position: 'left',
			},
			{
				name: translate('links.controlledDataUsers'),
				href: '#',
				position: 'left',
			},
			languageButton,
			...(Array.isArray(userMenuItems) ? userMenuItems : [userMenuItems]),
			isLoggedIn ? logoutButton : loginButton,
		];

		return menuItems
			.filter((menuItem) => (position !== 'both' ? menuItem?.position === position : menuItem?.position))
			.map((menuItem, key) => {
				if (!menuItem) {
					return null;
				}

				if ('buttonProps' in menuItem) {
					const clickAction = menuItem.onClickAction;
					return (
						<Button
							key={`menuItem-${key}`}
							{...(menuItem.buttonProps ?? null)}
							role="menuitem"
							style={{
								width: isResponsiveMode ? '100%' : 'auto',
								...menuItem.buttonProps?.style,
							}}
							onClick={clickAction ? () => onMenuButtonClick(clickAction) : undefined}
						>
							{menuItem.children ? menuItem.children : menuItem.name}
						</Button>
					);
				} else {
					return (
						<Link
							key={`menuItem-${key}`}
							style={linkStyle}
							href={menuItem.href ?? '#'}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									window.location.href = menuItem.href ?? '#';
								}
							}}
							role="menuitem"
						>
							{menuItem.name}
						</Link>
					);
				}
			});
	};

	return (
		<ConfigProvider theme={pcglHeaderTheme}>
			<Header
				style={{
					padding: isResponsiveMode ? '0' : token.Layout?.headerPadding,
					zIndex: 1000,
					backgroundColor: token.colorWhite,
				}}
			>
				<Flex
					role="menu"
					style={{
						padding: isResponsiveMode
							? `${token.paddingSM}px ${token.paddingSM}px ${token.paddingSM}px ${token.padding}px`
							: '0',
						height: '100%',
						width: '100%',
						zIndex: 1000,
						position: 'relative',
						backgroundColor: token.colorWhite,
					}}
					justify="center"
					align="center"
					gap={40}
				>
					<Flex flex={1}>
						<Flex justify="space-around" align="center" gap={40}>
							<Link href="/" role="menuitem">
								<Image width={200} src={PCGL} preview={false} alt="PCGL DACO Home" role="presentation" />
							</Link>
							{!isResponsiveMode ? <>{displayMenuItems('left')}</> : null}
						</Flex>
					</Flex>
					<Flex justify="flex-end" align="center" gap={20}>
						{!isResponsiveMode ? (
							<>{displayMenuItems('right')}</>
						) : !responsiveMenuOpen ? (
							<Button
								type="text"
								role="menuitem"
								aria-label="Open Menu ..."
								onClick={() => setResponsiveMenuOpen(true)}
							>
								<MenuOutlined aria-hidden />
							</Button>
						) : (
							<Button type="text" aria-label="Close Menu" onClick={() => setResponsiveMenuOpen(false)}>
								<CloseOutlined aria-hidden />
							</Button>
						)}
					</Flex>
				</Flex>
				{isResponsiveMode ? (
					<Drawer
						zIndex={998}
						height={'100%'}
						open={responsiveMenuOpen}
						title={null}
						onClose={() => setResponsiveMenuOpen(false)}
						closeIcon={null}
						placement={minWidth < token.screenMD ? 'top' : 'left'}
						width={minWidth < token.screenMD ? '100%' : '40%'}
					>
						<Flex style={{ margin: '4rem 0 0 0' }} vertical justify="top" align="flex-start" gap={token.paddingXL}>
							<>{displayMenuItems('both')}</>
						</Flex>
					</Drawer>
				) : null}
			</Header>
			<ApplyForAccessModal openModal={applyForAccessOpen} setOpenModal={setApplyForAccessOpen} />
		</ConfigProvider>
	);
};

export default HeaderComponent;
