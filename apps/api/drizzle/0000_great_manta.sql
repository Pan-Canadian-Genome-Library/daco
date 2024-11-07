CREATE TYPE "public"."action_types" AS ENUM('CREATE', 'WITHDRAW', 'CLOSE', 'REQUEST_INSTITUTIONAL_REP', 'INSTITUTIONAL_REP_APPROVED', 'INSTITUTIONAL_REP_REJECTED', 'DAC_REVIEW_APPROVED', 'DAC_REVIEW_REJECTED', 'DAC_REVIEW_REVISIONS', 'REVOKE');--> statement-breakpoint
CREATE TYPE "public"."agreement_types" AS ENUM('dac_agreement_software_updates', 'dac_agreement_non_disclosure', 'dac_agreement_monitor_individual_access', 'dac_agreement_destroy_data', 'dac_agreement_familiarize_restrictions', 'dac_agreement_provide_it_policy', 'dac_agreement_notify_unauthorized_access', 'dac_agreement_certify_application', 'dac_agreement_read_and_agreed');--> statement-breakpoint
CREATE TYPE "public"."application_states" AS ENUM('DRAFT', 'INSTITUTIONAL_REP_REVIEW', 'DAC_REVIEW', 'DAC_REVISIONS_REQUESTED', 'REJECTED', 'APPROVED', 'CLOSED', 'REVOKED');--> statement-breakpoint
CREATE TYPE "public"."file_types" AS ENUM('SIGNED_APPLICATION', 'ETHICS_LETTER');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "actions" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "actions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"application_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"action" "action_types" NOT NULL,
	"revisions_request_id" bigint,
	"state_before" varchar(255) NOT NULL,
	"state_after" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agreements" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "agreements_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"application_id" bigint,
	"user_id" varchar(100) NOT NULL,
	"name" text NOT NULL,
	"agreement_text" text NOT NULL,
	"agreement_type" "agreement_types" NOT NULL,
	"agreed_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "application_contents" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "application_contents_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"application_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"applicant_first_name" varchar(255),
	"applicant_middle_name" varchar(255),
	"applicant_last_name" varchar(255),
	"applicant_title" varchar(255),
	"applicant_suffix" varchar(255),
	"applicant_position_title" varchar(255),
	"applicant_primary_affiliation" varchar(500),
	"applicant_institutional_email" varchar(320),
	"applicant_profile_url" text,
	"institutional_rep_title" varchar(255),
	"institutional_rep_first_name" varchar(255),
	"institutional_rep_middle_name" varchar(255),
	"institutional_rep_last_name" varchar(255),
	"institutional_rep_suffix" varchar(255),
	"institutional_rep_primary_affiliation" varchar(255),
	"institutional_rep_email" varchar(255),
	"institutional_rep_profile_url" varchar(255),
	"institutional_rep_position_title" varchar(255),
	"institution_country" varchar(255),
	"institution_state" varchar(255),
	"institution_city" varchar(255),
	"institution_street_address" text,
	"institution_postal_code" varchar(255),
	"institution_building" varchar(255),
	"project_title" text,
	"project_website" text,
	"project_abstract" text,
	"project_methodology" text,
	"project_summary" text,
	"project_publication_urls" text[],
	"requested_studies" text[],
	"ethics_review_required" boolean,
	"ethics_letter" bigint,
	"signed_pdf" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "applications" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "applications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" varchar(100) NOT NULL,
	"state" "application_states" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp,
	"expires_at" timestamp,
	"contents" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collaborators" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "collaborators_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"application_id" bigint,
	"first_name" varchar(255) NOT NULL,
	"middle_name" varchar(255),
	"last_name" varchar(255) NOT NULL,
	"title" varchar(255),
	"suffix" varchar(255),
	"position_title" varchar(255) NOT NULL,
	"institutional_email" varchar(320) NOT NULL,
	"profile_url" text,
	"collaborator_type" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "files_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"application_id" bigint NOT NULL,
	"type" "file_types" NOT NULL,
	"submitter_user_id" varchar(100) NOT NULL,
	"submitted_at" timestamp NOT NULL,
	"content" "bytea" NOT NULL,
	"filename" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "revision_requests" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "revision_requests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"application_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"comments" text,
	"applicant_notes" text,
	"applicant_approved" boolean NOT NULL,
	"institution_rep_approved" boolean NOT NULL,
	"institution_rep_notes" text,
	"collaborators_approved" boolean NOT NULL,
	"collaborators_notes" text,
	"project_approved" boolean NOT NULL,
	"project_notes" text,
	"requested_studies_approved" boolean NOT NULL,
	"requested_studies_notes" text
);
