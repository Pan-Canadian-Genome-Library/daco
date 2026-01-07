ALTER TABLE "application_actions" ALTER COLUMN "state_before" SET DATA TYPE "public"."application_states" USING "state_before"::"public"."application_states";--> statement-breakpoint
ALTER TABLE "application_actions" ALTER COLUMN "state_after" SET DATA TYPE "public"."application_states" USING "state_after"::"public"."application_states";--> statement-breakpoint
