/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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

import assert from 'node:assert';
import { before, describe, it } from 'node:test';

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

import { connectToDb, type PostgresDb } from '@/db/index.js';
import { checkApplicationNeedsReminder, reminderStates } from '@/jobs/emailReminders.ts';
import { applicationSvc } from '@/service/applicationService.ts';
import { emailSvc } from '@/service/email/emailsService.ts';
import {
	type ApplicationService,
	type EmailService,
	type JoinedApplicationEmailsActionsRecord,
} from '@/service/types.ts';
import {
	addEmailReminderActions,
	addInitialApplications,
	addStudyAndDacUsers,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
} from '../utils/testUtils.ts';

describe('Email Reminder Jobs', () => {
	let db: PostgresDb;
	let container: StartedPostgreSqlContainer;
	let emailService: EmailService;
	let appService: ApplicationService;
	let testApplications: JoinedApplicationEmailsActionsRecord[] = [];

	before(async () => {
		container = await new PostgreSqlContainer()
			.withUsername(PG_USER)
			.withPassword(PG_PASSWORD)
			.withDatabase(PG_DATABASE)
			.start();

		const connectionString = container.getConnectionUri();
		db = connectToDb(connectionString);

		await initTestMigration(db);
		await addInitialApplications(db);
		await addEmailReminderActions(db);
		await addStudyAndDacUsers(db);

		// Todo: mock?
		appService = applicationSvc(db);
		emailService = emailSvc(db);

		const testApplicationResult = await appService.getEmailActionDetails({
			state: reminderStates,
		});
		if (testApplicationResult.success) {
			testApplications = testApplicationResult.data;
		} else {
			throw new Error('Error retrieving test applications for email-reminders.test');
		}
	});

	describe('EmailReminders', () => {
		it('checkApplicationNeedsReminder - Draft', async () => {
			const originalTestApplicationRecord = testApplications[0];
			assert.ok(originalTestApplicationRecord);
			assert.ok(originalTestApplicationRecord.sent_emails?.length === 0);
			assert.ok(originalTestApplicationRecord.application_actions?.length === 0);
			const { state, created_at } = originalTestApplicationRecord;
			const reminderResult = await checkApplicationNeedsReminder({ state, created_at });
			assert.ok(reminderResult);
		});
	});
});
