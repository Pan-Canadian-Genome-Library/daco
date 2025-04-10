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

import { type ApplicationContentsResponse } from '@pcgl-daco/data-model';
import {
	applicantInformationSchema,
	institutionalRepSchema,
	projectInformationSchema,
	requestedStudiesSchema,
} from '@pcgl-daco/validation';

export const ValidatorApplicant = (fields: ApplicationContentsResponse): boolean => {
	return applicantInformationSchema.safeParse({
		applicantTitle: fields.applicantTitle,
		applicantFirstName: fields.applicantFirstName,
		applicantMiddleName: fields.applicantMiddleName,
		applicantLastName: fields.applicantLastName,
		applicantSuffix: fields.applicantSuffix,
		applicantPrimaryAffiliation: fields.applicantPrimaryAffiliation,
		applicantInstituteEmail: fields.applicantInstitutionalEmail,
		applicantProfileUrl: fields.applicantProfileUrl,
		applicantPositionTitle: fields.applicantPositionTitle,
		applicantInstitutionCountry: fields.applicantInstitutionCountry,
		applicantInstitutionState: fields.applicantInstitutionState,
		applicantInstitutionCity: fields.applicantInstitutionCity,
		applicantInstitutionPostalCode: fields.applicantInstitutionPostalCode,
		applicantInstitutionStreetAddress: fields.applicantInstitutionStreetAddress,
		applicantInstitutionBuilding: fields.applicantInstitutionBuilding,
	}).success;
};

export const ValidatorInstitution = (fields: ApplicationContentsResponse): boolean => {
	return institutionalRepSchema.safeParse({
		institutionalTitle: fields.institutionalRepTitle,
		institutionalFirstName: fields.institutionalRepFirstName,
		institutionalLastName: fields.institutionalRepLastName,
		institutionalPrimaryAffiliation: fields.institutionalRepPrimaryAffiliation,
		institutionalInstituteAffiliation: fields.institutionalRepEmail,
		institutionalProfileUrl: fields.institutionalRepProfileUrl,
		institutionalPositionTitle: fields.institutionalRepPositionTitle,
		institutionCountry: fields.institutionCountry,
		institutionState: fields.institutionState,
		institutionCity: fields.institutionCity,
		institutionStreetAddress: fields.institutionStreetAddress,
		institutionPostalCode: fields.institutionPostalCode,
		institutionalMiddleName: fields.institutionalRepMiddleName,
		institutionalSuffix: fields.institutionalRepSuffix,
		institutionBuilding: fields.institutionBuilding,
	}).success;
};

export const ValidatorProject = (fields: ApplicationContentsResponse): boolean => {
	return projectInformationSchema.safeParse({
		projectTitle: fields.projectTitle,
		projectWebsite: fields.projectWebsite,
		projectBackground: fields.projectBackground, // Abstract
		projectAims: fields.projectAims,
		projectMethodology: fields.projectMethodology,
		projectSummary: fields.projectSummary,
		projectPublicationUrls: fields.projectPublicationUrls,
		relevantPublicationURL1: fields.projectPublicationUrls ? fields.projectPublicationUrls[0] : null,
		relevantPublicationURL2: fields.projectPublicationUrls ? fields.projectPublicationUrls[1] : null,
		relevantPublicationURL3: fields.projectPublicationUrls ? fields.projectPublicationUrls[2] : null,
	}).success;
};

export const ValidatorStudy = (fields: ApplicationContentsResponse): boolean => {
	return requestedStudiesSchema.safeParse({
		requestedStudies: fields.requestedStudies,
	}).success;
};
