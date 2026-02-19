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

import { useQuery } from '@tanstack/react-query';

import { withErrorResponseHandler } from '@/api/apiUtils';
import { isRepUser } from '@/components/pages/application/utils/authUtils';
import { isRestrictedApplicationContentsKey } from '@/components/pages/application/utils/validatorKeys';
import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { useUserContext } from '@/providers/UserProvider';
import { type ApplicationContentsResponse, type ApplicationResponseData } from '@pcgl-daco/data-model';

const useGetApplication = (id?: string | number) => {
	const { state, dispatch } = useApplicationContext();
	const { user } = useUserContext();

	return useQuery<ApplicationResponseData, ServerError>({
		queryKey: [`application-${id}`],
		queryFn: async () => {
			const response = await fetch(`/applications/${id}`).then(withErrorResponseHandler);

			return await response.json().then((data: ApplicationResponseData) => {
				// Filter out data if they contain null values and application metadata
				if (data.contents) {
					const fields = Object.entries(data.contents).reduce((acc, item) => {
						const [key, value] = item;
						if (value !== null && isRestrictedApplicationContentsKey(key)) {
							acc[key] = value;
						}

						return acc;
					}, {} as Partial<ApplicationContentsResponse>);

					dispatch({
						type: 'UPDATE_APPLICATION',
						payload: {
							...state,
							applicationState: data.state,
							applicationUserPermissions: {
								isInstitutionalRep: isRepUser(fields.institutionalRepEmail, user),
								isDacChair: user ? user.dacChair.some((dacId) => dacId === data.dacId) : false,
								isDacMember: user ? user.dacMember.some((dacId) => dacId === data.dacId) : false,
							},
							fields,
						},
					});
				}
				return data;
			});
		},
	});
};

export default useGetApplication;
