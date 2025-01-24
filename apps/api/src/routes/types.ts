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

import { ApplicationContentUpdates, ApplicationsColumnName, OrderBy } from '@/service/types.js';
import { ApplicationStateValues } from '@pcgl-daco/data-model/src/types.js';

export type ApplicationListRequest = {
	userId: string;
	state?: ApplicationStateValues[];
	sort?: Array<OrderBy<ApplicationsColumnName>>;
	page?: number;
	pageSize?: number;
};

export type ApplicationResponseData = {
	id: number;
	userId: string;
	state: ApplicationStateValues;
	createdAt: Date;
	approvedAt: Date | null;
	updatedAt: Date | null;
	expiresAt: Date | null;
	contents: ApplicationContentResponse | null;
};

export type ApplicationContentResponse = {
	applicationId: ApplicationContentUpdates['application_id'];
	createdAt: ApplicationContentUpdates['created_at'];
	updatedAt: ApplicationContentUpdates['updated_at'];
	applicantFirstName: ApplicationContentUpdates['applicant_first_name'];
	applicantLastName: ApplicationContentUpdates['applicant_last_name'];
	applicantMiddleName: ApplicationContentUpdates['applicant_middle_name'];
	applicantTitle: ApplicationContentUpdates['applicant_title'];
	applicantSuffix: ApplicationContentUpdates['applicant_suffix'];
	applicantPositionTitle: ApplicationContentUpdates['applicant_position_title'];
	applicantPrimaryAffiliation: ApplicationContentUpdates['applicant_primary_affiliation'];
	applicantInstitutionalEmail: ApplicationContentUpdates['applicant_institutional_email'];
	applicantProfileUrl: ApplicationContentUpdates['applicant_profile_url'];
	institutionalRepTitle: ApplicationContentUpdates['institutional_rep_title'];
	institutionalRepFirstName: ApplicationContentUpdates['institutional_rep_first_name'];
	institutionalRepMiddleName: ApplicationContentUpdates['institutional_rep_middle_name'];
	institutionalRepLastName: ApplicationContentUpdates['institutional_rep_last_name'];
	institutionalRepSuffix: ApplicationContentUpdates['institutional_rep_suffix'];
	institutionalRepPrimaryAffiliation: ApplicationContentUpdates['institutional_rep_primary_affiliation'];
	institutionalRepEmail: ApplicationContentUpdates['institutional_rep_email'];
	institutionalRepProfileUrl: ApplicationContentUpdates['institutional_rep_profile_url'];
	institutionalRepPositionTitle: ApplicationContentUpdates['institutional_rep_position_title'];
	institutionCountry: ApplicationContentUpdates['institution_country'];
	institutionState: ApplicationContentUpdates['institution_state'];
	institutionCity: ApplicationContentUpdates['institution_city'];
	institutionStreetAddress: ApplicationContentUpdates['institution_street_address'];
	institutionPostalCode: ApplicationContentUpdates['institution_postal_code'];
	institutionBuilding: ApplicationContentUpdates['institution_building'];
	projectTitle: ApplicationContentUpdates['project_title'];
	projectWebsite: ApplicationContentUpdates['project_website'];
	projectAbstract: ApplicationContentUpdates['project_abstract'];
	projectMethodology: ApplicationContentUpdates['project_methodology'];
	projectSummary: ApplicationContentUpdates['project_summary'];
	projectPublicationUrls: ApplicationContentUpdates['project_publication_urls'];
	requestedStudies: ApplicationContentUpdates['requested_studies'];
	ethicsReviewRequired: ApplicationContentUpdates['ethics_review_required'];
	ethicsLetter: ApplicationContentUpdates['ethics_letter'];
	signedPdf: ApplicationContentUpdates['signed_pdf'];
};
