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

import { Flex, Form, Select, type SelectProps, Typography } from 'antd';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

import { BasicFormFieldProps } from '@/global/types';
import { CheckCircleFilled } from '@ant-design/icons';
import { ReactNode } from 'react';

import { RequiredLabel } from './labels/RequiredLabel';

const { Item } = Form;
const { Text } = Typography;

interface SelectBoxProps extends BasicFormFieldProps {
	options: {
		label: string | ReactNode;
		value: string | number;
	}[];
	label: string;
	initialValue?: object | string | null;
	placeholder?: string;
	mode?: 'multiple' | 'tags';
	sublabel?: string | ReactNode;
	required?: boolean;
	filterOption?: SelectProps['filterOption'];
	showSearch?: SelectProps['showSearch'];
	allowClear?: SelectProps['allowClear'];
	tagRender?: SelectProps['tagRender'];
	removeIcon?: SelectProps['removeIcon'];
	onSelect?: SelectProps['onSelect'];
}

const SelectBox = <T extends FieldValues>(props: UseControllerProps<T> & SelectBoxProps) => {
	const {
		required,
		label,
		name,
		rule,
		control,
		initialValue,
		sublabel,
		mode,
		disabled,
		options,
		placeholder,
		tagRender,
		removeIcon,
		allowClear,
		showSearch,
		onSelect,
		filterOption,
	} = props;
	const fieldLabel = props.required ? RequiredLabel(label) : label;
	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => {
				return (
					<Item
						label={fieldLabel}
						name={`${name}`}
						rules={[rule]}
						validateTrigger="onChange"
						initialValue={initialValue ?? field.value}
					>
						<Flex vertical>
							{sublabel ? <Text style={{ fontSize: '0.75rem' }}>{sublabel}</Text> : null}
							<Select
								{...field}
								aria-label={label}
								mode={mode}
								disabled={disabled}
								options={options}
								placeholder={placeholder}
								required={required}
								menuItemSelectedIcon={
									<Flex style={{ marginLeft: '10px' }}>
										<CheckCircleFilled />
									</Flex>
								}
								tagRender={tagRender}
								removeIcon={removeIcon}
								allowClear={allowClear}
								showSearch={showSearch}
								onSelect={onSelect}
								filterOption={filterOption}
							/>
						</Flex>
					</Item>
				);
			}}
		/>
	);
};

export default SelectBox;
