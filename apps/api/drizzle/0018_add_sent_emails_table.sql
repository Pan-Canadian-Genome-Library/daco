CREATE TABLE "emails" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "emails_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"application_id" bigint NOT NULL,
	"application_action_id" bigint NOT NULL,
	"created_at" timestamp NOT NULL,
	"email_type" "email_types" NOT NULL,
	"recipient_emails" varchar(320)[] NOT NULL
);
--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_application_action_id_application_actions_id_fk" FOREIGN KEY ("application_action_id") REFERENCES "public"."application_actions"("id") ON DELETE no action ON UPDATE no action;