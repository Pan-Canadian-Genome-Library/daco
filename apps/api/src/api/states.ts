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

export enum ApplicationStateEvents {
	submit = 'submit',
	close = 'close',
	edit = 'edit',
	revision_request = 'revision_request',
	approve = 'approve',
	reject = 'reject',
	revoked = 'revoked',
}

const { submit, close, edit, revision_request, approve, reject, revoked } = ApplicationStateEvents;

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

const applicationTransitions = [
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

export const createApplicationStateManager = async ({ id }: { id: number }) => {
	const database = getDbInstance();
	const service: ReturnType<typeof applicationService> = applicationService(database);

	const dbRecord = await service.getApplicationById({ id });
	if (!dbRecord) throw new Error();

	const appStateManager = new ApplicationStateManager(dbRecord);

	return appStateManager;
};

// TODO: Add Validation
const validateContent = (application: typeof applications.$inferSelect) => {
	return { success: true, data: application };
};

export class ApplicationStateManager extends StateMachine<ApplicationStateValues, ApplicationStateEvents> {
	private readonly _id: number;
	private readonly _state: ApplicationStateValues;
	private readonly _application: typeof applications.$inferSelect;

	constructor(application: typeof applications.$inferSelect) {
		const { id, state } = application;
		super(state, applicationTransitions);
		this._id = id;
		this._state = state;
		this._application = application;
	}

	get id() {
		return this._id;
	}

	get state() {
		return this._state;
	}

	async submit() {
		if (this.can(submit)) {
			// TODO: Add Validation
			const validationResult = validateContent(this._application);
			if (validationResult.success) {
				this.dispatch(submit);
				return validationResult;
			} else {
				return { success: false, data: `Cannot submit application with state ${this._state}` };
			}
		}
	}
}

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
