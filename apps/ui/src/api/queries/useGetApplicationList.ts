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
import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { type ApplicationDTO } from '@pcgl-daco/data-model';
import { ApplicationStateValues } from '@pcgl-daco/data-model/src/types';

export interface ApplicationListSortingOptions {
	direction: 'desc' | 'asc';
	column: 'user_id' | 'id' | 'created_at' | 'updated_at' | 'state' | 'approved_at' | 'expires_at';
}
interface ApplicationListParams {
	state?: ApplicationStateValues[];
	sort?: ApplicationListSortingOptions[];
	page?: number;
	pageSize?: number;
}

const useGetApplicationList = ({ state, sort, page, pageSize }: ApplicationListParams) => {
	const queryParams = new URLSearchParams();

	if (state && state.length) {
		queryParams.set('state', JSON.stringify(state));
	}
	if (sort && sort.length) {
		queryParams.set('sort', JSON.stringify(sort));
	}
	if (page !== undefined) {
		queryParams.set('page', page.toString());
	}
	if (pageSize !== undefined) {
		queryParams.set('pageSize', pageSize.toString());
	}

	return useQuery<ApplicationDTO[], ServerError>({
		queryKey: [queryParams],
		queryFn: async () => {
			const response = await fetch(`/applications?${queryParams.toString()}`).then(withErrorResponseHandler);

			return await response.json();
		},
	});
};

export default useGetApplicationList;
