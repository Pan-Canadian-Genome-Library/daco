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

import { SectionRoutes } from '@/pages/AppRouter';
import { ApplicationContentsResponse } from '@pcgl-daco/data-model';
import { applicantInformationSchema, institutionalRepSchema } from '@pcgl-daco/validation';
import { isApplicantKey, isInstitutionalKey } from './validatorFunctions';

export interface VerifyPageSectionsType {
	[SectionRoutes.APPLICANT]: boolean;
	[SectionRoutes.INSTITUTIONAL]: boolean;
}

// Verify each section with zod if there are errors on their fields
export const VerifyFormSections = (fields?: ApplicationContentsResponse): VerifyPageSectionsType => {
	const sections: VerifyPageSectionsType = {
		[SectionRoutes.APPLICANT]: applicantInformationSchema.safeParse({
			applicantTitle: fields?.applicantTitle,
			applicantFirstName: fields?.applicantFirstName,
			applicantMiddleName: fields?.applicantMiddleName,
			applicantLastName: fields?.applicantLastName,
			applicantSuffix: fields?.applicantSuffix,
			applicantPrimaryAffiliation: fields?.applicantPrimaryAffiliation,
			applicantInstituteEmail: fields?.applicantInstitutionalEmail,
			applicantProfileUrl: fields?.applicantProfileUrl,
			applicantPositionTitle: fields?.applicantPositionTitle,
			applicantInstituteCountry: 'test', // NO mailing field in db
			applicantInstituteState: 'test', // NO mailing field in db
			applicantInstituteCity: 'test', // NO mailing field in db
			applicantInstitutePostalCode: 'test', // NO mailing field in db
			applicantInstituteStreetAddress: 'test', // NO mailing field in db
			applicantInstituteBuilding: 'test', // NO mailing field in db
		}).success,
		[SectionRoutes.INSTITUTIONAL]: institutionalRepSchema.safeParse({
			institutionalTitle: fields?.institutionalRepTitle,
			institutionalFirstName: fields?.institutionalRepFirstName,
			institutionalLastName: fields?.institutionalRepLastName,
			institutionalPrimaryAffiliation: fields?.institutionalRepPrimaryAffiliation,
			institutionalInstituteAffiliation: fields?.institutionalRepEmail,
			institutionalProfileUrl: fields?.institutionalRepProfileUrl,
			institutionalPositionTitle: fields?.institutionalRepPositionTitle,
			institutionCountry: fields?.institutionCountry,
			institutionState: fields?.institutionState,
			institutionCity: fields?.institutionCity,
			institutionStreetAddress: fields?.institutionStreetAddress,
			institutionPostalCode: fields?.institutionPostalCode,
			institutionalMiddleName: fields?.institutionalRepMiddleName,
			institutionalSuffix: fields?.institutionalRepSuffix,
			institutionBuilding: fields?.institutionBuilding,
		}).success,
	};

	return sections;
};

export const VerifySectionsTouched = (fields?: ApplicationContentsResponse): VerifyPageSectionsType => {
	let sectionTouched: VerifyPageSectionsType = {
		[SectionRoutes.APPLICANT]: false,
		[SectionRoutes.INSTITUTIONAL]: false,
	};

	if (!fields) return sectionTouched;

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
		}
	});

	return sectionTouched;
};
