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
import { Button, Flex, Form, theme, Typography, Upload, UploadFile } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import useEditApplication from '@/api/mutations/useEditApplication';
import useGetDownload from '@/api/queries/useGetDownload';
import useGetFile from '@/api/queries/useGetFile';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import BlockRadioBox from '@/components/pages/application/form-components/BlockRadioBox';
import SectionContent from '@/components/pages/application/SectionContent';
import SectionFooter from '@/components/pages/application/SectionFooter';
import SectionTitle from '@/components/pages/application/SectionTitle';
import { useSectionForm } from '@/components/pages/application/utils/useSectionForm';
import { ApplicationOutletContext, Nullable } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { useNotificationContext } from '@/providers/context/notification/NotificationContext';
import { FileExtensionTypes, FilesDTO } from '@pcgl-daco/data-model';

const { Text } = Typography;
const { useToken } = theme;

const rule = createSchemaFieldRule(ethicsSchema);

const MAX_FILE_SIZE = 5000000;

const Ethics = () => {
	const notification = useNotificationContext();
	const { t: translate } = useTranslation();
	const { appId, isEditMode } = useOutletContext<ApplicationOutletContext>();
	const { state, dispatch } = useApplicationContext();
	const { mutateAsync: editApplication } = useEditApplication();
	const form = useSectionForm({
		section: 'ethics',
		sectionVisited: state.formState.sectionsVisited.ethics,
	});

	const { refetch: getDownload } = useGetDownload({ fileId: state.fields.ethicsLetter });
	const { data, isLoading } = useGetFile({ fileId: state.fields.ethicsLetter });

	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const { token } = useToken();

	const { control, watch, getValues } = useForm<Nullable<EthicsSchemaType>>({
		defaultValues: {
			ethicsReviewRequired: state.fields.ethicsReviewRequired,
		},
	});
	const showFileUpload = watch('ethicsReviewRequired') !== undefined;

	// file meta data check before triggering upload process
	const beforeUpload = (file: RcFile) => {
		const isValidImage = new Set(Object.values(FileExtensionTypes)).has(file.type);

		if (!isValidImage) {
			notification.openNotification({
				type: 'error',
				message: translate('invalidFileTitle'),
			});

			return isValidImage || Upload.LIST_IGNORE;
		}

		if (file.size > MAX_FILE_SIZE) {
			notification.openNotification({
				type: 'error',
				message: translate('invalidFileSizeTitle'),
				description: translate('invalidFileSizeDescription'),
			});

			return false;
		}
	};

	// Generate download url and then remove the link after downloading
	const onDownload = async () => {
		const response = await getDownload();

		const { data: responseData } = response;

		if (!responseData) {
			return;
		}

		const bufferArray = new Uint8Array(responseData.content.data).buffer;

		const blob = new Blob([bufferArray], {
			type: 'pdf',
		});

		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;

		a.download = responseData.filename;
		document.body.appendChild(a);
		a.click();

		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const handleChange = (info: UploadChangeParam<UploadFile<FilesDTO>>) => {
		// Handle upload progress
		if (info.file.status === 'uploading') {
			setFileList(() => [
				{
					uid: `${info.file.uid}`,
					name: `${info.file.name}`,
					status: 'done',
					url: '/',
				},
			]);
			return;
		}

		if (info.file.status === 'done' && info.file.response?.id) {
			dispatch({
				type: 'UPDATE_APPLICATION',
				payload: {
					fields: {
						...state.fields,
						ethicsLetter: info.file.response.id,
					},
					formState: {
						...state.formState,
					},
				},
			});

			return;
		}
	};

	useEffect(() => {
		// Transform and update fileList when data arrives
		if (!isLoading && data) {
			setFileList(data);
		}
	}, [data, fileList.length, isLoading]);

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
						form={form}
						layout="vertical"
						onChange={() => {
							const ethicsReviewReq = getValues('ethicsReviewRequired');

							// This page should edit the backend immediately
							editApplication({
								id: appId,
								update: {
									ethicsReviewRequired: ethicsReviewReq,
								},
							}).then(() => {
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
							});
						}}
					>
						<BlockRadioBox
							label={translate('ethics-section.pleaseChoose')}
							name="ethicsReviewRequired"
							control={control}
							rule={rule}
							required
							disabled={!isEditMode}
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
												fileList={fileList}
												onPreview={onDownload} // since we have to generate a url on the frontend, need to use on preview onclick to download the file
												disabled={!isEditMode}
												onChange={handleChange}
												showUploadList={{
													showDownloadIcon: false,
													showRemoveIcon: false,
												}}
											>
												<Button type="primary" icon={<UploadOutlined />} disabled={!isEditMode}>
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
