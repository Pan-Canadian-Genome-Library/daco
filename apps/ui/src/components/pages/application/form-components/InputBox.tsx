import { Form, Input } from 'antd';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

import { BasicFormFieldProps } from '@/global/types';

const { Item } = Form;

const InputBox = <T extends FieldValues>(props: UseControllerProps<T> & BasicFormFieldProps) => {
	return (
		<Controller
			name={props.name}
			control={props.control}
			render={({ field }) => {
				return (
					<Item label={props.label} name={props.name as string} required={props.required} rules={[props.rule]}>
						<Input {...field} />
					</Item>
				);
			}}
		/>
	);
};

export default InputBox;
