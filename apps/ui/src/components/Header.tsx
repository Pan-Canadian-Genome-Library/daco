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

import { Button, ButtonProps, ConfigProvider, Drawer, Flex, Image, Layout, Typography, theme } from 'antd';

import PCGL from '@/assets/pcgl-logo-full.png';
import { pcglHeaderTheme } from '@/components/providers/ThemeProvider';
import { Breakpoints, useMinWidth } from '@/global/hooks/useMinWidth';
import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const { Link } = Typography;
const { Header } = Layout;
const { useToken } = theme;

interface MenuLinkType {
	name: string;
	isButton?: boolean;
	buttonProps?: ButtonProps;
	onClickAction?: VoidFunction;
	href?: string;
	position: 'left' | 'right';
}

const linkStyle: React.CSSProperties = {
	minWidth: 100,
	textAlign: 'center',
};

const HeaderComponent = () => {
	const minWidth = useMinWidth();
	const isResponsiveMode = minWidth <= Breakpoints.LG;

	const { token } = useToken();

	const [responsiveMenuOpen, setResponsiveMenuOpen] = useState(false);

	const menuButtonStyle: React.CSSProperties = {
		width: isResponsiveMode ? '100%' : 'auto',
	};

	/**
	 * Default action when a button in the menu is clicked, used particularly for the mobile menu which should close after click.
	 * @param buttonAction The function for the action needed to be preformed.
	 */
	const onMenuButtonClick = (buttonAction?: VoidFunction) => {
		if (!buttonAction) {
			return;
		}
		if (isResponsiveMode) {
			setResponsiveMenuOpen(false);
			buttonAction();
		} else {
			buttonAction();
		}
	};

	const onLoginClick = () => {
		console.info('Login Clicked. Not implemented yet.');
	};

	const menuLinks: MenuLinkType[] = [
		{
			name: 'Policies & Guidelines',
			href: '#',
			position: 'left',
		},
		{
			name: 'Help Guides',
			href: '#',
			position: 'left',
		},
		{
			name: 'Controlled Data Users',
			href: '#',
			position: 'left',
		},
		{
			name: 'Apply For Access',
			href: '#',
			position: 'right',
		},
		{
			name: 'Login',
			isButton: true,
			onClickAction: onLoginClick,
			buttonProps: { color: 'primary', variant: 'solid' },
			position: 'right',
		},
	];

	/**
	 * Generates the links to display in the mobile and desktop menus.
	 * @param menuLinks An array containing the list of links for the menu
	 * @param position The 'side' of links you want in the menu, left (next to the logo) or right (away from the logo on the other side of the screen)
	 * @returns JSX Element array containing the link elements.
	 */
	const displayMenuLinks = (menuLinks: MenuLinkType[], position: 'left' | 'right' | 'both'): JSX.Element[] => {
		return menuLinks
			.filter((ml) => (position !== 'both' ? ml.position === position : ml.position))
			.map((ml) =>
				ml.isButton ? (
					<Button
						{...(ml.buttonProps ?? null)}
						style={{ ...menuButtonStyle, ...ml.buttonProps?.style }}
						onClick={() => onMenuButtonClick(ml.onClickAction)}
					>
						{ml.name}
					</Button>
				) : (
					<Link style={linkStyle} target="_blank" href={ml.href ?? '#'}>
						{ml.name}
					</Link>
				),
			);
	};

	return (
		<ConfigProvider theme={pcglHeaderTheme}>
			<Header
				style={{
					padding: isResponsiveMode ? '0' : '0 50px',
					zIndex: 1000,
					backgroundColor: token.colorWhite,
				}}
			>
				<Flex
					role="menu"
					style={{
						padding: isResponsiveMode ? '0 1rem 0 1rem' : '0',
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
							<Link target="_blank">
								<Image width={200} src={PCGL} preview={false} />
							</Link>
							{!isResponsiveMode ? <>{displayMenuLinks(menuLinks, 'left')}</> : null}
						</Flex>
					</Flex>
					<Flex justify="flex-end" align="center" gap={20}>
						{!isResponsiveMode ? (
							<>{displayMenuLinks(menuLinks, 'right')}</>
						) : !responsiveMenuOpen ? (
							<Button type="text" aria-description="Open Menu" onClick={() => setResponsiveMenuOpen(true)}>
								<MenuOutlined />
							</Button>
						) : (
							<Button type="text" aria-description="Close Menu" onClick={() => setResponsiveMenuOpen(false)}>
								<CloseOutlined />
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
						closeIcon={null}
						placement={minWidth <= Breakpoints.SM ? 'top' : 'left'}
						width={minWidth <= Breakpoints.SM ? '100%' : '40%'}
					>
						<Flex style={{ margin: '4rem 0 0 0' }} vertical justify="top" align="start" gap={'2rem'}>
							<>{displayMenuLinks(menuLinks, 'both')}</>
						</Flex>
					</Drawer>
				) : null}
			</Header>
		</ConfigProvider>
	);
};

export default HeaderComponent;
