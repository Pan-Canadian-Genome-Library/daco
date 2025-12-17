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

import { serverConfig } from '@/config/serverConfig.js';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * This is a fetch wrapper with a configurable retry mechanism.
 * It will retry when an error occurs based on configured retry settings.
 *
 * @param url
 * @param init
 * @returns
 */
export async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
	const { FETCH_RETRIES, FETCH_RETRY_DELAY_MS, FETCH_TIMEOUT_MS } = serverConfig;

	let attempt = 0;

	while (true) {
		try {
			const response = await fetch(url, init);

			if (response.status >= 400) {
				attempt++;
				await sleep(FETCH_RETRY_DELAY_MS);
				continue;
			}

			return response;
		} catch (error) {
			if (attempt >= FETCH_RETRIES) {
				throw error;
			}
			attempt++;
			await sleep(FETCH_TIMEOUT_MS);
		}
	}
}
