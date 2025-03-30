DROP TABLE "agreements" CASCADE;--> statement-breakpoint
ALTER TABLE "application_contents" ADD COLUMN "accepted_agreements" text[];--> statement-breakpoint
ALTER TABLE "application_contents" ADD COLUMN "accepted_all_agreements_at" timestamp;--> statement-breakpoint
ALTER TABLE "application_contents" ADD COLUMN "accepted_appendices" text[];--> statement-breakpoint
ALTER TABLE "application_contents" ADD COLUMN "accepted_all_appendices_at" timestamp;--> statement-breakpoint
DROP TYPE "public"."agreement_types";
