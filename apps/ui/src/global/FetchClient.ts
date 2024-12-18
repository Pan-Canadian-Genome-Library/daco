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

/**
 * A wrapper for `fetch`, used to append the application API URL to all fetch calls.
 * @param resource This defines the resource that you wish to fetch. This can be a string or a `URL` object — that provides the URL of the resource you want to fetch. Important - prepend your request URLs with `/`
 * @param options A `RequestInit` object containing any custom settings that you want to apply to the request.
 * @returns A promise containing a `Response` object.
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
 */
async function fetchClient(resource: string | URL, options?: RequestInit): Promise<Response> {
	const applicationAPIPrefix = import.meta.env.VITE_APPLICATION_API_URL;

	if (typeof resource === 'string') {
		resource = applicationAPIPrefix + resource;
	} else if (resource instanceof URL) {
		resource.hostname = applicationAPIPrefix;
	}

	return await fetch(resource, { ...options });
}
export { fetchClient as fetch };
