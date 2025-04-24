
/**
    IMPORTANT NOTE: 
    
    This migration will NOT work if there are any existing duplicates with the same email address and application ID in the DB.
    Please ensure that all duplicates are dealt with prior to running this migration, otherwise this migration will fail.
**/

ALTER TABLE "collaborators" DROP CONSTRAINT "collaborators_pkey";--> statement-breakpoint
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_application_id_institutional_email_pk" PRIMARY KEY("application_id","institutional_email");