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
import { Form as AntdForm, Flex, Input } from 'antd';
import Title from 'antd/es/typography/Title';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import ApplicationWrapper from '@/components/layouts/SectionWrapper';
import SectionFooter from '@/components/pages/application/SectionFooter';

type FieldType = {
	firstName?: string;
	middleName?: string;
	lastName?: string;
	suffix?: string;
};

const schema = z.object({
	firstName: z
		.string()
		.min(1, { message: 'Required' })
		.max(15, { message: 'Username should be less than 15 characters' }),
	middleName: z.string().max(15, { message: 'Username should be less than 15 characters' }),
	lastName: z
		.string()
		.min(1, { message: 'Required' })
		.max(15, { message: 'Username should be less than 15 characters' }),
	suffix: z.string().min(1, { message: 'Required' }),
});

const Applicant = () => {
	const { handleSubmit, register } = useForm({
		defaultValues: { firstName: '', middleName: '', lastName: '', suffix: '' },
		resolver: zodResolver(schema),
	});

	return (
		<ApplicationWrapper>
			<>
				<Flex vertical>
					<Title level={2}>Applicant Information (Principal Investigator)</Title>
				</Flex>
				<Flex style={{ width: '100%' }}>
					<AntdForm
						onFinish={handleSubmit((data) => {
							console.log(data);
						})}
						style={{ width: '100%' }}
					>
						<Flex style={{ width: '100%' }}>
							<AntdForm.Item
								label="First Name"
								style={{ width: '100%' }}
								{...register('firstName', { required: true })}
							>
								<Input />
							</AntdForm.Item>

							<AntdForm.Item
								label="Middle Name"
								style={{ width: '100%' }}
								{...register('middleName', { required: true })}
							>
								<Input />
							</AntdForm.Item>
						</Flex>
						<Flex style={{ width: '100%' }}>
							<AntdForm.Item<FieldType>
								label="Last Name"
								{...register('lastName', { required: true })}
								name="lastName"
								style={{ width: '100%' }}
								rules={[{ required: true, message: 'Please input your username!' }]}
							>
								<Input />
							</AntdForm.Item>

							<input type="submit" />
						</Flex>
					</AntdForm>
				</Flex>
				<SectionFooter />
			</>
		</ApplicationWrapper>
	);
};

export default Applicant;
