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
import { ITransition, StateMachine, t as transition } from 'typescript-fsm';
import { getDbInstance } from '../db/index.js';
import { applications } from '../db/schemas/applications.js';
import applicationService from '../service/application-service.js';
import { AsyncResult, failure, success } from '../utils/results.js';

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

// TODO: Add Validation
const validateContent = async (
	application: typeof applications.$inferSelect,
): AsyncResult<typeof applications.$inferSelect> => {
	return success(application);
};

// TODO: Replace with individual methods
type ApplicationTransitionCallback = () => AsyncResult<typeof applications.$inferSelect>;

type ApplicationTransitions = ITransition<
	ApplicationStateValues,
	ApplicationStateEvents,
	ApplicationTransitionCallback
>;

export class ApplicationStateManager extends StateMachine<ApplicationStateValues, ApplicationStateEvents> {
	private readonly _id: number;
	private readonly _application: typeof applications.$inferSelect;
	private readonly _initState: ApplicationStateValues;

	// Draft
	private draftSubmitTransition = transition(DRAFT, submit, INSTITUTIONAL_REP_REVIEW, this._onSubmit);
	private draftEditTransition = transition(DRAFT, edit, DRAFT, this._onSubmit);
	private draftCloseTransition = transition(DRAFT, close, CLOSED, this._onSubmit);

	// Rep Review
	private repReviewCloseTransition = transition(INSTITUTIONAL_REP_REVIEW, close, CLOSED, this._onSubmit);
	private repReviewEditTransition = transition(INSTITUTIONAL_REP_REVIEW, edit, DRAFT, this._onSubmit);
	private repReviewRevisionTransition = transition(
		INSTITUTIONAL_REP_REVIEW,
		revision_request,
		REP_REVISION,
		this._onSubmit,
	);
	private repReviewSubmitTransition = transition(INSTITUTIONAL_REP_REVIEW, submit, DAC_REVIEW, this._onSubmit);

	// Rep Revision
	private repRevisionSubmitTransition = transition(REP_REVISION, submit, INSTITUTIONAL_REP_REVIEW, this._onSubmit);

	// DAC Review
	private dacReviewApproveTransition = transition(DAC_REVIEW, approve, APPROVED, this._onSubmit);
	private dacReviewCloseTransition = transition(DAC_REVIEW, close, CLOSED, this._onSubmit);
	private dacReviewEditTransition = transition(DAC_REVIEW, edit, DRAFT, this._onSubmit);
	private dacReviewRevisionTransition = transition(
		DAC_REVIEW,
		revision_request,
		DAC_REVISIONS_REQUESTED,
		this._onSubmit,
	);
	private dacReviewRejectTransition = transition(DAC_REVIEW, reject, REJECTED, this._onSubmit);

	// DAC Revision
	private dacRevisionSubmitTransition = transition(DAC_REVISIONS_REQUESTED, submit, DAC_REVIEW, this._onSubmit);

	// Approval
	private approvalRevokedTransition = transition(APPROVED, revoked, REVOKED, this._onSubmit);

	// All Transitions
	private applicationTransitions: ApplicationTransitions[] = [
		this.draftSubmitTransition,
		this.draftEditTransition,
		this.draftCloseTransition,
		this.repReviewCloseTransition,
		this.repReviewEditTransition,
		this.repReviewRevisionTransition,
		this.repReviewSubmitTransition,
		this.repRevisionSubmitTransition,
		this.dacReviewApproveTransition,
		this.dacReviewCloseTransition,
		this.dacReviewEditTransition,
		this.dacReviewRevisionTransition,
		this.dacReviewRejectTransition,
		this.dacRevisionSubmitTransition,
		this.approvalRevokedTransition,
	];

	// TODO: Add methods for all actions: submit, close, edit, revision_request, approve, reject, revoked
	private async _onSubmit() {
		// throw new Error('i messed up');
		if (this.can(submit)) {
			// TODO: Add Validation
			const validationResult = await validateContent(this._application);
			if (validationResult.success) {
				return validationResult;
			} else {
				return failure(`Cannot submit application with state ${this.getState()}`);
			}
		} else {
			return failure(`Cannot submit application with state ${this.getState()}`);
		}
	}

	constructor(application: typeof applications.$inferSelect) {
		const { id, state } = application;
		super(state);
		this._id = id;
		this._initState = state;
		this._application = application;

		this.addTransitions(this.applicationTransitions);
	}

	get id() {
		return this._id;
	}

	get state() {
		return this.getState();
	}

	submitDraft(props: {}) {
		//if can submit
		// try {
		// this.dispatch(ApplicationStateEvents.submit);
		// } catch (e) {
		// }
		// else return error
	}
}

export const createApplicationStateManager = async ({ id }: { id: number }) => {
	const database = getDbInstance();
	const service: ReturnType<typeof applicationService> = applicationService(database);

	const result = await service.getApplicationById({ id });
	if (!result.success) {
		return result;
	}

	const dbRecord = result.data;
	const appStateManager = new ApplicationStateManager(dbRecord);

	return success(appStateManager);
};

// application.submitDraft({});
