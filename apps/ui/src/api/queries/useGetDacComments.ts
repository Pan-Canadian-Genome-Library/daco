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

import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { useApplicationContext } from '@/providers/context/application/ApplicationContext';
import { DacCommentRecord } from '@pcgl-daco/data-model';
import { SectionRoutesValues } from '@pcgl-daco/validation';
import { useQuery } from '@tanstack/react-query';
import { withErrorResponseHandler } from '../apiUtils';

const useGetDacComments = ({
	applicationId,
	section,
}: {
	applicationId?: string | number;
	section?: SectionRoutesValues | string;
}) => {
	const { state } = useApplicationContext();

	// Do not fetch on these states
	const preventApplicationStates =
		state.applicationState !== 'APPROVED' &&
		state.applicationState !== 'REJECTED' &&
		state.applicationState !== 'CLOSED' &&
		state.applicationState !== 'REVOKED' &&
		state.applicationState !== 'DRAFT';
	// Do not fetch if its intro section
	const preventSection = section !== 'intro';

	const shouldFetchComments = preventApplicationStates && preventSection;

	return useQuery<DacCommentRecord[], ServerError>({
		queryKey: [`comments-${applicationId}-${section}`],
		enabled: shouldFetchComments,
		queryFn: async () => {
			if (!shouldFetchComments) {
				return [];
			}
			const response = await fetch(`/applications/${applicationId}/dac/comments/${section}`, {
				method: 'GET',
			}).then(withErrorResponseHandler);

			return await response.json();
		},
	});
};

export default useGetDacComments;
