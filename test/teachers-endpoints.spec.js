const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const xss = require('xss')
const { makeTeachersArray } = require('./test-helpers')

describe.only(`Teachers service object`, function() {

    let db

    before(() => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
           })
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

      })
  


  })