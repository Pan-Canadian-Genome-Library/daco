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

import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { eSignatureSchemaType } from '@pcgl-daco/validation';
import { Button, Flex, Row, theme } from 'antd';
import { RefObject } from 'react';
import {
	Controller,
	FieldValues,
	FormState,
	UseControllerProps,
	UseFormClearErrors,
	UseFormReset,
	UseFormSetValue,
	UseFormWatch,
} from 'react-hook-form';
import SignatureCanvas from 'react-signature-canvas';
import ErrorLabel from './labels/ErrorLabel';

interface eSignatureFormProps<T extends FieldValues> {
	setValue: UseFormSetValue<T>;
	formState: FormState<T>;
	clearErrors: UseFormClearErrors<T>;
	watch: UseFormWatch<T>;
	reset: UseFormReset<T>;
}
interface eSignatureProps {
	signatureRef: RefObject<SignatureCanvas>;
	downloadButton: string;
	previewButton: string;
	clearButton: string;
	saveButton: string;
	disableSaveButton?: boolean;
	disablePreviewButton?: boolean;
}

const ESignature = <T extends FieldValues>(
	props: UseControllerProps<T> & eSignatureFormProps<eSignatureSchemaType> & eSignatureProps,
) => {
	const { token } = theme.useToken();
	const clearSignature = () => {
		props.reset();
		props.signatureRef.current?.clear();
	};

	const formatIntoBase64 = () => {
		if (props.signatureRef.current) {
			const dataURL = props.signatureRef.current.toDataURL();
			return dataURL;
		} else {
			//Something went wrong and we can't find the signature field, but this should likely never happen.
			return null;
		}
	};

	const saveSignature = () => {
		const currentDate = new Date();
		props.setValue('createdAt', currentDate.toISOString());
		props.setValue('signature', formatIntoBase64());
		props.clearErrors(['signature', 'createdAt']);
	};

	const onBegin = () => {
		props.reset();
		props.clearErrors(['signature']);
	};

	const { signature: signatureError, createdAt: createdAtError } = props.formState.errors;

	return (
		<div>
			<Controller
				control={props.control}
				name={props.name}
				render={({ field }) => (
					<Row>
						<SignatureCanvas
							ref={props.signatureRef}
							onBegin={onBegin}
							onEnd={() => field.onChange(formatIntoBase64())}
							canvasProps={{
								style: {
									height: '10rem',
									width: '100%',
									border: 'solid 2px',
									borderColor: token.colorBorder,
									borderRadius: token.borderRadius,
								},
							}}
						/>
						<Flex justify="space-between" style={{ width: '100%', margin: '1rem 0 0 0' }}>
							<Flex gap={token.margin}>
								<Button disabled={props.disablePreviewButton} icon={<EyeOutlined />}>
									{props.previewButton}
								</Button>
								<Button icon={<DownloadOutlined />}>{props.downloadButton}</Button>
							</Flex>
							<Flex gap={token.margin}>
								<Button onClick={clearSignature}>Clear</Button>
								<Button disabled={props.disableSaveButton} onClick={saveSignature} type={'primary'}>
									{props.saveButton}
								</Button>
							</Flex>
						</Flex>
					</Row>
				)}
			/>

			{(createdAtError || signatureError) && (
				<ErrorLabel text={createdAtError ? createdAtError.message : (signatureError ?? null)} />
			)}
		</div>
	);
};

export default ESignature;
