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

/**
 * Checks if a required config value is defined.
 * If the val is present, the val is returned. If the val is null, undefined or an empty string, an error is thrown.
 *
 * @param val value being checked
 * @param configType AppConfig or AuthConfig
 * @param keyName string path of config value
 * @returns val
 */
export function checkConfigValueIsDefined<T>(
	val: T | undefined | null,
	configType: 'AppConfig' | 'AuthConfig',
	keyName: string,
): T {
	if (val === undefined || val === null || val === '') {
		throw new Error(
			`A required configuration value is missing for [${configType}]. No value is provided for [${keyName}].`,
		);
	}
	return val;
}

/**
 * Synchronous function to retrieve static config values from process.env
 * Intended for use in non-async functions that require config values (i.e. logger.ts)
 * @returns AppConfig
 */
export const getEmailConfig = () => {
	return {
		isProduction: (process.env.NODE_ENV || 'production') === 'production',
		express: {
			port: process.env.PORT || '8087',
		},
		email: {
			host: process.env.EMAIL_HOST || 'localhost',
			port: process.env.EMAIL_PORT || 1025,
			fromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@opcgl.ca',
			fromName: process.env.EMAIL_FROM_NAME || 'PCGL Registry',
			contactAddress: process.env.EMAIL_CONTACT_ADDRESS || 'info@pcgl.ca',
			auth: {
				user: process.env.EMAIL_USER,
				password: process.env.EMAIL_PASSWORD,
			},
			imageBaseUrl: process.env.IMAGE_BASE_URL || '',
			frenchEnabled: (process.env.FRENCH_EMAILS_ENABLED || 'false') === 'true',
		},
		pcgl: {
			registryUrl: process.env.PCGL_REGISTRY_URL || 'https://pcgl.ca',
			consentUiBaseUrl: process.env.CONSENT_UI_BASE_URL || 'http://localhost:3000',
		},
	};
};

export type emailConfig = ReturnType<typeof getEmailConfig>;
