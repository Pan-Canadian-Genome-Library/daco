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
import { useTranslation } from 'react-i18next';

import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';

import { useNotificationContext } from '@/providers/context/notification/NotificationContext';
import { queryClient } from '@/providers/Providers';
import { type ListCollaboratorResponse } from '@pcgl-daco/data-model';
import { CollaboratorsSchemaType } from '@pcgl-daco/validation';

const useAddCollaborator = () => {
	const { t: translate } = useTranslation();
	const notification = useNotificationContext();

	return useMutation<
		ListCollaboratorResponse,
		Error,
		{ applicationId: number | string; collaborators: CollaboratorsSchemaType[]; userId?: number | string }
	>({
		mutationFn: async ({ applicationId, collaborators }) => {
			const response = await fetch('/collaborators/create', {
				method: 'POST',
				body: JSON.stringify({
					applicationId,
					collaborators,
				}),
			});

			/**
			 * OnError only triggers when an error is rethrown, this is not ideal,
			 * but it's one way we can make do with how useMutation works for our
			 * setup.
			 */
			if (!response.ok) {
				switch (response.status) {
					case 400: {
						const error: ServerError = await response.json();
						if (error.message.includes('duplicate')) {
							throw new Error('DUPLICATE');
						}
						throw new Error('INVALID_REQUEST');
					}
					default:
						throw new Error('OTHER');
				}
			}

			return await response.json();
		},
		onSuccess: async (data) => {
			//  Update the cache if the add collaborator request is successful to prevent refetching data
			await queryClient.setQueryData([`collaborators-${data[0]?.applicationId}`], (prev: ListCollaboratorResponse) => {
				return [...prev, ...data];
			});
			notification.openNotification({
				type: 'success',
				message: translate('collab-section.notifications.added.successTitle'),
				description: translate('collab-section.notifications.added.successMessage', {
					firstName: data[0]?.collaboratorFirstName,
				}),
			});
		},
		onError: (error) => {
			if (error.message === 'DUPLICATE') {
				notification.openNotification({
					type: 'error',
					message: translate('collab-section.notifications.duplicate.duplicateTitle'),
					description: translate('collab-section.notifications.duplicate.duplicateMessage'),
				});
			} else {
				notification.openNotification({
					type: 'error',
					message: translate('errors.generic.title'),
					description: translate('errors.generic.message'),
				});
			}
		},
	});
};

export default useAddCollaborator;
