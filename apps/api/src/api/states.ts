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

import { ApplicationStates, ApplicationStateValues } from '@pcgl-daco/data-model/src/types.js';
import { StateMachine, t as transition } from 'typescript-fsm';
import { getDbInstance } from '../db/index.js';
import { applications } from '../db/schemas/applications.js';
import applicationService from '../service/application-service.js';

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

// TODO: Replace with actual methods
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
export const applicationStateMachine = new StateMachine<ApplicationStateValues, ApplicationEvents>(DRAFT, transitions);

export const createApplicationManager = async ({ id }: { id: number }) => {
	const database = getDbInstance();
	const service: ReturnType<typeof applicationService> = applicationService(database);

	const selectFields = { id: applications.id, state: applications.state };
	const dbRecord = await service.getApplicationById({ id, selectFields });

	console.log(dbRecord);
	return dbRecord;
};

// class Application extends StateMachine<ApplicationStateValues, ApplicationEvents> {
// private readonly _id: number;
// private readonly _key: number;

// constructor(application: ApplicationDBRecord) {
// this._id = application.id;
// this.addTransitions(transitions);

// fetch application from db to get initial state
// this._key = application.state; // state read from db
// }

// async submit(applicationRecord) {
// 	if(this.can('submit')) {
// 		const validationResult = validateContent();
// 		if(validationResult.success) {
// 			this.dispatch('submit');
// 		} else {
// 			return errorStuff
// 		}
// };
// }

// const submit = () => {
// if(state.can('submit')) {
// 	const validationResult = validateContent();
// 	if(validationResult.success) {
// 		state.dispatch('submit');
// 	} else {
// 		return errorStuff
// 	}
// };
// }

// export submitDraft(application: ApplicationDBRecord): {success: true} | {success: false; error: something} => {
// 	//1. initialize state machine
// 	const stateMachine = new StateMachine(applciation.state, transitions);
// 	if(stateMachine.can('submit')) {
// 		if(validationResult.success) {
// 			stateMachine.dispatch('submit');
// 			const validationResult = validateContent();
// 		} else {
// 			return errorStuff
// 		}
// }

// result is either success, or the reason i cant submit it.
