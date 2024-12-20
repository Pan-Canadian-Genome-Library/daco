ALTER TYPE "public"."application_states" ADD VALUE 'REP_REVISION' BEFORE 'DAC_REVIEW';--> statement-breakpoint
ALTER TABLE "public"."actions" ALTER COLUMN "action" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."action_types";--> statement-breakpoint
CREATE TYPE "public"."action_types" AS ENUM('CREATE', 'WITHDRAW', 'CLOSE', 'INSTITUTIONAL_REP_REVIEW', 'INSTITUTIONAL_REP_REVISION', 'INSTITUTIONAL_REP_SUBMIT', 'INSTITUTIONAL_REP_APPROVED', 'DAC_REVIEW_REVISIONS', 'DAC_REVIEW_SUBMIT', 'DAC_REVIEW_APPROVED', 'DAC_REVIEW_REJECTED', 'REVOKE');--> statement-breakpoint
ALTER TABLE "public"."actions" ALTER COLUMN "action" SET DATA TYPE "public"."action_types" USING "action"::"public"."action_types";