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

import type { AcceptingApplicationsResponse, StudyDacoDTO } from '@pcgl-daco/data-model';

import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { useNotificationContext } from '@/providers/context/notification/NotificationContext';
import { queryClient } from '@/providers/Providers';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { withErrorResponseHandler } from '../apiUtils';

type ToggleStudyPayload = {
	studyId: string;
	enabled: boolean;
};

const useToggleAccptingStudies = () => {
	const { t: translate } = useTranslation();
	const notification = useNotificationContext();

	return useMutation<AcceptingApplicationsResponse, ServerError, ToggleStudyPayload>({
		mutationFn: async ({ studyId, enabled }) => {
			const response = await fetch(`/study/${studyId}/accepting-applications`, {
				method: 'PATCH',
				body: JSON.stringify({
					enabled,
				}),
			}).then(withErrorResponseHandler);

			return await response.json();
		},
		onSuccess: (data) => {
			const currentStudies = queryClient.getQueryData<StudyDacoDTO[]>([`all-studies`]);

			if (currentStudies) {
				queryClient.setQueryData<StudyDacoDTO[]>(
					['all-studies'],
					currentStudies.map((study) =>
						study.studyId === data.studyId ? { ...study, acceptingApplications: data.acceptingApplications } : study,
					),
				);
			}

			notification.openNotification({
				type: 'success',
				message: translate('notifications.toggleAcceptingStudies.successMessage', { studyId: data.studyId }),
			});
		},
	});
};

export default useToggleAccptingStudies;
