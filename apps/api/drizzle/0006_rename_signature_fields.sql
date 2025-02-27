ALTER TABLE "application_contents" RENAME COLUMN "signature" TO "applicant_signature";
ALTER TABLE "application_contents" RENAME COLUMN "signature_signed_at" TO "applicant_signed_at";
ALTER TABLE "application_contents" ADD COLUMN "institutional_rep_signature" text;
ALTER TABLE "application_contents" ADD COLUMN "institutional_rep_signed_at" timestamp;