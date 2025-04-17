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
import { useTranslation } from 'react-i18next';

import { fetch } from '@/global/FetchClient';

import { queryClient } from '@/providers/Providers';
import { type CollaboratorUpdateRecord, type ListCollaboratorResponse } from '@pcgl-daco/data-model';

const useEditCollaborator = () => {
	const { t: translate } = useTranslation();
	return useMutation<
		ListCollaboratorResponse,
		Error,
		{
			applicationId: number | string;
			collaboratorUpdates: CollaboratorUpdateRecord;
		}
	>({
		mutationFn: async ({ applicationId, collaboratorUpdates }) => {
			const response = await fetch('/collaborators/update', {
				method: 'POST',
				body: JSON.stringify({
					applicationId,
					collaboratorUpdates,
				}),
			});

			/**
			 * OnError only triggers when an error is rethrown, this is not ideal,
			 * but it's one way we can make do with how useMutation works for our
			 * setup.
			 */
			if (!response.ok) {
				switch (response.status) {
					case 400:
						throw new Error('INVALID_REQUEST');
					case 409:
						throw new Error('DUPLICATE');
					default:
						throw new Error('SYSTEM_ERROR');
				}
			}
			return await response.json();
		},
		onError: (error) => {
			if (error.message === 'DUPLICATE') {
				notification.error({
					message: translate('collab-section.notifications.duplicate.duplicateCollaboratorTitle'),
					description: translate('collab-section.notifications.duplicate.duplicateCollaborator'),
				});
			} else {
				notification.error({
					message: translate('errors.generic.title'),
					description: translate('errors.generic.message'),
				});
			}
		},
		onSuccess: async (data) => {
			//  Update the cache if the edit collaborator request is successful to prevent refetching data
			await queryClient.setQueryData([`collaborators-${data[0]?.applicationId}`], (prev: ListCollaboratorResponse) => {
				return prev.map((value) => {
					// Replace cached value with response object
					if (value.id === data[0]?.id) {
						return data[0];
					}
					return value;
				});
			});
			notification.success({
				message: translate('collab-section.notifications.edit.successfullyUpdatedTitle'),
				description: translate('collab-section.notifications.edit.successfullyUpdated', {
					firstName: data[0]?.collaboratorFirstName,
				}),
			});
		},
	});
};

export default useEditCollaborator;
