const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const xss = require('xss')
const { makeMaliciousComment, makeHomeworkCommentsArray, makeHomeworkArray, makeTeachersArray, makeClassesArray, makeUsersArray } = require('./test-helpers')

describe(`Homework-comments service object`, function() {

    let db

    before(() => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
           })
        app.set('db', db)
  })
    
    
    after('disconnect from db', () => db.destroy());
    before('clean the table', () => db.raw('TRUNCATE teachers, class_list, classroom_users, homework, homework_comments RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE teachers, class_list, classroom_users, homework, homework_comments RESTART IDENTITY CASCADE'));
    

  describe('GET/api/homework-comments', () => {

    context('Given there are NO comments in the database', () => {

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/homework-comments')
          .expect(200, [])
          })

      })

    context('Given there ARE updates-comments in the database', () => {

      const testTeachers = makeTeachersArray()
      const testClasses = makeClassesArray()
      const testUsers = makeUsersArray()
      const testHomework = makeHomeworkArray()
      const testHomeworkComments = makeHomeworkCommentsArray()

      beforeEach('insert data', () => {
        return db
        .into('teachers')
        .insert(testTeachers)
        .then(() => {
          return db
          .into('class_list')
          .insert(testClasses)
          .then(() => {
            return db
            .into('classroom_users')
            .insert(testUsers)
            .then(() => {
                return db
                .into('homework')
                .insert(testHomework)
                .then(() => {
                    return db
                    .into('homework_comments')
                    .insert(testHomeworkComments)
                })
            })
          })
        })
      })

      it('gets homework-comments from the store', () => {
        return supertest(app)
        .get('/api/homework-comments')
        .expect(200, testHomeworkComments)
           })
         })

    context(`Given an XSS attack update`, () => {
      const testTeachers = makeTeachersArray()
      const testClasses = makeClassesArray()
      const testUsers = makeUsersArray()
      const testHomework = makeHomeworkArray()
      const { maliciousComment, expectedComment } = makeMaliciousComment()
            
          beforeEach('insert data', () => {
            return db
            .into('teachers')
            .insert(testTeachers)
            .then(() => {
              return db
              .into('class_list')
              .insert(testClasses)
              .then(() => {
                return db
                .into('classroom_users')
                .insert(testUsers)
                  .then(() => {
                    return db
                    .into('homework')
                    .insert(testHomework)
                    .then(() => {
                      return db
                      .into('homework_comments')
                      .insert([maliciousComment])
                    })  
                  })
                })
            })
          })  
                      
          it('removes XSS attack content', () => {
            return supertest(app)
              .get(`/api/homework-comments`)
              .expect(200)
              .expect(res => {
                expect(res.body[0].comment).to.eql(expectedComment.comment)
                      })
                  })
                })
    

  describe('GET/api/homework-comments/:commentId', () => {

    context('Given there are NO homework-comments in the database', () => {

      it(`responds 404 the update doesn't exist`, () => {
        return supertest(app)
          .get(`/api/homework-comments/123`)
          .expect(404, {
          error: { message: `Comment doesn't exist` }
               })
           })
       })

    context('Given there ARE homework-comments in the database', () => {

        const testTeachers = makeTeachersArray()
        const testClasses = makeClassesArray()
        const testUsers = makeUsersArray()
        const testHomework = makeHomeworkArray()
        const testHomeworkComments = makeHomeworkCommentsArray()
  
        beforeEach('insert data', () => {
          return db
          .into('teachers')
          .insert(testTeachers)
          .then(() => {
            return db
            .into('class_list')
            .insert(testClasses)
            .then(() => {
              return db
              .into('classroom_users')
              .insert(testUsers)
              .then(() => {
                  return db
                  .into('homework')
                  .insert(testHomework)
                  .then(() => {
                      return db
                      .into('homework_comments')
                      .insert(testHomeworkComments)
                  })
              })
            })
          })
        })
    it('responds with 200 and the specified user', () => {
      const commentId = 2
      const expectedComment = testHomeworkComments[commentId - 1]
        return supertest(app)
          .get(`/api/homework-comments/${commentId}`)
          .expect(200, expectedComment)
         })
       })
      })
      })
    })




