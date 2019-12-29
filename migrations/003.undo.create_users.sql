BEGIN;

ALTER TABLE updates_comments DROP COLUMN user_name;

ALTER TABLE updates_comments DROP COLUMN user_id;

ALTER TABLE homework_comments DROP COLUMN user_name;

ALTER TABLE homework_comments DROP COLUMN user_id;

DROP TYPE IF EXISTS user_category;

DROP TABLE IF EXISTS classroom_users;

COMMIT;