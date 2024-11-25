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

import { createActor, createMachine } from 'xstate';
import { ApplicationStates } from '../../../packages/data-model/src/types.ts';

const {
	DRAFT,
	INSTITUTIONAL_REP_REVIEW,
	REP_REVISION,
	DAC_REVIEW,
	DAC_REVISIONS_REQUESTED,
	REJECTED,
	APPROVED,
	CLOSED,
	REVOKED,
} = ApplicationStates;

export const applicationStateMachine = createMachine({
	id: 'applicationState',
	initial: 'DRAFT',
	states: {
		DRAFT: {
			on: { submit: 'INSTITUTIONAL_REP_REVIEW', close: 'CLOSED' },
		},
		INSTITUTIONAL_REP_REVIEW: {
			on: { close: 'CLOSED', edit: 'DRAFT', revision_request: 'REP_REVISION', submit: 'DAC_REVIEW' },
		},
		REP_REVISION: {
			on: { submit: 'INSTITUTIONAL_REP_REVIEW' },
		},
		DAC_REVIEW: {
			on: {
				approve: 'APPROVED',
				close: 'CLOSED',
				edit: 'DRAFT',
				revision_request: 'DAC_REVISIONS_REQUESTED',
				reject: 'REJECTED',
			},
		},
		DAC_REVISIONS_REQUESTED: {
			on: { submit: 'DAC_REVIEW' },
		},
		REJECTED: {
			on: {},
		},
		APPROVED: {
			on: { revoked: 'REVOKED' },
		},
		CLOSED: {
			on: {},
		},
		REVOKED: {
			on: {},
		},
	},
});

export const applicationStateActor = createActor(applicationStateMachine);
