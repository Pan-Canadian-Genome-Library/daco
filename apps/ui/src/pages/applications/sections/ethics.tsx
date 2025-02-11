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

import { UploadOutlined } from '@ant-design/icons';
import { EthicsFileEnum, ethicsSchema, type EthicsSchemaType } from '@pcgl-daco/validation';
import { Button, Flex, Form, notification, theme, Typography, Upload, UploadProps } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import BlockRadioBox from '@/components/pages/application/form-components/BlockRadioBox';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { ApplicationOutletContext } from '@/global/types';

const { Text } = Typography;
const { useToken } = theme;

const rule = createSchemaFieldRule(ethicsSchema);

enum AllowedFilesEnum {
	PDF = 'application/pdf',
	DOC = 'application/msword',
	DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

const MAX_FILE_SIZE = 5000000;

const Ethics = () => {
	const { t: translate } = useTranslation();
	const { isEditMode } = useOutletContext<ApplicationOutletContext>();
	const { control, watch } = useForm<EthicsSchemaType>({});
	const { token } = useToken();

	const showFileUpload = watch('ethicsApproval');

	// File Upload configuration
	const uploadFile: UploadProps = {
		action: 'https://www.localhost:3000',
		maxCount: 1,
		showUploadList: {
			showDownloadIcon: true,
			downloadIcon: 'Download',
		},
		beforeUpload: (file) => {
			const isValidImage = new Set(Object.values(AllowedFilesEnum)).has(file.type as AllowedFilesEnum);

			if (!isValidImage) {
				notification.error({
					message: translate('invalidFileTitle'),
				});
				return isValidImage || Upload.LIST_IGNORE;
			}

			if (file.size > MAX_FILE_SIZE) {
				notification.error({
					message: translate('invalidFileSizeTitle'),
					description: translate('invalidFileSizeDescription'),
				});
				return false;
			}
		},
		onChange: (info) => {
			// Add file data to the rhf here, once the file upload is complete.
		},
	};

	return (
		<SectionWrapper>
			<>
				<SectionTitle
					title={translate('ethics-section.title')}
					text={[translate('ethics-section.description1'), translate('ethics-section.description2')]}
					showDivider={true}
				/>
				<SectionContent title={translate('ethics-section.approval')}>
					<Form layout="vertical">
						<BlockRadioBox
							label={translate('ethics-section.pleaseChose')}
							name="ethicsApproval"
							control={control}
							rule={rule}
							required
							options={[
								{
									value: EthicsFileEnum.EXEMPTION,
									label: translate('ethics-section.exemptionDescription'),
								},
								{
									value: EthicsFileEnum.ETHICS_LETTER,
									label: translate('ethics-section.ethicsLetterDescription'),
								},
							]}
						/>
						{/* If a radio box has been checked, then display the file upload component */}
						{showFileUpload ? (
							<Flex>
								<Form.Item style={{ fontWeight: 600 }} required label={translate('ethics-section.attach')}>
									<Flex vertical gap={'large'}>
										<Text style={{ fontSize: token.fontSize, fontWeight: 300 }}>
											{translate('ethics-section.allowedFileTypes')}
										</Text>
										<Upload {...uploadFile}>
											<Button type="primary" icon={<UploadOutlined />}>
												{translate('button.upload')}
											</Button>
										</Upload>
									</Flex>
								</Form.Item>
							</Flex>
						) : null}
					</Form>
				</SectionContent>
				<SectionFooter currentRoute="ethics" isEditMode={isEditMode} />
			</>
		</SectionWrapper>
	);
};

export default Ethics;
