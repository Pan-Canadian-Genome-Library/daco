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

type TransitionValues = [
	ApplicationStateValues,
	ApplicationStateEvents,
	ApplicationStateValues,
	ApplicationTransitionCallback?,
];

const getTransitionHandler = (values: TransitionValues) => {
	return transition(...values);
};

// Draft
const draftSubmitTransitionValues: TransitionValues = [DRAFT, submit, INSTITUTIONAL_REP_REVIEW];
const draftEditTransitionValues: TransitionValues = [DRAFT, edit, DRAFT];
const draftCloseTransitionValues: TransitionValues = [DRAFT, close, CLOSED];

// Rep Review
const repReviewCloseTransitionValues: TransitionValues = [INSTITUTIONAL_REP_REVIEW, close, CLOSED];
const repReviewEditTransitionValues: TransitionValues = [INSTITUTIONAL_REP_REVIEW, edit, DRAFT];
const repReviewRevisionTransitionValues: TransitionValues = [INSTITUTIONAL_REP_REVIEW, revision_request, REP_REVISION];
const repReviewSubmitTransitionValues: TransitionValues = [INSTITUTIONAL_REP_REVIEW, submit, DAC_REVIEW];

// Rep Revision
const repRevisionSubmitTransitionValues: TransitionValues = [REP_REVISION, submit, INSTITUTIONAL_REP_REVIEW];

// DAC Review
const dacReviewApproveTransitionValues: TransitionValues = [DAC_REVIEW, approve, APPROVED];
const dacReviewCloseTransitionValues: TransitionValues = [DAC_REVIEW, close, CLOSED];
const dacReviewEditTransitionValues: TransitionValues = [DAC_REVIEW, edit, DRAFT];
const dacReviewRevisionTransitionValues: TransitionValues = [DAC_REVIEW, revision_request, DAC_REVISIONS_REQUESTED];
const dacReviewRejectTransitionValues: TransitionValues = [DAC_REVIEW, reject, REJECTED];

// DAC Revision
const dacRevisionSubmitTransitionValues: TransitionValues = [DAC_REVISIONS_REQUESTED, submit, DAC_REVIEW];

// Approval
const approvalRevokedTransitionValues: TransitionValues = [APPROVED, revoked, REVOKED];

// All Transitions
const applicationTransitionValues: TransitionValues[] = [
	draftSubmitTransitionValues,
	draftEditTransitionValues,
	draftCloseTransitionValues,
	repReviewCloseTransitionValues,
	repReviewEditTransitionValues,
	repReviewRevisionTransitionValues,
	repReviewSubmitTransitionValues,
	repRevisionSubmitTransitionValues,
	dacReviewApproveTransitionValues,
	dacReviewCloseTransitionValues,
	dacReviewEditTransitionValues,
	dacReviewRevisionTransitionValues,
	dacReviewRejectTransitionValues,
	dacRevisionSubmitTransitionValues,
	approvalRevokedTransitionValues,
];

export class ApplicationStateManager extends StateMachine<ApplicationStateValues, ApplicationStateEvents> {
	private readonly _id: number;
	private readonly _application: typeof applications.$inferSelect;
	private _state: ApplicationStateValues;

	// TODO: Add methods for all actions: submit, close, edit, revision_request, approve, reject, revoked
	private async _onSubmit() {
		if (this.can(submit)) {
			// TODO: Add Validation
			const validationResult = await validateContent(this._application);
			if (validationResult.success) {
				return validationResult;
			} else {
				return failure(`Cannot submit application with state ${this._state}`);
			}
		} else {
			return failure(`Cannot submit application with state ${this._state}`);
		}
	}

	constructor(application: typeof applications.$inferSelect) {
		const { id, state } = application;
		super(state);
		this._id = id;
		this._state = state;
		this._application = application;

		const applicationTransitions = applicationTransitionValues.map((values) => {
			values.push(this._onSubmit);
			return getTransitionHandler(values);
		});

		this.addTransitions(applicationTransitions);
	}

	get id() {
		return this._id;
	}

	get state() {
		return this._state;
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
