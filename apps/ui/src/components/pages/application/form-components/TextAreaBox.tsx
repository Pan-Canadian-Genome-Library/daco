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

import { ColProps, Form, Input } from 'antd';
import { ReactNode } from 'react';
import { Controller, ControllerRenderProps, FieldValues, Path, UseControllerProps } from 'react-hook-form';

import { BasicFormFieldProps } from '@/global/types';
import { WORDS } from '@pcgl-daco/validation';

const { Item } = Form;

interface TextAreaProps extends BasicFormFieldProps {
	subLabel?: string | ReactNode;
	placeHolder?: string;
	labelAlign?: 'left' | 'right';
	labelCol?: ColProps;
	showCount?: boolean;
	maxWordCount?: number;
}

const TextAreaBox = <T extends FieldValues>(props: UseControllerProps<T> & TextAreaProps) => {
	/**
	 * Renders the TextArea component, helps reduce redefining (and making mistakes with)
	 * the Input control.
	 *
	 * @param field the field attribute from `react-hook-from`
	 * @returns `ReactNode` with the input component.
	 */
	const renderControl = (field: ControllerRenderProps<T, Path<T>>) => {
		return (
			<Input.TextArea
				style={{
					height: 'auto',
				}}
				{...field}
				rows={10}
				count={{
					show: props.showCount,
					strategy: (text) => (text.length === 0 ? text.split(WORDS).length - 1 : text.split(WORDS).length),
					max: props.maxWordCount,
				}}
				disabled={props.disabled}
				placeholder={props.placeHolder}
			/>
		);
	};

	return (
		<Controller
			name={props.name}
			control={props.control}
			render={({ field }) => {
				return (
					<Item
						label={props.label}
						required={props.required}
						name={`${props.name}`}
						rules={!props.subLabel ? [props.rule] : undefined}
						labelAlign={props.labelAlign}
						labelCol={props.labelCol}
						initialValue={!props.subLabel ? field.value : undefined}
						validateTrigger="onBlur"
					>
						{props.subLabel ? (
							<Item
								label={props.subLabel}
								name={`${props.name}`}
								rules={[props.rule]}
								labelAlign={props.labelAlign}
								labelCol={props.labelCol}
								initialValue={field.value}
								validateTrigger="onBlur"
							>
								{renderControl(field)}
							</Item>
						) : (
							renderControl(field)
						)}
					</Item>
				);
			}}
		/>
	);
};

export default TextAreaBox;
