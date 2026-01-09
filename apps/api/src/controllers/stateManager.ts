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

import { ApplicationStates, type ApplicationStateValues } from '@pcgl-daco/data-model/src/types.js';
import cron from 'node-cron';
import { ITransition, StateMachine, t as transition } from 'typescript-fsm';

import { getDbInstance } from '@/db/index.js';
import { applicationActionSvc } from '@/service/applicationActionService.js';
import { applicationSvc } from '@/service/applicationService.js';
import { type AddActionMethods, type ApplicationRecord } from '@/service/types.js';
import { type AsyncResult, failure, type Result, success } from '@/utils/results.js';
import BaseLogger from '../logger.js';
import { getApplicationById } from './applicationController.ts';
import { validateContent } from './validation.js';

const logger = BaseLogger.forModule('stateManager');

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
	submit = 'submit',
	submit_rep_revisions = 'submit_rep_revisions',
	submit_dac_revisions = 'submit_dac_revisions',
	close = 'close',
	edit = 'edit',
	rep_review_withdraw = 'rep_review_withdraw',
	rep_approve_review = 'rep_approve_review',
	rep_revision_request = 'rep_revision_request',
	dac_approve_review = 'dac_approve_review',
	dac_reject = 'dac_reject',
	dac_revision_request = 'dac_revision_request',
	dac_review_withdraw = 'dac_review_withdraw',
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
	rep_review_withdraw,
	dac_approve_review,
	dac_reject,
	dac_revision_request,
	dac_review_withdraw,
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

	_stateTransitionFailure(action: ApplicationStateEvents) {
		return failure(
			'INVALID_STATE_TRANSITION',
			`Cannot perform action "${action}" on application with state "${this.getState()}"`,
		);
	}

	_canPerformAction(action: ApplicationStateEvents): Result<true, 'INVALID_STATE_TRANSITION'> {
		if (this.can(action)) {
			return success(true);
		} else {
			return this._stateTransitionFailure(action);
		}
	}

	async _dispatchAndUpdateAction(
		action: ApplicationStateEvents,
		actionMethod: AddActionMethods,
		userName: string,
	): AsyncResult<ApplicationRecord & { actionId: number }, 'SYSTEM_ERROR' | 'NOT_FOUND'> {
		try {
			await this.dispatch(action);
			const updateResult = await this._updateRecords(actionMethod, userName);
			return updateResult;
		} catch (error) {
			const message = `Unexpected error performing action "${actionMethod}" on application with id "${this._application.id}"`;
			logger.error(message);
			return failure('SYSTEM_ERROR', message);
		}
	}

	async _updateRecords(
		method: AddActionMethods,
		userName: string,
	): AsyncResult<ApplicationRecord & { actionId: number }, 'SYSTEM_ERROR' | 'NOT_FOUND'> {
		const db = getDbInstance();
		const applicationRepo = applicationSvc(db);
		const applicationActionRepo = applicationActionSvc(db);

		return await db.transaction(async (tx) => {
			try {
				const actionResult = await applicationActionRepo[method](this._application, tx, userName);
				if (!actionResult.success) {
					return actionResult;
				}

				const { state_after: state } = actionResult.data;
				const { id } = this._application;
				const update = { state };
				const applicationResult = await applicationRepo.findOneAndUpdate({
					id,
					update,
					transaction: tx,
				});

				if (!applicationResult.success) {
					return applicationResult;
				}

				this._application = applicationResult.data;

				return success({ ...applicationResult.data, actionId: actionResult.data.id });
			} catch (error) {
				logger.error(`Unexpected error updating an application in the database.`, error);
				return failure(
					'SYSTEM_ERROR',
					'Unexpected error occurred interacting with database. No updates were performed.',
				);
			}
		});
	}

	// Handler Methods
	// Submit
	async submitDraft(userName: string) {
		const transitionResult = this._canPerformAction(submit);
		if (!transitionResult.success) {
			return transitionResult;
		}

		const validationResult = await validateContent(this._application);
		if (validationResult.success) {
			return await this._dispatchAndUpdateAction(submit, 'draftSubmit', userName);
		} else {
			return validationResult;
		}
	}

	private async _onSubmitDraft() {
		// Post Submit Draft, Application has moved to Rep Review, if still in review 7 days later -> send email reminder
		cron.schedule('0 0 */7 * *', async (context) => {
			const applicationResult = await getApplicationById({ applicationId: this._id });
			if (!applicationResult.success) {
				return applicationResult;
			}

			if (applicationResult.data.state === ApplicationStates.INSTITUTIONAL_REP_REVIEW) {
				console.log('\nPlease review & submit your application with state Rep Review\n');
			} else {
				context.task?.destroy();
			}
		});

		return success(`Submit Draft email reminder set for application ${this._id}`);
	}

	async submitRepRevision(userName: string) {
		const transitionResult = this._canPerformAction(submit_rep_revisions);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(submit_rep_revisions, 'repSubmit', userName);
		} else {
			return transitionResult;
		}
	}

	async submitDacRevision(userName: string) {
		const transitionResult = this._canPerformAction(submit_dac_revisions);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(submit_dac_revisions, 'dacSubmit', userName);
		} else {
			return transitionResult;
		}
	}

	private async _onSubmit() {
		return success('post dispatch on submit');
	}

	// Edit
	async editDraft() {
		const transitionResult = this._canPerformAction(edit);
		if (transitionResult.success) {
			const validationResult = await validateContent(this._application);
			return validationResult;
		} else {
			return transitionResult;
		}
	}

	async editRepReview() {
		const transitionResult = this._canPerformAction(edit);
		if (transitionResult.success) {
			const validationResult = await validateContent(this._application);
			return validationResult;
		} else {
			return transitionResult;
		}
	}

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
	async reviseRepReview(userName: string) {
		const transitionResult = this._canPerformAction(rep_revision_request);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(rep_revision_request, 'repRevision', userName);
		} else {
			return transitionResult;
		}
	}

	private async _onRepRevision() {
		// Post Rep Revisions Requested, if still in review 7 days later -> send email reminder
		cron.schedule(
			'0 0 */7 * *',
			async (context) => {
				const applicationResult = await getApplicationById({ applicationId: this._id });

				if (!applicationResult.success) {
					return applicationResult;
				}

				if (applicationResult.data.state === ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED) {
					console.log('\nPlease review & submit your application with state Rep Revision Requested\n');
				} else {
					context.task?.destroy();
				}
			},
			{ noOverlap: true },
		);

		return success(`Submit Rep Review Revision email reminder set for application ${this._id}`);
	}

	async reviseDacReview(userName: string) {
		const transitionResult = this._canPerformAction(dac_revision_request);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(dac_revision_request, 'dacRevision', userName);
		} else {
			return transitionResult;
		}
	}

	private async _onDacRevision() {
		// Post Dac Revisions Requested, if still in review 7 days later -> send email reminder
		cron.schedule(
			'0 0 */7 * *',
			async (context) => {
				const applicationResult = await getApplicationById({ applicationId: this._id });

				if (!applicationResult.success) {
					return applicationResult;
				}

				if (applicationResult.data.state === ApplicationStates.DAC_REVISIONS_REQUESTED) {
					console.log('\nPlease review & submit your application with state Dac Revision Requested\n');
				} else {
					context.task?.destroy();
				}
			},
			{ noOverlap: true },
		);

		return success(`Submit DAC Revision email reminder set for application ${this._id}`);
	}

	// Close
	async closeDraft(
		userName: string,
	): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> {
		const transitionResult = this._canPerformAction(close);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(close, 'close', userName);
		} else {
			return this._stateTransitionFailure(close);
		}
	}

	async closeRepReview(
		userName: string,
	): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> {
		const transitionResult = this._canPerformAction(close);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(close, 'close', userName);
		} else {
			return failure('INVALID_STATE_TRANSITION', `Cannot close application with state ${this.getState()}`);
		}
	}

	async closeDacReview(
		userName: string,
	): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> {
		const transitionResult = this._canPerformAction(close);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(close, 'close', userName);
		} else {
			return transitionResult;
		}
	}

	private async _onClose() {
		return success('post dispatch on close');
	}

	// Approve
	async approveRepReview(
		userName: string,
	): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> {
		const transitionResult = this._canPerformAction(rep_approve_review);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(rep_approve_review, 'repApproved', userName);
		} else {
			return transitionResult;
		}
	}

	private async _onApproveRepReview() {
		const applicationId = this._id;
		cron.schedule('0 0 */7 * *', async (context) => {
			// Post Submit Rep Review, Application has moved to Dac Review, if still in review 7 days later -> send email reminder
			const applicationResult = await getApplicationById({ applicationId });
			if (!applicationResult.success) {
				return applicationResult;
			}

			if (applicationResult.data.state === ApplicationStates.DAC_REVIEW) {
				console.log(`\nPlease review & submit your application with ID ${applicationId} in state Dac Review\n`);
			} else {
				context.task?.destroy();
			}
		});

		return success(`Submit Draft email reminder set for application ${applicationId}`);
	}

	async approveDacReview(
		userName: string,
	): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> {
		const transitionResult = this._canPerformAction(dac_approve_review);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(dac_approve_review, 'dacApproved', userName);
		} else {
			return transitionResult;
		}
	}

	private async _onApproved() {
		return success('post dispatch on approve');
	}

	// Reject
	async rejectDacReview(
		userName: string,
	): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> {
		const transitionResult = this._canPerformAction(dac_reject);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(dac_reject, 'dacRejected', userName);
		} else {
			return this._stateTransitionFailure(dac_reject);
		}
	}

	private async _onReject() {
		return success('post dispatch on reject');
	}

	// Revoke
	async revokeApproval(
		userName: string,
	): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> {
		const transitionResult = this._canPerformAction(revoked);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(revoked, 'revoke', userName);
		} else {
			return this._stateTransitionFailure(revoked);
		}
	}

	private async _onRevoked() {
		return success('post dispatch on revoked');
	}

	// Withdraw
	async withdrawRepReview(
		userName: string,
	): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> {
		const transitionResult = this._canPerformAction(rep_review_withdraw);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(rep_review_withdraw, 'withdraw', userName);
		} else {
			return transitionResult;
		}
	}

	async withdrawDacReview(
		userName: string,
	): AsyncResult<ApplicationRecord, 'INVALID_STATE_TRANSITION' | 'NOT_FOUND' | 'SYSTEM_ERROR'> {
		const transitionResult = this._canPerformAction(dac_review_withdraw);
		if (transitionResult.success) {
			return await this._dispatchAndUpdateAction(dac_review_withdraw, 'withdraw', userName);
		} else {
			return transitionResult;
		}
	}

	private async _onWithdrawal() {
		return success('post dispatch on withdraw');
	}

	/* *********** *
	 * Transitions *
	 * *********** */
	// Draft
	private draftSubmitTransition = transition(DRAFT, submit, INSTITUTIONAL_REP_REVIEW, this._onSubmitDraft);
	private draftEditTransition = transition(DRAFT, edit, DRAFT, this._onEdit);
	private draftCloseTransition = transition(DRAFT, close, CLOSED, this._onClose);

	// Rep Review
	private repReviewCloseTransition = transition(INSTITUTIONAL_REP_REVIEW, close, CLOSED, this._onClose);
	private repReviewEditTransition = transition(
		INSTITUTIONAL_REP_REVISION_REQUESTED,
		edit,
		INSTITUTIONAL_REP_REVIEW,
		this._onEdit,
	);
	private repReviewRevisionTransition = transition(
		INSTITUTIONAL_REP_REVIEW,
		rep_revision_request,
		INSTITUTIONAL_REP_REVISION_REQUESTED,
		this._onRepRevision,
	);
	private repReviewApproveTransition = transition(
		INSTITUTIONAL_REP_REVIEW,
		rep_approve_review,
		DAC_REVIEW,
		this._onApproveRepReview,
	);
	private repReviewWithdrawTransition = transition(
		INSTITUTIONAL_REP_REVIEW,
		rep_review_withdraw,
		DRAFT,
		this._onWithdrawal,
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
	private dacReviewEditTransition = transition(DAC_REVISIONS_REQUESTED, edit, DAC_REVIEW, this._onEdit);
	private dacReviewRevisionTransition = transition(
		DAC_REVIEW,
		dac_revision_request,
		DAC_REVISIONS_REQUESTED,
		this._onDacRevision,
	);
	private dacReviewRejectTransition = transition(DAC_REVIEW, dac_reject, REJECTED, this._onReject);
	private dacReviewWithdrawTransition = transition(DAC_REVIEW, dac_review_withdraw, DRAFT, this._onWithdrawal);

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
		this.dacReviewWithdrawTransition,
		this.draftCloseTransition,
		this.draftEditTransition,
		this.draftSubmitTransition,
		this.repReviewCloseTransition,
		this.repReviewEditTransition,
		this.repReviewRevisionTransition,
		this.repReviewApproveTransition,
		this.repRevisionSubmitTransition,
		this.repReviewWithdrawTransition,
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
