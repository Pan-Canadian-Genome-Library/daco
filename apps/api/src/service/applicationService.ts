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

import { and, count, desc, eq, inArray, or, sql } from 'drizzle-orm';

import { type PostgresDb } from '@/db/index.js';
import { applicationActions } from '@/db/schemas/applicationActions.ts';
import { applicationContents } from '@/db/schemas/applicationContents.js';
import { applications } from '@/db/schemas/applications.js';
import { dacComments } from '@/db/schemas/dacComments.ts';
import { revisionRequests } from '@/db/schemas/revisionRequests.js';
import BaseLogger from '@/logger.js';
import { failure, success, type AsyncResult } from '@/utils/results.js';
import { ApplicationStateTotals, DacCommentRecord, RevisionsDTO } from '@pcgl-daco/data-model';
import {
	ApplicationStates,
	type ApplicationListResponse,
	type ApplicationStateValues,
} from '@pcgl-daco/data-model/src/types.js';
import { SectionRoutesValues } from '@pcgl-daco/validation';
import { collaborators } from '../db/schemas/collaborators.ts';
import {
	type ApplicationActionRecord,
	type ApplicationContentModel,
	type ApplicationContentUpdates,
	type ApplicationRecord,
	type ApplicationsColumnName,
	type ApplicationUpdates,
	type JoinedApplicationRecord,
	type OrderBy,
	type PostgresTransaction,
	type RevisionRequestModel,
	type RevisionRequestRecord,
} from './types.js';
import { applicationsQuery } from './utils.ts';

const logger = BaseLogger.forModule('applicationService');

/**
 * ApplicationService provides methods for Applications DB access
 * @param db - Drizzle Postgres DB Instance
 */
