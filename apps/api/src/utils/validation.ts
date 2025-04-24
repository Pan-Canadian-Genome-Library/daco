/*
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
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

import { ApplicationContentsResponse, RevisionsDTO } from '@pcgl-daco/data-model';
import {
	isAgreementKey,
	isAppendicesKey,
	isApplicantKey,
	isEthicsKey,
	isInstitutionalKey,
	isProjectKey,
	isRequestedStudies,
} from '@pcgl-daco/validation';
import { z } from 'zod';

const apiZodErrorMapping: z.ZodErrorMap = (issue, ctx) => {
	if (issue.code === z.ZodIssueCode.invalid_type) {
		if (!issue.expected.includes('undefined') && issue.received.includes('undefined')) {
			return {
				message: `Property '${issue.path[issue.path.length - 1]}' is required.`,
			};
		}
	}

	if (issue.code === z.ZodIssueCode.custom) {
		if (issue.params?.violation === 'noEmptyObject') {
			return {
				message: `Object is empty or only contains unrecognized keys. Object may not be empty.`,
			};
		}
	}

	return { message: ctx.defaultError };
};

/**
 *
 * @param fields ApplicationContent fields sent from the frontend
 * @param revisions Most recent revision data
 * @returns true or false if fields contains a key that is not apart of the revisions
 */
const validateRevisedFields = (fields: ApplicationContentsResponse, revisions: RevisionsDTO): boolean => {
	const result = Object.entries(fields).every((item) => {
		const [key, _] = item;

		if (!revisions.applicantApproved && isApplicantKey(key)) {
			return true;
		} else if (!revisions.institutionRepApproved && isInstitutionalKey(key)) {
			return true;
		} else if (!revisions.projectApproved && isProjectKey(key)) {
			return true;
		} else if (!revisions.ethicsApproved && isEthicsKey(key)) {
			return true;
		} else if (!revisions.agreementsApproved && isAgreementKey(key)) {
			return true;
		} else if (!revisions.appendicesApproved && isAppendicesKey(key)) {
			return true;
		} else if (!revisions.requestedStudiesApproved && isRequestedStudies(key)) {
			return true;
		}
		return false;
	});

	return result;
};

export { apiZodErrorMapping, validateRevisedFields };
