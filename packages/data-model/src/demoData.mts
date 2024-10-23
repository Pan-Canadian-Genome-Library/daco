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

import { Applicant, Application, ApplicationStates, Institution } from './types';

const demoUser: Applicant = {
	userId: 'id01',
	title: 'Dr.',
	firstName: 'Testing',
	middleName: 'Test',
	lastName: 'Person',
	suffix: '',
	primaryAffiliation: 'OICR',
	institutionalEmail: 'testing@oicr.on.ca',
	researcherProfileURL: 'platform.icgc-argo.org',
	positionTitle: 'Dr.',
};

const demoInstitute: Institution = {
	country: 'Canada',
	streetAddress: '661 University Ave',
	suite: '510',
	city: 'Toronto',
	province: 'ON',
	postalCode: 'M5G 0A3',
};

export const demoApplication: Application = {
	id: 1,
	state: ApplicationStates['DRAFT'],
	userId: 'ddemaria@oicr.on.ca',
	created_at: new Date(),
	approved_at: new Date(),
	expires_at: new Date(),
	contents: {
		applicant: demoUser,
		createdAt: new Date(),
		updatedAt: new Date(),

		institution: demoInstitute,
		institutionalRepresentative: {
			personalInformation: {
				userId: 'id02',
				title: 'Mrs.',
				firstName: 'Jane',
				middleName: '',
				lastName: 'Doe',
				suffix: '',
				primaryAffiliation: 'OICR',
				institutionalEmail: 'testing@oicr.on.ca',
				researcherProfileURL: 'platform.icgc-argo.org',
				positionTitle: 'PI',
			},
			institution: {
				country: 'Canada',
				streetAddress: '661 University Ave',
				suite: '510',
				city: 'Toronto',
				province: 'ON',
				postalCode: 'M5G 0A3',
			},
		},

		collaborators: [],

		projectInformation: {
			title: 'ICGC ARGO',
			website: 'platform.icgc-argo.org',
			abstract: '',
			methodology: '',
			summary: '',
			publicationUrls: ['Nature Portfolio'],
		},

		requestedStudies: {
			studyIds: ['CHICHI-INTL'],
		},

		ethics: {
			ethicsReviewRequired: false,
			ethicsLetter: undefined,
		},

		files: [],

		dataAccessAgreements: [
			{
				id: 123,
				userId: 'user123',
				name: 'Dr. Doctorson',
				agreementText: 'I agree',
				agreementType: '',
				agreedAt: new Date(),
			},
		],

		appendices: {
			agreements: [{ name: 'NDA', agreement: false }],
		},

		signatures: [],

		revisions: [],
	},
};
