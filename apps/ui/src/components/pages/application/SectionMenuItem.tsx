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

import { SectionRoutes } from '@/pages/AppRouter';
import { pcglColors } from '@/providers/ThemeProvider';
import { CheckCircleOutlined, ExclamationCircleFilled, LockOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

type SectionMenuItemProps = {
	isCurrentSection: boolean;
	isSectionTouched?: boolean;
	isSectionValid?: boolean;
	label: string;
	isEditMode?: boolean;
};

const SectionMenuItem = ({
	isCurrentSection,
	isSectionTouched,
	isSectionValid,
	label,
	isEditMode,
}: SectionMenuItemProps) => {
	const { t: translate } = useTranslation();

	/**
	 * TODO: once we are in the DAC/REP revision state in the application, add a renderIcon condition
	 */
	const renderIcon = () => {
		if (label === SectionRoutes.INTRO) {
			// do not display intro icon
			return;
		} else if (label === SectionRoutes.COLLABORATORS)
			// Collaborators is an optional field, so it will always be checkmarked
			return <CheckCircleOutlined />;
		else if (isCurrentSection && isEditMode && !isSectionValid) {
			// do not display icon if on currentpage
			return;
		} else if (!isEditMode) {
			// display lock on edit mode
			return <LockOutlined />;
		} else if (!isSectionTouched) {
			// do not display icon if the section has not been worked on
			return;
		} else if (isSectionValid) {
			// display checkmark is section is valid
			return <CheckCircleOutlined />;
		} else if (!isSectionValid) {
			// display exlamation if section is invalid and needs revisions
			return <ExclamationCircleFilled />;
		}

		return;
	};

	return (
		<Flex style={{ width: '100%' }} justify="space-between">
			<Text style={{ color: 'inherit' }} ellipsis>
				{translate(`menu.${label}`)}
			</Text>

			<Flex style={{ color: !isEditMode ? 'inherit' : pcglColors.primary }}>{renderIcon()}</Flex>
		</Flex>
	);
};

export default SectionMenuItem;
