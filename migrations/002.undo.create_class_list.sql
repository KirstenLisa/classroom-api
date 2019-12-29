BEGIN;

DROP TABLE IF EXISTS class_list;

ALTER TABLE classroom_users DROP COLUMN class_id;

ALTER TABLE updates DROP COLUMN class_id;

COMMIT;