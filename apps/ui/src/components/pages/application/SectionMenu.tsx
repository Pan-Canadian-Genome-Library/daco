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
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import useEditApplication from '@/api/useEditApplication';
import SectionMenuItem from '@/components/pages/application/SectionMenuItem';
import { ApplicationSectionRoutes } from '@/pages/AppRouter';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { VerifyFormSections, VerifyPageSectionsType, VerifySectionsTouched } from './utils/validators';

type SectionMenuProps = {
	currentSection: string;
	isEditMode: boolean;
};

const SectionMenu = ({ currentSection, isEditMode }: SectionMenuProps) => {
	const navigate = useNavigate();
	const { state } = useApplicationContext();
	const { mutate: editApplication } = useEditApplication();

	const handleNavigation: MenuProps['onClick'] = (e) => {
		if (state?.formState?.isDirty) {
			editApplication();
		}
		navigate(`${e.key}/${isEditMode ? 'edit' : ''}`);
	};

	// Check if the form on each section is valid
	const SectionValidator = useMemo(() => {
		return VerifyFormSections(state?.fields);
	}, [state]);

	// Check if the form has beed dirtied at all
	const SectionTouched = useMemo(() => {
		return VerifySectionsTouched(state?.fields);
	}, [state]);

	return (
		<Menu
			style={{ width: '100%', height: '100%' }}
			selectedKeys={[currentSection]}
			mode="inline"
			items={ApplicationSectionRoutes.map((item) => {
				const route = item.route as keyof VerifyPageSectionsType;

				return {
					key: item.route,
					label: (
						<SectionMenuItem
							isSectionTouched={SectionTouched[route]}
							isSectionValid={SectionValidator[route]}
							label={item.route}
							isEditMode={isEditMode}
						/>
					),
				};
			})}
			onClick={handleNavigation}
		/>
	);
};

export default SectionMenu;
