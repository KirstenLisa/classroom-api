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

    it('responds with 200 and the specified update', () => {
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
          
    
          
describe(`PATCH /api/update/:update_id`, () => {
  context(`Given no updates`, () => {
  
    it(`responds with 404`, () => {
      const updateId = 123456
      return supertest(app)
      .patch(`/api/updates/${updateId}`)
      .expect(404, { error: { message: `Update doesn't exist` } })
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

  it('responds with 204 and updates the updates', () => {
                        
    const idToUpdate = 2
    const updatedUpdate = {
      headline: 'updated headline',
      content: 'updated content',
      class_id: 1,
      author: 'updated author',
      date: '2019-04-22T16:28:32.615Z'
      }
          
    const expectedUpdate = {
      ...testUpdates[idToUpdate - 1],
      ...updatedUpdate
                  }
                           
    return supertest(app)
      .patch(`/api/updates/${idToUpdate}`)
      .send(updatedUpdate)
      .expect(204)
      .then(res =>
        supertest(app)
        .get(`/api/updates/${idToUpdate}`)
        .expect(expectedUpdate)
      )
    }) 
                
    it(`responds with 400 when no required fields supplied`, () => {
                  
      const idToUpdate = 2
        return supertest(app)
        .patch(`/api/updates/${idToUpdate}`)
        .send({ irrelevantField: 'foo' })
        .expect(400, {
            error: {
              message: `Request body must contain either 'headline', 'content', 'class_id', 'author' or 'date'`
            }
          })
        })
                
    it(`responds with 204 when updating only a subset of fields`, () => {
                  
      const idToUpdate = 2
      const updatedUpdate = {
            headline: 'updated headline',
                               }
      const expectedUpdate = {
          ...testUpdates[idToUpdate - 1],
          ...updatedUpdate
                  }
                            
      return supertest(app)
        .patch(`/api/updates/${idToUpdate}`)
        .send({
            ...updatedUpdate,
            fieldToIgnore: 'should not be in GET response'
                            })
        .expect(204)
        .then(res =>
          supertest(app)
          .get(`/api/updates/${idToUpdate}`)
          .expect(expectedUpdate)
        )
      })
    })
  })
                  



  describe.only(`POST /updates`, () => {

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
        
    it(`creates an update, responding with 201 and the new update`, function() {
      this.retries(3)
      const newUpdate = {
        update_id: 5,
        headline: 'Test new headline',
        content: 'test new content',
        class_id: 2,
        author: 'test new author',
        date: '2019-04-22T16:28:32.615Z'
        }

      return supertest(app)
        .post('/api/updates')
        .send(newUpdate)
        .expect(201)
        .expect(res => {
          expect(res.body.headline).to.eql(newUpdate.headline)
          expect(res.body.content).to.eql(newUpdate.content)
          expect(res.body.class_id).to.eql(newUpdate.class_id)
          expect(res.body.author).to.eql(newUpdate.author)
          const expected = new Intl.DateTimeFormat('en-US').format(new Date(res.body.date))
          const actual = new Intl.DateTimeFormat('en-US').format(new Date(newUpdate.date))
          expect(actual).to.eql(expected)
          expect(res.body).to.have.property('update_id')
          expect(res.headers.location).to.eql(`/api/updates/${res.body.update_id}`)
                })
            .then(postRes =>
              supertest(app)
              .get(`/api/updates/${postRes.body.update_id}`)
              .expect(postRes.body)
                )
            })
            
      const requiredFields = ['headline', 'content', 'class_id', 'author']
            
        requiredFields.forEach(field => {
          const newUpdate = {
            headline: 'Test new headline',
            content: 'test new content',
            class_id: 2,
            author: 'test new author',
            }
            
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newUpdate[field]
            
        return supertest(app)
          .post('/api/updates')
          .send(newUpdate)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
                     })
                 })
               })
                 
      it('removes XSS attack content', () => {
        const { maliciousUpdate, expectedUpdate } = makeMaliciousUpdate();
          return supertest(app)
            .post('/api/updates')
            .send(maliciousUpdate)
            .expect(201)
            .expect(res => {
              expect(res.body.headline).to.eql(expectedUpdate.headline)
              expect(res.body.content).to.eql(expectedUpdate.content)
              expect(res.body.class_id).to.eql(expectedUpdate.class_id)
              expect(res.body.author).to.eql(expectedUpdate.author)
              expect(res.body.date).to.eql(expectedUpdate.date)
                          
                           })
                        })
                      })
        




    })


