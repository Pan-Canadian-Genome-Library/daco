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

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { port, server } from '../../dist/pcgl-daco-api.js';

// Most basic synchronous example
describe('Initial Test Setup', async () => {
	describe('First File', () => {
		it('should have a Port Value of 3000', () => {
			assert.strictEqual(port, 3000);
		});
	});
});

// Example async beforeEach + testContext
// Mock DB Setup etc.
describe('Async Test Setup', async () => {
	it('Second Test Suite using BeforeEach', async () => {
		let asyncData = 0;

		beforeEach(async () => {
			const setupPromise = new Promise((resolve) => {
				asyncData++;
				resolve(asyncData);
			});

			setupPromise.then((data) => console.log('\nAsync Data', data));
		});

		await it('AsyncData does not equal 0', async () => {
			assert.notEqual(asyncData, 0);
		});

		await it('AsyncData equals 2 (beforeEach called on every Test)', async () => {
			assert.equal(asyncData, 2);
		});
	});
});

// Failure Example + Close Server
describe('Third Test Suite', async () => {
	it('Example Failure Case', async () => {
		assert.strictEqual(port, 4000);
	});

	it('Close Server', async () => {
		server.close();
	});
});
