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

import { pcglColours } from '@/providers/ThemeProvider';
import { ApplicationStateValues } from '@pcgl-daco/data-model';
import { UserRole } from '@pcgl-daco/validation';
import { Flex, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { RenderIcon } from './utils/IconSelector';

const { Text } = Typography;

export type SectionMenuItemProps = {
	isCurrentSection: boolean;
	isSectionTouched?: boolean;
	isSectionValid?: boolean;
	label: string;
	isEditMode?: boolean;
	isLocked?: boolean;
	hasCollaborators?: boolean;
	appState: ApplicationStateValues;
	role: UserRole;
};

const SectionMenuItem = (props: SectionMenuItemProps) => {
	const { t: translate } = useTranslation();

	const iconColour = props.isEditMode ? pcglColours.primary : 'inherit';

	return (
		<Flex style={{ width: '100%' }} justify="space-between">
			<Text style={{ color: 'inherit' }} ellipsis>
				{translate(`menu.${props.label}`)}
			</Text>

			<Flex style={{ color: iconColour }}>{RenderIcon(props)}</Flex>
		</Flex>
	);
};

export default SectionMenuItem;
