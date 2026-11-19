ALTER TABLE "study" ADD COLUMN "duo_permission" text DEFAULT 'DUO:0000042' NOT NULL;--> statement-breakpoint
ALTER TABLE "study" ADD COLUMN "disease_specific_modifier" text[] DEFAULT '{}' NOT NULL;