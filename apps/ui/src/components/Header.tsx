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

import React, { useState } from 'react';

import { CloseOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, ButtonProps, ConfigProvider, Drawer, Flex, Image, Layout, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import PCGL from '@/assets/pcgl-logo-full.png';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { clearExtraSessionInformation } from '@/global/localStorage';
import { pcglHeaderTheme } from '@/providers/ThemeProvider';
import { useUserContext } from '@/providers/UserProvider';
import { API_PATH_LOGIN, API_PATH_LOGOUT } from '../api/paths';
import ApplyForAccessModal from './modals/ApplyForAccessModal';

const { Link } = Typography;
const { Header } = Layout;
const { useToken } = theme;

interface MenuItem {
	name: string;
	position: 'left' | 'right';
}

interface MenuButton extends MenuItem {
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
	const { t: translate } = useTranslation();
	const minWidth = useMinWidth();
	const { token } = useToken();
	const { isLoggedIn, role } = useUserContext();

	const isResponsiveMode = minWidth <= token.screenXL;

	const [responsiveMenuOpen, setResponsiveMenuOpen] = useState(false);
	const [applyForAccessOpen, setApplyForAccessOpen] = useState(false);

	const menuButtonStyle: React.CSSProperties = {
		width: isResponsiveMode ? '100%' : 'auto',
	};

	const buttonLinkStyle: React.CSSProperties = {
		fontWeight: 'normal',
		fontSize: token.fontSizeLG,
		justifyContent: isResponsiveMode ? 'start' : 'center',
		padding: isResponsiveMode ? '0 0' : '1rem',
	};

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
	const determineIfApplicationsShown = (): MenuLink | MenuButton | undefined => {
		if (!isLoggedIn) {
			return {
				name: translate('links.apply'),
				buttonProps: {
					style: { ...buttonLinkStyle },
					variant: 'text',
					type: 'text',
				},
				onClickAction: () => setApplyForAccessOpen(true),
				position: 'right',
				target: '_self',
			};
		} else if (role === 'DAC_MEMBER') {
			return {
				name: translate('links.manageApplications'),
				href: '/manage/applications',
				position: 'right',
				target: '_self',
			};
		} else if (role === 'APPLICANT') {
			return {
				name: translate('links.myApplications'),
				href: '/dashboard',
				position: 'right',
				target: '_self',
			};
		} else {
			return undefined;
		}
	};

	const location = useLocation();
	const isHome = location.pathname === '/';

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
		onClickAction: () => clearExtraSessionInformation(),
		buttonProps: {
			type: `${isHome ? 'default' : 'text'}`,
			color: `${isHome ? 'primary' : 'default'}`,
			variant: `${isHome ? 'solid' : 'text'}`,
			icon: !isHome ? <LogoutOutlined /> : null,
			iconPosition: 'end',
			href: API_PATH_LOGOUT,
		},
		position: 'right',
	};

	const defaultMenuItems: (MenuLink | MenuButton)[] = [
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
	];

	const menuItems = [...defaultMenuItems, determineIfApplicationsShown(), isLoggedIn ? logoutButton : loginButton];

	/**
	 * Generates the links to display in the mobile and desktop menus.
	 * @param menuItems An array containing the list of links for the menu
	 * @param position The 'side' of links you want in the menu, left (next to the logo) or right (away from the logo on the other side of the screen)
	 * @returns JSX Element array containing the link elements or `null` if the link is not shown.
	 */
	const displayMenuItems = (
		menuItems: (MenuLink | MenuButton | undefined)[],
		position: 'left' | 'right' | 'both',
	): (JSX.Element | null)[] => {
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
							style={{ ...menuButtonStyle, ...menuItem.buttonProps?.style }}
							onClick={clickAction ? () => onMenuButtonClick(clickAction) : undefined}
						>
							{menuItem.name}
						</Button>
					);
				} else {
					return (
						<Link key={`menuItem-${key}`} style={linkStyle} href={menuItem.href ?? '#'}>
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
							<Link href="/">
								<Image width={200} src={PCGL} preview={false} alt="PCGL DACO Home" />
							</Link>
							{!isResponsiveMode ? <>{displayMenuItems(menuItems, 'left')}</> : null}
						</Flex>
					</Flex>
					<Flex justify="flex-end" align="center" gap={20}>
						{!isResponsiveMode ? (
							<>{displayMenuItems(menuItems, 'right')}</>
						) : !responsiveMenuOpen ? (
							<Button type="text" aria-label="Open Menu" onClick={() => setResponsiveMenuOpen(true)}>
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
							<>{displayMenuItems(menuItems, 'both')}</>
						</Flex>
					</Drawer>
				) : null}
			</Header>
			<ApplyForAccessModal openModal={applyForAccessOpen} setOpenModal={setApplyForAccessOpen} />
		</ConfigProvider>
	);
};

export default HeaderComponent;
