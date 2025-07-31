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

import useEditApplication from '@/api/mutations/useEditApplication';
import useGetCollaborators from '@/api/queries/useGetCollaborators';
import SectionMenuItem from '@/components/pages/application/SectionMenuItem';
import { VerifyFormSections, VerifySectionsTouched } from '@/components/pages/application/utils/validators';
import { ApplicationSectionRoutes } from '@/pages/AppRouter';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { ApplicationStateValues } from '@pcgl-daco/data-model';
import { SectionRevision, SectionRoutes, SectionRoutesValues } from '@pcgl-daco/validation';
import { ValidateAllSections } from './utils/validatorFunctions';

type SectionMenuProps = {
	currentSection: string;
	isEditMode: boolean;
	appId: string | number;
	revisions: Partial<SectionRevision>;
	appState: ApplicationStateValues;
};

const SectionMenu = ({ currentSection, isEditMode, appId, revisions, appState }: SectionMenuProps) => {
	const navigate = useNavigate();
	const {
		state: { fields, formState, applicationUserRole },
	} = useApplicationContext();
	const { mutate: editApplication } = useEditApplication();
	const { data, isLoading } = useGetCollaborators(appId);

	const handleNavigation: MenuProps['onClick'] = (e) => {
		if (formState.isDirty) {
			editApplication({ id: appId, revisions });
		}
		navigate(`${e.key}/${isEditMode ? 'edit' : ''}`);
	};

	// Check if the form on each section is valid
	const SectionValidator = useMemo(() => {
		return VerifyFormSections(fields);
	}, [fields]);

	// Check if the form has been dirtied at all
	const SectionTouched = useMemo(() => {
		return VerifySectionsTouched(fields);
	}, [fields]);

	/**
	 * This could be more elegant, however, this is used to determine if a section should display as locked
	 * as long as the route isApproved is not undefined, this logic works as you expect (locked when approved, unlocked when not)
	 * however, when isApproved is set to undefined (any time the app state is not in REP_REV_REQUESTED or DAC_REV_REQUESTED),
	 * AND we're not in edit mode, we want to lock everything down.
	 *
	 * @param route The `SectionRoutesValues` representing what route we're at
	 * @returns a `boolean` weather a route should be locked or not.
	 */
	const determineIfLocked = (route: SectionRoutesValues) => {
		if (route === 'intro' && isEditMode === false) {
			return true;
		} else if (revisions[route]?.isApproved !== undefined && revisions[route].isApproved === true) {
			return true;
		} else if (revisions[route]?.isApproved !== undefined && revisions[route].isApproved === false) {
			return false;
		} else if (revisions[route]?.isApproved === undefined && isEditMode === false) {
			return true;
		}

		return false;
	};

	return (
		<Menu
			style={{ width: '100%', height: '100%' }}
			selectedKeys={[currentSection]}
			mode="inline"
			items={
				!isLoading
					? ApplicationSectionRoutes.map((item) => {
							const route = item.route;

							return {
								key: item.route,
								label: (
									<SectionMenuItem
										isCurrentSection={currentSection === route}
										isSectionTouched={SectionTouched[route]}
										isSectionValid={SectionValidator[route]}
										label={item.route}
										isEditMode={isEditMode}
										isLocked={determineIfLocked(route)}
										hasCollaborators={data && data.length > 0}
										appState={appState}
										role={applicationUserRole}
									/>
								),
								disabled: route === SectionRoutes.SIGN && !ValidateAllSections(fields),
							};
						})
					: []
			}
			onClick={handleNavigation}
		/>
	);
};

export default SectionMenu;
