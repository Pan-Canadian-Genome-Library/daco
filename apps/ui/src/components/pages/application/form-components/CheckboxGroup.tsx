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

import { Checkbox, Form, Row, theme, Typography } from 'antd';
import { ReactNode } from 'react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

import { BasicFormFieldProps } from '@/global/types';
import { pcglColors } from '@/providers/ThemeProvider';

const { Item } = Form;
const { useToken } = theme;
const { Text } = Typography;

export interface CheckboxGroupOptions {
	description?: string | ReactNode;
	label: string;
	value: string;
}
interface CheckboxGroup extends BasicFormFieldProps {
	gap?: number;
	options: CheckboxGroupOptions[];
}

const CheckboxGroup = <T extends FieldValues>(props: UseControllerProps<T> & CheckboxGroup) => {
	const { token } = useToken();

	return (
		<Controller
			name={props.name}
			control={props.control}
			render={({ field }) => {
				return (
					<Item
						label={props.label}
						name={`${props.name}`}
						rules={[props.rule]}
						required={props.required}
						validateTrigger="onChange"
					>
						<Checkbox.Group {...field} style={{ width: '100%', gap: props.gap ? `${props.gap}px` : token.marginSM }}>
							{props.options.map((checkbox) => (
								<Row
									key={`checkbox-${checkbox.value}`}
									style={{
										borderRadius: token.borderRadius,
										width: '100%',
										minWidth: '100%',
									}}
								>
									<Text>{checkbox.description}</Text>
									<Checkbox
										value={checkbox.value}
										disabled={props.disabled}
										style={{ width: '100%', backgroundColor: pcglColors.greyLight, padding: token.padding }}
									>
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
