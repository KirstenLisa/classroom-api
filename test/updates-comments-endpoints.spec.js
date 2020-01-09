const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { seedTeachers, seedClassList, seedUsers, seedUpdates, seedUpdatesComments, makeMaliciousComment, makeUpdatesCommentsArray, makeUpdatesArray, makeTeachersArray, makeClassesArray, makeUsersArray } = require('./test-helpers')

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

      const testTeachers = makeTeachersArray()
      const testClasses = makeClassesArray()
      const testUsers = makeUsersArray()
      const testUpdates = makeUpdatesArray()
      

      beforeEach('insert teachers', () =>
        seedTeachers(db, testTeachers)
      );

      beforeEach('insert classes', () =>
        seedClassList(db, testClasses)
      );

      beforeEach('insert users', () =>
        seedUsers(db, testUsers)
        );

      beforeEach('insert updates', () =>
        seedUpdates(db, testUpdates)
        ); 
     
      

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

      beforeEach('insert teachers', () =>
        seedTeachers(db, testTeachers)
      );

      beforeEach('insert classes', () =>
        seedClassList(db, testClasses)
      );

      beforeEach('insert users', () =>
        seedUsers(db, testUsers)
        );

      beforeEach('insert updates', () =>
        seedUpdates(db, testUpdates)
        );  

      beforeEach('insert updates-comments',() => 
        seedUpdatesComments(db, testUpdatesComments))
     
        
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
                

    beforeEach('insert teachers', () =>
      seedTeachers(db, testTeachers)
    );

    beforeEach('insert classes', () =>
      seedClassList(db, testClasses)
    );

    beforeEach('insert users', () =>
      seedUsers(db, testUsers)
      );

    beforeEach('insert updates', () =>
      seedUpdates(db, testUpdates)
      );  

    
    beforeEach('insertupdates-comments',() => 
      seedUpdatesComments(db, maliciousComment))
   
    
         
    it('removes XSS attack content', () => {
      return supertest(app)
        .get(`/api/updates-comments`)
        .expect(200)
        .expect(res => {
          expect(res.body[0].comment).to.eql(expectedComment.comment)
                          })
                      })
                    })
        
                  })

  describe('GET/api/updates-comments/:commentId', () => {

    context('Given there are NO updates-comments in the database', () => {

      const testTeachers = makeTeachersArray()
      const testClasses = makeClassesArray()
      const testUsers = makeUsersArray()
      const testUpdates = makeUpdatesArray()

      beforeEach('insert teachers', () =>
        seedTeachers(db, testTeachers)
      );

      beforeEach('insert classes', () =>
        seedClassList(db, testClasses)
      );

      beforeEach('insert users', () =>
        seedUsers(db, testUsers)
        );

      beforeEach('insert updates', () =>
        seedUpdates(db, testUpdates)
        );  

    
      

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get(`/api/updates-comments/123`)
          .expect(200, [])
        })
    })


    context('Given there ARE updates-comments in the database', () => {

        const testTeachers = makeTeachersArray()
        const testClasses = makeClassesArray()
        const testUsers = makeUsersArray()
        const testUpdates = makeUpdatesArray()
        const testUpdatesComments = makeUpdatesCommentsArray()
        
  
        beforeEach('insert teachers', () =>
          seedTeachers(db, testTeachers)
        );
  
        beforeEach('insert classes', () =>
          seedClassList(db, testClasses)
        );
  
        beforeEach('insert users', () =>
          seedUsers(db, testUsers)
          );
  
        beforeEach('insert updates', () =>
          seedUpdates(db, testUpdates)
          );  
  
        
        beforeEach('insertupdates-comments',() => 
          seedUpdatesComments(db, testUpdatesComments))
       
        
    it('responds with 200 and the specified comment', () => {
      const commentId = 2
      const expectedComment = testUpdatesComments[commentId - 1]
        return supertest(app)
          .get(`/api/updates-comments/${commentId}`)
          .expect(200, [expectedComment])
         })
       })
      })
      
                           
            

  describe(`POST /updates-comments`, () => {

    const testTeachers = makeTeachersArray()
    const testClasses = makeClassesArray()
    const testUsers = makeUsersArray()
    const testUpdates = makeUpdatesArray()
                    
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
            })
          })                        
    })
  })
                            
    it(`creates a comment, responding with 201 and the new comment`, function() {
      this.retries(3)
      const newUpdateComment = {
        comment_id: 5,
        comment: 'Test new comment',
        user_name: 'test-username-1',
        date: '2019-04-22T16:28:32.615Z',
        user_id: 1,
        page_id: 1
        }
                    
      return supertest(app)
        .post('/api/updates-comments')
        .send(newUpdateComment)
        .expect(201)
        .expect(res => {
          expect(res.body.comment).to.eql(newUpdateComment.comment)
          expect(res.body.user_name).to.eql(newUpdateComment.user_name)
          expect(res.body.date).to.eql(newUpdateComment.date)
          expect(res.body.user_id).to.eql(newUpdateComment.user_id)
          expect(res.body.page_id).to.eql(newUpdateComment.page_id)
          expect(res.body).to.have.property('comment_id')
          expect(res.headers.location).to.eql(`/api/updates-comments/${res.body.comment_id}`)
                                    })
            .then(postRes =>
              supertest(app)
              .get(`/api/updates-comments/${postRes.body.comment_id}`)
              .expect([postRes.body])
            )
          })
                                
      const requiredFields = ['comment', 'user_name', 'date', 'user_id', 'page_id']
                                
        requiredFields.forEach(field => {
          const newUpdateComment = {
            comment: 'Test new comment',
            user_name: 'test-username-1',
            date: '2019-04-22T16:28:32.615Z',
            user_id: 1,
            page_id: 1
            }
                                
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newUpdateComment[field]
                                
        return supertest(app)
        .post('/api/updates-comments')
        .send(newUpdateComment)
        .expect(400, {
          error: { message: `Missing '${field}' in request body` }
          })
        })
      })
                                     
      it('removes XSS attack content', () => {
        const { maliciousComment, expectedComment } = makeMaliciousComment();
          return supertest(app)
            .post('/api/updates-comments')
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




