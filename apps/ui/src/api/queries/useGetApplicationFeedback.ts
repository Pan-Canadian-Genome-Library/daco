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
import { SectionRoutesValues } from '@/pages/AppRouter';
import { RevisionsDTO } from '@pcgl-daco/data-model';

export type RevisionType = {
	isApproved: boolean | undefined;
	comment: string | null;
};

export type VerifyPageRevisionType<T extends string> = {
	[section in T]: RevisionType;
};

const useGetApplicationFeedback = (id?: string | number, isInReviewState?: boolean) => {
	return useQuery<Partial<VerifyPageRevisionType<SectionRoutesValues>>, ServerError>({
		queryKey: [`revisions-${id}`],
		retry: 0,
		queryFn: async () => {
			const response = await fetch(`/applications/${id}/revisions`).then(withErrorResponseHandler);

			return await response.json().then((data: RevisionsDTO[]) => {
				const result: Partial<VerifyPageRevisionType<SectionRoutesValues>> = {
					applicant: {
						isApproved: isInReviewState ? data[0]?.applicantApproved : undefined,
						comment: data[0]?.applicantNotes ?? null,
					},
					institutional: {
						isApproved: isInReviewState ? data[0]?.institutionRepApproved : undefined,
						comment: data[0]?.institutionRepNotes ?? null,
					},
					collaborators: {
						isApproved: isInReviewState ? data[0]?.collaboratorsApproved : undefined,
						comment: data[0]?.collaboratorsNotes ?? null,
					},
					project: {
						isApproved: isInReviewState ? data[0]?.projectApproved : undefined,
						comment: data[0]?.projectNotes ?? null,
					},
					study: {
						isApproved: isInReviewState ? data[0]?.requestedStudiesApproved : undefined,
						comment: data[0]?.requestedStudiesNotes ?? null,
					},
					ethics: {
						isApproved: isInReviewState ? data[0]?.requestedStudiesApproved : undefined,
						comment: data[0]?.requestedStudiesNotes ?? null,
					},
					agreement: {
						isApproved: isInReviewState ? data[0]?.agreementsApproved : undefined,
						comment: data[0]?.agreementsNotes ?? null,
					},
					appendices: {
						isApproved: isInReviewState ? data[0]?.appendicesApproved : undefined,
						comment: data[0]?.appendicesNotes ?? null,
					},
					sign: {
						isApproved: isInReviewState ? data[0]?.signAndSubmitApproved : undefined,
						comment: data[0]?.signAndSubmitNotes ?? null,
					},
				};

				return result;
			});
		},
	});
};

export default useGetApplicationFeedback;
