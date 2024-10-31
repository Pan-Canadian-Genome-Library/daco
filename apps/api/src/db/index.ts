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

import { eq } from 'drizzle-orm';
import { drizzle, NodePgClient, NodePgDatabase } from 'drizzle-orm/node-postgres';

import { actions } from './schemas/actions.ts';
import { agreements } from './schemas/agreements.ts';
import { applicationContents } from './schemas/applicationContents.ts';
import { applications } from './schemas/applications.ts';
import { collaborators } from './schemas/collaborators.ts';
import { files } from './schemas/files.ts';
import { revisionRequests } from './schemas/revisionRequests.ts';

import { connectionString } from '../../drizzle.config.ts';

type Database = NodePgDatabase<Record<string, never>> & {
	$client: NodePgClient;
};

async function testActions(db: Database) {
	const testAction: typeof actions.$inferInsert = {
		application_id: 1,
		user_id: 'testUser@oicr.on.ca',
		action: 'CREATE',
		state_before: 'none',
		state_after: 'tbd',
	};

	await db.insert(actions).values(testAction);

	const allActions = await db.select().from(actions);
	console.log('Getting all actions from the database: ', allActions);

	await db.delete(actions).where(eq(actions.application_id, testAction.application_id));
	console.log('Action deleted');
}

async function testAgreements(db: Database) {
	const testAgreements: typeof agreements.$inferInsert = {
		application_id: 1,
		name: 'Test Agreement',
		agreement_text: 'Testing Agreement',
		agreement_type: 'dac_agreement_non_disclosure',
		user_id: 'testUser@oicr.on.ca',
		agreed_at: new Date(),
	};

	await db.insert(agreements).values(testAgreements);

	const allAgreements = await db.select().from(agreements);
	console.log('Getting all agreements from the database: ', allAgreements);

	await db.delete(agreements).where(eq(agreements.name, testAgreements.name));
	console.log('Agreement deleted');
}

async function testApplications(db: Database) {
	const testApplications: typeof applications.$inferInsert = {
		user_id: 'testUser@oicr.on.ca',
		state: 'DRAFT',
	};

	await db.insert(applications).values(testApplications);

	const allApplications = await db.select().from(applications);
	console.log('Getting all applications from the database: ', allApplications);

	await db.delete(applications).where(eq(applications.user_id, testApplications.user_id));
	console.log('Application deleted');
}

async function testApplicationContents(db: Database) {
	const testApplicationContents: typeof applicationContents.$inferInsert = {
		application_id: 1,
		updated_at: new Date(),
		applicant_first_name: 'Test',
		applicant_middle_name: '',
		applicant_last_name: 'Testerson',
		applicant_title: 'Dr.',
		applicant_suffix: 'Sr.',
		applicant_position_title: 'PHD',
		applicant_primary_affiliation: 'UHN',
		applicant_institutional_email: 'testAccount@oicr.on.ca',
		applicant_profile_url: '',
	};

	await db.insert(applicationContents).values(testApplicationContents);

	const allApplicationContents = await db.select().from(applicationContents);
	console.log('Getting all actions from the database: ', allApplicationContents);

	await db
		.delete(applicationContents)
		.where(eq(applicationContents.application_id, testApplicationContents.application_id));
	console.log('Application contents deleted');
}

async function testCollaborators(db: Database) {
	const testCollaborators: typeof collaborators.$inferInsert = {
		application_id: 1,
		first_name: 'Thomas',
		last_name: 'Testing',
		position_title: 'Teacher',
		institutional_email: 'ttesting@oicr.on.ca',
	};

	await db.insert(collaborators).values(testCollaborators);

	const allCollaborators = await db.select().from(collaborators);
	console.log('Getting all collaborators from the database: ', allCollaborators);

	await db.delete(collaborators).where(eq(collaborators.first_name, testCollaborators.first_name));
	console.log('Collaborator deleted');
}

async function testFiles(db: Database) {
	const testFiles: typeof files.$inferInsert = {
		application_id: 1,
		type: 'SIGNED_APPLICATION',
		submitter_user_id: '001',
		submitted_at: new Date(),
		content: Buffer.alloc(123),
	};

	await db.insert(files).values(testFiles);

	const allFiles = await db.select().from(files);
	console.log('Getting all files from the database: ', allFiles);

	await db.delete(files).where(eq(files.submitter_user_id, testFiles.submitter_user_id));
	console.log('File deleted');
}

async function testRevisions(db: Database) {
	const testRevisions: typeof revisionRequests.$inferInsert = {
		application_id: 1,
		applicant_approved: false,
		institution_rep_approved: true,
		collaborators_approved: true,
		project_approved: false,
		requested_studies_approved: true,
	};

	await db.insert(revisionRequests).values(testRevisions);

	const allRevisions = await db.select().from(revisionRequests);
	console.log('Getting all revisions from the database: ', allRevisions);

	await db.delete(revisionRequests).where(eq(revisionRequests.application_id, testRevisions.application_id));
	console.log('Revision deleted');
}

async function testDb() {
	try {
		const db = drizzle(connectionString);

		console.log('Connected to Postgres Db');

		await testActions(db);
		await testAgreements(db);
		await testApplications(db);
		await testApplicationContents(db);
		await testCollaborators(db);
		await testFiles(db);
		await testRevisions(db);
	} catch (err) {
		console.error('Error at TestDb');
		console.error(err);
	}
	process.exit();
}

await testDb();
