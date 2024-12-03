import { bigint, boolean, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const actionTypes = pgEnum('action_types', [
	'CREATE',
	'WITHDRAW',
	'CLOSE',
	'REQUEST_INSTITUTIONAL_REP',
	'INSTITUTIONAL_REP_APPROVED',
	'INSTITUTIONAL_REP_REJECTED',
	'DAC_REVIEW_APPROVED',
	'DAC_REVIEW_REJECTED',
	'DAC_REVIEW_REVISIONS',
	'REVOKE',
]);
export const agreementTypes = pgEnum('agreement_types', [
	'dac_agreement_software_updates',
	'dac_agreement_non_disclosure',
	'dac_agreement_monitor_individual_access',
	'dac_agreement_destroy_data',
	'dac_agreement_familiarize_restrictions',
	'dac_agreement_provide_it_policy',
	'dac_agreement_notify_unauthorized_access',
	'dac_agreement_certify_application',
	'dac_agreement_read_and_agreed',
]);
export const applicationStates = pgEnum('application_states', [
	'DRAFT',
	'INSTITUTIONAL_REP_REVIEW',
	'DAC_REVIEW',
	'DAC_REVISIONS_REQUESTED',
	'REJECTED',
	'APPROVED',
	'CLOSED',
	'REVOKED',
]);
export const fileTypes = pgEnum('file_types', ['SIGNED_APPLICATION', 'ETHICS_LETTER']);

export const actions = pgTable('actions', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
		name: 'actions_id_seq',
		startWith: 1,
		increment: 1,
		minValue: 1,
		maxValue: 9223372036854775807,
		cache: 1,
	}),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	applicationId: bigint('application_id', { mode: 'number' }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
	userId: varchar('user_id', { length: 100 }).notNull(),
	action: actionTypes().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	revisionsRequestId: bigint('revisions_request_id', { mode: 'number' }),
	stateBefore: varchar('state_before', { length: 255 }).notNull(),
	stateAfter: varchar('state_after', { length: 255 }).notNull(),
});

export const agreements = pgTable('agreements', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
		name: 'agreements_id_seq',
		startWith: 1,
		increment: 1,
		minValue: 1,
		maxValue: 9223372036854775807,
		cache: 1,
	}),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	applicationId: bigint('application_id', { mode: 'number' }),
	userId: varchar('user_id', { length: 100 }).notNull(),
	name: text().notNull(),
	agreementText: text('agreement_text').notNull(),
	agreementType: agreementTypes('agreement_type').notNull(),
	agreedAt: timestamp('agreed_at', { mode: 'string' }).notNull(),
});

export const applicationContents = pgTable('application_contents', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
		name: 'application_contents_id_seq',
		startWith: 1,
		increment: 1,
		minValue: 1,
		maxValue: 9223372036854775807,
		cache: 1,
	}),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	applicationId: bigint('application_id', { mode: 'number' }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	applicantFirstName: varchar('applicant_first_name', { length: 255 }),
	applicantMiddleName: varchar('applicant_middle_name', { length: 255 }),
	applicantLastName: varchar('applicant_last_name', { length: 255 }),
	applicantTitle: varchar('applicant_title', { length: 255 }),
	applicantSuffix: varchar('applicant_suffix', { length: 255 }),
	applicantPositionTitle: varchar('applicant_position_title', { length: 255 }),
	applicantPrimaryAffiliation: varchar('applicant_primary_affiliation', { length: 500 }),
	applicantInstitutionalEmail: varchar('applicant_institutional_email', { length: 320 }),
	applicantProfileUrl: text('applicant_profile_url'),
	institutionalRepTitle: varchar('institutional_rep_title', { length: 255 }),
	institutionalRepFirstName: varchar('institutional_rep_first_name', { length: 255 }),
	institutionalRepMiddleName: varchar('institutional_rep_middle_name', { length: 255 }),
	institutionalRepLastName: varchar('institutional_rep_last_name', { length: 255 }),
	institutionalRepSuffix: varchar('institutional_rep_suffix', { length: 255 }),
	institutionalRepPrimaryAffiliation: varchar('institutional_rep_primary_affiliation', { length: 255 }),
	institutionalRepEmail: varchar('institutional_rep_email', { length: 255 }),
	institutionalRepProfileUrl: varchar('institutional_rep_profile_url', { length: 255 }),
	institutionalRepPositionTitle: varchar('institutional_rep_position_title', { length: 255 }),
	institutionCountry: varchar('institution_country', { length: 255 }),
	institutionState: varchar('institution_state', { length: 255 }),
	institutionCity: varchar('institution_city', { length: 255 }),
	institutionStreetAddress: text('institution_street_address'),
	institutionPostalCode: varchar('institution_postal_code', { length: 255 }),
	institutionBuilding: varchar('institution_building', { length: 255 }),
	projectTitle: text('project_title'),
	projectWebsite: text('project_website'),
	projectAbstract: text('project_abstract'),
	projectMethodology: text('project_methodology'),
	projectSummary: text('project_summary'),
	projectPublicationUrls: text('project_publication_urls').array(),
	requestedStudies: text('requested_studies').array(),
	ethicsReviewRequired: boolean('ethics_review_required'),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	ethicsLetter: bigint('ethics_letter', { mode: 'number' }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	signedPdf: bigint('signed_pdf', { mode: 'number' }),
});

