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
import { ServerError } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { ApplicationResponseData } from '@pcgl-daco/data-model';

const useEditApplication = () => {
	const { t: translate } = useTranslation();
	const { state, dispatch } = useApplicationContext();

	return useMutation<ApplicationResponseData, ServerError, { id: number | string }>({
		mutationFn: async ({ id }) => {
			const update = state?.fields;

			const response = await fetch('/applications/edit', {
				method: 'POST',
				body: JSON.stringify({
					id,
					update,
				}),
			});

			if (!response.ok) {
				const error = {
					message: translate('errors.generic.title'),
					errors: translate('errors.generic.message'),
				};

				switch (response.status) {
					case 400:
						error.message = translate('errors.fetchError.title');
						error.errors = translate('errors.fetchError.message');
						break;
				}

				throw error;
			}

			return await response.json();
		},
		onError: (error) => {
			notification.error({
				message: error.message,
			});
		},
		onSuccess: () => {
			dispatch({ type: 'UPDATE_DIRTY_STATE', payload: false });
		},
	});
};

export default useEditApplication;
