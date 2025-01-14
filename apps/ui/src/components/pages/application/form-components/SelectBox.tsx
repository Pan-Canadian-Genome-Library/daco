import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

import { BasicFormFieldProps } from '@/global/types';
import { Form, Select } from 'antd';

const { Item } = Form;

interface SelectBoxProps extends BasicFormFieldProps {
	options?: never[]; // The actual data type from Select options from antd
}

const SelectBox = <T extends FieldValues>(props: UseControllerProps<T> & SelectBoxProps) => {
	return (
		<Controller
			name={props.name}
			control={props.control}
			render={({ field }) => {
				return (
					<Item label={props.label} name={props.name as string} rules={[props.rule]} required={props.required}>
						<Select {...field} disabled={props.disabled} options={props.options} />
					</Item>
				);
			}}
		/>
	);
};

export default SelectBox;
