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

import { getDbInstance } from '@/db/index.js';
import { applicationActionSvc } from '@/service/applicationActionService.js';
import { applicationSvc } from '@/service/applicationService.js';
import { type AddActionMethods, type ApplicationRecord } from '@/service/types.js';
import { type AsyncResult, failure, success } from '@/utils/results.js';
import { ApplicationStates, type ApplicationStateValues } from '@pcgl-daco/data-model/src/types.js';
import { ITransition, StateMachine, t as transition } from 'typescript-fsm';
import { validateContent } from './validation.js';

const {
	DRAFT,
	INSTITUTIONAL_REP_REVIEW,
	INSTITUTIONAL_REP_REVISION_REQUESTED,
	DAC_REVIEW,
	DAC_REVISIONS_REQUESTED,
	REJECTED,
	APPROVED,
	CLOSED,
	REVOKED,
} = ApplicationStates;

export enum ApplicationStateEvents {
	submit = 'submit', // submit draft
	submit_rep_revisions = 'submit_rep_revisions', // submit draft
	submit_dac_revisions = 'submit_dac_revisions', // submit draft
	close = 'close',
	edit = 'edit',
	rep_approve_review = 'rep_approve_review',
	rep_revision_request = 'rep_revision_request',
	dac_approve_review = 'dac_approve_review',
	dac_reject = 'dac_reject',
	dac_revision_request = 'dac_revision_request',
	revoked = 'revoked',
}

const {
	submit,
	submit_rep_revisions,
	submit_dac_revisions,
	close,
	edit,
	rep_revision_request,
	rep_approve_review,
	dac_approve_review,
	dac_reject,
	dac_revision_request,
	revoked,
} = ApplicationStateEvents;

// TODO: Replace with individual methods
type ApplicationTransitionCallback = () => AsyncResult<string>;

type ApplicationTransitions = ITransition<
	ApplicationStateValues,
	ApplicationStateEvents,
	ApplicationTransitionCallback
>;

export class ApplicationStateManager extends StateMachine<ApplicationStateValues, ApplicationStateEvents> {
	private readonly _id: number;
	private _application: ApplicationRecord;
	public readonly initState: ApplicationStateValues;

	_canPerformAction(action: ApplicationStateEvents) {
		if (this.can(action)) {
			return success(true);
		} else {
			return failure(`Cannot perform action ${action} on application with state ${this.getState()}`);
		}
	}

	async _dispatchAndUpdateAction(action: ApplicationStateEvents, actionMethod: AddActionMethods) {
		try {
			await this.dispatch(action);
			const updateResult = await this._updateRecords(actionMethod);
			return updateResult;
		} catch (error) {
			return failure(`Error performing action ${actionMethod} on application with id ${this._application.id}`, error);
		}
	}

	async _updateRecords(method: AddActionMethods) {
		const db = getDbInstance();
		const applicationRepo = applicationSvc(db);
		const applicationActionRepo = applicationActionSvc(db);

		return await db.transaction(async (tx) => {
			const actionResult = await applicationActionRepo[method](this._application, tx);
			if (!actionResult.success) return actionResult;

			const { state_after } = actionResult.data;
			// TODO: Drizzle pgEnum will not accept ApplicationStates as an argument
			const state = state_after as ApplicationStateValues;
			const { id } = this._application;
			const update = { state };
			const applicationResult = await applicationRepo.findOneAndUpdate({
				id,
				update,
				transaction: tx,
			});

			if (applicationResult.success && applicationResult.data) {
				this._application = applicationResult.data;
			}

			return applicationResult;
		});
	}

	// Handler Methods
	// Submit
	// TODO: Add Validation + Edit Content service methods
	async submitDraft() {
		const transitionResult = this._canPerformAction(submit);
		if (transitionResult.success) {
			const validationResult = await validateContent(this._application);
			if (validationResult.success) {
				return await this._dispatchAndUpdateAction(submit, 'draftSubmit');
			} else {
				return validationResult;
			}
		} else {
			return transitionResult;
		}
	}