const applicationSvc = (db: PostgresDb) => ({
	/** @method createApplication: Create new Application record */
	createApplication: async ({ user_id }: { user_id: string }): AsyncResult<ApplicationRecord, 'SYSTEM_ERROR'> => {
		const newApplication: typeof applications.$inferInsert = {
			user_id,
			state: ApplicationStates.DRAFT,
		};

		try {
			const application = await db.transaction(async (transaction) => {
				// Create Application
				const newApplicationRecord = await transaction.insert(applications).values(newApplication).returning();
				if (!newApplicationRecord[0]) {
					throw new Error('Application record is undefined');
				}

				// Create associated ApplicationContents
				const { id: application_id } = newApplicationRecord[0];

				const newAppContents: Pick<ApplicationContentModel, 'application_id' | 'created_at' | 'updated_at'> = {
					application_id,
					created_at: new Date(),
					updated_at: new Date(),
				};
				const newAppContentsRecord = await transaction.insert(applicationContents).values(newAppContents).returning();
				if (!newAppContentsRecord[0]) {
					throw new Error('Application contents record is undefined');
				}

				// Join records
				const { id: contents_id } = newAppContentsRecord[0];

				const application = await transaction
					.update(applications)
					.set({ contents: contents_id })
					.where(eq(applications.id, application_id))
					.returning();
				if (!application[0]) {
					throw new Error('Application record is undefined');
				}

				return application[0];
			});

			return success(application);
		} catch (err) {
			logger.error(`Error at createApplication with user_id: ${user_id}`);
			return failure('SYSTEM_ERROR', 'An unexpected database failure occurred, application was not created.');
		}
	},
	/** @method editApplication: Update Application Contents and parent Application record */
	editApplication: async ({
		id,
		update,
		transaction,
	}: {
		id: number;
		update: ApplicationContentUpdates;
		transaction?: PostgresTransaction;
	}): AsyncResult<JoinedApplicationRecord, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
		try {
			const dbTransaction = transaction ? transaction : db;

			const application = await dbTransaction.transaction(async (transaction) => {
				// Update Application Contents
				const contents = { ...update, updated_at: sql`NOW()` };
				const editedContents = await transaction
					.update(applicationContents)
					.set(contents)
					.where(eq(applicationContents.application_id, id))
					.returning();
				if (!editedContents[0]) {
					return failure('NOT_FOUND', `Could not find application with the ID: ${id}`);
				}

				// Update Related Application
				const applicationUpdates = { updated_at: sql`NOW()` };
				const editedApplication = await transaction
					.update(applications)
					.set(applicationUpdates)
					.where(eq(applications.id, id))
					.returning();
				if (!editedApplication[0]) {
					return failure('SYSTEM_ERROR', 'An unexpected database failure occurred, no updates were applied.');
				}

				// Returns merged record
				return success({
					...editedApplication[0],
					contents: editedContents[0],
				});
			});

			return application;
		} catch (err) {
			logger.error(`Error at editApplication with id: ${id}`, err);
			return failure('SYSTEM_ERROR', 'An unexpected error occurred attempting to edit application.');
		}
	},
	/** @method findOneAndUpdate: Update a base Application record */
	findOneAndUpdate: async ({
		id,
		update,
		transaction,
	}: {
		id: number;
		update: ApplicationUpdates;
		transaction?: PostgresTransaction;
	}): AsyncResult<ApplicationRecord, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
		try {
			const dbTransaction = transaction ? transaction : db;
			const application = await dbTransaction
				.update(applications)
				.set({ ...update, updated_at: sql`NOW()` })
				.where(eq(applications.id, id))
				.returning();
			if (!application[0]) throw new Error('Application record is undefined');

			return success(application[0]);
		} catch (err) {
			logger.error(`Error at findOneAndUpdate with id: ${id}`, err);
			return failure('SYSTEM_ERROR', 'An unexpected error occurred attempting to update application record.');
		}
	},
	/** @method getApplicationById: Find a specific Application record */
	getApplicationById: async ({ id }: { id: number }): AsyncResult<ApplicationRecord, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
		try {
			const applicationRecord = await db.select().from(applications).where(eq(applications.id, id));

			if (!applicationRecord[0]) {
				return failure('NOT_FOUND', `No application found with the ID: ${id}`);
			}

			return success(applicationRecord[0]);
		} catch (err) {
			logger.error(`Error at getApplicationById with id: ${id}`, err);
			return failure('SYSTEM_ERROR', 'An unexpected error occurred retrieving the application from the database.');
		}
	},
	/** @method getApplicationForCollaboratorEmail: Find a specific Application record that a collaborator belongs to */
	getApplicationForCollaboratorEmail: async ({
		collaboratorEmail,
	}: {
		collaboratorEmail: string;
	}): AsyncResult<ApplicationRecord, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
		try {
			// TODO: These two queries can be combined into 1
			// Fetch applicationId for the collaborator
			const applicationIds = await db
				.select({ application_id: collaborators.application_id })
				.from(collaborators)
				.where(eq(collaborators.institutional_email, collaboratorEmail));
			if (applicationIds.length === 0) {
				return failure('NOT_FOUND', 'Could not find an collaborator for the provided collaborator email.');
			}

			// Fetch the applciation by ID
			const applicationRecords = await db
				.select()
				.from(applications)
				.where(
					inArray(
						applications.id,
						applicationIds.map((value) => value.application_id),
					),
				);

			const application = applicationRecords[0];
			if (!application) {
				return failure('NOT_FOUND', 'Could not find the application that this collaborator belongs to.');
			}
			return success(application);
		} catch (err) {
			logger.error(`Error at getApplicationForCollaboratorId with email: ${collaboratorEmail}`, err);
			return failure('SYSTEM_ERROR', 'An unexpected error occurred fetching application data from the database.');
		}
	},
	/** @method getApplicationWithContents: Find an Application record with Contents included */
	getApplicationWithContents: async ({
		id,
	}: {
		id: number;
	}): AsyncResult<JoinedApplicationRecord, 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
		try {
			const applicationRecord = await db
				.select()
				.from(applications)
				.where(eq(applications.id, id))
				.leftJoin(applicationContents, eq(applications.contents, applicationContents.id));

			if (!applicationRecord[0]) {
				return failure('NOT_FOUND', `No application found with the ID: ${id}`);
			}

			const application = {
				...applicationRecord[0].applications,
				contents: applicationRecord[0].application_contents,
			};

			return success(application);
		} catch (err) {
			logger.error(`Error at getApplicationById with id: ${id}`, err);
			return failure('SYSTEM_ERROR', 'An unexpected error occurred attempting to get application record.');
		}
	},
	/**
	 * @method listApplications: Find multiple sorted Application records
	 * Includes ApplicantInformation and PagingMetadata
	 */
	listApplications: async ({
		user_id,
		state = [],
		sort = [],
		page = 0,
		pageSize = 20,
		search,
		isApplicantView = false,
	}: {
		user_id?: string;
		state?: ApplicationStateValues[];
		sort?: Array<OrderBy<ApplicationsColumnName>>;
		page?: number;
		pageSize?: number;
		search?: string;
		isApplicantView?: boolean;
	}): AsyncResult<ApplicationListResponse, 'SYSTEM_ERROR' | 'INVALID_PARAMETERS'> => {
		try {
			const transformSearchIntoQuery = (searchText: string) => {
				const sanitizedSearch = searchText
					?.trim()
					.replace(/[^a-zA-Z0-9\s@.\-]/g, '') // Remove special characters except @ . -
					.trim() // apply trim again in-case user inputs a special characters as the first/last word
					.replace(/\s+/g, ' | '); // add OR between phrases

				const searchQuery = sql`(
									setweight(to_tsvector('english', ${applicationContents.application_id}::text), 'A') ||
									setweight(to_tsvector('english', COALESCE(${applicationContents.applicant_first_name}, '') || ' ' || COALESCE(${applicationContents.applicant_last_name}, '')), 'B') ||
									setweight(to_tsvector('english', COALESCE(${applicationContents.applicant_institutional_email}, '')), 'C') ||
									setweight(to_tsvector('english', COALESCE(${applicationContents.applicant_primary_affiliation}, '')), 'D')
								)
     		 @@ to_tsquery('english', ${`%${sanitizedSearch}%` + ':*'})`;

				return searchQuery;
			};

			const customCount = (state: ApplicationStateValues) => {
				return sql<number>`COUNT(CASE WHEN ${applications.state} = ${state} THEN ${applications.state} END)`.mapWith(
					Number,
				);
			};

			const rawApplicationRecord = await db
				.select({
					id: applications.id,
					userId: applications.user_id,
					state: applications.state,
					createdAt: applications.created_at,
					updatedAt: applications.updated_at,
					applicant: {
						createdAt: applicationContents.created_at,
						firstName: applicationContents.applicant_first_name,
						lastName: applicationContents.applicant_last_name,
						email: applicationContents.applicant_institutional_email,
						country: applicationContents.institution_country,
						institution: applicationContents.applicant_primary_affiliation,
					},
				})
				.from(applications)
				.where(
					and(
						user_id ? eq(applications.user_id, String(user_id)) : undefined,
						state.length ? inArray(applications.state, state) : undefined,
						search ? transformSearchIntoQuery(search) : undefined,
					),
				)
				.leftJoin(applicationContents, eq(applications.contents, applicationContents.id))
				.orderBy(...applicationsQuery(sort))
				.offset(page * pageSize)
				.limit(pageSize);

			const countResult = await db
				.select({
					APPROVED: customCount(ApplicationStates.APPROVED),
					CLOSED: customCount(ApplicationStates.CLOSED),
					DAC_REVIEW: customCount(ApplicationStates.DAC_REVIEW),
					DAC_REVISIONS_REQUESTED: customCount(ApplicationStates.DAC_REVISIONS_REQUESTED),
					DRAFT: customCount(ApplicationStates.DRAFT),
					INSTITUTIONAL_REP_REVIEW: customCount(ApplicationStates.INSTITUTIONAL_REP_REVIEW),
					REJECTED: customCount(ApplicationStates.REJECTED),
					INSTITUTIONAL_REP_REVISION_REQUESTED: customCount(ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED),
					REVOKED: customCount(ApplicationStates.REVOKED),
					TOTAL: count(),
				})
				.from(applications)
				.where(
					and(
						user_id ? eq(applications.user_id, String(user_id)) : undefined,
						search ? transformSearchIntoQuery(search) : undefined,
					),
				)
				.leftJoin(applicationContents, eq(applications.contents, applicationContents.id));

			if (!countResult[0]) {
				return failure('SYSTEM_ERROR', 'Failed to retrieve application totals');
			}

			let returnableApplications = rawApplicationRecord;

			/**
			 *
			 * If applicant view is true, records with revisions will be pushed to the top.
			 * if applicant view is false, sort DAC_REVIEW records to the top to display on the front end, however...
			 *
			 * We only want to sort DAC_REVIEW records to the top if:
			 * 	- The user hasn't sorted by any filter
			 * 	- If the sorting filters include DAC_REVIEW
			 * 		- Keeping in mind that if it includes JUST DAC_REVIEW, then we skip
			 * 		 since the sorting will already be handled by drizzle in this case.
			 */
			if (
				!isApplicantView &&
				(!state?.length || (state.length !== 1 && state?.includes(ApplicationStates.DAC_REVIEW)))
			) {
				const reviewApplications = returnableApplications.filter(
					(applications) => applications.state === ApplicationStates.DAC_REVIEW,
				);

				const nonReviewApplications = returnableApplications.filter(
					(applications) => applications.state !== ApplicationStates.DAC_REVIEW,
				);

				returnableApplications = [...reviewApplications, ...nonReviewApplications];
			} else {
				const reviewApplications = returnableApplications.filter(
					(applications) =>
						applications.state === ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED ||
						applications.state === ApplicationStates.DAC_REVISIONS_REQUESTED,
				);

				const nonReviewApplications = returnableApplications.filter(
					(applications) =>
						applications.state !== ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED &&
						applications.state !== ApplicationStates.DAC_REVISIONS_REQUESTED,
				);

				returnableApplications = [...reviewApplications, ...nonReviewApplications];
			}

			const applicationsList: ApplicationListResponse = {
				applications: returnableApplications,
				pagingMetadata: {
					page: page,
					pageSize: pageSize,
				},
				totals: {
					...countResult[0],
				},
			};

			return success(applicationsList);
		} catch (err) {
			logger.error(`Error at listApplications with with user_id: ${user_id} and state: ${state}`, err);
			return failure('SYSTEM_ERROR', 'An unexpected error occurred attempting to list applications.');
		}
	},
	/** @method applicationStateTotals: Obtain count for all Application records with each State */
	applicationStateTotals: async (): AsyncResult<ApplicationStateTotals, 'SYSTEM_ERROR'> => {
		try {
			const rawApplicationRecord = await db
				.select({
					APPROVED: db.$count(applications, eq(applications.state, 'APPROVED')),
					CLOSED: db.$count(applications, eq(applications.state, 'CLOSED')),
					DAC_REVIEW: db.$count(applications, eq(applications.state, 'DAC_REVIEW')),
					DAC_REVISIONS_REQUESTED: db.$count(applications, eq(applications.state, 'DAC_REVISIONS_REQUESTED')),
					DRAFT: db.$count(applications, eq(applications.state, 'DRAFT')),
					INSTITUTIONAL_REP_REVIEW: db.$count(applications, eq(applications.state, 'INSTITUTIONAL_REP_REVIEW')),
					REJECTED: db.$count(applications, eq(applications.state, 'REJECTED')),
					INSTITUTIONAL_REP_REVISION_REQUESTED: db.$count(
						applications,
						eq(applications.state, 'INSTITUTIONAL_REP_REVISION_REQUESTED'),
					),
					REVOKED: db.$count(applications, eq(applications.state, 'REVOKED')),
					TOTAL: db.$count(applications),
				})
				.from(applications)
				.limit(1);

			if (rawApplicationRecord[0] && rawApplicationRecord.length) {
				return success(rawApplicationRecord[0]);
			} else {
				return success({
					APPROVED: 0,
					CLOSED: 0,
					DAC_REVIEW: 0,
					DAC_REVISIONS_REQUESTED: 0,
					DRAFT: 0,
					INSTITUTIONAL_REP_REVIEW: 0,
					REJECTED: 0,
					INSTITUTIONAL_REP_REVISION_REQUESTED: 0,
					REVOKED: 0,
					TOTAL: 0,
				});
			}
		} catch (err) {
			logger.error(`Error querying applicationStateTotals`, err);
			return failure('SYSTEM_ERROR', 'An unexpected error occurred attempting to retrieve application counts.');
		}
	},
	createRevisionRequest: async ({
		applicationId,
		revisionData,
	}: {
		applicationId: number;
		revisionData: RevisionRequestModel;
	}): AsyncResult<RevisionRequestRecord, 'SYSTEM_ERROR'> => {
		try {
			// Using transaction for inserting
			const result = await db.transaction(async (transaction) => {
				// Insert into the revision_requests table
				const revisionRecord = await transaction.insert(revisionRequests).values(revisionData).returning();
				if (!revisionRecord[0]) throw new Error('Revision request record is undefined');

				// Returning the inserted revision request
				return revisionRecord[0];
			});

			return success(result);
		} catch (error) {
			const message = `Error creating revision request for applicationId: ${applicationId}`;
			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	getRevisions: async ({ applicationId }: { applicationId: number }): AsyncResult<RevisionsDTO[], 'SYSTEM_ERROR'> => {
		try {
			const results = await db
				.select({
					applicationsId: revisionRequests.application_id,
					applicationActionId: applicationActions.id,
					applicationAction: applicationActions.action,
					comments: revisionRequests.comments,
					applicantNotes: revisionRequests.applicant_notes,
					applicantApproved: revisionRequests.applicant_approved,
					institutionRepApproved: revisionRequests.institution_rep_approved,
					institutionRepNotes: revisionRequests.institution_rep_notes,
					collaboratorsApproved: revisionRequests.collaborators_approved,
					collaboratorsNotes: revisionRequests.collaborators_notes,
					projectApproved: revisionRequests.project_approved,
					projectNotes: revisionRequests.project_notes,
					requestedStudiesApproved: revisionRequests.requested_studies_approved,
					requestedStudiesNotes: revisionRequests.requested_studies_notes,
					ethicsApproved: revisionRequests.ethics_approved,
					ethicsNotes: revisionRequests.ethics_notes,
					agreementsApproved: revisionRequests.agreements_approved,
					agreementsNotes: revisionRequests.agreements_notes,
					appendicesApproved: revisionRequests.appendices_approved,
					appendicesNotes: revisionRequests.appendices_notes,
					signAndSubmitApproved: revisionRequests.sign_and_submit_approved,
					signAndSubmitNotes: revisionRequests.sign_and_submit_notes,
					createdAt: revisionRequests.created_at,
				})
				.from(applicationActions)
				.where(
					and(
						eq(revisionRequests.application_id, applicationId),
						or(
							eq(applicationActions.action, 'DAC_REVIEW_REVISION_REQUEST'),
							eq(applicationActions.action, 'INSTITUTIONAL_REP_REVISION_REQUEST'),
						),
					),
				)
				.innerJoin(revisionRequests, eq(revisionRequests.id, applicationActions.revisions_request_id))
				.orderBy(desc(revisionRequests.created_at));

			const transformResult: RevisionsDTO[] = results.map((revision) => {
				return {
					...revision,
					isDacRequest: revision.applicationAction === 'DAC_REVIEW_REVISION_REQUEST',
				};
			});

			return success(transformResult);
		} catch (error) {
			const message = `Error while fetching revisions for applicationId: ${applicationId}`;
			logger.error(message, error);
			return failure('SYSTEM_ERROR', message);
		}
	},
	updateApplicationActionRecordRevisionId: async ({
		actionId,
		revisionId,
	}: {
		actionId: number;
		revisionId: number;
	}): AsyncResult<ApplicationActionRecord[], 'NOT_FOUND' | 'SYSTEM_ERROR'> => {
		try {
			const result = await db
				.update(applicationActions)
				.set({ revisions_request_id: revisionId })
				.where(eq(applicationActions.id, actionId))
				.returning();

			return success(result);
		} catch (err) {
			const message = `Error at updateApplicationActionRecord with action id: ${actionId}`;
			logger.error(message, err);
			return failure('SYSTEM_ERROR', message);
		}
	},
	createDacComment: async ({
		applicationId,
		message,
		userId,
		userName,
		section,
		toDacChair,
		transaction,
	}: {
		applicationId: number;
		message: string;
		userId: string;
		userName: string;
		section: SectionRoutesValues;
		toDacChair: boolean;
		transaction?: PostgresTransaction;
	}): AsyncResult<DacCommentRecord, 'SYSTEM_ERROR'> => {
		try {
			const dbTransaction = transaction ? transaction : db;

			const result = await dbTransaction.transaction(async (tx) => {
				const commentRecord = await tx
					.insert(dacComments)
					.values({
						application_id: applicationId,
						user_id: userId,
						message,
						user_name: userName,
						section: section.toUpperCase(),
						dac_chair_only: toDacChair,
					})
					.returning({
						id: dacComments.id,
						applicationId: dacComments.application_id,
						userId: dacComments.user_id,
						message: dacComments.message,
						userName: dacComments.user_name,
						section: dacComments.section,
						dacChairOnly: dacComments.dac_chair_only,
						createdAt: dacComments.created_at,
					});
				if (!commentRecord[0]) throw new Error('Failed to insert dac comment');
				// Returning the inserted comment
				return commentRecord[0];
			});

			return success(result);
		} catch (error) {
			const message = `Error creating DAC comment for applicationId: ${applicationId}`;
			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
	getDacComment: async ({
		applicationId,
		section,
		isDac,
	}: {
		applicationId: number;
		section: string;
		isDac: boolean;
	}): AsyncResult<DacCommentRecord[], 'SYSTEM_ERROR'> => {
		try {
			const commentRecord = await db
				.select({
					id: dacComments.id,
					applicationId: dacComments.application_id,
					userId: dacComments.user_id,
					message: dacComments.message,
					userName: dacComments.user_name,
					section: dacComments.section,
					dacChairOnly: dacComments.dac_chair_only,
					createdAt: dacComments.created_at,
				})
				.from(dacComments)
				.where(
					and(
						eq(dacComments.application_id, applicationId), // Grab specific application id
						eq(dacComments.section, section.toUpperCase()), // Grab specific section
						isDac ? undefined : eq(dacComments.dac_chair_only, false), // if is dac, then we can return chair comments
					),
				);

			return success(commentRecord);
		} catch (error) {
			const message = `Error retrieving DAC comments for applicationId: ${applicationId}`;
			logger.error(message, error);

			return failure('SYSTEM_ERROR', message);
		}
	},
});

export { applicationSvc };
