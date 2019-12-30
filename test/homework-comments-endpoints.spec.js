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


  describe('DELETE /homework-comments/:id', () => {
        
    context(`Given no comments`, () => {
                              
      it(`responds 404 the comment doesn't exist`, () => {
        return supertest(app)
          .delete(`/api/homework-comments/123`)
          .expect(404, {
            error: { message: `Comment doesn't exist` }
                                  })
                              })
                            })
                      
    context('Given there ARE comments in the database', () => {
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
                        
                
    it('removes the comments by ID from the store', () => {
      const idToRemove = 2
      const expectedComment = testHomeworkComments.filter(comment => comment.comment_id !== idToRemove)
        return supertest(app)
          .delete(`/api/homework-comments/${idToRemove}`)
              .expect(204)
              .then(() =>
                supertest(app)
                .get(`/api/homework-comments`)
                .expect(expectedComment)
                                  )
                              })
                            })
                          })  



  describe(`POST /homework-comments`, () => {

    const testTeachers = makeTeachersArray()
    const testClasses = makeClassesArray()
    const testUsers = makeUsersArray()
    const testHomework = makeHomeworkArray()
                                            
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
      })
    })                        
  })
})
                                                    
    it(`creates a comment, responding with 201 and the new comment`, function() {
      this.retries(3)
      const newHomeworkComment = {
        comment_id: 5,
        comment: 'Test new comment homework',
        user_name: 'test-username-1',
        date: '2019-04-22T16:28:32.615Z',
        user_id: 1,
        page_id: 11
    }
                                            
      return supertest(app)
        .post('/api/homework-comments')
        .send(newHomeworkComment)
        .expect(201)
        .expect(res => {
          expect(res.body.comment).to.eql(newHomeworkComment.comment)
          expect(res.body.user_name).to.eql(newHomeworkComment.user_name)
          expect(res.body.date).to.eql(newHomeworkComment.date)
          expect(res.body.user_id).to.eql(newHomeworkComment.user_id)
          expect(res.body.page_id).to.eql(newHomeworkComment.page_id)
          expect(res.body).to.have.property('comment_id')
          expect(res.headers.location).to.eql(`/api/homework-comments/${res.body.comment_id}`)
          })
          .then(postRes =>
            supertest(app)
            .get(`/api/homework-comments/${postRes.body.comment_id}`)
            .expect(postRes.body)
          )
        })
                                                        
      const requiredFields = ['comment', 'user_name', 'date', 'user_id', 'page_id']
                                                        
      requiredFields.forEach(field => {
        const newHomeworkComment = {
          comment: 'Test new comment homework',
          user_name: 'test-username-1',
          date: '2019-04-22T16:28:32.615Z',
          user_id: 1,
          page_id: 11
      }
                                                        
    it(`responds with 400 and an error message when the '${field}' is missing`, () => {
      delete newHomeworkComment[field]
                                                        
      return supertest(app)
      .post('/api/homework-comments')
      .send(newHomeworkComment)
      .expect(400, {
        error: { message: `Missing '${field}' in request body` }
      })
    })
  })
                                                             
  it('removes XSS attack content', () => {
    const { maliciousComment, expectedComment } = makeMaliciousComment();
    return supertest(app)
      .post('/api/homework-comments')
      .send(maliciousComment)
      .expect(201)
      .expect(res => {
          expect(res.body.comment).to.eql(expectedComment.comment)
          expect(res.body.user_name).to.eql(expectedComment.user_name)
          expect(res.body.date).to.eql(expectedComment.date)
          expect(res.body.user_id).to.eql(expectedComment.user_id)
          expect(res.body.page_id).to.eql(expectedComment.page_id)
        })
      })
    })                     
                        

    })




