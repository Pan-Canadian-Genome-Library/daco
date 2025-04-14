ALTER TABLE "revision_requests" ADD COLUMN "ethics_approved" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "revision_requests" ADD COLUMN "ethics_notes" text;--> statement-breakpoint
ALTER TABLE "revision_requests" ADD COLUMN "agreements_approved" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "revision_requests" ADD COLUMN "agreements_notes" text;--> statement-breakpoint
ALTER TABLE "revision_requests" ADD COLUMN "appendices_approved" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "revision_requests" ADD COLUMN "appendices_notes" text;--> statement-breakpoint
ALTER TABLE "revision_requests" ADD COLUMN "sign_and_submit_approved" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "revision_requests" ADD COLUMN "sign_and_submit_notes" text;