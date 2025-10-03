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
import { withErrorResponseHandler } from '@/api/apiUtils';
import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { useNotificationContext } from '@/providers/context/notification/NotificationContext';
import { queryClient } from '@/providers/Providers';
import { type ApplicationDTO } from '@pcgl-daco/data-model';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const useRevokeApplication = () => {
	const notification = useNotificationContext();
	const { t: translate } = useTranslation();

	return useMutation<ApplicationDTO, ServerError, { applicationId?: string | number; revokeReason?: string | null }>({
		mutationFn: async ({ applicationId, revokeReason }) => {
			const response = await fetch(`/applications/${applicationId}/revoke`, {
				method: 'POST',
				body: JSON.stringify({
					revokeReason,
				}),
			}).then(withErrorResponseHandler);

			return await response.json();
		},
		onSuccess: async (data) => {
			/**
			 * Used to invalidate our current application data to pull it fresh from the server,
			 * we need to do this to have react rerender things in edit mode correctly.
			 */
			await queryClient.refetchQueries({ queryKey: [`application-${data.id}`] }).then(() => {
				notification.openNotification({
					type: 'success',
					message: translate('modals.revokeApplication.notifications.successTitle'),
					description: translate('modals.revokeApplication.notifications.successMessage', { id: data.id }),
				});
			});
		},
		onError: () => {
			notification.openNotification({
				type: 'error',
				message: translate('modals.revokeApplication.notifications.failureTitle'),
				description: translate('modals.revokeApplication.notifications.failureMessage'),
			});
		},
	});
};

export default useRevokeApplication;
