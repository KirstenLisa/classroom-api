CREATE TYPE subject_category AS ENUM (
    'Math',
    'Art',
    'History',
    'Languages',
    'Literature',
    'Music',
    'Social Studies',
    'Biology'
);

CREATE TABLE homework (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    homework_id INTEGER NOT NULL,
    subject subject_category,
    homework TEXT NOT NULL,
    due_date TIMESTAMP DEFAULT now() NOT NULL,
    teacher_id INTEGER 
        REFERENCES teachers(id) ON DELETE CASCADE NOT NULL,
    teacher_name TEXT
        REFERENCES teachers(teacher_name) ON DELETE CASCADE NOT NULL,
    class_id INTEGER
        REFERENCES class_list(class_id) ON DELETE CASCADE NOT NULL
);