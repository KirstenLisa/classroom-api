const knex = require('knex')
const app = require('../src/app')
const { makeTeachersArray, makeClassesArray } = require('./test-helpers')

describe(`Classes service object`, function() {

    let db

    before(() => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
           })
        app.set('db', db)
  })
    
    
    after('disconnect from db', () => db.destroy());
    before('clean the table', () => db.raw('TRUNCATE teachers, class_list RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE teachers, class_list RESTART IDENTITY CASCADE'));
    

  describe('GET/api/classes', () => {

    context('Given there is NO data in the database', () => {

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/classes')
          .expect(200, [])
          })

      })

    context('Given there IS data in the database', () => {

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
  

      it('gets users from the store', () => {
        return supertest(app)
        .get('/api/classes')
        .expect(200, testClasses)
           })
         })


  describe('GET/api/classes/:classId', () => {

    context('Given there are NO classes in the database', () => {

      it(`responds 404 the class doesn't exist`, () => {
        return supertest(app)
          .get(`/api/classes/123`)
          .expect(404, {
          error: { message: `Class id doesn't exist` }
               })
           })
       })

    context('Given there ARE classes in the database', () => {

      const testTeachers = makeTeachersArray()
      const testClasses = makeClassesArray()

    beforeEach('insert classes', () => {
      return db
      .into('teachers')
      .insert(testTeachers)
      .then(() => {
        return db
        .into('class_list')
        .insert(testClasses)
      })  
    })

    it('responds with 200 and the specified user', () => {
      const classId = 2
      const expectedClass = testClasses[classId - 1]
        return supertest(app)
          .get(`/api/classes/${classId}`)
          .expect(200, expectedClass)
         })
       })
      })
      })
    })


