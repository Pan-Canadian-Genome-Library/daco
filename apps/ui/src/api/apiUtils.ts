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

import i18n from '@/i18n/translations';

export const withErrorResponseHandler = (response: Response) => {
	if (response.ok) {
		return response;
	} else {
		const error = {
			message: i18n.t('errors.generic.title'),
			error: i18n.t('errors.generic.message'),
		};

		switch (response.status) {
			case 400:
				error.message = i18n.t('errors.http.400.title');
				error.error = i18n.t('errors.http.400.message');
				break;
			case 403:
				error.message = i18n.t('errors.http.403.title');
				error.error = i18n.t('errors.http.403.message');
				break;
			case 404:
				error.message = i18n.t('errors.http.404.title');
				error.error = i18n.t('errors.http.404.message');
				break;
			case 500:
				error.message = i18n.t('errors.http.500.title');
				error.error = i18n.t('errors.http.500.message');
				break;
			default:
				error.message = i18n.t('errors.fetchError.title');
				error.error = i18n.t('errors.fetchError.message');
		}

		throw error;
	}
};
