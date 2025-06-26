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

import { pcglColours } from '@/providers/ThemeProvider';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Typography, type MenuProps } from 'antd';
import { type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

interface RowCountProps {
	style?: CSSProperties;
	rowCount?: number;
	onRowsChange: (rows: number) => void;
}

const RowCount = ({ style, rowCount, onRowsChange }: RowCountProps) => {
	const { t: translate } = useTranslation();

	const items: MenuProps['items'] = [
		{
			label: '20',
			key: 20,
		},
		{
			label: '50',
			key: 50,
		},
		{
			label: '100',
			key: 100,
		},
	];

	const onItemSelect: MenuProps['onClick'] = ({ key }) => {
		onRowsChange(Number(key));
	};

	return (
		<Dropdown menu={{ items, onClick: onItemSelect }} trigger={['click']}>
			<div style={{ ...style, maxWidth: '9rem' }}>
				<Text>{translate('manage.applications.show')}&nbsp;</Text>
				<Text
					tabIndex={0}
					onClick={(e) => e.preventDefault()}
					style={{ color: pcglColours.primary, cursor: 'pointer' }}
					role="button"
				>
					{rowCount}
					&nbsp;
					<DownOutlined />
				</Text>
				<Text>&nbsp;{translate('manage.applications.rows')}</Text>
			</div>
		</Dropdown>
	);
};

export default RowCount;
