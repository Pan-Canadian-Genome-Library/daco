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
import { withErrorResponseHandler } from '@/api/apiUtils';
import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { type ApplicantDTO, ApplicationStates, ApplicationStateValues } from '@pcgl-daco/data-model';
import { RevisionsModalSchemaType } from '@pcgl-daco/validation';
import { useMutation } from '@tanstack/react-query';

const useRequestRevisions = (currentState: ApplicationStateValues) => {
	return useMutation<ApplicantDTO, ServerError, RevisionsModalSchemaType & { applicationId: string | number }>({
		mutationFn: async (payload) => {
			const response = await fetch(
				`/applications/${payload.applicationId}/${currentState === ApplicationStates.DAC_REVIEW ? 'dac' : 'rep'}/request-revisions`,
				{
					method: 'POST',
					body: JSON.stringify({
						applicantApproved: !payload.applicantInformation,
						applicantNotes: payload.applicantInformation,
						institutionRepApproved: !payload.institutionalRep,
						institutionRepNotes: payload.institutionalRep,
						collaboratorsApproved: !payload.collaborators,
						collaboratorsNotes: payload.collaborators,
						projectApproved: !payload.projectInformation,
						projectNotes: payload.projectInformation,
						requestedStudiesApproved: !payload.requestedStudy,
						requestedStudiesNotes: payload.requestedStudy,
						ethicsApproved: !payload.ethics,
						ethicsNotes: payload.ethics,
						agreementsApproved: !payload.agreements,
						agreementsNotes: payload.agreements,
						appendicesApproved: !payload.appendices,
						appendicesNotes: payload.appendices,
						signAndSubmitApproved: !payload.signature,
						signAndSubmitNotes: payload.signature,
						comments: payload.general,
					}),
				},
			).then(withErrorResponseHandler);

			return await response.json();
		},
	});
};

export default useRequestRevisions;
