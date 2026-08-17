-- Custom SQL migration file to TRUNCATE the studies table
--
-- Altering the studies table to match clinical-submission's schema. The existing data can be re-synced using the `GET /import` endpoint.

TRUNCATE TABLE study;
