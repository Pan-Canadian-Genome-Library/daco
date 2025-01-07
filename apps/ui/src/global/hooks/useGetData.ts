/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { fetch } from '../FetchClient';
import { FetchError } from '../types';

/**
 * A simplified hook to fetch data from the DACO API that handles error states.
 * @param url The URL endpoint to the DACO API
 * @returns The data or a `FetchError`
 */
export const useGetData = (url: URL | string) => {
	const [data, setData] = useState<unknown | FetchError>(undefined);
	const { t: translate } = useTranslation();

	useEffect(() => {
		fetch(url)
			.then((fetchedData) => {
				if (fetchedData.ok) {
					fetchedData.json().then((deserialized) => {
						setData(deserialized);
					});
				} else {
					switch (fetchedData.status) {
						case 404:
							setData({
								isError: true,
								statusCode: 404,
								message: translate('errors.http.404.title'),
								errors: translate('errors.http.404.message'),
							});
							break;
						default:
							setData({
								isError: true,
								statusCode: 500,
								message: translate('errors.generic.title'),
								errors: translate('errors.generic.message'),
							});
							break;
					}
				}
			})
			.catch(() => {
				setData({
					isError: true,
					message: translate('errors.fetchError.title'),
					errors: translate('errors.fetchError.message'),
				});
			});
	}, [translate, url]);
	return data;
};
