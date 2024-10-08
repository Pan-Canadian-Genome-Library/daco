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
		application_ID: '123',
		userId: 'id01',
		title: 'Dr.',
		first: 'Testing',
		middle: 'Test',
		last: 'Person',
		suffix: '',
		primary_affiliation: 'OICR',
		institutional_email: 'testing@oicr.on.ca',
		researcher_profile_URL: 'platform.icgc-argo.org',
		position_title: 'Dr.',
	},

	institution: {
		country: 'Canada',
		street_address: '661 University Ave',
		suite: '510',
		city: 'Toronto',
		province: 'ON',
		postal_code: 'M5G 0A3',
	},

	institutional_representative: {
		applicant: {
			application_ID: '123',
			userId: 'id02',
			title: 'Mrs.',
			first: 'Jane',
			middle: '',
			last: 'Doe',
			suffix: '',
			primary_affiliation: 'OICR',
			institutional_email: 'testing@oicr.on.ca',
			researcher_profile_URL: 'platform.icgc-argo.org',
			position_title: 'PI',
		},
		institution: {
			country: 'Canada',
			street_address: '661 University Ave',
			suite: '510',
			city: 'Toronto',
			province: 'ON',
			postal_code: 'M5G 0A3',
		},
	},

	collaborators: [],

	project_information: {
		project_title: 'ICGC ARGO',
		project_website: 'platform.icgc-argo.org',
		background: '',
		methodology: '',
		summary: '',
		relevant_publications: 'Nature Portfolio',
	},

	requested_studies: {
		studyIds: ['CHICHI-INTL'],
	},

	ethics: {
		accepted: false,
		ethics_letter: undefined,
	},

	files: [],

	data_access_agreement: {
		agreements: false,
	},

	appendices: {
		agreements: [{ name: 'NDA', agreement: false }],
	},

	signatures: [],

	revisions: [],
};
