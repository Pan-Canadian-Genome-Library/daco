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

import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { UploadFile } from 'antd';
import { withErrorResponseHandler } from '../apiUtils';

const useGetFile = ({ fileId }: { fileId?: number | null }) => {
	return useQuery<UploadFile[], ServerError>({
		queryKey: [`file-${fileId}`],
		enabled: !!fileId,
		queryFn: async () => {
			const response = await fetch(`/file/${fileId}`).then(withErrorResponseHandler);
			const result = await response.json();

			const formattedFile: UploadFile[] = [
				{
					uid: `${result?.id}`,
					name: `${result?.filename}`,
					status: 'done',
					url: '/', // Shows our primary link colour when retrieving the file.
					response: result,
				},
			];

			return formattedFile;
		},
	});
};

export default useGetFile;
