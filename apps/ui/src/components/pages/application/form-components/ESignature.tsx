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
import { Button, Flex, Row, theme } from 'antd';
import { RefObject } from 'react';
import { Control, Controller } from 'react-hook-form';
import SignatureCanvas from 'react-signature-canvas';
import { z } from 'zod';

const E_SIGNATURE_BOX_COLORS = ['GREEN', 'GREY'] as const;

export const ESignatureCardColor = z.enum(E_SIGNATURE_BOX_COLORS);

interface eSignatureButtons {}
interface eSignatureProps {
	signatureRef: RefObject<SignatureCanvas>;
	name: string;
	control: Control;
	downloadButton: string;
	previewButton: string;
	clearButton: string;
	saveButton: string;
	rules: any;
	formState: any;
	values: [Function, Function];
}

const ESignature = ({
	signatureRef,
	name,
	control,
	rules,
	values,
	formState,
	downloadButton,
	previewButton,
	clearButton,
	saveButton,
}: eSignatureProps) => {
	// const { control, formState, setValue, watch, clearErrors } = useFormContext();

	const { token } = theme.useToken();
	const [getValue, setValue] = values;
	const clearSignature = () => {
		signatureRef.current?.clear();
	};

	const formatIntoBase64 = () => {
		if (signatureRef.current) {
			const dataURL = signatureRef.current.toDataURL();
			return dataURL;
		}
	};

	const saveSignature = () => {
		const currentDate = new Date();
		setValue('createdAt', currentDate.toISOString());
		setValue('signature', formatIntoBase64());
		clearErrors(['signature', 'createdAt']);
	};

	// const watchCreatedAt = watch('createdAt');

	const onBegin = () => setValue('createdAt', undefined);

	console.log(formState.errors);

	return (
		<div>
			<Controller
				control={control}
				name={name}
				rules={rules}
				render={({ field }) => (
					<Row>
						<SignatureCanvas
							ref={signatureRef}
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
								<Button icon={<EyeOutlined />}>View Preview</Button>
								<Button icon={<DownloadOutlined />}>Download PDF</Button>
							</Flex>
							<Flex gap={token.margin}>
								<Button onClick={clearSignature}>Clear</Button>
								<Button type={'primary'}>Save</Button>
							</Flex>
						</Flex>
					</Row>
				)}
			/>

			{/* <div className={styles.nameDate}>
				<div>{signeeName}</div>
				{watchCreatedAt && <div>{new Date(watchCreatedAt).toLocaleDateString('en-US')}</div>}
			</div>

			<div className={styles.buttons}>
				<Button variant={'secondary'} onClick={clearSignature}>
					{clearText}
				</Button>
				<Button disabled={disableSaveButton} variant={'primary'} onClick={saveSignature}>
					{saveText}
				</Button>
			</div> */}

			{/* {(createdAtError || signatureError) && <div>Error</div>} */}
		</div>
	);
};

export default ESignature;
