const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const xss = require('xss')
const { makeMaliciousHomework, makeHomeworkArray, makeTeachersArray, makeClassesArray, makeUsersArray } = require('./test-helpers')

describe(`Homework service object`, function() {

    let db

    before(() => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
           })
        app.set('db', db)
  })
    
    
    after('disconnect from db', () => db.destroy());
    before('clean the table', () => db.raw('TRUNCATE teachers, class_list, classroom_users, homework RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE teachers, class_list, classroom_users, homework RESTART IDENTITY CASCADE'));
    

  describe('GET/api/homework', () => {

    context('Given there is NO homework in the database', () => {

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/homework')
          .expect(200, [])
          })

      })

    context('Given there is homework in the database', () => {

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

      it('gets updates from the store', () => {
        return supertest(app)
        .get('/api/homework')
        .expect(200, testHomework)
           })
         })
  
         context(`Given an XSS attack update`, () => {
          const testTeachers = makeTeachersArray()
          const testClasses = makeClassesArray()
          const testUsers = makeUsersArray()
          const { maliciousHomework, expectedHomework } = makeMaliciousHomework()
            
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
                    .insert([maliciousHomework])
                  })
                })
            })
          })  
                      
          it('removes XSS attack content', () => {
            return supertest(app)
              .get(`/api/homework`)
              .expect(200)
              .expect(res => {
                expect(res.body[0].homework).to.eql(expectedHomework.homework)
                      })
                  })
                })
    

  describe('GET/api/homework/:homeworkId', () => {

    context('Given there is NO homework in the database', () => {

      it(`responds 404 the homework doesn't exist`, () => {
        return supertest(app)
          .get(`/api/homework/123`)
          .expect(404, {
          error: { message: `Homework doesn't exist` }
               })
           })
       })

    context('Given there IS homework in the database', () => {

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
                .into('homework')
                .insert(testHomework)
              })
            })
          })
    

    it('responds with 200 and the specified user', () => {
      const homeworkId = 2
      const expectedHomework = testHomework[homeworkId - 1]
        return supertest(app)
          .get(`/api/homework/${homeworkId}`)
          .expect(200, expectedHomework)
         })
       })
      })
      })
    })


