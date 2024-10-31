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

import { drizzle } from 'drizzle-orm/node-postgres';

import { actions } from './schemas/actions.ts';
import { agreements } from './schemas/agreements.ts';
import { applicationContents } from './schemas/applicationContents.ts';
import { applications } from './schemas/applications.ts';
import { collaborators } from './schemas/collaborators.ts';
import { files } from './schemas/files.ts';
import { revisionRequests } from './schemas/revisionRequests.ts';

import { connectionString } from '../../drizzle.config.ts';

function testActions() {
	const testAction: typeof actions.$inferInsert = {
		application_id: 1,
		user_id: 'testUser@oicr.on.ca',
		action: 'CREATE',
		state_before: 'none',
		state_after: 'tbd',
	};

	console.log('testAction', testAction);
}

function testAgreements() {
	const testAgreements: typeof agreements.$inferInsert = {
		application_id: 1,
		name: 'Test Agreement',
		agreement_text: 'Testing Agreement',
		agreement_type: 'dac_agreement_non_disclosure',
		user_id: 'testUser@oicr.on.ca',
		agreed_at: new Date(),
	};

	console.log('testAgreements', testAgreements);
}

function testApplications() {
	const testApplications: typeof applications.$inferInsert = {
		user_id: 'testUser@oicr.on.ca',
		state: 'DRAFT',
	};
	console.log('testApplications', testApplications);
}

function testApplicationContents() {
	const testApplicationContents: typeof applicationContents.$inferInsert = {
		application_id: 1,
		updated_at: new Date(),
		// Applicant
		applicant_first_name: 'Test',
		applicant_middle_name: '',
		applicant_last_name: 'Testerson',
		applicant_title: 'Dr.',
		applicant_suffix: 'Sr.',
		applicant_position_title: 'PHD',
		applicant_primary_affiliation: 'UHN',
		applicant_institutional_email: 'testAccount@oicr.on.ca',
		applicant_profile_url: '',
		// Institutional Rep
		institutional_rep_title: '',
		institutional_rep_first_name: '',
		institutional_rep_middle_name: '',
		institutional_rep_last_name: '',
		institutional_rep_suffix: '',
		institutional_rep_primary_affiliation: '',
		institutional_rep_email: '',
		institutional_rep_profile_url: '',
		institutional_rep_position_title: '',
		// Institution
		institution_country: '',
		institution_state: '',
		institution_city: '',
		institution_street_address: '',
		institution_postal_code: '',
		institution_building: '',
		// Project
		project_title: '',
		project_website: '',
		project_abstract: '',
		project_methodology: '',
		project_summary: '',
		project_publication_urls: [],
		// Studies
		requested_studies: [],
		// Agreements & Ethics
		ethics_review_required: false,
	};
	console.log('application contents', testApplicationContents);
}

function testCollaborators() {
	const testAction: typeof actions.$inferInsert = {
		application_id: 1,
		user_id: 'testUser@oicr.on.ca',
		action: 'CREATE',
		state_before: 'none',
		state_after: 'tbd',
	};
	console.log('collaborators', collaborators);
}

function testFiles() {
	const testAction: typeof actions.$inferInsert = {
		application_id: 1,
		user_id: 'testUser@oicr.on.ca',
		action: 'CREATE',
		state_before: 'none',
		state_after: 'tbd',
	};
	console.log('files', files);
}

function testRevisions() {
	const testAction: typeof actions.$inferInsert = {
		application_id: 1,
		user_id: 'testUser@oicr.on.ca',
		action: 'CREATE',
		state_before: 'none',
		state_after: 'tbd',
	};
	console.log('revisions', revisionRequests);
}

async function testDb() {
	try {
		const db = drizzle(connectionString);

		console.log('Connected to Postgres Db');

		testActions();
		testAgreements();
		testApplications();
		testApplicationContents();
		testCollaborators();
		testFiles();
		testRevisions();
	} catch (err) {
		console.error('Error at TestDb');
		console.error(err);
	}
	process.exit();
}

await testDb();
