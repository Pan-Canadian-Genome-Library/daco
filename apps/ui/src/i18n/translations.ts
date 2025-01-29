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

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { z } from 'zod';

import enFormErrors from './locale/en/enFormErrors.json';
import enApplicationSection from './locale/en/enSection.json';
import enGeneralLang from './locale/en/enTranslations.json';
import frFormErrors from './locale/fr/frFormErrors.json';
import frGeneralLang from './locale/fr/frTranslations.json';

i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: {
				...enGeneralLang,
				...enApplicationSection,
				...enFormErrors,
			},
		},
		fr: {
			translation: {
				...frGeneralLang,
				...frFormErrors,
			},
		},
	},
	lng: 'en',
	fallbackLng: 'en',
	supportedLngs: ['en', 'fr'],
});

/**
 * Translation error mapping for custom error messages
 */
const CustomFormErrorTranslationMapping: z.ZodErrorMap = (error, ctx) => {
	/**
	 * Add translations through here
	 */
	switch (error.code) {
		case z.ZodIssueCode.invalid_type:
			if (error.expected === 'string') {
				return { message: i18n.t('requiredField') };
			}
			break;
		case z.ZodIssueCode.invalid_string:
			if (error.validation === 'email') {
				return { message: i18n.t('validEmail') };
			} else if (error.validation === 'url') {
				return { message: i18n.t('validURL') };
			} else if (error.validation === 'regex') {
				// right now this only does the postal code, when we expand 'regex' outside of postal code, we need to adjust here
				return { message: i18n.t('validPostalCode') };
			}
			break;
	}
	return { message: ctx.defaultError };
};

z.setErrorMap(CustomFormErrorTranslationMapping);

export default i18n;
