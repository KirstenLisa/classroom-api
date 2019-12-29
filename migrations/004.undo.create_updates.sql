BEGIN;

DROP TABLE IF EXISTS updates;

ALTER TABLE updates_comments DROP COLUMN page_id;

COMMIT;