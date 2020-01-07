const knex = require('knex')
const app = require('../src/app')
const { makeTeachersArray } = require('./test-helpers')

describe(`Teachers service object`, function() {

    let db

    before(() => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
           })
        app.set('db', db)
  })
    
    
    after('disconnect from db', () => db.destroy());
    before('clean the table', () => db.raw('TRUNCATE teachers RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE teachers RESTART IDENTITY CASCADE'));
    

  describe('GET/api/teachers', () => {

    context('Given there is NO data in the database', () => {

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/teachers')
          .expect(200, [])
          })

      })

    context('Given there IS data in the database', () => {

      const testTeachers = makeTeachersArray()

      beforeEach('insert teachers', () => {
        return db
          .into('teachers')
          .insert(testTeachers)
      })

      it('gets teachers from the store', () => {
        return supertest(app)
        .get('/api/teachers')
        .expect(200, testTeachers)
           })
         })


  describe('GET/api/teachers/:teacherId', () => {

    context('Given there is NO data in the database', () => {

      it(`responds 404 the teacher doesn't exist`, () => {
        return supertest(app)
          .get(`/api/teachers/123`)
          .expect(404, {
          error: { message: `Teacher id doesn't exist` }
               })
           })
       })

    context('Given there IS data in the database', () => {

    const testTeachers = makeTeachersArray()

    beforeEach('insert teacher', () => {
      return db
      .into('teachers')
      .insert(testTeachers)
    })

    it('responds with 200 and the specified teacher', () => {
      const teacherId = 2
      const expectedTeacher = testTeachers[teacherId - 1]
        return supertest(app)
          .get(`/api/teachers/${teacherId}`)
          .expect(200, expectedTeacher)
         })
       })
      })
      })
    })


