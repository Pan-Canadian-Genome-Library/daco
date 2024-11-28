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

import { ApplicationStates } from '@pcgl-daco/data-model/src/types.js';
import { createActor, createMachine } from 'xstate';

import { StateMachine, t as transition } from 'typescript-fsm';

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

// XState

export const applicationStateMachine = createMachine({
	id: 'applicationState',
	initial: DRAFT,
	states: {
		[DRAFT]: {
			on: { submit: INSTITUTIONAL_REP_REVIEW, close: CLOSED },
		},
		[INSTITUTIONAL_REP_REVIEW]: {
			on: { close: CLOSED, edit: DRAFT, revision_request: REP_REVISION, submit: DAC_REVIEW },
		},
		[REP_REVISION]: {
			on: { submit: INSTITUTIONAL_REP_REVIEW },
		},
		[DAC_REVIEW]: {
			on: {
				approve: APPROVED,
				close: CLOSED,
				edit: DRAFT,
				revision_request: DAC_REVISIONS_REQUESTED,
				reject: REJECTED,
			},
		},
		[DAC_REVISIONS_REQUESTED]: {
			on: { submit: DAC_REVIEW },
		},
		[REJECTED]: {
			on: {},
		},
		[APPROVED]: {
			on: { revoked: REVOKED },
		},
		[CLOSED]: {
			on: {},
		},
		[REVOKED]: {
			on: {},
		},
	},
});

export const applicationStateActor = createActor(applicationStateMachine);

// FSM

export enum ApplicationEvents {
	submit = 'submit',
	close = 'close',
	edit = 'edit',
	revision_request = 'revision_request',
	approve = 'approve',
	reject = 'reject',
	revoked = 'revoked',
}

const { submit, close, edit, revision_request, approve, reject, revoked } = ApplicationEvents;

const transitionHandler = () => {};

const draftSubmitTransition = transition(DRAFT, submit, INSTITUTIONAL_REP_REVIEW, transitionHandler);
const draftEditTransition = transition(DRAFT, edit, DRAFT, transitionHandler);
const draftCloseTransition = transition(DRAFT, close, CLOSED, transitionHandler);

const repReviewCloseTransition = transition(INSTITUTIONAL_REP_REVIEW, close, CLOSED, transitionHandler);
const repReviewEditTransition = transition(INSTITUTIONAL_REP_REVIEW, edit, DRAFT, transitionHandler);
const repReviewRevisionTransition = transition(
	INSTITUTIONAL_REP_REVIEW,
	revision_request,
	REP_REVISION,
	transitionHandler,
);
const repReviewSubmitTransition = transition(INSTITUTIONAL_REP_REVIEW, submit, DAC_REVIEW, transitionHandler);

const repRevisionSubmitTransition = transition(REP_REVISION, submit, INSTITUTIONAL_REP_REVIEW, transitionHandler);

const dacReviewApproveTransition = transition(DAC_REVIEW, approve, APPROVED, transitionHandler);
const dacReviewCloseTransition = transition(DAC_REVIEW, close, CLOSED, transitionHandler);
const dacReviewEditTransition = transition(DAC_REVIEW, edit, DRAFT, transitionHandler);
const dacReviewRevisionTransition = transition(
	DAC_REVIEW,
	revision_request,
	DAC_REVISIONS_REQUESTED,
	transitionHandler,
);
const dacReviewRejectTransition = transition(DAC_REVIEW, reject, REJECTED, transitionHandler);

const dacRevisionSubmitTransition = transition(DAC_REVISIONS_REQUESTED, submit, DAC_REVIEW, transitionHandler);

const approvalRevokedTransition = transition(APPROVED, revoked, REVOKED, transitionHandler);

const transitions = [
	draftSubmitTransition,
	draftEditTransition,
	draftCloseTransition,
	repReviewCloseTransition,
	repReviewEditTransition,
	repReviewRevisionTransition,
	repReviewSubmitTransition,
	repRevisionSubmitTransition,
	dacReviewApproveTransition,
	dacReviewCloseTransition,
	dacReviewEditTransition,
	dacReviewRevisionTransition,
	dacReviewRejectTransition,
	dacRevisionSubmitTransition,
	approvalRevokedTransition,
];

// TODO: Rename
export const applicationFiniteStateMachine = new StateMachine<ApplicationStates, ApplicationEvents>(DRAFT, transitions);
