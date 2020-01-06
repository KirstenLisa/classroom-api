const bcrypte = require('bcryptjs')

function makeTeachersArray() {
    return [
        {
           "teacher_name": "test-teacher-name-1",
           "id": 1 
        },
        {
            "teacher_name": "test-teacher-name-2",
            "id": 2 
         },
         {
            "teacher_name": "test-teacher-name-3",
            "id": 3 
         }
    ]
}

function makeUsersArray() {
   return [
       {
          "user_id": 1,
          "fullname": "test-fullname-1",
          "username": "test-username-1",
          "password": "test-password-1",
          "class_id": 1,
          "user_type": "parent"
       },
       {
         "user_id": 2,
         "fullname": "test-fullname-2",
         "username": "test-username-2",
         "password": "test-password-2",
         "class_id": 2,
         "user_type": "student"
      },
      {
         "user_id": 3,
         "fullname": "test-fullname-3",
         "username": "test-username-3",
         "password": "test-password-3",
         "class_id": 3,
         "user_type": "teacher"
      },
   ]
}

function makeClassesArray() {
   return [
      {
         "class_id": 1,
         "class_name": "1A",
         "class_teacher": "test-teacher-name-1"
      },
      {
         "class_id": 2,
         "class_name": "1B",
         "class_teacher": "test-teacher-name-2"
      },
      {
         "class_id": 3,
         "class_name": "1C",
         "class_teacher": "test-teacher-name-3"
      }
   ]
}

function makeUpdatesArray() {
   return [
      {
         "update_id": 1,
         "headline": "test headline 1",
         "content": "test update content 1",
         "class_id": 1,
         "author": "test-author-1",
         "date": '2019-04-22T16:28:32.615Z'
      },
      {
         "update_id": 2,
         "headline": "test headline 2",
         "content": "test update content 2",
         "class_id": 2,
         "author": "test-author-2",
         "date": '2019-03-22T16:28:32.615Z'
      },
      {
         "update_id": 3,
         "headline": "test headline 3",
         "content": "test update content 3",
         "class_id": 3,
         "author": "test-author-3",
         "date": '2019-02-22T16:28:32.615Z'
      }
   ]
}

function makeHomeworkArray() {
   return [
      {
         "id": 1,
         "homework_id": 11,
         "subject": "Math",
         "homework": "Test homework 1",
         "due_date": "2020-01-18T16:28:32.615Z",
         "teacher_id": 1,
         "teacher_name": "test-teacher-name-1",
         "class_id": 1,

      },
      {
         "id": 2,
         "homework_id": 12,
         "subject": "Art",
         "homework": "Test homework 2",
         "due_date": "2020-01-20T16:28:32.615Z",
         "teacher_id": 2,
         "teacher_name": "test-teacher-name-2",
         "class_id": 1
      },
      {
         "id": 3,
         "homework_id": 13,
         "subject": "History",
         "homework": "Test homework 3",
         "due_date": "2020-01-19T16:28:32.615Z",
         "teacher_id": 3,
         "teacher_name": "test-teacher-name-3",
         "class_id": 1
      }
   ]
}

function makeUpdatesCommentsArray() {
   return [
      {
         "comment_id": 1,
         "comment": "Test update commemnt 1",
         "user_name": "test-username-1",
         "date": "2020-01-10T16:28:32.615Z",
         "user_id": 1,
         "page_id": 1
      },
      {
         "comment_id": 2,
         "comment": "Test update commemnt 2",
         "user_name": "test-username-2",
         "date": "2020-01-09T16:28:32.615Z",
         "user_id": 2,
         "page_id": 2
      },
      {
         "comment_id": 3,
         "comment": "Test update commemnt 3",
         "user_name": "test-username-3",
         "date": "2020-01-08T16:28:32.615Z",
         "user_id": 3,
         "page_id": 3
      },
   ]
}

function makeHomeworkCommentsArray() {
   return [
      {
         "comment_id": 1,
         "comment": "Test homework commemnt 1",
         "user_name": "test-username-1",
         "date": "2020-01-10T16:28:32.615Z",
         "user_id": 1,
         "page_id": 1
      },
      {
         "comment_id": 2,
         "comment": "Test homework commemnt 2",
         "user_name": "test-username-2",
         "date": "2020-01-11T16:28:32.615Z",
         "user_id": 2,
         "page_id": 2
      },
      {
         "comment_id": 3,
         "comment": "Test homework commemnt 3",
         "user_name": "test-username-3",
         "date": "2020-01-12T16:28:32.615Z",
         "user_id": 3,
         "page_id": 3
      },
   ]
}

