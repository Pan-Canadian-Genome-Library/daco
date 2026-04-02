CREATE SEQUENCE "public"."dac_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9999 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."study_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9999 START WITH 1 CACHE 1;--> statement-breakpoint
ALTER TABLE "dac" ALTER COLUMN "dac_id" SET DEFAULT 
	'PCGLDA' || lpad(
		nextval('dac_id_seq')::text,
		4,
		'0'
	)
;--> statement-breakpoint
ALTER TABLE "study" ALTER COLUMN "study_id" SET DEFAULT 
	'PCGLST' || lpad(
		nextval('study_id_seq')::text,
		4,
		'0'
	)
;--> statement-breakpoint
ALTER TABLE "dac" ADD COLUMN "is_pcgl_dac" boolean DEFAULT false NOT NULL;