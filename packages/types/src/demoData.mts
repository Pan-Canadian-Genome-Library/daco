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

import { Application } from './types';

export const demoApplication: Application = {
	_type: 'Application',
	status: 'DRAFT',
	applicant: {
		applicationID: '123',
		userId: 'id01',
		title: 'Dr.',
		first: 'Testing',
		middle: 'Test',
		last: 'Person',
		suffix: '',
		primaryAffiliation: 'OICR',
		institutionalEmail: 'testing@oicr.on.ca',
		researcherProfileURL: 'platform.icgc-argo.org',
		positionTitle: 'Dr.',
	},

	institution: {
		country: 'Canada',
		streetAddress: '661 University Ave',
		suite: '510',
		city: 'Toronto',
		province: 'ON',
		postalCode: 'M5G 0A3',
	},

	institutional_representative: {
		applicant: {
			applicationID: '123',
			userId: 'id02',
			title: 'Mrs.',
			first: 'Jane',
			middle: '',
			last: 'Doe',
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
		background: '',
		methodology: '',
		summary: '',
		relevantPublications: 'Nature Portfolio',
	},

	requestedStudies: {
		studyIds: ['CHICHI-INTL'],
	},

	ethics: {
		accepted: false,
		ethicsLetter: undefined,
	},

	files: [],

	dataAccessAgreement: {
		agreements: false,
	},

	appendices: {
		agreements: [{ name: 'NDA', agreement: false }],
	},

	signatures: [],

	revisions: [],
};
