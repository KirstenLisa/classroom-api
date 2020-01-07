const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const { makeAuthHeader, seedTeachers, seedClassList, seedUsers, seedHomework, seedHomeworkComments, makeMaliciousComment, makeHomeworkCommentsArray, makeHomeworkArray, makeTeachersArray, makeClassesArray, makeUsersArray } = require('./test-helpers')


describe('Auth Endpoints', function() {
    let db

    const testUsers = makeUsersArray()
    const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })
    
    
    after('disconnect from db', () => db.destroy());
    before('clean the table', () => db.raw('TRUNCATE teachers, class_list, classroom_users, homework, homework_comments RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE teachers, class_list, classroom_users, homework, homework_comments RESTART IDENTITY CASCADE'));
    

  describe(`POST /api/auth/login`, () => {
    const testTeachers = makeTeachersArray()
    const testClasses = makeClassesArray()
    const testUsers = makeUsersArray()


      beforeEach('insert teachers', () =>
        seedTeachers(db, testTeachers)
      );

      beforeEach('insert classes', () =>
        seedClassList(db, testClasses)
      );

      beforeEach('insert users', () =>
        seedUsers(db, testUsers)
        );


    const requiredFields = ['username', 'password']
        
    requiredFields.forEach(field => {
        const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password,
    }
        
    it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]
        
        return supertest(app)
            .post('/api/auth/login')
            .send(loginAttemptBody)
            .expect(400, {
                error: `Missing '${field}' in request body`,
        })
    })

    it(`responds 400 'invalid username or password' when bad username`, () => {
        const userInvalidUser = { username: 'user-not', password: 'existy' }
            return supertest(app)
              .post('/api/auth/login')
              .send(userInvalidUser)
              .expect(400, { error: `Incorrect username or password` })
          })

    it(`responds 400 'invalid username or password' when bad password`, () => {
        const userInvalidPass = { username: testUser.username, password: 'incorrect' }
            return supertest(app)
                .post('/api/auth/login')
                .send(userInvalidPass)
                .expect(400, { error: `Incorrect username or password` })
            })


    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
        const userValidCreds = {
            username: testUser.username,
            password: testUser.password,
            }
        const expectedToken = jwt.sign(
            { user_id: testUser.user_id }, // payload
                process.env.JWT_SECRET,
            {
            subject: testUser.username,
            expiresIn: process.env.JWT_EXPIRY,
            algorithm: 'HS256',
            }
            )
            return supertest(app)
                .post('/api/auth/login')
                .send(userValidCreds)
                .expect(200, {
                authToken: expectedToken,
                })
            })
          })
        })

  describe(`POST /api/auth/refresh`, () => {
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
          
      it(`responds 200 and JWT auth token using secret`, () => {
                const expectedToken = jwt.sign(
                  { user_id: testUser.user_id },
                  process.env.JWT_SECRET,
                  {
                    subject: testUser.username,
                    expiresIn: process.env.JWT_EXPIRY,
                    algorithm: 'HS256',
                  }
                )
                return supertest(app)
                  .post('/api/auth/refresh')
                  .set('Authorization', makeAuthHeader(testUser))
                  .expect(200, {
                    authToken: expectedToken,
                  })
              })
            })
    })
  