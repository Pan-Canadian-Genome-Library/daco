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
type ApplicationTransitionCallback = () => AsyncResult<string | void>;

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
	private draftEditTransition = transition(DRAFT, edit, DRAFT, this._onEdit);
	private draftCloseTransition = transition(DRAFT, close, CLOSED, this._onClose);

	// Rep Review
	private repReviewCloseTransition = transition(INSTITUTIONAL_REP_REVIEW, close, CLOSED, this._onClose);
	private repReviewEditTransition = transition(INSTITUTIONAL_REP_REVIEW, edit, DRAFT, this._onEdit);
	private repReviewRevisionTransition = transition(
		INSTITUTIONAL_REP_REVIEW,
		revision_request,
		REP_REVISION,
		this._onRevision,
	);
	private repReviewSubmitTransition = transition(INSTITUTIONAL_REP_REVIEW, submit, DAC_REVIEW, this._onSubmit);

	// Rep Revision
	private repRevisionSubmitTransition = transition(REP_REVISION, submit, INSTITUTIONAL_REP_REVIEW, this._onSubmit);

	// DAC Review
	private dacReviewApproveTransition = transition(DAC_REVIEW, approve, APPROVED, this._onApproved);
	private dacReviewCloseTransition = transition(DAC_REVIEW, close, CLOSED, this._onClose);
	private dacReviewEditTransition = transition(DAC_REVIEW, edit, DRAFT, this._onEdit);
	private dacReviewRevisionTransition = transition(
		DAC_REVIEW,
		revision_request,
		DAC_REVISIONS_REQUESTED,
		this._onRevision,
	);
	private dacReviewRejectTransition = transition(DAC_REVIEW, reject, REJECTED, this._onReject);

	// DAC Revision
	private dacRevisionSubmitTransition = transition(DAC_REVISIONS_REQUESTED, submit, DAC_REVIEW, this._onSubmit);

	// Approval
	private approvalRevokedTransition = transition(APPROVED, revoked, REVOKED, this._onRevoked);

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

	// Handler Methods
	async submitDraft() {
		if (this.can(submit)) {
			// TODO: Add Validation
			const validationResult = await validateContent(this._application);
			if (validationResult.success) {
				await this.dispatch(submit);
				return validationResult;
			} else {
				return failure(`Cannot submit application with state ${this.getState()}`);
			}
		} else {
			return failure(`Cannot submit application with state ${this.getState()}`);
		}
	}

	async submitRepReview() {
		return this.submitDraft();
	}

	async submitRepRevision() {
		return this.submitDraft();
	}

	async submitDacRevision() {
		return this.submitDraft();
	}

	private async _onSubmit() {
		return success('post dispatch on submit');
	}

	async editDraft() {
		if (this.can(edit)) {
			await this.dispatch(edit);
			return success(edit);
		} else {
			return failure(`Cannot edit application with state ${this.getState()}`);
		}
	}

	async editRepReview() {
		return this.editDraft();
	}

	async editDacReview() {
		return this.editDraft();
	}

	private async _onEdit() {
		return success('post dispatch on edit');
	}

	async reviseRepReview() {
		if (this.can(revision_request)) {
			await this.dispatch(revision_request);
			return success(revision_request);
		} else {
			return failure(`Cannot revise application with state ${this.getState()}`);
		}
	}

	async reviseDacReview() {
		return this._onRevision();
	}

	private async _onRevision() {
		return success('post dispatch on revision');
	}

	async onDraftClose() {
		if (this.can(close)) {
			await this.dispatch(close);
			return success(close);
		} else {
			return failure(`Cannot close application with state ${this.getState()}`);
		}
	}

	async onRepReviewClose() {
		return this.onDraftClose();
	}

	async onDacReviewClose() {
		return this.onDraftClose();
	}

	private async _onClose() {
		return success('post dispatch on close');
	}

	async onDacReviewApprove() {
		if (this.can(approve)) {
			await this.dispatch(approve);
			return success(approve);
		} else {
			return failure(`Cannot approve application with state ${this.getState()}`);
		}
	}

	private async _onApproved() {
		return success('post dispatch on close');
	}

	async onDacReviewReject() {
		if (this.can(reject)) {
			await this.dispatch(reject);
			return success(reject);
		} else {
			return failure(`Cannot reject application with state ${this.getState()}`);
		}
	}

	private async _onReject() {
		return success('post dispatch on reject');
	}

	async onApprovalRevoked() {
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
