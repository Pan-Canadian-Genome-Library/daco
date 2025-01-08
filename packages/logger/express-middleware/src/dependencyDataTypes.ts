/*
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
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

import { RecursivePartial } from '@pcgl-daco/logging-types/common';

/*
 * The types here are hints to help us format the data returned by the express-request-logger middleware.
 *
 * The actual contents appear to closely match the Express Request and Response types, without any functions.
 * These are put together from observing the default log info objects.
 *
 * Every property is made optional with RecursivePartial to make sure that developers always check for existence before using them.
 */
//

export type MiddlewareResponse = RecursivePartial<{
	status_code?: number;
	timestamp?: string; // ISO formatted date
	timestamp_ms: number;
	elapsed: number; // duration of request handler in ms
	headers: Record<string, string>;
	body: string; // "N/A" when no message, stringified JSON when there is a response object
}>;

export type MiddlewareRequest = RecursivePartial<{
	method: string;
	url_params: Record<string, string> | string; // "N/A" when no params
	url: string;
	url_route: string;
	headers: Record<string, string>;
	query: Record<string, string>;
	timestamp: string; // ISO formatted date
	timestamp_ms: number;
	body: string; // "N/A" when no message, stringified JSON when there is a response object
}>;

export type MiddlewareData = RecursivePartial<{
	response?: MiddlewareResponse;
	request?: MiddlewareRequest;

	// Unknown meaning, questionable usefulness
	'millis-timestamp': number;
	'utc-timestamp': string; // ISO formatted date
	stage: string;
}>;
