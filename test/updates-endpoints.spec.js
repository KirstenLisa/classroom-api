const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const xss = require('xss')
const { makeMaliciousUpdate, makeUpdatesArray, makeTeachersArray, makeClassesArray, makeUsersArray } = require('./test-helpers')

describe(`Updates service object`, function() {

    let db

    before(() => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
           })
        app.set('db', db)
  })
    
    
    after('disconnect from db', () => db.destroy());
    before('clean the table', () => db.raw('TRUNCATE teachers, class_list, classroom_users, updates RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE teachers, class_list, classroom_users, updates RESTART IDENTITY CASCADE'));
    

  describe('GET/api/updates', () => {

    context('Given there are NO updates in the database', () => {

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/updates')
          .expect(200, [])
          })

      })

    context('Given there ARE updates in the database', () => {

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

      it('gets updates from the store', () => {
        return supertest(app)
        .get('/api/updates')
        .expect(200, testUpdates)
           })
         })
    

    context(`Given an XSS attack update`, () => {
      const testTeachers = makeTeachersArray()
      const testClasses = makeClassesArray()
      const testUsers = makeUsersArray()
      const { maliciousUpdate, expectedUpdate } = makeMaliciousUpdate()
        
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
                .insert([maliciousUpdate])
              })
            })
        })
      })  
                  
      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/updates`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].headline).to.eql(expectedUpdate.headline)
            expect(res.body[0].content).to.eql(expectedUpdate.content)
            expect(res.body[0].author).to.eql(expectedUpdate.author)
                  })
              })
            })




  describe('GET/api/updates/:updateId', () => {

    context('Given there are NO updates in the database', () => {

      it(`responds 404 the update doesn't exist`, () => {
        return supertest(app)
          .get(`/api/updates/123`)
          .expect(404, {
          error: { message: `Update doesn't exist` }
               })
           })
       })

    context('Given there ARE updates in the database', () => {

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

    it('responds with 200 and the specified user', () => {
      const updateId = 2
      const expectedUpdate = testUpdates[updateId - 1]
        return supertest(app)
          .get(`/api/updates/${updateId}`)
          .expect(200, expectedUpdate)
         })
       })
      })
      })


describe('DELETE /updates/:id', () => {
        
  context(`Given no updates`, () => {
              
    it(`responds 404 the note doesn't exist`, () => {
      return supertest(app)
        .delete(`/api/updates/123`)
        .expect(404, {
          error: { message: `Update doesn't exist` }
                  })
              })
            })
      
  context('Given there ARE updates in the database', () => {
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
        

    it('removes the update by ID from the store', () => {
      const idToRemove = 2
      const expectedUpdate = testUpdates.filter(update => update.update_id !== idToRemove)
                return supertest(app)
                  .delete(`/api/updates/${idToRemove}`)
                  .expect(204)
                  .then(() =>
                    supertest(app)
                      .get(`/api/updates`)
                      .expect(expectedUpdate)
                  )
              })
            })
          })            





    })


