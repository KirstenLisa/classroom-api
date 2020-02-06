<h1>My Classroom</h1>

About
Server is used for back end of app and connects to client.

URL: https://evening-dawn-46088.herokuapp.com/api

Technologies Used
Client side: React, JavaScript, Zeit, HTML and CSS.

Server side: Express.js, Node.js, PostgreSQL and Heroku.


<h1>URL/ Endpoints:</h1>

<h2>/auth/login</h2>

Method: POST 

Data Params { user_name: "A_Pommelhorst", password: "Password!123" }

Success Response:

Code: 200
Content: { "authToken": "" }

Error Response:

Code: 400
Content: { :error": Incorrect username or password }
Code: 400
Content: { :error": Missing 'username' in request body}
Code: 400
Content: { :error": Missing 'password' in request body }

<h2>/auth/refresh/</h2>

Method: POST

Success Response:

Code: 200
Content: { "authToken": "" }

<h2>/teachers</h2>

Method: GET
Gets and renders teachers stored in database

Success Response:

Code: 200
Content:

    [{
        "teacher_name": "Mrs Krabappel",
        "id": 1
    },
    ....
    ]

<h2>/teachers/:teacherId</h2>

Method: GET
Gets teacher by id

Success Response:

Code: 200
Content:

    [{
        "teacher_name": "Mrs Krabappel",
        "id": 1
    },
    ....
    ]

Error Response:

Code: 404
Content: { error: {message: 'Teacher id doesn't exist'} }


<h2>/classes</h2>

Method: GET
Gets and renders classes stored in database

Success Response:

Code: 200
Content:

    [{
        "class_id": 1,
        "class_name": "1A",
        "class_teacher": "Mrs Krabappel"
    },
    ....
    ]

<h2>/classes/:classId</h2>

Method: GET
Gets specific class by Id

Success Response:

Code: 200
Content:

{
    "class_id": 2,
    "class_name": "1B",
    "class_teacher": "Mr Bergstrom"
}


<h2>/users</h2>

Method: GET
GET: Retrieves all users from database 

Success Response:

Code: 200
Content:

[{
        "user_id": 1,
        "fullname": "Guy Inkognito",
        "username": "GuyI",
        "class_id": 1,
        "user_type": "parent"
    }, ...
]

Method: POST
Lets user register as a new user

Success Response:

Code: 201

Content:

{
        "user_id": 1,
        "fullname": "Guy Inkognito",
        "username": "GuyI",
        "class_id": 1,
        "user_type": "parent"
    }

Error Response:

Code: 400

Content: 

{ error: `Missing 'fullname' in request body`}
{ error: `Missing 'username' in request body`}
{ error: `Missing 'class_id' in request body`}
{ error: `Missing 'user_type' in request body`}
{ error: `Username already taken` }

<h2>/users/:username</h2>

Method: GET
Gets user by username

Success Response:

Code: 200

Content:
{
     "user_id": 12,
    "fullname": "Antje Pommelhorst",
    "username": "A_Pommelhorst",
    "class_id": 6,
    "user_type": "teacher"
}

Error Response:

Code: 404

Content:
{
    "error": { "message": "User doesn't exist" }
}


<h2>/homework</h2>

Method: GET
Retrieves homework from database

Success Response: 

Code: 200

Content:
[{
    "id": 58,
    "homework_id": 31,
    "subject": "Math",
    "homework": "fvgzbhjnkm",
    "due_date": "2020-01-02T13:13:24.000Z",
    "teacher_id": 1,
    "teacher_name": "Mrs Krabappel",
    "class_id": 3
}, ...
]

Error Response:

Code: 401

Content: 
{
    "error": "Missing bearer token"
}

Method: POST
posts homework for specific class and subject linked to by id and homework_id

Success response:

Code: 201

{
    "id": 58,
    "homework_id": 31,
    "subject": "Math",
    "homework": "fvgzbhjnkm",
    "due_date": "2020-01-02T13:13:24.000Z",
    "teacher_id": 1,
    "teacher_name": "Mrs Krabappel",
    "class_id": 3
}

Error Response:

Code: 400

Content:
 error: { message: `Missing 'subject' in request body` }
 error: { message: `Missing 'homework' in request body` }
 error: { message: `Missing 'due_date' in request body` }
 error: { message: `Missing 'teacher_name' in request body` }


<h2>/:homeworkId</h2>

Method: GET
gets specific homework from database

Success Response:

Code: 200

Content: 
{
    "id": 58,
    "homework_id": 31,
    "subject": "Math",
    "homework": "fvgzbhjnkm",
    "due_date": "2020-01-02T13:13:24.000Z",
    "teacher_id": 1,
    "teacher_name": "Mrs Krabappel",
    "class_id": 3
}

Error Response:

Code: 404

Content:
{ error: { message: `Homework doesn't exist` } }

Method: DELETE
deletes specific homework from database

Success Response:

Code: 204

Method: PATCH
Changes specific homework

Success Response:

Code: 204

Error Response:

Code: 400

Content:
{ error: { message: `Homework doesn't exist` } }


<h2>/update</h2>

Method: GET
Retrieves updates from database

Success Response: 

Code: 200

Content:
[{
    "update_id": 111,
    "headline": "Headline 1",
    "content": "So much content",
    "class_id": 3
    "author": "Antje",
    "date": "2020-01-02T13:13:24.000Z",
    
}, ...
]

Error Response:

Code: 401

Content: 
{
    "error": "Missing bearer token"
}

Method: POST
posts update for specific class linked to by class_id

Success response:

Code: 201

{
    "update_id": 111,
    "headline": "Headline 1",
    "content": "So much content",
    "class_id": 3
    "author": "Antje",
    "date": "2020-01-02T13:13:24.000Z"
}

Error Response:

Code: 400

Content:
 error: { message: `Missing 'headline' in request body` }
 error: { message: `Missing 'content' in request body` }
 error: { message: `Missing 'class_id' in request body` }
 error: { message: `Missing 'author' in request body` }
error: { message: `Missing 'date' in request body` }


<h2>/:updateId</h2>

Method: GET
gets specific update from database

Success Response:

Code: 200

Content: 
{
    "update_id": 111,
    "headline": "Headline 1",
    "content": "So much content",
    "class_id": 3
    "author": "Antje",
    "date": "2020-01-02T13:13:24.000Z"
}

Error Response:

Code: 404

Content:
{ error: { message: `Update doesn't exist` } }

Method: DELETE
deletes specific update from database

Success Response:

Code: 204

Method: PATCH
Changes specific update

Success Response:

Code: 204

Error Response:

Code: 400

Content:
{ error: {
          message: `Request body must contain either 'headline', 'content', 'class_id', 'author' or 'date'`
        }


<h2>/homework-comments</h2>
<h2>/updates-comments</h2>

Method: GET
Retrieves comments from database

Success Response:

Code: 200

Content:
[{
        "comment_id": 5,
        "comment": "comment no. 5 homework",
        "user_name": "Maria",
        "date": "2019-12-29T06:59:01.783Z",
        "user_id": 5,
        "page_id": 33
    }, ...
]

Method: POST
Posts comment to homework/updates related to by id

Code: 400

Content:

{ error: { message: `Missing 'comment' in request body` } }
{ error: { message: `Missing 'user_name' in request body` } }
{ error: { message: `Missing 'date' in request body` } }
{ error: { message: `Missing 'user_id' in request body` } }
{ error: { message: `Missing 'page_id' in request body` } }

<h2>/:commentId</h2>

Method: GET
Retrieves specific comment from database

Code: 204

Content:
[
    {
        "comment_id": 5,
        "comment": "comment no. 5 homework",
        "user_name": "Maria",
        "date": "2019-12-29T06:59:01.783Z",
        "user_id": 5,
        "page_id": 33
    }
]

Code: 404

Content: 

{ error: { message: `Comment doesn't exist` } }
