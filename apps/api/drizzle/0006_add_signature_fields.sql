ALTER TABLE "application_contents" ADD COLUMN "applicant_signature" text;--> statement-breakpoint
ALTER TABLE "application_contents" ADD COLUMN "applicant_signed_at" timestamp;--> statement-breakpoint
ALTER TABLE "application_contents" ADD COLUMN "institutional_rep_signature" text;--> statement-breakpoint
ALTER TABLE "application_contents" ADD COLUMN "institutional_rep_signed_at" timestamp;