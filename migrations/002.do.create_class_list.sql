CREATE TABLE class_list (
    class_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,  
    class_name TEXT NOT NULL,
    class_teacher TEXT
        REFERENCES teachers(teacher_name) ON DELETE CASCADE NOT NULL
);