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
import { useTranslation } from 'react-i18next';

import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';

type FilesUpdate = {
	application_id: number;
	type: 'SIGNED_APPLICATION' | 'ETHICS_LETTER';
	submitter_user_id: string;
	submitted_at: Date;
	content: {
		data: Buffer<ArrayBufferLike>;
	};
	filename: string;
};

const useGetFile = ({ fileId }: { fileId?: number | null }) => {
	const { t: translate } = useTranslation();

	return useQuery<FilesUpdate & { id: number }, ServerError>({
		queryKey: ['file'],
		enabled: !!fileId,
		queryFn: async () => {
			const response = await fetch(`/file/${fileId}`);

			if (!response.ok) {
				const error = {
					message: translate('errors.generic.title'),
					errors: translate('errors.generic.message'),
				};

				switch (response.status) {
					case 400:
						error.message = translate('errors.http.400.title');
						error.errors = translate('errors.http.400.message');
						break;
				}

				throw error;
			}

			return await response.json();
		},
	});
};

export default useGetFile;
