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

import { ColProps, Flex, Form, Radio, Row, theme } from 'antd';
import { FormItemLayout } from 'antd/es/form/Form';
import { Controller, ControllerRenderProps, FieldValues, Path, UseControllerProps } from 'react-hook-form';

import { pcglColors } from '@/components/providers/ThemeProvider';
import { BasicFormFieldProps } from '@/global/types';
import { EthicsFileEnum } from '@pcgl-daco/validation';

const { Item } = Form;
const { useToken } = theme;

interface CheckboxValues {
	value: EthicsFileEnum;
	label: string | React.ReactElement;
}

interface InputBoxProps extends BasicFormFieldProps {
	subLabel?: string;
	placeHolder?: string;
	labelAlign?: 'left' | 'right';
	labelCol?: ColProps;
	layout?: FormItemLayout;
	options: CheckboxValues[];
}

const BlockRadioBox = <T extends FieldValues>(props: UseControllerProps<T> & InputBoxProps) => {
	const { token } = useToken();
	/**
	 * Renders the input box component. We currently use two nested labels to display certain information on the
	 * application form (see Applicant Info). But in the case where only one label is needed, we should only render
	 * one label to avoid visual and a11y issues.
	 *
	 * This function helps reduce redefining the Input field.
	 * @param field the field attribute from `react-hook-from`
	 * @returns `ReactNode` with the input component.
	 */
	const renderControl = (field: ControllerRenderProps<T, Path<T>>) => {
		return (
			<Radio.Group {...field} disabled={props.disabled}>
				<Row justify="start" gutter={[0, 10]}>
					{props.options.map((item) => {
						return (
							<Flex
								key={item.value}
								style={{
									backgroundColor: pcglColors.greyLight,
									width: '100%',
									padding: token.padding,
								}}
							>
								<Radio value={item.value}>{item.label}</Radio>
							</Flex>
						);
					})}
				</Row>
			</Radio.Group>
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
						name={props.name as string}
						labelAlign={props.labelAlign}
						rules={!props.subLabel ? [props.rule] : undefined}
						labelCol={props.labelCol}
						layout={props.layout}
					>
						{props.subLabel ? (
							<Item
								label={props.subLabel}
								name={props.name as string}
								rules={[props.rule]}
								labelAlign={props.labelAlign}
								labelCol={props.labelCol}
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

export default BlockRadioBox;
