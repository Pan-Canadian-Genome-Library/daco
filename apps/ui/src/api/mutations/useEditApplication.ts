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

import { parseRevisedFields } from '@/components/pages/application/utils/validatorKeys';
import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { ApplicationContentsResponse, ApplicationResponseData } from '@pcgl-daco/data-model';
import { SectionRevision } from '@pcgl-daco/validation';
import { withErrorResponseHandler } from '../apiUtils';

const useEditApplication = () => {
	const { state, dispatch } = useApplicationContext();

	return useMutation<
		ApplicationResponseData,
		ServerError,
		{ id: number | string; update?: Partial<ApplicationContentsResponse>; revisions?: Partial<SectionRevision> }
	>({
		mutationFn: async ({ id, update, revisions }) => {
			let fields = state.fields;

			// If applications state is in revisions, then send only relevant fields in each sections
			if (
				(state.applicationState === 'DAC_REVISIONS_REQUESTED' ||
					state.applicationState === 'INSTITUTIONAL_REP_REVISION_REQUESTED') &&
				revisions
			) {
				fields = parseRevisedFields(state.fields, revisions);
			}

			const response = await fetch('/applications/edit', {
				method: 'POST',
				body: JSON.stringify({
					id,
					update: {
						...fields,
						...update,
					},
				}),
			}).then(withErrorResponseHandler);

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
