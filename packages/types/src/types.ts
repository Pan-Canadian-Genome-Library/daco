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

export type PersonalInfo = {
	userId: string;
	title: string;
	first: string;
	middle: string;
	last: string;
	suffix: string;
	primaryAffiliation: string;
	institutionalEmail: string;
	researcherProfileURL: string;
	positionTitle: string;
};

export interface Applicant extends PersonalInfo {
	applicationID: string;
}

export interface Collaborator extends Applicant {
	collaboratorType: string;
}

export type Institution = {
	country: string;
	streetAddress: string;
	building?: string;
	suite?: string;
	city: string;
	province: string;
	postalCode: string;
};

export type Project = {
	title: string;
	website: string;
	background: string;
	methodology: string;
	summary: string;
	relevantPublications: string;
};

export type Revisions = {
	createdAt: Date;
	createdBy: 'string';
	version: number;
	changes: {}[];
};

export enum Status {
	'DRAFT',
	'REVIEW',
	'APPROVED',
	'CLOSED',
	'REVOKED',
}

export type Application = {
	status: keyof typeof Status;
	applicant: Applicant;
	institution: Institution;

	institutional_representative: {
		applicant: Applicant;
		institution: Institution;
	};

	collaborators: Collaborator[];

	projectInformation: Project;

	requestedStudies: {
		studyIds: string[];
	};

	ethics: {
		accepted: boolean;
		ethicsLetter?: File;
	};

	files: File[];

	dataAccessAgreement: {
		agreements: boolean;
	};

	appendices: {
		agreements: { name: string; agreement: boolean }[];
	};

	signatures: File[];

	revisions: Revisions[];
};
