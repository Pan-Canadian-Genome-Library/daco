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
import enModalsLang from './locale/en/enModals.json';
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
				...enModalsLang,
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
 * NOTE: If the zod schema has a {message:...} contained in one of the fields, it will not trigger the translation mapping and will prioritize the {message:...} object
 */
const CustomFormErrorTranslationMapping: z.ZodErrorMap = (error, ctx) => {
	switch (error.code) {
		case z.ZodIssueCode.invalid_type:
			if (error.expected === 'string') {
				return { message: i18n.t('requiredField') };
			} else if (error.expected === 'array' && error.path[0] === 'agreements') {
				return { message: i18n.t('requiredNumberOfCheckboxes') };
			}

			return { message: i18n.t('defaultViolationText') };
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
		case z.ZodIssueCode.too_small:
			if (error.type === 'array' && error.path[0] === 'agreements') {
				return { message: i18n.t('checkboxesNotFilledOut') };
			} else if (error.type === 'number' && error.path[0] === 'requestedStudy') {
				return { message: i18n.t('invalidIdNumber') };
			} else if (error.code === 'too_small') {
				return { message: i18n.t('tooSmall', { value: error.minimum }) };
			}
			break;
		case z.ZodIssueCode.too_big:
			if (error.type === 'array' && error.path[0] === 'agreements') {
				return { message: i18n.t('requiredNumberOfCheckboxes') };
			}
			break;
		// Custom zod errors using refine / super refine
		case z.ZodIssueCode.custom:
			if (error.params?.violation) {
				const violation = error.params.violation;
				const params = error.params;

				switch (violation) {
					case 'tooFewWords':
						return { message: i18n.t(violation, { length: params.length }) };
					case 'tooManyWords':
						return { message: i18n.t(violation, { length: params.length }) };
					default:
						return { message: i18n.t(violation) };
				}
			}
			return { message: i18n.t('defaultViolationText') };
		case z.ZodIssueCode.invalid_enum_value:
			return { message: i18n.t('receivedInvalidEnum') };
	}
	return { message: ctx.defaultError };
};

z.setErrorMap(CustomFormErrorTranslationMapping);

export default i18n;
