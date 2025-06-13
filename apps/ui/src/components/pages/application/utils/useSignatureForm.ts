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

import useCreateSignature from '@/api/mutations/useCreateSignature';
import { ApplicationOutletContext } from '@/global/types';
import { canSignSection } from '@/pages/applications/utils/canSignSection';
import { useUserContext } from '@/providers/UserProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignatureDTO } from '@pcgl-daco/data-model';
import { esignatureSchema, eSignatureSchemaType } from '@pcgl-daco/validation';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router';
import SignatureCanvas from 'react-signature-canvas';

type SignatureProps = {
	signatureData?: SignatureDTO;
};

// custom hook for e-signature
export const useSignatureForm = ({ signatureData }: SignatureProps) => {
	const signatureRef = useRef<SignatureCanvas>(null);
	const { mutateAsync: createSignature } = useCreateSignature();
	const { role } = useUserContext();
	const { isEditMode, appId, revisions, state } = useOutletContext<ApplicationOutletContext>();
	const form = useForm<eSignatureSchemaType>({
		resolver: zodResolver(esignatureSchema),
	});

	// Disable logic
	const { disableSignature, disableSubmit } = canSignSection({
		revisions,
		isEditMode,
		role,
		state,
		signatures: signatureData,
	});

	// Load the proper signature based off type of user
	useEffect(() => {
		if (signatureData && signatureData.applicantSignature && signatureRef.current && role === 'APPLICANT') {
			signatureRef.current.fromDataURL(signatureData.applicantSignature, {
				ratio: 1,
				width: signatureRef.current?.getCanvas().offsetWidth,
				height: signatureRef.current?.getCanvas().offsetHeight,
			});
			form.setValue('signature', signatureData.applicantSignature);
		} else if (
			signatureData &&
			signatureData.institutionalRepSignature &&
			signatureRef.current &&
			role === 'INSTITUTIONAL_REP'
		) {
			signatureRef.current.fromDataURL(signatureData.institutionalRepSignature, {
				ratio: 1,
				width: signatureRef.current?.getCanvas().offsetWidth,
				height: signatureRef.current?.getCanvas().offsetHeight,
			});
			form.setValue('signature', signatureData.institutionalRepSignature);
		}
	}, [signatureData, role, form.setValue, form]);

	// Save signature
	const onSaveClicked = async () => {
		const signature = form.getValues('signature');

		if (signature) {
			await createSignature({ applicationId: appId, signature }).then(() => {
				if (signatureRef.current) {
					signatureRef.current.clear();
				}
			});
		}
	};

	return { form, onSaveClicked, disableSignature, disableSubmit, signatureRef };
};
