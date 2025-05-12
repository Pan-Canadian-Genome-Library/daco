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

import { z } from 'zod';
import EnvironmentConfigError from './EnvironmentConfigError.ts';

export const emailConfigSchema = z.object({
	IS_PROD: z.string().optional().default('false'),
	PORT: z.coerce.number().optional().default(3000),
	UI_HOST: z.string().url(),
	EMAIL_HOST: z.string(),
	EMAIL_PORT: z.coerce.number().default(1025),
	EMAIL_FROM_ADDRESS: z.string().email(),
	EMAIL_FROM_NAME: z.string(),
	EMAIL_CONTACT_ADDRESS: z.string().email(),
	EMAIL_DACO_ADDRESS: z.string().email(),
	IMAGE_BASE_URL: z.string(),
	EMAIL_USER: z.string(),
	EMAIL_PASSWORD: z.string(),
});

const parseResult = emailConfigSchema.safeParse(process.env);

if (!parseResult.success) {
	throw new EnvironmentConfigError(`email`, parseResult.error);
}

export const getEmailConfig = {
	isProduction: parseResult.data.IS_PROD.toLocaleLowerCase() === 'true',
	express: {
		port: parseResult.data.PORT,
		ui: parseResult.data.UI_HOST,
	},
	email: {
		host: parseResult.data.EMAIL_HOST,
		port: parseResult.data.EMAIL_PORT,
		fromAddress: parseResult.data.EMAIL_CONTACT_ADDRESS,
		fromName: parseResult.data.EMAIL_FROM_NAME,
		contactAddress: parseResult.data.EMAIL_CONTACT_ADDRESS,
		dacAddress: parseResult.data.EMAIL_DACO_ADDRESS,
		auth: {
			user: parseResult.data.EMAIL_USER,
			password: parseResult.data.EMAIL_PASSWORD,
		},
		imageBaseUrl: parseResult.data.IMAGE_BASE_URL,
	},
};