function makeMaliciousUser() {
   const maliciousUser = 
      {
         "user_id": 1,
         "fullname": 'Naughty naughty very naughty <script>alert("xss");</script>',
         "username": 'Naughty naughty very naughty <script>alert("xss");</script>',
         "password": 'Naughty naughty very naughty <script>alert("xss");</script>',
         "class_id": 1,
         "user_type": "parent"
      }
   const expectedUser =
      {
         "user_id": 1,
         "fullname": 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
         "username": 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
         "password": 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
         "class_id": 1,
         "user_type": "parent" 
      }
      return {maliciousUser, expectedUser}
   }

function makeMaliciousUpdate() {
   const maliciousUpdate = 
      {
         "update_id": 1,
         "headline": 'Naughty naughty very naughty <script>alert("xss");</script>',
         "content": 'Naughty naughty very naughty <script>alert("xss");</script>',
         "class_id": 1,
         "author": 'Naughty naughty very naughty <script>alert("xss");</script>',
         "date": "2020-01-12T16:28:32.615Z"
      }
   const expectedUpdate =
      {
         "update_id": 1,
         "headline": 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
         "content": 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
         "class_id": 1,
         "author": 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
         "date": "2020-01-12T16:28:32.615Z"  
         }
         return {maliciousUpdate, expectedUpdate}
      }


function makeMaliciousHomework() {
   const maliciousHomework = 
      {
         "id": 1,
         "homework_id": 1,
         "subject": 'Math',
         "homework": 'Naughty naughty very naughty <script>alert("xss");</script>',
         "due_date": "2020-01-12T16:28:32.615Z",
         "teacher_id": 1,
         "teacher_name": "test-teacher-name-1",
         "class_id": 1     
      }
   const expectedHomework =
      {
         "id": 1,
         "homework_id": 1,
         "subject": 'Math',
         "homework": 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
         "due_date": "2020-01-12T16:28:32.615Z",
         "teacher_id": 1,
         "teacher_name": "test-teacher-name-1",
         "class_id": 1
      }
      return {maliciousHomework, expectedHomework}
      }

function makeMaliciousComment() {
   const maliciousComment = 
      {
         "comment_id": 1,
         "comment": 'Naughty naughty very naughty <script>alert("xss");</script>',
         "user_name": "test-username-1",
         "date": "2020-01-12T16:28:32.615Z",
         "user_id": 1,
         "page_id": 1     
      }

   const expectedComment =
      {
         "comment_id": 1,
         "comment": 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
         "user_name": "test-username-1",
         "date": "2020-01-12T16:28:32.615Z",
         "user_id": 1,
         "page_id": 1
      }
      return {maliciousComment, expectedComment}
      }

// function cleanTables(db) {
//    return db.transaction(trx =>
//       trx.raw(
//          `TRUNCATE
//             teachers,
//             class_list,
//             classroom_users,
//             updates,
//             homework,
//             updates_comments,
//             homework_comments`
//            )
//       .then(() =>
//          Promise.all([
//             trx.raw(`ALTER SEQUENCE teachers_id_seq minvalue 0 START WITH 1`),
//             trx.raw(`ALTER SEQUENCE class_list_id_seq minvalue 0 START WITH 1`),
//             trx.raw(`ALTER SEQUENCE classroom_users_id_seq minvalue 0 START WITH 1`),
//             trx.raw(`ALTER SEQUENCE updates_id_seq minvalue 0 START WITH 1`),
//             trx.raw(`ALTER SEQUENCE homework_id_seq minvalue 0 START WITH 1`),
//             trx.raw(`ALTER SEQUENCE updates_comments_id_seq minvalue 0 START WITH 1`),
//             trx.raw(`ALTER SEQUENCE homework_comments_id_seq minvalue 0 START WITH 1`),
//             trx.raw(`SELECT setval('teachers_id_seq', 0)`),
//             trx.raw(`SELECT setval('class_list_id_seq', 0)`),
//             trx.raw(`SELECT setval('classroom_users_id_seq', 0)`),
//             trx.raw(`SELECT setval('updates_id_seq', 0)`),
//             trx.raw(`SELECT setval('homework_id_seq', 0)`),
//             trx.raw(`SELECT setval('updates_comments_id_seq', 0)`),
//             trx.raw(`SELECT setval('homework_comments_id_seq', 0)`)
//            ])
//          )
//        )
//      }

   function seedTeachers(db, teachers) {
      return db
          .insert(teachers)
          .into('teachers');
  }
  
  function seedClassList(db, classList) {
      return db
          .insert(classList)
          .into('class_list');
  }

  function seedUsers(db, users) {
   const preppedUsers = users.map(user => ({
       ...user,
       password: bcrypte.hashSync(user.password, 1)
   }))
   return db
       .into('classroom_users')
       .insert(preppedUsers);
}

