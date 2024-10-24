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

import { bigint, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const applicationsTable = pgTable('applications', {
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
	user_id: varchar({ length: 100 }).notNull(), // User ID set to a string since we don't have details atm about how this will be communicated. This will either be email address or a unique token from the auth system
	state: text().notNull(), // application_state enum
	created_at: timestamp().notNull(),
	approved_at: timestamp(),
	expires_at: timestamp(),
});

// Table application_contents {
// 	Note: '''
// 		All fields here are nullable as this allows us to store partially complete
// 		applications as the user is working through the submission form.

// 		Validation rules for the application content needs to be implemented in the
// 		software, not at the database level.
// 	'''

// 	application_id bigint [not null, ref: - applications.id]
// 	created_at timestamp [not null]
// 	updated_at timestamp [not null]

// 	applicant_first_name varchar(255)
// 	applicant_middle_name varchar(255)
// 	applicant_last_name varchar(255)
// 	applicant_title varchar(255)
// 	applicant_suffix varchar(255)
// 	applicant_position_title varchar(255)
// 	applicant_primary_affiliation varchar(500)
// 	applicant_institutional_email varchar(320) // emails addresses cannot be longer than 320
// 	applicant_profile_url text // no length restriciton on url, application should validate its properly formed url

// 	institutional_rep_title varchar(255)
// 	institutional_rep_first_name varchar(255)
// 	institutional_rep_middle_name varchar(255)
// 	institutional_rep_last_name varchar(255)
// 	institutional_rep_suffix varchar(255)
// 	institutional_rep_primary_affiliation varchar(255)
// 	institutional_rep_email varchar(255)
// 	institutional_rep_profile_url varchar(255)
// 	institutional_rep_position_title varchar(255)
// 	institution_country vachar(255)
// 	institution_state vachar(255)
// 	institution_city vachar(255)
// 	institution_street_address text
// 	institution_postal_code varchar(255) // postal codes globally may be longer, might as well not constrain it
// 	institution_building varchar(255)

// 	project_title text
// 	project_website text
// 	project_abstract text
// 	project_methodology text
// 	project_summary text
// 	project_publication_urls text[]

// 	//TODO: requested study information
// 	requested_studies text[]

// 	// TODO: need to store user agreement to terms

// 	ethics_review_required boolean
// 	ethics_letter bigint [ref: - files.id]

// 	dac_agreement_software_updates boolean [Note: "You will keep all computer systems on which PCGL Controlled Datea reside, or which provide accesss to such data, up-to-date with respect to software patches and antivirus file definitions (if applicable)."]
// 	dac_agreement_non_disclosure boolean [Note: "You will protect ICGC Controlled Data against disclosure to and use by unauthorized individuals."]
// 	dac_agreement_monitor_individual_access boolean [Note: "You will monitor and control which individuals have access to ICGC controlled Data."]
// 	dac_agreement_destroy_data boolean [Note: "You will securely destroy all copies of ICGC Controlled Data in accordance with the terms and conditions of the Data Access Agreement."]
// 	dac_agreement_familiarize_restrictions boolean [Note: "You will familiarixe all individuals who have access to ICGC Controlled Data with the restrictions on its use."]
// 	dac_agreement_provide_it_policy boolean [Note: "You agree to swiftly provide a copy of both your institutional and Research Project related IT policy documents upon request from a DACO representative."]
// 	dac_agreement_notify_unauthorized_access boolean [Note: "You will notify the DACO immediately if you become aware or suspect that someone has gained unauthorized access to the ICGC Controlled Data."]
// 	dac_agreement_certify_application boolean [Note: "You certify that the contents in the application are ture and correct to the best of your knowledge and belief."]
// 	dac_agreement_read_and_agreed boolean [Note: "You have read and agree to abide by the terms and conditions outlined in the Data Access Agreement."]

// 	signed_pdf bigint [ref: -files.id]
// }

// // TODO: Might need to track user agreements separate from the application content, This could model this
// // Table agreements {
// //   id bigint [not null]
// //   user_id varchar(100) [not null]
// //   name text [not null]
// //   agreement_text text [not null]

// //   agreement_type agreement_type [not null] // enum, need to review possible agreements needed
// //   agreed_at timestamp [not null] // with timezone, seconds precision = 0
// // }
