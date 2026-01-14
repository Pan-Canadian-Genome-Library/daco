CREATE TYPE "public"."sections" AS ENUM('INTRO', 'APPLICANT', 'INSTITUTIONAL', 'COLLABORATORS', 'PROJECT', 'STUDY', 'ETHICS', 'AGREEMENT', 'APPENDICES', 'SIGN');--> statement-breakpoint
CREATE TABLE "comments" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"application_id" bigint NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"dac_chair_only" boolean NOT NULL,
	"section" "sections" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
