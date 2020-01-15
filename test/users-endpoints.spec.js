const { expect } = require('chai')
const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const { seedUsers, seedTeachers, seedClassList, seedHomework, makeAuthHeader, makeMaliciousHomework, makeHomeworkArray, makeTeachersArray, makeClassesArray, makeUsersArray } = require('./test-helpers')

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
    





  describe(`POST /users`, () => {
    context(`User Validation`, () => {

      const testTeachers = makeTeachersArray()
      const testClasses = makeClassesArray()
      const testUsers = makeUsersArray()
      const testUser = testUsers[0]

      beforeEach('insert teachers', () =>
        seedTeachers(db, testTeachers)
     );

    beforeEach('insert classes', () =>
        seedClassList(db, testClasses)
    );

    beforeEach('insert users', () =>
      seedUsers(db, testUsers)
      );

    const requiredFields = ['fullname', 'username', 'password', 'class_id', 'user_type']
    
    requiredFields.forEach(field => {
        const registerAttemptBody = {
          fullname: 'Test new user',
          username: 'test new username',
          password: 'Test password',
          class_id: 2,
          user_type: 'student'
         }

         it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })


      it(`responds 400 'Password must be longer than 7 characters' when empty password`, () => {
        const userShortPassword = {
          fullname: 'Test new user',
          username: 'test new username',
          password: '123456',
          class_id: 2,
          user_type: 'student'
        }
        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, { error: `Password must be longer than 7 characters` })
          })

      it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          fullname: 'Test new user',
          username: 'test new username',
          password: '*'.repeat(73),
          class_id: 2,
          user_type: 'student'
          }
          // console.log(userLongPassword)
          // console.log(userLongPassword.password.length)
          return supertest(app)
            .post('/api/users')
            .send(userLongPassword)
            .expect(400, { error: `Password must be less than 72 characters` })
          })

      it(`responds 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          fullname: 'Test new user',
          username: 'test new username',
          password: ' 1Aa!2Bb@',
          class_id: 2,
          user_type: 'student'
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordStartsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })

      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          fullname: 'Test new user',
          username: 'test new username',
          password: '1Aa!2Bb@ ',
          class_id: 2,
          user_type: 'student'
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordEndsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })

      it(`responds 400 error when password isn't complex enough`, () => {
          const userPasswordNotComplex = {
            fullname: 'Test new user',
            username: 'test new username',
            password: '11AAaabb',
            class_id: 2,
            user_type: 'student'
        }
          return supertest(app)
            .post('/api/users')
            .send(userPasswordNotComplex)
            .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
        })

      it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
        const duplicateUser = {
          fullname: 'Test new user',
          username: testUser.username,
          password: '11AAaa!!',
          class_id: 2,
          user_type: 'student'
      }
        return supertest(app)
          .post('/api/users')
          .send(duplicateUser)
          .expect(400, { error: `Username already taken` })
      })
          })
        })
  
  context(`Happy path`, () => {

    const testTeachers = makeTeachersArray()
    const testClasses = makeClassesArray()


    beforeEach('insert teachers', () =>
      seedTeachers(db, testTeachers)
      );

    beforeEach('insert classes', () =>
      seedClassList(db, testClasses)
      );



    it(`creates a user, responding with 201 and the new user`, function() {
      this.retries(3)
      const newUser = {
        fullname: 'Test new user',
        username: 'test new username',
        password: '11AAaa!!',
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
              expect(res.body.class_id).to.eql(newUser.class_id)
              expect(res.body.user_type).to.eql(newUser.user_type)
              expect(res.body).to.have.property('user_id')
              expect(res.body).to.not.have.property('password')
              expect(res.headers.location).to.eql(`/api/users/${res.body.user_id}`)
               })
              .expect(res =>
                db
                  .from('classroom_users')
                  .select('*')
                  .where({ username: res.body.username })
                  .first()
                  .then(row => {
                    expect(res.body.fullname).to.eql(newUser.fullname)
                    expect(res.body.username).to.eql(newUser.username)
                    expect(res.body.class_id).to.eql(newUser.class_id)
                    expect(res.body.user_type).to.eql(newUser.user_type)

                    return bcrypt.compare(newUser.password, row.password)
              })
                    .then(compareMatch => {
                        expect(compareMatch).to.be.true
                 })
                  )

               .then(postRes =>
                supertest(app)
                .get(`/api/users/${postRes.body.user_id}`)
                .expect(postRes.body)
                )
            })
    
             }) 
                       

    })


