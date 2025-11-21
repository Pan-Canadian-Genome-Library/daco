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
import { DacCommentRecord } from '@pcgl-daco/data-model';
import { SectionRoutesValues } from '@pcgl-daco/validation';
import { withErrorResponseHandler } from '../apiUtils';

type CreateDacCommentsType = {
	applicationId: string | number;
	message: string;
	toDacChair: boolean;
	section: SectionRoutesValues;
};

const useCreateDacComments = () => {
	return useMutation<DacCommentRecord, ServerError, CreateDacCommentsType>({
		mutationFn: async ({ applicationId }) => {
			const response = await fetch(`/applications/${applicationId}/dac-member/submit-comment`, {
				method: 'POST',
			}).then(withErrorResponseHandler);

			return await response.json();
		},
		onError: (error) => {
			notification.error({
				message: error.message,
			});
		},
	});
};

export default useCreateDacComments;
