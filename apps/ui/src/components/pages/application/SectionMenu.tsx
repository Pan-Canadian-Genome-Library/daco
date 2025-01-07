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

import { Menu, MenuProps } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatch, useNavigate } from 'react-router';

import SectionMenuItem from '@/components/pages/application/SectionMenuItem';

type MenuItem = Required<MenuProps>['items'][number];

// Temporary logic
const isEdit = false;
const SectionMenu = () => {
	const navigate = useNavigate();
	const { t: translate } = useTranslation();

	// Grab current section from url
	const match = useMatch('/application/:id/:section/*');
	const currentSection = match?.params.section ?? 'intro';

	useEffect(() => {
		// if the section route is empty, navigate to intro route
		if (currentSection === 'intro') {
			navigate(`intro/${isEdit ? 'edit' : ''}`);
		}
	}, [currentSection, navigate]);

	const MenuItemList: MenuItem[] = [
		{
			key: 'intro',
			label: <SectionMenuItem label={translate('menu.intro')} />,
		},
		{
			key: 'applicant',
			label: <SectionMenuItem label={translate('menu.sectionA')} />,
		},
	];

	const handleNavigation: MenuProps['onClick'] = (e) => {
		navigate(`${e.key}/${isEdit ? 'edit' : ''}`);
	};

	return (
		<Menu
			style={{ width: '100%', minWidth: '275px', height: '100%', border: '20px' }}
			defaultSelectedKeys={[currentSection]}
			mode="inline"
			items={MenuItemList}
			onClick={handleNavigation}
		/>
	);
};

export default SectionMenu;
