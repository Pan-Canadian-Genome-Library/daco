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
import { describe, it } from 'node:test';

import { StateValue } from 'xstate';
import { applicationStateActor } from '../../states.ts';

describe('State Machine', () => {
	describe('State Machine', () => {
		it('should complete happy path from draft to approval with revisions', () => {
			let counter = 0;
			let value: string | StateValue = 'DRAFT';
			applicationStateActor.subscribe((snapshot) => {
				console.log(counter, snapshot.value);
				counter++;
				value = snapshot.value;
			});

			// 0. Should return DRAFT
			applicationStateActor.start();

			// 1. Should return INSTITUTIONAL_REP_REVIEW
			applicationStateActor.send({ type: 'submit' });
			// 2. Should return DRAFT
			applicationStateActor.send({ type: 'edit' });
			// 3. Should return INSTITUTIONAL_REP_REVIEW
			applicationStateActor.send({ type: 'submit' });
			// 4. Should return REP_REVISION
			applicationStateActor.send({ type: 'revision_request' });
			// 5. Should return INSTITUTIONAL_REP_REVIEW
			applicationStateActor.send({ type: 'submit' });
			// 6. Should return DAC_REVIEW
			applicationStateActor.send({ type: 'submit' });
			// 7. Should return DAC_REVISIONS_REQUESTED
			applicationStateActor.send({ type: 'revision_request' });
			// 8. Should return DAC_REVIEW
			applicationStateActor.send({ type: 'submit' });
			// 9. Should return APPROVED
			applicationStateActor.send({ type: 'approve' });

			assert.strictEqual(value, 'APPROVED');
		});
	});
});
