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

import {
	ValidatorApplicant,
	ValidatorInstitution,
	ValidatorProject,
} from '@/components/pages/application/utils/validatorFunctions';
import { isApplicantKey, isInstitutionalKey, isProjectKey } from '@/components/pages/application/utils/validatorKeys';
import { SectionRoutes, SectionRoutesValues } from '@/pages/AppRouter';
import { ApplicationContentsResponse } from '@pcgl-daco/data-model';

export type VerifyPageSectionsType<T extends string> = {
	[section in T]: boolean;
};

/**
 *
 * @param fields fields retrived from the store
 * @returns VerifyPageSectionsType object sections determining if the section is touched
 *
 * This is needed for a users first time visit, there should not be an icon present if the user hasn't started any of the sections
 *
 */
export const VerifySectionsTouched = (fields?: ApplicationContentsResponse) => {
	let sectionTouched: VerifyPageSectionsType<SectionRoutesValues> = {
		[SectionRoutes.APPLICANT]: false,
		[SectionRoutes.INSTITUTIONAL]: false,
		[SectionRoutes.INTRO]: false,
		[SectionRoutes.COLLABORATORS]: false,
		[SectionRoutes.PROJECT]: false,
		[SectionRoutes.STUDY]: false,
		[SectionRoutes.ETHICS]: false,
		[SectionRoutes.AGREEMENT]: false,
		[SectionRoutes.APPENDICES]: false,
		[SectionRoutes.SIGN]: false,
	};

	if (!fields) {
		return sectionTouched;
	}

	Object.entries(fields).forEach(([key, value]) => {
		if (isApplicantKey(key) && value !== null) {
			sectionTouched = {
				...sectionTouched,
				applicant: true,
			};
		} else if (isInstitutionalKey(key) && value !== null) {
			sectionTouched = {
				...sectionTouched,
				institutional: true,
			};
		} else if (isProjectKey(key) && value !== null) {
			sectionTouched = {
				...sectionTouched,
				project: true,
			};
		}
	});

	return sectionTouched;
};

/**
 *
 * @param fields fields retrived from the store
 * @returns VerifyPageSectionsType object sections determining if the section is valid
 *
 *  Verify each section with zod if there are errors on their fields using
 */
export const VerifyFormSections = (fields?: ApplicationContentsResponse): VerifyPageSectionsType<SectionRoutesValues> => {
	
	return {
		[SectionRoutes.INTRO]: false,
		[SectionRoutes.APPLICANT]: fields ? ValidatorApplicant(fields) : false,
		[SectionRoutes.INSTITUTIONAL]: fields ? ValidatorInstitution(fields) : false,
		[SectionRoutes.COLLABORATORS]: false,
		[SectionRoutes.PROJECT]: fields ? ValidatorProject(fields) : false,
		[SectionRoutes.STUDY]: false,
		[SectionRoutes.ETHICS]: false,
		[SectionRoutes.AGREEMENT]: false,
		[SectionRoutes.APPENDICES]: false,
		[SectionRoutes.SIGN]: false,
	};
};
