ALTER TABLE "application_contents" ADD COLUMN "applicant_institution_country" varchar(255);--> statement-breakpoint
ALTER TABLE "application_contents" ADD COLUMN "applicant_institution_state" varchar(255);--> statement-breakpoint
ALTER TABLE "application_contents" ADD COLUMN "applicant_institution_city" varchar(255);--> statement-breakpoint
ALTER TABLE "application_contents" ADD COLUMN "applicant_institution_street_address" text;--> statement-breakpoint
ALTER TABLE "application_contents" ADD COLUMN "applicant_institution_postal_code" varchar(255);--> statement-breakpoint
ALTER TABLE "application_contents" ADD COLUMN "applicant_institution_building" varchar(255);