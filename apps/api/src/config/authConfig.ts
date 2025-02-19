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

import { z as zod } from 'zod';

import EnvironmentConfigError from './EnvironmentConfigError.js';
import { serverConfig } from './serverConfig.js';

const authConfigSchema = zod.object({
	AUTH_PROVIDER_HOST: zod.string().url(),
	AUTH_CLIENT_ID: zod.string(),
	AUTH_CLIENT_SECRET: zod.string(),
	AUTH_UI_REDIRECT_PATH: zod.string(),
});
export type AuthConfig = zod.infer<typeof authConfigSchema>;

function getAuthConfig() {
	const flag = process.env.ENABLE_AUTH;
	const enabled = flag === 'true';

	// Enforce enabling auth when running in production
	if (serverConfig.isProduction && !enabled) {
		throw new EnvironmentConfigError(
			`The application "NODE_ENV" is set to "production" while "ENABLE_AUTH" is not "true". Auth must be enabled to run in production.`,
		);
	}

	if (!enabled) {
		// Running with auth disabled may be useful for developers.
		return { enabled };
	}

	const parseResult = authConfigSchema.safeParse(process.env);

	if (!parseResult.success) {
		// Only require auth config if auth is enabled
		throw new EnvironmentConfigError(`db`, parseResult.error);
	}

	return { enabled, ...parseResult.data };
}

export const authConfig = getAuthConfig();
