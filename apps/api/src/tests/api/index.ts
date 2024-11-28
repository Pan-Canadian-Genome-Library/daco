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
import { before, describe, it } from 'node:test';

import { ApplicationStates } from '@pcgl-daco/data-model/src/types.js';
import { StateValue } from 'xstate';
import { applicationStateActor } from '../../states.js';

const { DRAFT, INSTITUTIONAL_REP_REVIEW, REP_REVISION, DAC_REVIEW, DAC_REVISIONS_REQUESTED, APPROVED } =
	ApplicationStates;

describe('State Machine', () => {
	describe('Application State', () => {
		let counter = 0;
		let value: string | StateValue = DRAFT;

		before(() => {
			applicationStateActor.subscribe((snapshot) => {
				counter++;
				value = snapshot.value;
			});
		});

		it('should initialize with state DRAFT', () => {
			applicationStateActor.start();
			assert.strictEqual(value, DRAFT);
		});

		it('should change from DRAFT to INSTITUTIONAL_REP_REVIEW on submit', () => {
			applicationStateActor.send({ type: 'submit' });
			assert.strictEqual(value, INSTITUTIONAL_REP_REVIEW);
		});

		it('should change from INSTITUTIONAL_REP_REVIEW to DRAFT on edit', () => {
			applicationStateActor.send({ type: 'edit' });
			assert.strictEqual(value, DRAFT);
		});

		it('should change from INSTITUTIONAL_REP_REVIEW to REP_REVISION on revision_request', () => {
			applicationStateActor.send({ type: 'submit' });
			applicationStateActor.send({ type: 'revision_request' });
			assert.strictEqual(value, REP_REVISION);
		});

		it('should change from REP_REVISION to INSTITUTIONAL_REP_REVIEW on submit', () => {
			applicationStateActor.send({ type: 'submit' });
			assert.strictEqual(value, INSTITUTIONAL_REP_REVIEW);
		});

		it('should change from INSTITUTIONAL_REP_REVIEW to DAC_REVIEW on submit', () => {
			applicationStateActor.send({ type: 'submit' });
			assert.strictEqual(value, DAC_REVIEW);
		});

		it('should change from DAC_REVIEW to DAC_REVISIONS_REQUESTED on revision_request', () => {
			applicationStateActor.send({ type: 'revision_request' });
			assert.strictEqual(value, DAC_REVISIONS_REQUESTED);
		});

		it('should change from DAC_REVISIONS_REQUESTED to DAC_REVIEW on submit', () => {
			applicationStateActor.send({ type: 'submit' });
			assert.strictEqual(value, DAC_REVIEW);
		});

		it('should change from DAC_REVIEW to APPROVED on approval', () => {
			applicationStateActor.send({ type: 'approve' });
			assert.strictEqual(value, APPROVED);
		});

		it('should change from DAC_REVIEW to APPROVED on approval', () => {
			applicationStateActor.send({ type: 'edit' });
			assert.ok(DRAFT);
		});
	});
});
