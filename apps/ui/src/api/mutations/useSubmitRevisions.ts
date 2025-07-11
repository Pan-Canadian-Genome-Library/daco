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
import { useNavigate } from 'react-router';

const useSubmitRevisions = () => {
	const navigation = useNavigate();
	const notification = useNotificationContext();
	const { t: translate } = useTranslation();

	return useMutation<ApplicationDTO, ServerError, { applicationId?: string | number }>({
		mutationFn: async ({ applicationId }) => {
			const response = await fetch(`/applications/${applicationId}/submit-revisions`, {
				method: 'POST',
			}).then(withErrorResponseHandler);

			return await response.json();
		},
		onSuccess: async (data) => {
			notification.openNotification({
				type: 'success',
				message: translate('sign-and-submit-section.notifications.submitApplicationWithRevisionsSuccess'),
			});
			// Invalidate previous application data
			await queryClient.invalidateQueries({ queryKey: [`application-${data.id}`] });
			navigation(`/dashboard`);
		},
		onError: () => {
			notification.openNotification({
				type: 'error',
				message: translate('sign-and-submit-section.notifications.submitApplicationFailed'),
			});
		},
	});
};

export default useSubmitRevisions;
