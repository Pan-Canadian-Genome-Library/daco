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

import { useQuery } from '@tanstack/react-query';

import { withErrorResponseHandler } from '@/api/apiUtils';
import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { ApplicationStates, ApplicationStateValues, RevisionsDTO } from '@pcgl-daco/data-model';
import { SectionRevision } from '@pcgl-daco/validation';

const useGetApplicationFeedback = (id?: string | number, state?: ApplicationStateValues) => {
	/**
	 * We only want to display the approval status if we're in one of these status'
	 */
	const revisionDependant =
		state === ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED ||
		state === ApplicationStates.DAC_REVISIONS_REQUESTED;

	return useQuery<SectionRevision, ServerError>({
		queryKey: [`revisions-${id}`],
		retry: 0,
		enabled: state !== undefined,
		queryFn: async () => {
			// Prevent API being called for states that don't utilize revisions
			if (!revisionDependant) {
				return {
					intro: [],
					applicant: [],
					institutional: [],
					collaborators: [],
					project: [],
					ethics: [],
					study: [],
					agreement: [],
					appendices: [],
					sign: [],
					general: [],
				};
			}

			const response = await fetch(`/applications/${id}/revisions`).then(withErrorResponseHandler);

			return await response.json().then((data: RevisionsDTO[]) => {
				return formatRevisionFeedback(data);
			});
		},
	});
};

export default useGetApplicationFeedback;

const formatRevisionFeedback = (data: RevisionsDTO[]): SectionRevision => {
	return {
		intro: [],
		applicant: data.map((value) => {
			return {
				comment: value.applicantNotes ?? null,
				isApproved: value.applicantApproved,
				isDacRequest: value.isDacRequest,
				createdAt: value.createdAt,
			};
		}),
		institutional: data.map((value) => {
			return {
				comment: value.institutionRepNotes ?? null,
				isApproved: value.institutionRepApproved,
				isDacRequest: value.isDacRequest,
				createdAt: value.createdAt,
			};
		}),
		collaborators: data.map((value) => {
			return {
				comment: value.collaboratorsNotes ?? null,
				isApproved: value.collaboratorsApproved,
				isDacRequest: value.isDacRequest,
				createdAt: value.createdAt,
			};
		}),
		project: data.map((value) => {
			return {
				comment: value.projectNotes ?? null,
				isApproved: value.projectApproved,
				isDacRequest: value.isDacRequest,
				createdAt: value.createdAt,
			};
		}),
		study: data.map((value) => {
			return {
				comment: value.requestedStudiesNotes ?? null,
				isApproved: value.requestedStudiesApproved,
				isDacRequest: value.isDacRequest,
				createdAt: value.createdAt,
			};
		}),
		ethics: data.map((value) => {
			return {
				comment: value.ethicsNotes ?? null,
				isApproved: value.ethicsApproved,
				isDacRequest: value.isDacRequest,
				createdAt: value.createdAt,
			};
		}),
		agreement: data.map((value) => {
			return {
				comment: value.agreementsNotes ?? null,
				isApproved: value.agreementsApproved,
				isDacRequest: value.isDacRequest,
				createdAt: value.createdAt,
			};
		}),
		appendices: data.map((value) => {
			return {
				comment: value.appendicesNotes ?? null,
				isApproved: value.appendicesApproved,
				isDacRequest: value.isDacRequest,
				createdAt: value.createdAt,
			};
		}),
		sign: data.map((value) => {
			return {
				comment: value.signAndSubmitNotes ?? null,
				isApproved: value.signAndSubmitApproved,
				isDacRequest: value.isDacRequest,
				createdAt: value.createdAt,
				general: value.comments,
			};
		}),
		general: data.map((value) => {
			return {
				comment: value.comments ?? null,
				isDacRequest: value.isDacRequest,
				createdAt: value.createdAt,
			};
		}),
	};
};
