DROP TABLE "agreements" CASCADE;--> statement-breakpoint
ALTER TABLE "application_contents" ADD COLUMN "accepted_agreements" text[];--> statement-breakpoint
ALTER TABLE "application_contents" ADD COLUMN "accepted_appendices" text[];--> statement-breakpoint
DROP TYPE "public"."agreement_types";
