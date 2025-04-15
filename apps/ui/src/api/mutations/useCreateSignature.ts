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
import { useMutation } from '@tanstack/react-query';
import { notification } from 'antd';

import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { queryClient } from '@/providers/Providers';
import { EditSignatureResponse } from '@pcgl-daco/validation';
import { withErrorResponseHandler } from '../apiUtils';

const useCreateSignature = () => {
	return useMutation<
		EditSignatureResponse,
		ServerError,
		{ applicationId: number | string; signature: string; signee: string }
	>({
		mutationFn: async ({ applicationId, signature, signee }) => {
			const response = await fetch('/signature/sign', {
				method: 'POST',
				body: JSON.stringify({
					applicationId,
					signature,
					signee,
				}),
			}).then(withErrorResponseHandler);

			return await response.json();
		},
		onError: (error) => {
			notification.error({
				message: error.message,
			});
		},
		onSuccess: async (data) => {
			// Invalidate previous signature get request
			await queryClient.invalidateQueries({ queryKey: [`signature-${data.id}`] });
		},
	});
};

export default useCreateSignature;