	async submitRepRevision() {
		const transitionResult = this._canPerformAction(submit_rep_revisions);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(submit_rep_revisions, 'repSubmit');
		} else {
			return transitionResult;
		}
	}

	async submitDacRevision() {
		const transitionResult = this._canPerformAction(submit_dac_revisions);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(submit_dac_revisions, 'dacSubmit');
		} else {
			return transitionResult;
		}
	}

	private async _onSubmit() {
		return success('post dispatch on submit');
	}

	// Edit
	// TODO: Add Validation + Edit Content service methods
	async editDraft() {
		const transitionResult = this._canPerformAction(edit);
		if (transitionResult.success) {
			const validationResult = await validateContent(this._application);
			return validationResult;
		} else {
			return transitionResult;
		}
	}

	// TODO: Add Validation + Edit Content service methods
	async editRepReview() {
		const transitionResult = this._canPerformAction(edit);
		if (transitionResult.success) {
			const validationResult = await validateContent(this._application);
			return validationResult;
		} else {
			return transitionResult;
		}
	}

	// TODO: Add Validation + Edit Content service methods
	async editDacReview() {
		const transitionResult = this._canPerformAction(edit);
		if (transitionResult.success) {
			const validationResult = await validateContent(this._application);
			return validationResult;
		} else {
			return transitionResult;
		}
	}

	private async _onEdit() {
		return success('post dispatch on edit');
	}

	// Revise
	async reviseRepReview() {
		const transitionResult = this._canPerformAction(rep_revision_request);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(rep_revision_request, 'repRevision');
		} else {
			return transitionResult;
		}
	}

	async reviseDacReview() {
		const transitionResult = this._canPerformAction(dac_revision_request);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(dac_revision_request, 'dacRevision');
		} else {
			return transitionResult;
		}
	}

	private async _onRevision() {
		return success('post dispatch on revision');
	}

	// Close
	async closeDraft() {
		if (this.can(close)) {
			await this.dispatch(close);
			return success(close);
		} else {
			return failure(`Cannot close application with state ${this.getState()}`);
		}
	}

	async closeRepReview() {
		return this.closeDraft();
	}

	async closeDacReview() {
		return this.closeDraft();
	}

	private async _onClose() {
		return success('post dispatch on close');
	}

	// Approve
	async approveRepReview() {
		const transitionResult = this._canPerformAction(rep_approve_review);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(rep_approve_review, 'repApproved');
		} else {
			return transitionResult;
		}
	}

	async approveDacReview() {
		const transitionResult = this._canPerformAction(dac_approve_review);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(dac_approve_review, 'dacApproved');
		} else {
			return transitionResult;
		}
	}

	private async _onApproved() {
		return success('post dispatch on approve');
	}

	// Reject
	async rejectDacReview() {
		const transitionResult = this._canPerformAction(dac_reject);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(dac_reject, 'dacRejected');
		} else {
			return failure(`Cannot reject application with state ${this.getState()}`);
		}
	}

	private async _onReject() {
		return success('post dispatch on reject');
	}

	// Revoke
	async revokeApproval() {
		if (this.can(revoked)) {
			await this.dispatch(revoked);
			return success(revoked);
		} else {
			return failure(`Cannot revoke application with state ${this.getState()}`);
		}
	}

	private async _onRevoked() {
		return success('post dispatch on revoked');
	}

	/* *********** *
	 * Transitions *
	 * *********** */
	// Draft
	private draftSubmitTransition = transition(DRAFT, submit, INSTITUTIONAL_REP_REVIEW, this._onSubmit);
	private draftEditTransition = transition(DRAFT, edit, DRAFT, this._onEdit);
	private draftCloseTransition = transition(DRAFT, close, CLOSED, this._onClose);

	// Rep Review
	private repReviewCloseTransition = transition(INSTITUTIONAL_REP_REVIEW, close, CLOSED, this._onClose);
	private repReviewEditTransition = transition(INSTITUTIONAL_REP_REVIEW, edit, INSTITUTIONAL_REP_REVIEW, this._onEdit);
	private repReviewRevisionTransition = transition(
		INSTITUTIONAL_REP_REVIEW,
		rep_revision_request,
		INSTITUTIONAL_REP_REVISION_REQUESTED,
		this._onRevision,
	);
	private repReviewApproveTransition = transition(
		INSTITUTIONAL_REP_REVIEW,
		rep_approve_review,
		DAC_REVIEW,
		this._onApproved,
	);

	// Rep Revision
	private repRevisionSubmitTransition = transition(
		INSTITUTIONAL_REP_REVISION_REQUESTED,
		submit_rep_revisions,
		INSTITUTIONAL_REP_REVIEW,
		this._onSubmit,
	);

	// DAC Review
	private dacReviewApproveTransition = transition(DAC_REVIEW, dac_approve_review, APPROVED, this._onApproved);
	private dacReviewCloseTransition = transition(DAC_REVIEW, close, CLOSED, this._onClose);
	private dacReviewEditTransition = transition(DAC_REVIEW, edit, DAC_REVIEW, this._onEdit);
	private dacReviewRevisionTransition = transition(
		DAC_REVIEW,
		dac_revision_request,
		DAC_REVISIONS_REQUESTED,
		this._onRevision,
	);
	private dacReviewRejectTransition = transition(DAC_REVIEW, dac_reject, REJECTED, this._onReject);

	// DAC Revision
	private dacRevisionSubmitTransition = transition(
		DAC_REVISIONS_REQUESTED,
		submit_dac_revisions,
		DAC_REVIEW,
		this._onSubmit,
	);

	// Revoke Approval
	private approvalRevokedTransition = transition(APPROVED, revoked, REVOKED, this._onRevoked);

	// All Transitions
	private applicationTransitions = [
		this.approvalRevokedTransition,
		this.dacReviewApproveTransition,
		this.dacReviewCloseTransition,
		this.dacReviewEditTransition,
		this.dacReviewRevisionTransition,
		this.dacReviewRejectTransition,
		this.dacRevisionSubmitTransition,
		this.draftCloseTransition,
		this.draftEditTransition,
		this.draftSubmitTransition,
		this.repReviewCloseTransition,
		this.repReviewEditTransition,
		this.repReviewRevisionTransition,
		this.repReviewApproveTransition,
		this.repRevisionSubmitTransition,
	] as const satisfies ApplicationTransitions[];

	constructor(application: ApplicationRecord) {
		const { id, state } = application;
		super(state);
		this._id = id;
		this._application = application;
		this.initState = state;

		this.addTransitions(this.applicationTransitions);
	}

	get id() {
		return this._id;
	}

	get state() {
		return this.getState();
	}
}

export const createApplicationStateManager = async ({ id }: { id: number }) => {
	const database = getDbInstance();
	const service: ReturnType<typeof applicationSvc> = applicationSvc(database);

	const result = await service.getApplicationById({ id });
	if (!result.success) {
		return result;
	}

	const dbRecord = result.data;
	const appStateManager = new ApplicationStateManager(dbRecord);

	return success(appStateManager);
};
