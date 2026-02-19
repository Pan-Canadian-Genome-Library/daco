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
import { after, before, describe, it } from 'node:test';

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

import { connectToDb, type PostgresDb } from '@/db/index.js';
import { checkApplicationNeedsReminder, getRelevantReminderAction, reminderStates } from '@/jobs/emailReminders.ts';
import { applicationSvc } from '@/service/applicationService.ts';
import { type ApplicationService, type JoinedApplicationEmailsActionsRecord } from '@/service/types.ts';
import {
	addEmailReminderActions,
	addReminderApplications,
	addStudyAndDacUsers,
	initTestMigration,
	PG_DATABASE,
	PG_PASSWORD,
	PG_USER,
} from '../utils/testUtils.ts';

describe('Email Reminder Jobs', () => {
	let db: PostgresDb;
	let container: StartedPostgreSqlContainer;
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
		await addReminderApplications(db);
		await addEmailReminderActions(db);
		await addStudyAndDacUsers(db);

		appService = applicationSvc(db);
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
			const testApplicationRecord = testApplications.find((app) => app.application_id === 1);
			assert.ok(testApplicationRecord);
			const { state, created_at, sent_emails, application_actions } = testApplicationRecord;
			assert.ok(sent_emails?.length === 0);
			assert.ok(application_actions?.length === 0);
			const reminderResult = await checkApplicationNeedsReminder({ state, created_at });
			assert.ok(reminderResult);
		});

		it('checkApplicationNeedsReminder - Institutional Rep Review', async () => {
			const testApplicationRecord = testApplications.find((app) => app.application_id === 2);
			assert.ok(testApplicationRecord);
			const { state, created_at, application_actions: applicationActions } = testApplicationRecord;
			assert.ok(state === 'INSTITUTIONAL_REP_REVIEW');
			assert.ok(applicationActions?.length && applicationActions?.length > 0);
			const mostRecentAction = getRelevantReminderAction({ applicationActions, state });
			assert.ok(mostRecentAction && mostRecentAction.action === 'SUBMIT_DRAFT');
			const reminderResult = await checkApplicationNeedsReminder({ state, created_at, mostRecentAction });
			assert.ok(reminderResult);
		});

		it('checkApplicationNeedsReminder - Institutional Rep Revision Requested', async () => {
			const testApplicationRecord = testApplications.find((app) => app.application_id === 3);
			assert.ok(testApplicationRecord);
			const { state, created_at, application_actions: applicationActions } = testApplicationRecord;
			assert.ok(state === 'INSTITUTIONAL_REP_REVISION_REQUESTED');
			assert.ok(applicationActions?.length && applicationActions?.length > 0);
			const mostRecentAction = getRelevantReminderAction({ applicationActions, state });
			assert.ok(mostRecentAction && mostRecentAction.action === 'INSTITUTIONAL_REP_REVISION_REQUEST');
			const reminderResult = await checkApplicationNeedsReminder({ state, created_at, mostRecentAction });
			assert.ok(reminderResult);
		});

		it('checkApplicationNeedsReminder - Post Rep Revision requested', async () => {
			const testApplicationRecord = testApplications.find((app) => app.application_id === 4);
			assert.ok(testApplicationRecord);
			const { state, created_at, application_actions: applicationActions } = testApplicationRecord;
			assert.ok(state === 'INSTITUTIONAL_REP_REVIEW');
			assert.ok(applicationActions?.length && applicationActions?.length > 0);
			const mostRecentAction = getRelevantReminderAction({ applicationActions, state });
			assert.ok(mostRecentAction && mostRecentAction.action === 'INSTITUTIONAL_REP_SUBMIT');
			const reminderResult = await checkApplicationNeedsReminder({ state, created_at, mostRecentAction });
			assert.ok(reminderResult);
		});

		it('checkApplicationNeedsReminder - Dac Review', async () => {
			const testApplicationRecord = testApplications.find((app) => app.application_id === 5);
			assert.ok(testApplicationRecord);
			const { state, created_at, application_actions: applicationActions } = testApplicationRecord;
			assert.ok(state === 'DAC_REVIEW');
			assert.ok(applicationActions?.length && applicationActions?.length > 0);
			const mostRecentAction = getRelevantReminderAction({ applicationActions, state });
			assert.ok(mostRecentAction && mostRecentAction.action === 'INSTITUTIONAL_REP_APPROVED');
			const reminderResult = await checkApplicationNeedsReminder({ state, created_at, mostRecentAction });
			assert.ok(reminderResult);
		});

		it('checkApplicationNeedsReminder - Dac Revisions Requested', async () => {
			const testApplicationRecord = testApplications.find((app) => app.application_id === 6);
			assert.ok(testApplicationRecord);
			const { state, created_at, application_actions: applicationActions } = testApplicationRecord;
			assert.ok(state === 'DAC_REVISIONS_REQUESTED');
			assert.ok(applicationActions?.length && applicationActions?.length > 0);
			const mostRecentAction = getRelevantReminderAction({ applicationActions, state });
			assert.ok(mostRecentAction && mostRecentAction.action === 'DAC_REVIEW_REVISION_REQUEST');
			const reminderResult = await checkApplicationNeedsReminder({ state, created_at, mostRecentAction });
			assert.ok(reminderResult);
		});

		it('checkApplicationNeedsReminder - Post Dac Revisions Requested', async () => {
			const testApplicationRecord = testApplications.find((app) => app.application_id === 7);
			assert.ok(testApplicationRecord);
			const { state, created_at, application_actions: applicationActions } = testApplicationRecord;
			assert.ok(state === 'DAC_REVIEW');
			assert.ok(applicationActions?.length && applicationActions?.length > 0);
			const mostRecentAction = getRelevantReminderAction({ applicationActions, state });
			assert.ok(mostRecentAction && mostRecentAction.action === 'DAC_REVIEW_SUBMIT');
			const reminderResult = await checkApplicationNeedsReminder({ state, created_at, mostRecentAction });
			assert.ok(reminderResult);
		});

		it('checkApplicationNeedsReminder - Application Withdrawn', async () => {
			const testApplicationRecord = testApplications.find((app) => app.application_id === 8);
			assert.ok(testApplicationRecord);
			const { state, created_at, application_actions: applicationActions } = testApplicationRecord;
			assert.ok(state === 'DRAFT');
			assert.ok(applicationActions?.length && applicationActions?.length > 0);
			const mostRecentAction = getRelevantReminderAction({ applicationActions, state });
			assert.ok(mostRecentAction && mostRecentAction.action === 'WITHDRAW');
			const reminderResult = await checkApplicationNeedsReminder({ state, created_at, mostRecentAction });
			assert.ok(reminderResult);
		});
	});

	after(async () => {
		await container.stop();
		process.exit(0);
	});
});
