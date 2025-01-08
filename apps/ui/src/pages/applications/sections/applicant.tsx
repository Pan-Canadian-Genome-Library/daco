/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import { zodResolver } from '@hookform/resolvers/zod';
import { Divider, Flex, Form, Input, Radio, Select, Typography } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';

import * as z from 'zod';

import ApplicationWrapper from '@/components/layouts/SectionWrapper';
import SectionFooter from '@/components/pages/application/SectionFooter';

const { Item } = Form;
const { Title } = Typography;

type FieldType = {
	firstName: string;
	suffix: string;
	randomNum: string | number;
};

const schema = z.object({
	firstName: z
		.string()
		.min(1, { message: 'Required' })
		.max(15, { message: 'First name should be less than 15 characters' }),
	suffix: z.string().min(1, { message: 'Required' }),
	randomNum: z.string(),
});

const rules = createSchemaFieldRule(schema);

/**
 * 	Main libs: react-hook-form, Zod, Antd
 *  recommended-libraries: react-hook-form-antd, antd-zod
 */

const Applicant = () => {
	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<FieldType>({
		resolver: zodResolver(schema),
	});

	const onSubmit: SubmitHandler<FieldType> = (data) => {
		console.log(data);
	};

	const onSubmitAntd = (values: unknown) => {
		console.log('antd-no-rhf: ', values);
	};

	console.log(errors);

	return (
		<ApplicationWrapper>
			<>
				{/* just react-hook-form / antd / zod  */}
				{/* If we were not to use antd or react-hook-form antd */}
				{/*Needs to utilize the <Controller/> component to interact with antd could possibly make a custom component*/}
				<Flex style={{ width: '100%' }} vertical>
					<Title level={4}>With RHF + antd-zod (RHF/antd/zod/antd-zod)</Title>
					<Form style={{ width: '100%' }} onFinish={handleSubmit(onSubmit)} layout="vertical">
						<Controller
							name="firstName"
							control={control}
							render={({ field: { onChange, value } }) => {
								return (
									<Item label="First Name" name={'firstName'} rules={[rules]}>
										<Input onChange={onChange} value={value} />
									</Item>
								);
							}}
						/>

						<input type="submit" />
					</Form>
				</Flex>

				<Divider style={{ borderColor: '#7cb305' }} />

				{/* antd / zod / antd-zod */}
				{/* antd-zod is supported and recommended on zod's official website */}
				<Flex vertical>
					<Title level={4}>No RHF (antd / zod / antd-zod)</Title>

					<Form style={{ width: '100%' }} onFinish={onSubmitAntd} layout="vertical">
						<Item label="First Name" name={'firstName'} rules={[rules]}>
							<Input />
						</Item>

						<input type="submit" />
					</Form>
				</Flex>

				{/* antd / zod / react-hook-form / react-hook-form-antd*/}
				{/* react-hook-form-antd is refered on react-hook-forms official website */}
				{/* Using different components from antd */}
				<Divider style={{ borderColor: '#7cb305' }} />
				<Flex vertical>
					<Title level={4}>With RHF + RHFA (RHF/antd/zod/react-hook-form-antd)</Title>

					<Form style={{ width: '100%' }} onFinish={handleSubmit(onSubmit)} layout="vertical">
						<FormItem control={control} name="firstName" label="firstName">
							<Input />
						</FormItem>

						<FormItem control={control} name="suffix" label="Suffix">
							<Select>
								<Select.Option value="mr">Mr</Select.Option>
								<Select.Option value="mrs">Mrs</Select.Option>
								<Select.Option value="dr">Dr</Select.Option>
							</Select>
						</FormItem>

						<FormItem control={control} name="randomNum" label="Number">
							<Radio.Group>
								<Radio value={'A'}>A</Radio>
								<Radio value={'B'}>B</Radio>
								<Radio value={'C'}>C</Radio>
								<Radio value={4}>D</Radio>
							</Radio.Group>
						</FormItem>

						<input type="submit" />
					</Form>
				</Flex>
				<SectionFooter />
			</>
		</ApplicationWrapper>
	);
};

export default Applicant;
