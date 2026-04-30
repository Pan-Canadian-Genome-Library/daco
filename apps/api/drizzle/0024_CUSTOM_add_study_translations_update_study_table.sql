-- CUSTOM MIGRATION SCRIPT
CREATE TYPE "languages" AS ENUM('en_ca', 'fr_ca');
CREATE TABLE "study_translations" (
    "study_translation_id" serial PRIMARY KEY NOT NULL,
	"study_id" text NOT NULL,
	"language_id" "languages" NOT NULL,
	"study_description" text NOT NULL,
	"program_name" varchar(255),
	"keywords" text[],
	"participant_criteria" text,
	"funding_sources" text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	UNIQUE("study_id", "language_id"),
	FOREIGN KEY ("study_id") REFERENCES "study"("study_id") ON DELETE CASCADE
);

-- Insert existing study data into study_translations with default language (en_ca)
INSERT INTO "study_translations" (
	study_id,
	language_id,
	study_description,
	program_name,
	keywords,
	participant_criteria,
	funding_sources,
	created_at,
	updated_at
)
SELECT
	study.study_id,
	'en_ca',
	study.study_description,
	study.program_name,
	study.keywords,
	study.participant_criteria,
	study.funding_sources,
	COALESCE(study.created_at, now()),
	study.updated_at
	FROM "study" study;


-- Apply default_translation to study table
ALTER TABLE "study" ADD COLUMN "default_translation" integer;
ALTER TABLE "study" ADD CONSTRAINT "default_translation_fk" FOREIGN KEY ("default_translation") REFERENCES "study_translations"("study_translation_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- Update the default_translation to point to the newly created translations
UPDATE "study" s
SET default_translation = st.study_translation_id
FROM "study_translations" st
WHERE s.study_id = st.study_id AND st.language_id = 'en_ca';
-- Apply not null constraint to default_translation
ALTER TABLE "study" ALTER COLUMN "default_translation" SET NOT NULL;

-- Drop study_description, program_name, keywords, participant_criteria, funding_sources columns from study table
ALTER TABLE "study" DROP COLUMN "study_description";
ALTER TABLE "study" DROP COLUMN "program_name";
ALTER TABLE "study" DROP COLUMN "keywords";
ALTER TABLE "study" DROP COLUMN "participant_criteria";
ALTER TABLE "study" DROP COLUMN "funding_sources";
