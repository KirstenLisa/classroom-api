const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const xss = require('xss')
const { makeMaliciousUser, makeTeachersArray, makeClassesArray, makeUsersArray } = require('./test-helpers')

describe(`Users service object`, function() {

    let db

    before(() => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
           })
        app.set('db', db)
  })
    
    
    after('disconnect from db', () => db.destroy());
    before('clean the table', () => db.raw('TRUNCATE teachers, class_list, classroom_users RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE teachers, class_list, classroom_users RESTART IDENTITY CASCADE'));
    

  describe('GET/api/users', () => {

    context('Given there is NO data in the database', () => {

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/users')
          .expect(200, [])
          })

      })

    context('Given there IS data in the database', () => {

      const testTeachers = makeTeachersArray()
      const testClasses = makeClassesArray()
      const testUsers = makeUsersArray()

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
          })
        })
      })

      it('gets users from the store', () => {
        return supertest(app)
        .get('/api/users')
        .expect(200, testUsers)
           })
         })
    


    context(`Given an XSS attack user`, () => {
      const testTeachers = makeTeachersArray()
      const testClasses = makeClassesArray()
      const { maliciousUser, expectedUser } = makeMaliciousUser()
    
        beforeEach('insert data', () => {
          return db
          .into('teachers')
          .insert(testTeachers)
          .then(() => {
            return db
            .into('class_list')
            .insert(testClasses)
          . then(() => {
            return db
            .into('classroom_users')
            .insert([maliciousUser])
          })
        })
      })   
              
      it('removes XSS attack content', () => {
          return supertest(app)
              .get(`/api/users`)
              .expect(200)
              .expect(res => {
                expect(res.body[0].fullname).to.eql(expectedUser.fullname)
                expect(res.body[0].username).to.eql(expectedUser.username)
                expect(res.body[0].password).to.eql(expectedUser.password)
              })
          })
        })
    

  describe('GET/api/users/:userId', () => {

    context('Given there are NO users in the database', () => {

      it(`responds 404 the user doesn't exist`, () => {
        return supertest(app)
          .get(`/api/users/123`)
          .expect(404, {
          error: { message: `User id doesn't exist` }
               })
           })
       })

    context('Given there ARE users in the database', () => {

      const testTeachers = makeTeachersArray()
      const testClasses = makeClassesArray()
      const testUsers = makeUsersArray()

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
          })
        })
      })

    it('responds with 200 and the specified user', () => {
      const userId = 2
      const expectedUser = testUsers[userId - 1]
        return supertest(app)
          .get(`/api/users/${userId}`)
          .expect(200, expectedUser)
         })
       })
      })


describe('DELETE /users/:user_id', () => {
        
  context(`Given no users`, () => {
              
    it(`responds 404 the user doesn't exist`, () => {
      return supertest(app)
        .delete(`/api/users/123`)
        .expect(404, {
          error: { message: `User id doesn't exist` }
                  })
              })
            })
      
  context('Given there ARE users in the database', () => {
    const testTeachers = makeTeachersArray()
    const testClasses = makeClassesArray()
    const testUsers = makeUsersArray()

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
          })
        })
      })
        
      it('removes the note by ID from the store', () => {
        const idToRemove = 2
        const expectedUser = testUsers.filter(user => user.user_id !== idToRemove)
          return supertest(app)
            .delete(`/api/users/${idToRemove}`)
            .expect(204)
            .then(() =>
              supertest(app)
                .get(`/api/users`)
                .expect(expectedUser)
            )
              })
            })
          })            

      })


  describe(`POST /users`, () => {

    const testTeachers = makeTeachersArray()
    const testClasses = makeClassesArray()
    beforeEach('insert data', () => {
      return db
        .into('teachers')
        .insert(testTeachers)
        .then(() => {
          return db
          .into('class_list')
          .insert(testClasses)
        })
      })

    it(`creates a user, responding with 201 and the new article`, function() {
      this.retries(3)
      const newUser = {
        fullname: 'Test new user',
        username: 'test new username',
        password: 'Test password',
        class_id: 2,
        user_type: 'student'
            }
          return supertest(app)
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect(res => {
              expect(res.body.fullname).to.eql(newUser.fullname)
              expect(res.body.username).to.eql(newUser.username)
              expect(res.body.password).to.eql(newUser.password)
              expect(res.body.class_id).to.eql(newUser.class_id)
              expect(res.body.user_type).to.eql(newUser.user_type)
              expect(res.body).to.have.property('user_id')
              expect(res.headers.location).to.eql(`/api/users/${res.body.user_id}`)
               })
               .then(postRes =>
                supertest(app)
                .get(`/api/users/${postRes.body.user_id}`)
                .expect(postRes.body)
                )
            })
    
        const requiredFields = ['fullname', 'username', 'password', 'class_id', 'user_type']
    
        requiredFields.forEach(field => {
        const newUser = {
          fullname: 'Test new user',
          username: 'test new username',
          password: 'Test password',
          class_id: 2,
          user_type: 'student'
         }
    
         it(`responds with 400 and an error message when the '${field}' is missing`, () => {
           delete newUser[field]
    
           return supertest(app)
             .post('/api/users')
             .send(newUser)
             .expect(400, {
               error: { message: `Missing '${field}' in request body` }
             })
         })
       })
         
        it('removes XSS attack content', () => {
          const { maliciousUser, expectedUser } = makeMaliciousUser();
            return supertest(app)
              .post('/api/users')
              .send(maliciousUser)
              .expect(201)
              .expect(res => {
                expect(res.body.fullname).to.eql(expectedUser.fullname)
                expect(res.body.username).to.eql(expectedUser.username)
                expect(res.body.password).to.eql(expectedUser.password)
                expect(res.body.class_id).to.eql(expectedUser.class_id)
                expect(res.body.user_type).to.eql(expectedUser.user_type)
                  
                   })
                })
              })



    })


