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
import { useMutation } from '@tanstack/react-query';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';

import { fetch } from '@/global/FetchClient';
import { ServerError } from '@/global/types';
import { ApplicationContentsResponse, ApplicationResponseData } from '@pcgl-daco/data-model';

export const ApiFormat = {
	applicantFirstName: 'applicant_first_name',
	applicantMiddleName: 'applicant_middle_name',
	applicantLastName: 'applicant_last_name',
	applicantTitle: 'applicant_title',
	applicantSuffix: 'applicant_suffix',
	applicantPositionTitle: 'applicant_position_title',
	applicantPrimaryAffiliation: 'applicant_primary_affiliation',
	applicantInstitutionalEmail: 'applicant_institutional_email',
	applicantProfileUrl: 'applicant_profile_url',
	institutionalRepTitle: 'institutional_rep_title',
	institutionalRepFirstName: 'institutional_rep_first_name',
	institutionalRepMiddleName: 'institutional_rep_middle_name',
	institutionalRepLastName: 'institutional_rep_last_name',
	institutionalRepSuffix: 'institutional_rep_suffix',
	institutionalRepPrimaryAffiliation: 'institutional_rep_primary_affiliation',
	institutionalRepEmail: 'institutional_rep_email',
	institutionalRepProfileUrl: 'institutional_rep_profile_url',
	institutionalRepPositionTitle: 'institutional_rep_position_title',
	institutionCountry: 'institution_country',
	institutionState: 'institution_state',
	institutionCity: 'institution_city',
	institutionStreetAddress: 'institution_street_address',
	institutionPostalCode: 'institution_postal_code',
	institutionBuilding: 'institution_building',
	projectTitle: 'project_title',
	projectWebsite: 'project_website',
	projectBackground: 'project_background',
	projectMethodology: 'project_methodology',
	projectAims: 'project_aims',
	projectSummary: 'project_summary',
} as const;

type ApiFormatKeys = keyof typeof ApiFormat;

interface UpdateObject {
	[key: string]: string | null;
}

/**
 *	Converts form fields from camelCase to snake_case for api compatibility
 *
 * @param storeState  current store form values
 * @returns an object compatible with api fields
 */
const GenerateUpdateObjectMap = (storeState: ApplicationContentsResponse | null) => {
	if (!storeState) {
		return;
	}
	const response = Object.entries(storeState).reduce<UpdateObject>((acu, [key, value]) => {
		// if the value is null, that means its hasn't been dirtied, so skip adding it UpdateObject
		if (value !== null && key in ApiFormat) {
			const apiKey = ApiFormat[key as ApiFormatKeys];
			acu[apiKey] = value;
		}
		return acu;
	}, {});

	return response;
};

const useEditApplication = () => {
	const { t: translate } = useTranslation();

	return useMutation<ApplicationResponseData, ServerError, ApplicationContentsResponse | null>({
		mutationFn: async (state) => {
			const update = GenerateUpdateObjectMap(state);

			const response = await fetch('/applications/edit', {
				method: 'POST',
				body: JSON.stringify({
					id: state?.applicationId,
					update,
				}),
			});

			if (!response.ok) {
				const error = {
					message: translate('errors.generic.title'),
					errors: translate('errors.generic.message'),
				};

				switch (response.status) {
					case 400:
						error.message = translate('errors.fetchError.title');
						error.errors = translate('errors.fetchError.message');
						break;
				}

				throw error;
			}

			return await response.json();
		},
		onError: (error) => {
			notification.error({
				message: error.message,
			});
		},
		onSuccess: () => {},
	});
};

export default useEditApplication;
