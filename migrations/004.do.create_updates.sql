CREATE TABLE updates (
    update_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    headline TEXT NOT NULL,
    content TEXT NOT NULL,
    class_id INTEGER 
        REFERENCES class_list(class_id) ON DELETE CASCADE NOT NULL,
    author TEXT NOT NULL,
    date TIMESTAMP DEFAULT now() NOT NULL
);