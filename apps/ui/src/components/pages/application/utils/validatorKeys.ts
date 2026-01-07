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
	type AgreementDTO,
	type AppendicesDTO,
	type ApplicantDTO,
	type ApplicationContentsResponse,
	type EthicsLetterDTO,
	type InstitutionalRepDTO,
	type InstitutionDTO,
	type ProjectDTO,
	type RequestedStudiesDTO,
} from '@pcgl-daco/data-model';

import {
	agreementsSchema,
	appendicesSchema,
	applicantInformationSchema,
	ethicsSchema,
	institutionalRepSchema,
	projectInformationSchema,
	requestedStudiesSchema,
	SectionRevision,
} from '@pcgl-daco/validation';

// Determines of value is a key of one of the metadata passed in ApplicationContentsResponse
export function isRestrictedApplicationContentsKey(value: string): value is keyof ApplicationContentsResponse {
	return value !== 'applicationId' && value !== 'createdAt' && value !== 'updatedAt';
}

// ApplicantKey
export function isApplicantKey(value: string): value is keyof ApplicantDTO {
	return value in applicantInformationSchema.keyof().Values;
}
// InstitutionalKey
interface InstitutionalKey extends InstitutionalRepDTO, InstitutionDTO {}
export function isInstitutionalKey(value: string): value is keyof InstitutionalKey {
	return value in institutionalRepSchema.keyof().Values;
}

export function isAgreementKey(value: string): value is keyof AgreementDTO {
	return value in agreementsSchema.keyof().Values;
}

export function isAppendicesKey(value: string): value is keyof AppendicesDTO {
	return value in appendicesSchema.keyof().Values;
}
// EthicsKey
export function isEthicsKey(value: string): value is keyof EthicsLetterDTO {
	return value in ethicsSchema.keyof().Values;
}
// RequestedStudyKey
export function isRequestedStudies(value: string): value is keyof RequestedStudiesDTO {
	return value in requestedStudiesSchema.keyof().Values;
}

// ProjectKey
export function isProjectKey(value: string): value is keyof ProjectDTO {
	return value in projectInformationSchema.keyof().Values;
}

// Grab fields that have revision requests
export function parseRevisedFields(fields: ApplicationContentsResponse, revisedFields: SectionRevision) {
	const result = Object.entries(fields).reduce((acc, item) => {
		const [key, value] = item;

		if (!revisedFields.applicant[0]?.isApproved && isApplicantKey(key)) {
			acc[key] = value;
		} else if (!revisedFields.institutional[0]?.isApproved && isInstitutionalKey(key)) {
			acc[key] = value;
		} else if (!revisedFields.project[0]?.isApproved && isProjectKey(key)) {
			acc[key] = value;
		} else if (!revisedFields.agreement[0]?.isApproved && isAgreementKey(key)) {
			acc[key] = value;
		} else if (!revisedFields.appendices[0]?.isApproved && isAppendicesKey(key)) {
			acc[key] = value;
		} else if (!revisedFields.ethics[0]?.isApproved && isEthicsKey(key)) {
			acc[key] = value;
		} else if (!revisedFields.study[0]?.isApproved && isRequestedStudies(key)) {
			acc[key] = value;
		}

		return acc;
	}, {} as Partial<ApplicationContentsResponse>);

	return result;
}
