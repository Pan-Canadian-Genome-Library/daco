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

import useLogout from '@/api/mutations/useLogout';
import { API_PATH_LOGOUT } from '@/api/paths';
import { useMinWidth } from '@/global/hooks/useMinWidth';
import { pcglColours } from '@/providers/ThemeProvider';
import { useUserContext } from '@/providers/UserProvider';
import { LogoutOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, theme, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
const { useToken } = theme;

interface UserInfoProps {
	isLogoutOpen: boolean;
	isLogoutHover: boolean;
	setLogoutHover: (hover: boolean) => void;
}

const UserInfo = ({ isLogoutOpen, isLogoutHover, setLogoutHover }: UserInfoProps) => {
	const minWidth = useMinWidth();
	const { user } = useUserContext();
	const { t: translate } = useTranslation();
	const { logout } = useLogout();

	const { emails = [], familyName = '', givenName = '' } = user || {};
	const displayName = givenName || familyName ? `${givenName} ${familyName}` : givenName;
	const displayEmail = emails[0]?.address;

	const { token } = useToken();
	const isResponsiveMode = minWidth <= token.screenXL;

	return (
		<Flex
			vertical
			style={{ padding: 5, width: '100%', position: 'relative', top: isLogoutOpen && !isResponsiveMode ? 5 : 0 }}
		>
			{isResponsiveMode && (
				<Divider
					style={{
						borderColor: pcglColours.secondary,
						margin: 0,
						position: 'absolute',
						top: -10,
						alignSelf: 'center',
					}}
				/>
			)}
			<Flex vertical style={{ padding: 5, width: '100%' }}>
				<Typography style={{ fontSize: 14 }}>{displayName}</Typography>
				{displayEmail && (
					<Typography
						style={{
							color: pcglColours.primary,
							fontSize: 14,
							fontWeight: 400,
							height: 20,
							margin: 0,
						}}
					>
						{displayEmail}
					</Typography>
				)}
			</Flex>
			{(isLogoutOpen || isResponsiveMode) && (
				<Flex vertical style={{ padding: 5, width: '100%' }}>
					<Button
						href={API_PATH_LOGOUT}
						onClick={() => {
							logout();
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								logout();
							}
						}}
						onMouseOver={() => {
							setLogoutHover(true);
						}}
						onMouseOut={() => {
							setLogoutHover(false);
						}}
						style={{
							backgroundColor: isResponsiveMode ? pcglColours.tertiary : pcglColours.white,
							boxShadow: '0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08)',
							fontWeight: 'normal',
							height: 45,
							justifyContent: 'left',
							left: 0,
							minWidth: 100,
							position: 'absolute',
							top: displayEmail ? 65 : 42,
							width: isResponsiveMode ? '100%' : 'calc(100% + 20px)',
						}}
						tabIndex={0}
					>
						{translate(`button.logout`)}{' '}
						<LogoutOutlined
							style={{
								color: isLogoutHover ? pcglColours.primary : pcglColours.darkGrey,
								marginLeft: 10,
							}}
						/>
					</Button>
				</Flex>
			)}
		</Flex>
	);
};

export default UserInfo;