function seedUpdates(db, updates) {
   return db
       .insert(updates)
       .into('updates');
}

function seedHomework(db, homework) {
   return db
       .insert(homework)
       .into('homework');
}

function seedUpdatesComments(db, updatesComments) {
   return db
       .insert(updatesComments)
       .into('updates_comments');
}

function seedHomeworkComments(db, homeworkComments) {
   return db
       .insert(homeworkComments)
       .into('homework_comments');
}

   //   function seedUsers(db, users) {
   //       const preppedUsers = users.map(user => ({
   //        ...user,
   //      password: bcrypt.hashSync(user.password, 1)
   //    }))
   //    return db.into('classroom_users').insert(preppedUsers)
   //      .then(() =>
   //        // update the auto sequence to stay in sync
   //        db.raw(
   //          `SELECT setval('classroom_users_id_seq', ?)`,
   //          [users[users.length - 1].id],
   //        )
   //      )
   //  }


   //  function seedUpdatesTables(db, users, updates, comments=[]) {
   //    // use a transaction to group the queries and auto rollback on any failure
   //    return db.transaction(async trx => {
   //      await seedUsers(trx, users)
   //      await trx.into('updates').insert(updates)
   //      // update the auto sequence to match the forced id values
   //      await trx.raw(
   //       `SELECT setval('updates_id_seq', ?)`,
   //        [updates[updates.length - 1].id],
   //      )
   //      // only insert comments if there are some, also update the sequence counter
   //      if (comments.length) {
   //        await trx.into('updates_comments').insert(comments)
   //        await trx.raw(
   //          `SELECT setval('updates_comments_id_seq', ?)`,
   //          [comments[comments.length - 1].id],
   //        )
   //      }
   //    })
   //  }


   //  function seedHomeworkTables(db, users, homework, comments=[]) {
   //    // use a transaction to group the queries and auto rollback on any failure
   //    return db.transaction(async trx => {
   //      await seedUsers(trx, users)
   //      await trx.into('homework').insert(homework)
   //      // update the auto sequence to match the forced id values
   //      await trx.raw(
   //       `SELECT setval('homework_id_seq', ?)`,
   //        [homework[homework.length - 1].id],
   //      )
   //      // only insert comments if there are some, also update the sequence counter
   //      if (comments.length) {
   //        await trx.into('updates_comments').insert(comments)
   //        await trx.raw(
   //          `SELECT setval('updates_comments_id_seq', ?)`,
   //          [comments[comments.length - 1].id],
   //        )
   //      }
   //    })
   //  }

   // function seedMaliciousUpdate(db, user, update) {
   //    return seedUsers(db, [user])
   //      .then(() =>
   //        db
   //          .into('updates')
   //          .insert([update])
   //      )
   //  }

   //  function seedMaliciousHomework(db, user, homework) {
   //    return seedUsers(db, [user])
   //      .then(() =>
   //        db
   //          .into('homework')
   //          .insert([homework])
   //      )
   //  }



   function makeAuthHeader(user) {
      const token = Buffer.from(`${user.username}:${user.password}`).toString('base64')
         return `Basic ${token}`
      }

module.exports = { 
   makeTeachersArray, 
   makeUsersArray, 
   makeClassesArray, 
   makeUpdatesArray, 
   makeHomeworkArray,
   makeUpdatesCommentsArray,
   makeHomeworkCommentsArray,
   makeMaliciousUser,
   makeMaliciousUpdate,
   makeMaliciousHomework,
   makeMaliciousComment,
   seedTeachers,
   seedClassList,
   seedUsers,
   seedUpdates,
   seedHomework,
   seedUpdatesComments,
   seedHomeworkComments,
   makeAuthHeader }