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
import { ethicsSchema, type EthicsSchemaType } from '@pcgl-daco/validation';
import { Button, Flex, Form, notification, theme, Typography, Upload, UploadFile } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import useEditApplication from '@/api/useEditApplication';
import useGetFile from '@/api/useGetFIle';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import BlockRadioBox from '@/components/pages/application/form-components/BlockRadioBox';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { ApplicationOutletContext } from '@/global/types';
import { AllowedFilesEnum, getFileType } from '@/global/utils';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { RcFile, UploadChangeParam } from 'antd/es/upload';

const { Text } = Typography;
const { useToken } = theme;

const rule = createSchemaFieldRule(ethicsSchema);

const MAX_FILE_SIZE = 5000000;

const Ethics = () => {
	const { t: translate } = useTranslation();
	const { appId, isEditMode } = useOutletContext<ApplicationOutletContext>();
	const { state, dispatch } = useApplicationContext();
	const { mutate: editApplication } = useEditApplication();
	const { data, isLoading } = useGetFile({ fileId: state.fields?.ethicsLetter });
	const { token } = useToken();

	const { control, watch, getValues } = useForm<EthicsSchemaType>({
		defaultValues: {
			ethicsReviewRequired: state.fields?.ethicsReviewRequired ?? undefined,
		},
	});

	const showFileUpload = watch('ethicsReviewRequired') !== undefined;

	// Update the state on file change
	const uploadChange = (info: UploadChangeParam<UploadFile>) => {
		if (info.file.status === 'done') {
			dispatch({
				type: 'UPDATE_APPLICATION',
				payload: {
					fields: {
						...state?.fields,
						ethicsLetter: info.file.response.id,
					},
					formState: {
						...state?.formState,
					},
				},
			});
		}
	};

	// file meta data check before triggering upload process
	const beforeUpload = (file: RcFile) => {
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
	};

	// Generate download url and then remove the link after downloading
	const onDownload = (value: UploadFile) => {
		const bufferArray = new Uint8Array(value.response.content.data).buffer;
		const fileType = getFileType(value.name);

		const blob = new Blob([bufferArray], {
			type: fileType,
		});

		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;

		a.download = value.name;
		document.body.appendChild(a);
		a.click();

		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<SectionWrapper>
			<>
				<SectionTitle
					title={translate('ethics-section.title')}
					text={[translate('ethics-section.description1'), translate('ethics-section.description2')]}
					showDivider={true}
				/>
				<SectionContent title={translate('ethics-section.approval')} showDivider={false}>
					<Form
						layout="vertical"
						onChange={() => {
							const ethicsReviewReq = getValues('ethicsReviewRequired');
							dispatch({
								type: 'UPDATE_APPLICATION',
								payload: {
									fields: {
										...state?.fields,
										ethicsReviewRequired: ethicsReviewReq,
									},
									formState: {
										...state?.formState,
									},
								},
							});
							// This page should edit the backend immediately
							editApplication({
								id: appId,
								update: {
									ethicsReviewRequired: ethicsReviewReq,
								},
							});
						}}
					>
						<BlockRadioBox
							label={translate('ethics-section.pleaseChose')}
							name="ethicsReviewRequired"
							control={control}
							rule={rule}
							required
							options={[
								{
									key: 'exemption',
									value: false,
									label: translate('ethics-section.exemptionDescription'),
								},
								{
									key: 'ethicsLetter',
									value: true,
									label: translate('ethics-section.ethicsLetterDescription'),
								},
							]}
						/>
						{/* If a radio box has been checked, then display the file upload component */}
						{showFileUpload ? (
							<Flex>
								<Form.Item
									style={{ fontWeight: 600 }}
									required
									label={translate('ethics-section.attach', {
										letter: getValues('ethicsReviewRequired') === false ? 'exemption' : 'approval',
									})}
								>
									<Flex vertical gap={'large'}>
										<Text style={{ fontSize: token.fontSize, fontWeight: 300 }}>
											{translate('ethics-section.allowedFileTypes')}
										</Text>
										{!isLoading ? (
											<Upload
												action={`${__API_PROXY_PATH__}/file/ethics/${appId}`}
												maxCount={1}
												beforeUpload={beforeUpload}
												onChange={uploadChange}
												defaultFileList={data}
												onPreview={onDownload} // since we have to generate a url on the frontend, need to use on preview onclick to download the file
											>
												<Button type="primary" icon={<UploadOutlined />}>
													{translate('button.upload')}
												</Button>
											</Upload>
										) : null}
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
