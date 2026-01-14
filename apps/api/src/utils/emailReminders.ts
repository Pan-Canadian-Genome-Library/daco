/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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

import { getApplicationById } from '@/controllers/applicationController.js';
import { ApplicationStates } from '@pcgl-daco/data-model';

export const submitDraftReminder = async (applicationId: number) => {
	const applicationResult = await getApplicationById({ applicationId });
	if (!applicationResult.success) {
		return applicationResult;
	}

	if (applicationResult.data.state === ApplicationStates.DRAFT) {
		// if still in draft after 7 days -> send email reminder
		console.log(`\nPlease review & submit your application with ID ${applicationId} with state DRAFT\n`);
	}
};

export const repReviewReminder = async (applicationId: number) => {
	// Post Submit Draft, Application has moved to Rep Review, if still in review 7 days later -> send email reminder
	const applicationResult = await getApplicationById({ applicationId });
	if (!applicationResult.success) {
		return applicationResult;
	}

	if (applicationResult.data.state === ApplicationStates.INSTITUTIONAL_REP_REVIEW) {
		console.log(`\nPlease review & submit your application with ID ${applicationId} and state Rep Review\n`);
	}
};

export const repSubmitRevisionReminder = async (applicationId: number) => {
	// Post Rep Revisions Submitted, if still in review 7 days later -> send email reminder
	const applicationResult = await getApplicationById({ applicationId });
	if (!applicationResult.success) {
		return applicationResult;
	}

	if (applicationResult.data.state === ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED) {
		console.log(
			`\nPlease review & submit your application with ID ${applicationId} and state Rep Revision Requested\n`,
		);
	}
};

export const repRevisionRequestReminder = async (applicationId: number) => {
	// Post Rep Revisions Requested, if still in review 7 days later -> send email reminder
	const applicationResult = await getApplicationById({ applicationId });
	if (!applicationResult.success) {
		return applicationResult;
	}

	if (applicationResult.data.state === ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED) {
		console.log(
			`\nPlease review & submit your application with ID ${applicationId} and state Rep Revision Requested\n`,
		);
	}
};

export const dacSubmitRevisionReminder = async (applicationId: number) => {
	// Post Dac Revisions Submitted, if still in review 7 days later -> send email reminder
	const applicationResult = await getApplicationById({ applicationId });
	if (!applicationResult.success) {
		return applicationResult;
	}

	if (applicationResult.data.state === ApplicationStates.DAC_REVISIONS_REQUESTED) {
		console.log(
			`\nPlease review & submit your application with ID ${applicationId} and state Dac Revision Requested\n`,
		);
	}
};

export const dacRevisionRequestReminder = async (applicationId: number) => {
	// Post Dac Revisions Requested, if still in review 7 days later -> send email reminder
	const applicationResult = await getApplicationById({ applicationId });
	if (!applicationResult.success) {
		return applicationResult;
	}

	if (applicationResult.data.state === ApplicationStates.DAC_REVISIONS_REQUESTED) {
		console.log(
			`\nPlease review & submit your application with ID ${applicationId} with state Dac Revision Requested\n`,
		);
	}
};

export const dacReviewReminder = async (applicationId: number) => {
	// Post Submit Rep Review, Application has moved to Dac Review, if still in review 7 days later -> send email reminder
	const applicationResult = await getApplicationById({ applicationId });
	if (!applicationResult.success) {
		return applicationResult;
	}

	if (applicationResult.data.state === ApplicationStates.DAC_REVIEW) {
		console.log(`\nPlease review & submit your application with ID ${applicationId} in state Dac Review\n`);
	}
};
