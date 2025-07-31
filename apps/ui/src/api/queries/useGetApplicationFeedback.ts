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

	return useQuery<Partial<SectionRevision>, ServerError>({
		queryKey: [`revisions-${id}`],
		retry: 0,
		enabled: state !== undefined,
		queryFn: async () => {
			// Prevent API being called for states that don't utilize revisions
			if (!revisionDependant) {
				return {};
			}

			const response = await fetch(`/applications/${id}/revisions`).then(withErrorResponseHandler);

			return await response.json().then((data: RevisionsDTO[]) => {
				const result: Partial<SectionRevision> = {
					applicant: {
						isApproved: data[0]?.applicantApproved,
						comment: data[0]?.applicantNotes ?? null,
					},
					institutional: {
						isApproved: data[0]?.institutionRepApproved,
						comment: data[0]?.institutionRepNotes ?? null,
					},
					collaborators: {
						isApproved: data[0]?.collaboratorsApproved,
						comment: data[0]?.collaboratorsNotes ?? null,
					},
					project: {
						isApproved: data[0]?.projectApproved,
						comment: data[0]?.projectNotes ?? null,
					},
					study: {
						isApproved: data[0]?.requestedStudiesApproved,
						comment: data[0]?.requestedStudiesNotes ?? null,
					},
					ethics: {
						isApproved: data[0]?.ethicsApproved,
						comment: data[0]?.requestedStudiesNotes ?? null,
					},
					agreement: {
						isApproved: data[0]?.agreementsApproved,
						comment: data[0]?.agreementsNotes ?? null,
					},
					appendices: {
						isApproved: data[0]?.appendicesApproved,
						comment: data[0]?.appendicesNotes ?? null,
					},
					sign: {
						isApproved: data[0]?.signAndSubmitApproved,
						comment: data[0]?.signAndSubmitNotes ?? null,
					},
				};

				return result;
			});
		},
	});
};

export default useGetApplicationFeedback;
