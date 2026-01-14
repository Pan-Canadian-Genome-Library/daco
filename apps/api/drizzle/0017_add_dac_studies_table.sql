CREATE TYPE "public"."study_context" AS ENUM('CLINICAL', 'RESEARCH');--> statement-breakpoint
CREATE TYPE "public"."study_status" AS ENUM('ONGOING', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "dac" (
	"dac_id" text PRIMARY KEY NOT NULL,
	"dac_name" varchar(255) NOT NULL,
	"dac_description" text NOT NULL,
	"contact_name" varchar(255) NOT NULL,
	"contact_email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "study" (
	"study_id" text PRIMARY KEY NOT NULL,
	"dac_id" text NOT NULL,
	"study_name" varchar(255) NOT NULL,
	"study_description" text NOT NULL,
	"program_name" varchar(255),
	"keywords" text[],
	"status" "study_status" NOT NULL,
	"context" "study_context" NOT NULL,
	"domain" text[] NOT NULL,
	"participant_criteria" text,
	"principal_investigators" text[] NOT NULL,
	"lead_organizations" text[] NOT NULL,
	"collaborators" text[],
	"funding_sources" text[] NOT NULL,
	"publication_links" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"category_id" integer,
	"acceptingApplications" boolean DEFAULT false,
	CONSTRAINT "study_category_id_unique" UNIQUE("category_id")
);
--> statement-breakpoint
ALTER TABLE "study" ADD CONSTRAINT "dac_id_fk" FOREIGN KEY ("dac_id") REFERENCES "public"."dac"("dac_id") ON DELETE no action ON UPDATE no action;