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
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

import { BasicFormFieldProps } from '@/global/types';
import { ReactNode } from 'react';

const { Item } = Form;

interface TextAreaProps extends BasicFormFieldProps {
	subLabel?: string | ReactNode;
	placeHolder?: string;
	labelAlign?: 'left' | 'right';
	labelCol?: ColProps;
}

const TextAreaBox = <T extends FieldValues>(props: UseControllerProps<T> & TextAreaProps) => {
	return (
		<Controller
			name={props.name}
			control={props.control}
			render={({ field }) => {
				return (
					<Item
						label={props.label}
						required={props.required}
						name={props.subLabel ? undefined : (props.name as string)}
						rules={props.label ? undefined : [props.rule]}
						labelAlign={props.labelAlign ?? undefined}
						labelCol={props.labelCol ?? undefined}
					>
						<Item
							label={props.subLabel}
							name={props.name as string}
							rules={[props.rule]}
							labelAlign={props.labelAlign ?? undefined}
							labelCol={props.labelCol ?? undefined}
						>
							<Input.TextArea {...field} disabled={props.disabled} placeholder={props.placeHolder} />
						</Item>
					</Item>
				);
			}}
		/>
	);
};

export default TextAreaBox;
