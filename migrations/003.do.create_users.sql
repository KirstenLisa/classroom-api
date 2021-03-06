CREATE TYPE user_category AS ENUM (
    'teacher',
    'student',
    'parent'
);

CREATE TABLE classroom_users (
    user_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    fullname TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    class_id INTEGER
        REFERENCES class_list(class_id) ON DELETE CASCADE NOT NULL,
    user_type user_category
);

