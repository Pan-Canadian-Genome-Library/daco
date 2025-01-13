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

import { Col, Form, Input, Row, Select, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { ApplicationContext } from '@/global/types';
import { useOutletContext } from 'react-router';

const { Text } = Typography;

const Applicant = () => {
	const { t: translate } = useTranslation();
	const { isEditMode } = useOutletContext<ApplicationContext>();

	return (
		<SectionWrapper>
			<Form layout="vertical">
				<SectionTitle
					title={translate('applicant-section.title')}
					text={[translate('applicant-section.description1'), translate('applicant-section.description2')]}
				/>
				<SectionContent title={'Principal Investigator Information'}>
					<Row>
						<Col span={4}>
							<Form.Item label="Title:">
								<Select disabled={!isEditMode}>
									<Select.Option value="rapper">Rapper</Select.Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col span={12}>
							<Form.Item label="First Name:" required>
								<Input disabled={!isEditMode} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="Middle Name:">
								<Input disabled={!isEditMode} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col span={12}>
							<Form.Item label="Last Name:" required>
								<Input disabled={!isEditMode} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="Suffix:">
								<Input disabled={!isEditMode} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col span={12}>
							<Form.Item label="Primary Affiliation:" required>
								<Text style={{ fontSize: '0.75rem' }}>The legal entity responsible for this application.</Text>
								<Input disabled={!isEditMode} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col span={12}>
							<Form.Item label="Institutional Email:" required>
								<Text style={{ fontSize: '0.75rem' }}>
									Must be the institutional email address of the Principal Investigator.
								</Text>
								<Input disabled={!isEditMode} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col span={12}>
							<Form.Item label="Researcher Profile:" required>
								<Text style={{ fontSize: '0.75rem' }}>
									Please provide a link to your profile on your institution/company website.
								</Text>
								<Input disabled={!isEditMode} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={26}>
						<Col span={12}>
							<Form.Item label="Position Title:" required>
								<Input disabled={!isEditMode} />
							</Form.Item>
						</Col>
					</Row>
				</SectionContent>
				<SectionContent title="Institution/Company Mailing Address"></SectionContent>
				<SectionFooter />
			</Form>
		</SectionWrapper>
	);
};

export default Applicant;
