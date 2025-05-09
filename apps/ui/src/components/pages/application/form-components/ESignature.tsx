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

import { DownloadOutlined } from '@ant-design/icons';
import { type eSignatureSchemaType } from '@pcgl-daco/validation';
import { Button, Flex, Row, theme } from 'antd';
import React, { useState, type RefObject } from 'react';
import {
	Controller,
	type FieldValues,
	type FormState,
	type UseControllerProps,
	type UseFormClearErrors,
	type UseFormReset,
	type UseFormSetValue,
	type UseFormWatch,
} from 'react-hook-form';
import SignatureCanvas from 'react-signature-canvas';

import ErrorLabel from '@/components/pages/application/form-components/labels/ErrorLabel';

interface ESignatureFormProps<T extends FieldValues> {
	setValue: UseFormSetValue<T>;
	formState: FormState<T>;
	clearErrors: UseFormClearErrors<T>;
	watch: UseFormWatch<T>;
	reset: UseFormReset<T>;
}
interface ESignatureProps {
	signatureRef: RefObject<SignatureCanvas>;
	downloadButtonText: string;
	clearButtonText: string;
	saveButtonText: string;
	disableSaveButton?: boolean;
	onSaveClicked: () => void;
	onDownloadClicked: () => void;
	disableDownloadPDF: boolean;
}

const SignatureFieldCover = ({ style }: { style: React.CSSProperties }) => {
	const { token } = theme.useToken();
	return (
		<div
			aria-hidden
			style={{
				...style,
				position: 'absolute',
				borderColor: 'transparent',
				borderRadius: style.borderRadius ? 0 : 0,
				background: token.colorTextDisabled,
				opacity: 0.1,
			}}
		/>
	);
};

const ESignature = <T extends FieldValues>(
	props: UseControllerProps<T> & ESignatureFormProps<eSignatureSchemaType> & ESignatureProps,
) => {
	const { token } = theme.useToken();

	const [signatureSaved, setSignatureSaved] = useState(false);
	const SignatureFieldStyle: React.CSSProperties = {
		height: '10rem',
		width: '100%',
		maxWidth: '900px',
		border: 'solid 2px',
		borderColor: token.colorBorder,
		borderRadius: token.borderRadius,
	};

	const {
		control,
		name,
		disabled,
		signatureRef,
		reset,
		setValue,
		clearErrors,
		disableSaveButton,
		clearButtonText,
		downloadButtonText,
		saveButtonText,
	} = props;

	const clearSignature = () => {
		reset();
		signatureRef.current?.clear();
	};

	const formatIntoBase64 = () => {
		if (signatureRef.current) {
			const dataURL = signatureRef.current.toDataURL();
			return dataURL;
		} else {
			//Something went wrong and we can't find the signature field, but this should likely never happen.
			return null;
		}
	};

	const saveSignature = () => {
		setValue('signature', formatIntoBase64());
		clearErrors(['signature']);
		setSignatureSaved(true);
		props.onSaveClicked();
	};

	const onBegin = () => {
		reset();
		setSignatureSaved(false);
		clearErrors(['signature']);
	};

	const { signature: signatureError } = props.formState.errors;

	return (
		<div>
			<Controller
				control={control}
				name={name}
				render={({ field }) => (
					<Row>
						{disabled ? <SignatureFieldCover style={SignatureFieldStyle} /> : null}
						<SignatureCanvas
							ref={signatureRef}
							onBegin={onBegin}
							onEnd={() => field.onChange(formatIntoBase64())}
							canvasProps={{
								style: SignatureFieldStyle,
							}}
						/>
						<Flex justify="space-between" style={{ width: '100%', margin: '1rem 0 0 0' }}>
							<Flex gap={token.margin}>
								<Button
									disabled={props.disableDownloadPDF}
									onClick={props.onDownloadClicked}
									icon={<DownloadOutlined />}
								>
									{downloadButtonText}
								</Button>
							</Flex>
							<Flex gap={token.margin}>
								<Button onClick={clearSignature} disabled={disabled}>
									{clearButtonText}
								</Button>
								<Button disabled={disableSaveButton || !!signatureSaved} onClick={saveSignature} type={'primary'}>
									{saveButtonText}
								</Button>
							</Flex>
						</Flex>
					</Row>
				)}
			/>

			{signatureError && <ErrorLabel text={signatureError ? signatureError.message : undefined} />}
		</div>
	);
};

export default ESignature;
