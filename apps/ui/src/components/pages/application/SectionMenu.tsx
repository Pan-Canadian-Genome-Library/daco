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

import { Menu, MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import SectionMenuItem from '@/components/pages/application/SectionMenuItem';

type MenuItem = Required<MenuProps>['items'][number];

type SectionMenuProps = {
	currentSection: string;
	isEditMode: boolean;
};

const SectionMenu = ({ currentSection, isEditMode }: SectionMenuProps) => {
	const navigate = useNavigate();
	const { t: translate } = useTranslation();

	const MenuItemList: MenuItem[] = [
		{
			key: 'intro',
			label: <SectionMenuItem label={translate('menu.intro')} isEditMode={isEditMode} />,
		},
		{
			key: 'applicant',
			label: <SectionMenuItem label={translate('menu.applicant')} isEditMode={isEditMode} />,
		},
		{
			key: 'institutional',
			label: <SectionMenuItem label={translate('menu.institutional')} isEditMode={isEditMode} />,
		},
	];

	const handleNavigation: MenuProps['onClick'] = (e) => {
		navigate(`${e.key}/${isEditMode ? 'edit' : ''}`);
	};

	return (
		<Menu
			style={{ width: '100%', height: '100%' }}
			defaultSelectedKeys={[currentSection]}
			mode="inline"
			items={MenuItemList}
			onClick={handleNavigation}
		/>
	);
};

export default SectionMenu;
