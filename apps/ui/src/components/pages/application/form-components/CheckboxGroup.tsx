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

import { Checkbox, Form, Row, theme } from 'antd';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

import { pcglColors } from '@/components/providers/ThemeProvider';
import { BasicFormFieldProps } from '@/global/types';

const { Item } = Form;
const { useToken } = theme;

interface CheckboxGroup extends BasicFormFieldProps {
	options: {
		label: string;
		value: string;
	}[];
}

const CheckboxGroup = <T extends FieldValues>(props: UseControllerProps<T> & CheckboxGroup) => {
	const { token } = useToken();

	return (
		<Controller
			name={props.name}
			control={props.control}
			render={({ field }) => {
				return (
					<Item label={props.label} name={props.name as string} rules={[props.rule]} required={props.required}>
						<Checkbox.Group {...field} style={{ width: '100%' }}>
							{props.options.map((checkbox) => (
								<Row
									key={`checkbox-${checkbox.value}`}
									style={{
										backgroundColor: pcglColors.greyLight,
										padding: token.padding,
										borderRadius: token.borderRadius,
										width: '100%',
										minWidth: '100%',
										margin: `${token.marginXS}px 0`,
									}}
								>
									<Checkbox value={checkbox.value} disabled={props.disabled} style={{ width: '100%' }}>
										{checkbox.label}
									</Checkbox>
								</Row>
							))}
						</Checkbox.Group>
					</Item>
				);
			}}
		/>
	);
};

export default CheckboxGroup;
