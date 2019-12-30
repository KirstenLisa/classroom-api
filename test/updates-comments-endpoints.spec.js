const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const xss = require('xss')
const { makeMaliciousComment, makeUpdatesCommentsArray, makeUpdatesArray, makeTeachersArray, makeClassesArray, makeUsersArray } = require('./test-helpers')

describe(`Updates-comments service object`, function() {

    let db

    before(() => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
           })
        app.set('db', db)
  })
    
    
    after('disconnect from db', () => db.destroy());
    before('clean the table', () => db.raw('TRUNCATE teachers, class_list, classroom_users, updates, updates_comments RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE teachers, class_list, classroom_users, updates, updates_comments RESTART IDENTITY CASCADE'));
    

  describe('GET/api/updates', () => {

    context('Given there are NO updates in the database', () => {

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/updates-comments')
          .expect(200, [])
          })

      })

    context('Given there ARE updates-comments in the database', () => {

      const testTeachers = makeTeachersArray()
      const testClasses = makeClassesArray()
      const testUsers = makeUsersArray()
      const testUpdates = makeUpdatesArray()
      const testUpdatesComments = makeUpdatesCommentsArray()

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
                .into('updates')
                .insert(testUpdates)
                .then(() => {
                    return db
                    .into('updates_comments')
                    .insert(testUpdatesComments)
                })
            })
          })
        })
      })

      it('gets updates-comments from the store', () => {
        return supertest(app)
        .get('/api/updates-comments')
        .expect(200, testUpdatesComments)
           })
         })
  
  context(`Given an XSS attack update`, () => {
    const testTeachers = makeTeachersArray()
    const testClasses = makeClassesArray()
    const testUsers = makeUsersArray()
    const testUpdates = makeUpdatesArray()
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
                  .into('updates')
                  .insert(testUpdates)
                  .then(() => {
                    return db
                      .into('updates_comments')
                      .insert([maliciousComment])
                        })  
                      })
                    })
                })
              })  
                          
    it('removes XSS attack content', () => {
      return supertest(app)
        .get(`/api/updates-comments`)
        .expect(200)
        .expect(res => {
          expect(res.body[0].comment).to.eql(expectedComment.comment)
                          })
                      })
                    })
        
    

  describe('GET/api/updates-comments/:commentId', () => {

    context('Given there are NO updates-comments in the database', () => {

      it(`responds 404 the update doesn't exist`, () => {
        return supertest(app)
          .get(`/api/updates-comments/123`)
          .expect(404, {
          error: { message: `Comment doesn't exist` }
               })
           })
       })

    context('Given there ARE updates-comments in the database', () => {

        const testTeachers = makeTeachersArray()
        const testClasses = makeClassesArray()
        const testUsers = makeUsersArray()
        const testUpdates = makeUpdatesArray()
        const testUpdatesComments = makeUpdatesCommentsArray()
  
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
                  .into('updates')
                  .insert(testUpdates)
                  .then(() => {
                      return db
                      .into('updates_comments')
                      .insert(testUpdatesComments)
                  })
              })
            })
          })
        })
    it('responds with 200 and the specified user', () => {
      const commentId = 2
      const expectedComment = testUpdatesComments[commentId - 1]
        return supertest(app)
          .get(`/api/updates-comments/${commentId}`)
          .expect(200, expectedComment)
         })
       })
      })
      })
    })




