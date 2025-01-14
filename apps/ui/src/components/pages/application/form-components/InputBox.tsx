import { Form, Input } from 'antd';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

import { BasicFormFieldProps } from '@/global/types';

const { Item } = Form;

interface InputBoxProps extends BasicFormFieldProps {
	subLabel?: string;
	placeHolder?: string;
}

const InputBox = <T extends FieldValues>(props: UseControllerProps<T> & InputBoxProps) => {
	return (
		<Controller
			name={props.name}
			control={props.control}
			render={({ field }) => {
				return (
					<Item label={props.label} required={props.required}>
						<Item label={props.subLabel} name={props.name as string} rules={[props.rule]}>
							<Input {...field} disabled={props.disabled} placeholder={props.placeHolder} />
						</Item>
					</Item>
				);
			}}
		/>
	);
};

export default InputBox;
