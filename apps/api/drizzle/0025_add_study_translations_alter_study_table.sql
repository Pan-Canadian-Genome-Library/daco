CREATE TYPE "public"."languages" AS ENUM('en_ca', 'fr_ca');--> statement-breakpoint
CREATE TABLE "study_translations" (
	"study_translation_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "study_translations_study_translation_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"study_id" text NOT NULL,
	"language_id" "languages" NOT NULL,
	"study_description" text NOT NULL,
	"program_name" varchar(255),
	"keywords" text[],
	"participant_criteria" text,
	"funding_sources" text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "study" ADD COLUMN "default_translation" integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "study_translations_study_id_language_id_index" ON "study_translations" USING btree ("study_id","language_id");--> statement-breakpoint
ALTER TABLE "study" ADD CONSTRAINT "default_translation_fk" FOREIGN KEY ("default_translation") REFERENCES "public"."study_translations"("study_translation_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study" DROP COLUMN "study_description";--> statement-breakpoint
ALTER TABLE "study" DROP COLUMN "program_name";--> statement-breakpoint
ALTER TABLE "study" DROP COLUMN "keywords";--> statement-breakpoint
ALTER TABLE "study" DROP COLUMN "participant_criteria";--> statement-breakpoint
ALTER TABLE "study" DROP COLUMN "funding_sources";