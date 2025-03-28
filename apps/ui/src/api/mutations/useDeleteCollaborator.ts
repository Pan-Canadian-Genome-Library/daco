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
import { type ListCollaboratorResponse } from '@pcgl-daco/data-model';
import { withErrorResponseHandler } from '../apiUtils';

const useDeleteCollaborator = () => {
	return useMutation<
		ListCollaboratorResponse,
		ServerError,
		{ applicationId: number | string; collaboratorId: number | string }
	>({
		mutationFn: async ({ applicationId, collaboratorId }) => {
			const response = await fetch(`/collaborators/${applicationId}/${collaboratorId}`, {
				method: 'DELETE',
			}).then(withErrorResponseHandler);

			return await response.json();
		},
		onError: (error) => {
			notification.error({
				message: error.message,
			});
		},
		onSuccess: async (data) => {
			//  Update the cache if the delete collaborator request is successful to prevent refetching data
			await queryClient.setQueryData([`collaborators-${data[0]?.applicationId}`], (prev: ListCollaboratorResponse) => {
				return prev.filter((value) => value.id !== data[0]?.id);
			});
			notification.success({
				message: `User ${data[0]?.collaboratorFirstName} was deleted successfully`,
			});
		},
	});
};

export default useDeleteCollaborator;
