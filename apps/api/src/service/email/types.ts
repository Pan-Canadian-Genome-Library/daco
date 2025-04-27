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

import { RevisionRequestModel } from '../types.ts';

// TODO: Likely to be refactored once we add translations
export const EmailSubjects = {
	INSTITUTIONAL_REP_REVIEW_REQUEST: 'Review Request for PCGL DACO Application',
	NOTIFY_APPLICANT_REP_SUBMIT_DAC_REVIEW: ' Your PCGL DACO Application Has Been Submitted for DAC Review',
	NOTIFY_DAC_REVIEW_REVISIONS: 'Request for DAC Review of PCGL DACO Application',
	NOTIFY_REVISION: 'Revisions Requested on Your PCGL DACO Application',
	NOTIFY_APPROVAL: 'Congratulations! Your DACO Application Has Been Approved',
	DACO_APPLICATION_STATUS: 'DACO Application Status',
} as const;

export type EmailSubjectsType = (typeof EmailSubjects)[keyof typeof EmailSubjects];

export type BaseEmailType = {
	to?: string | null;
	lang?: string;
};

export type GenerateInstitutionalRepType = {
	id: string | number;
	repName: string;
	applicantName: string;
	submittedDate: Date | string;
	// NOTE: sign up url for the institutional rep, subject to change
	registerUrl?: string;
} & BaseEmailType;

export type GenerateRejectType = {
	id: string | number;
	name: string;
	comment: string;
} & BaseEmailType;

export type GenerateApproveType = {
	id: string | number;
	name: string;
	lang?: string;
} & BaseEmailType;

export type GenerateDacRevisionType = {
	id: string | number;
	applicantName: string;
	submittedDate: Date | string;
} & BaseEmailType;

export type GenerateApplicantRevisionType = {
	id: string | number;
	applicantName: string;
	comments: RevisionRequestModel;
} & BaseEmailType;

export type GenerateApplicantRepRevisionType = {
	id: string | number;
	applicantName: string;
	institutionalRepFirstName: string;
	institutionalRepLastName: string;
	comments: RevisionRequestModel;
} & BaseEmailType;
