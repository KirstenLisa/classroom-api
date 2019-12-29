const usersList = [
    {
        "user_id": 1,
        "fullname": "Guy Inkognito",
        "username": "GuyI",
        "password": "GuyInkognito!123",
        "class_id": 1,
        "user_type": "parent"
    },
    {
        "user_id": 2,
        "fullname": "Susi Sonnenschein",
        "username": "Susi",
        "password": "SusiSonne!123",
        "class_id": 2,
        "user_type": "student"
    },
    {
        "user_id": 3,
        "fullname": "Max Mustermann",
        "username": "Maximaus",
        "password": "MaxM!123",
        "class_id": 3,
        "user_type": "parent"
    },
    {
        "user_id": 4,
        "fullname": "Else Kling",
        "username": "Klingtgut",
        "password": "KlingElse!123",
        "class_id": 4,
        "user_type": "student"
    },
    {
        "user_id": 5,
        "fullname": "Guido Kretschmer",
        "username": "Maria",
        "password": "GuidO!123",
        "class_id": 5,
        "user_type": "parent"
    },
    {
        "user_id": 6,
        "fullname": "Kai Pflaume",
        "username": "Plaumenmus86",
        "password": "KaI!123",
        "class_id": 6,
        "user_type": "student"
    },
    {
        "user_id": 7,
        "fullname": "Edna Krabappel",
        "username": "E_Krabappel",
        "password": "Password!123",
        "class_id": 1,
        "user_type": "teacher"
    },
    {
        "user_id": 8,
        "fullname": "Seymour Skinner",
        "username": "S_Skinner",
        "password": "Password!123",
        "class_id": 2,
        "user_type": "teacher"
    },
    {
        "user_id": 9,
        "fullname": "Ned Flanders",
        "username": "N_Flanders",
        "password": "Password!123",
        "class_id": 3,
        "user_type": "teacher"
    },
    {
        "user_id": 10,
        "fullname": "Jonas Bergstrom",
        "username": "J_Bergstrom",
        "password": "Password!123",
        "class_id": 4,
        "user_type": "teacher"
    },
    {
        "user_id": 11,
        "fullname": "Selma Hoover",
        "username": "S_Hoover",
        "password": "Password!123",
        "class_id": 5,
        "user_type": "teacher"
    },
    {
        "user_id": 12,
        "fullname": "Antje Pommelhorst",
        "username": "A_Pommelhorst",
        "password": "Password!123",
        "class_id": 6,
        "user_type": "teacher"
    },
] 

const commentsList = [{
    "comment_id": 1,
    "comment": 'comment 1',
    "user_name": "GuyI",
    "date": new Date(),
    "user_id": 1,
    "page_id": "33"
},
{
    "comment_id": 2,
    "comment": 'comment 2',
    "user_name": "GuyI",
    "date": new Date(),
    "user_id": 1,
    "page_id": "111" 
},
{
    "comment_id": 3,
    "comment": 'comment 3',
    "user_name": "GuyI",
    "date": new Date(),
    "user_id": 1,
    "page_id": "120"
},
{
    "comment_id": 4,
    "comment": 'comment 4',
    "user_name": "GuyI",
    "date": new Date(),
    "user_id": 1,
    "page_id": "11"
},
{
    "comment_id": 5,
    "comment": 'comment 5',
    "user_name": "GuyI",
    "date": new Date(),
    "user_id": 1,
    "page_id": "105"
},
{
    "comment_id": 6,
    "comment": 'comment 6',
    "user_name": "GuyI",
    "date": new Date(),
    "user_id": 1,
    "page_id": "13"
}
]


module.exports = { usersList, commentsList }