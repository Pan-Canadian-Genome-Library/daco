DELETE FROM "public"."application_actions" WHERE "application_actions"."action" = 'CREATE';
ALTER TABLE "public"."application_actions" ALTER COLUMN "action" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."application_action_types";--> statement-breakpoint
CREATE TYPE "public"."application_action_types" AS ENUM('WITHDRAW', 'CLOSE', 'SUBMIT_DRAFT', 'INSTITUTIONAL_REP_REVISION_REQUEST', 'INSTITUTIONAL_REP_SUBMIT', 'INSTITUTIONAL_REP_APPROVED', 'DAC_REVIEW_REVISION_REQUEST', 'DAC_REVIEW_SUBMIT', 'DAC_REVIEW_APPROVED', 'DAC_REVIEW_REJECTED', 'REVOKE');--> statement-breakpoint
ALTER TABLE "public"."application_actions" ALTER COLUMN "action" SET DATA TYPE "public"."application_action_types" USING "action"::"public"."application_action_types";