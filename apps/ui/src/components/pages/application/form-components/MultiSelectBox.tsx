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

import { Flex, Form, Select } from 'antd';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

import { BasicFormFieldProps } from '@/global/types';
import { CheckCircleFilled } from '@ant-design/icons';

const { Item } = Form;

interface SelectBoxProps extends BasicFormFieldProps {
	options: {
		label: string;
		value: string | number;
	}[];
	initialValue?: object | string | null;
	placeholder?: string;
}

const MultiSelectBox = <T extends FieldValues>(props: UseControllerProps<T> & SelectBoxProps) => {
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
						initialValue={props.initialValue ?? field.value}
						validateTrigger="onChange"
					>
						<Select
							{...field}
							onChange={field.onChange}
							mode="multiple"
							removeIcon
							disabled={props.disabled}
							showSearch={false}
							menuItemSelectedIcon={
								<Flex style={{ marginLeft: '10px' }}>
									<CheckCircleFilled />
								</Flex>
							}
							placeholder={props.placeholder}
						>
							{props.options.map((value) => (
								<Select.Option value={value.value} key={value.label}>
									{value.label}
								</Select.Option>
							))}
						</Select>
					</Item>
				);
			}}
		/>
	);
};

export default MultiSelectBox;