export const collaborators = pgTable('collaborators', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
		name: 'collaborators_id_seq',
		startWith: 1,
		increment: 1,
		minValue: 1,
		maxValue: 9223372036854775807,
		cache: 1,
	}),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	applicationId: bigint('application_id', { mode: 'number' }),
	firstName: varchar('first_name', { length: 255 }).notNull(),
	middleName: varchar('middle_name', { length: 255 }),
	lastName: varchar('last_name', { length: 255 }).notNull(),
	title: varchar({ length: 255 }),
	suffix: varchar({ length: 255 }),
	positionTitle: varchar('position_title', { length: 255 }).notNull(),
	institutionalEmail: varchar('institutional_email', { length: 320 }).notNull(),
	profileUrl: text('profile_url'),
	collaboratorType: text('collaborator_type'),
});

export const files = pgTable('files', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
		name: 'files_id_seq',
		startWith: 1,
		increment: 1,
		minValue: 1,
		maxValue: 9223372036854775807,
		cache: 1,
	}),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	applicationId: bigint('application_id', { mode: 'number' }).notNull(),
	type: fileTypes().notNull(),
	submitterUserId: varchar('submitter_user_id', { length: 100 }).notNull(),
	submittedAt: timestamp('submitted_at', { mode: 'string' }).notNull(),
	// TODO: failed to parse database type 'bytea'
	// content: unknown('content').notNull(),
	filename: varchar({ length: 255 }),
});

export const revisionRequests = pgTable('revision_requests', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
		name: 'revision_requests_id_seq',
		startWith: 1,
		increment: 1,
		minValue: 1,
		maxValue: 9223372036854775807,
		cache: 1,
	}),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	applicationId: bigint('application_id', { mode: 'number' }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
	comments: text(),
	applicantNotes: text('applicant_notes'),
	applicantApproved: boolean('applicant_approved').notNull(),
	institutionRepApproved: boolean('institution_rep_approved').notNull(),
	institutionRepNotes: text('institution_rep_notes'),
	collaboratorsApproved: boolean('collaborators_approved').notNull(),
	collaboratorsNotes: text('collaborators_notes'),
	projectApproved: boolean('project_approved').notNull(),
	projectNotes: text('project_notes'),
	requestedStudiesApproved: boolean('requested_studies_approved').notNull(),
	requestedStudiesNotes: text('requested_studies_notes'),
});

export const applications = pgTable('applications', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
		name: 'applications_id_seq',
		startWith: 1,
		increment: 1,
		minValue: 1,
		maxValue: 9223372036854775807,
		cache: 1,
	}),
	userId: varchar('user_id', { length: 100 }).notNull(),
	state: applicationStates().notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
	approvedAt: timestamp('approved_at', { mode: 'string' }),
	expiresAt: timestamp('expires_at', { mode: 'string' }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	contents: bigint({ mode: 'number' }),
	updatedAt: timestamp('updated_at', { mode: 'string' }),
});
