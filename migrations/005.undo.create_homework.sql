BEGIN;

ALTER TABLE homework_comments DROP COLUMN page_id;

DROP TYPE IF EXISTS subject_category;

DROP TABLE IF EXISTS homework;

COMMIT;