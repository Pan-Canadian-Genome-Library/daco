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

import assert from 'node:assert';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';

import { refreshSessionUser, SESSION_USER_REFRESH_INTERVAL_MS } from '@/session/refreshSessionUser.ts';
import type { SessionAccount, SessionUser } from '@pcgl-daco/validation';
import { type Request } from 'express';

type TestSession = Pick<Request['session'], 'user' | 'account' | 'userRefreshedAt'> & { save: () => void };

const START_TIME = 1_000_000;

const staleAuthorization = {
	studyId: 'study1',
	startDate: '2026-01-01T00:00:00.000Z',
	endDate: '2026-02-01T00:00:00.000Z',
};
const freshAuthorization = {
	studyId: 'study2',
	startDate: '2026-10-01T00:00:00.000Z',
	endDate: '2027-10-01T00:00:00.000Z',
};

const testUser: SessionUser = {
	userId: 'pcgl-1',
	sub: 'sub-1',
	givenName: 'Test',
	familyName: 'User',
	emails: [{ address: 'test.user@oicr.on.ca', type: 'official' }],
	siteAdmin: false,
	dataAdmin: false,
	isPcglDac: false,
	studyAuthorizations: { editableStudies: [], readableStudies: [] },
	dacAuthorizations: [staleAuthorization],
	groups: [],
	dacoAdmin: false,
	dacChair: [],
	dacMember: [],
};

const testAccount: SessionAccount = {
	idToken: 'id-token',
	accessToken: 'access-token',
	refreshToken: 'refresh-token',
	refreshTokenIat: 1,
};

describe('refreshSessionUser', () => {
	// What the mocked AuthZ service returns for /user/me
	let authZDacAuthorizations: { study_id: string; start_date: string; end_date: string }[];
	let authZStatus: number;
	let userInfoCalls: number;
	let saveCalls: number;
	let session: TestSession;

	const jsonResponse = (body: unknown, status = 200) =>
		new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

	const refresh = (now: number) => refreshSessionUser(session as unknown as Request['session'], now);

	beforeEach(() => {
		authZDacAuthorizations = [
			{
				study_id: freshAuthorization.studyId,
				start_date: freshAuthorization.startDate,
				end_date: freshAuthorization.endDate,
			},
		];
		authZStatus = 200;
		userInfoCalls = 0;
		saveCalls = 0;
		session = {
			user: { ...testUser },
			account: { ...testAccount },
			userRefreshedAt: START_TIME,
			save: () => {
				saveCalls++;
			},
		};

		mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
			const url = String(input);

			if (url.endsWith('/verify')) {
				return jsonResponse({ token: 'test-service-token' });
			}

			if (url.endsWith('/user/me')) {
				userInfoCalls++;
				if (authZStatus !== 200) {
					return jsonResponse({ message: 'AuthZ failure' }, authZStatus);
				}
				return jsonResponse(
					{
						userinfo: { emails: testUser.emails, pcgl_id: testUser.userId, site_admin: false, data_admin: false },
						study_authorizations: { editable_studies: [], readable_studies: [] },
						dac_authorizations: authZDacAuthorizations,
						groups: [],
					},
					200,
				);
			}

			throw new Error(`Unexpected fetch call in test: ${url}`);
		});
	});

	afterEach(() => {
		mock.restoreAll();
	});

	it('returns undefined and does not call AuthZ when there is no logged in user', async () => {
		session.user = undefined;

		const result = await refresh(START_TIME + SESSION_USER_REFRESH_INTERVAL_MS);

		assert.strictEqual(result, undefined);
		assert.strictEqual(userInfoCalls, 0);
	});

	it('returns undefined when the session has no account to call AuthZ with', async () => {
		session.account = undefined;

		const result = await refresh(START_TIME + SESSION_USER_REFRESH_INTERVAL_MS);

		assert.strictEqual(result, undefined);
		assert.strictEqual(userInfoCalls, 0);
	});

	it('loads the latest dac_authorizations from AuthZ and saves them in the session', async () => {
		const now = START_TIME + SESSION_USER_REFRESH_INTERVAL_MS;

		const result = await refresh(now);

		assert.ok(result);
		assert.deepStrictEqual(result.dacAuthorizations, [freshAuthorization]);
		assert.deepStrictEqual(session.user?.dacAuthorizations, [freshAuthorization]);
		assert.strictEqual(session.userRefreshedAt, now);
		assert.strictEqual(saveCalls, 1);
		// The rest of the session user is left as it was
		assert.strictEqual(result.userId, testUser.userId);
		assert.deepStrictEqual(result.emails, testUser.emails);
	});

	it('removes dac_authorizations that are no longer in AuthZ (e.g. a revoked application)', async () => {
		authZDacAuthorizations = [];

		const result = await refresh(START_TIME + SESSION_USER_REFRESH_INTERVAL_MS);

		assert.ok(result);
		assert.deepStrictEqual(result.dacAuthorizations, []);
	});

	it('does not call AuthZ again within the refresh interval', async () => {
		const result = await refresh(START_TIME + SESSION_USER_REFRESH_INTERVAL_MS - 1);

		assert.ok(result);
		assert.deepStrictEqual(result.dacAuthorizations, [staleAuthorization]);
		assert.strictEqual(userInfoCalls, 0);
		assert.strictEqual(saveCalls, 0);
	});

	it('refreshes when the session user has never been refreshed', async () => {
		session.userRefreshedAt = undefined;

		const result = await refresh(START_TIME);

		assert.ok(result);
		assert.deepStrictEqual(result.dacAuthorizations, [freshAuthorization]);
		assert.strictEqual(userInfoCalls, 1);
	});

	it('refreshes again once the interval has passed since the last refresh', async () => {
		const firstRefresh = START_TIME + SESSION_USER_REFRESH_INTERVAL_MS;
		await refresh(firstRefresh);
		assert.strictEqual(userInfoCalls, 1);

		await refresh(firstRefresh + 1);
		assert.strictEqual(userInfoCalls, 1);

		await refresh(firstRefresh + SESSION_USER_REFRESH_INTERVAL_MS);
		assert.strictEqual(userInfoCalls, 2);
	});

	it('returns the session user unchanged, to be retried on the next call, when AuthZ fails', async () => {
		authZStatus = 500;

		const result = await refresh(START_TIME + SESSION_USER_REFRESH_INTERVAL_MS);

		assert.ok(result);
		assert.deepStrictEqual(result.dacAuthorizations, [staleAuthorization]);
		assert.strictEqual(session.userRefreshedAt, START_TIME);
		assert.strictEqual(saveCalls, 0);
	});
});
