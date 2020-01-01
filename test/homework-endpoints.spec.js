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


describe('DELETE /homework/:id', () => {
        
  context(`Given no homework`, () => {
                    
          it(`responds 404 the homework doesn't exist`, () => {
            return supertest(app)
              .delete(`/api/homework/123`)
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
              
      
    it('removes the homework by ID from the store', () => {
      const idToRemove = 2
      const expectedHomework = testHomework.filter(homework => homework.id !== idToRemove)
        return supertest(app)
          .delete(`/api/homework/${idToRemove}`)
          .expect(204)
          .then(() =>
            supertest(app)
            .get(`/api/homework`)
            .expect(expectedHomework)
                        )
                    })
                  })
                })            
  
            
describe(`PATCH /api/homework/:homework_id`, () => {
  context(`Given no homework`, () => {
  
    it(`responds with 404`, () => {
      const homeworkId = 123456
      return supertest(app)
      .patch(`/api/homework/${homeworkId}`)
      .expect(404, { error: { message: `Homework doesn't exist` } })
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

  it('responds with 204 and updates the homework', () => {
                        
    const idToUpdate = 2
    const updatedHomework = {
      homework_id: 33,
      subject: 'Math',
      homework: 'updated homework',
      due_date: '2019-04-22T16:28:32.615Z',
      teacher_id: 3,
      teacher_name: 'test-teacher-name-3',
      class_id: 2 
      }
          
    const expectedHomework = {
      ...testHomework[idToUpdate - 1],
      ...updatedHomework
                  }

    console.log(idToUpdate)
                           
    return supertest(app)
      .patch(`/api/homework/${idToUpdate}`)
      .send(updatedHomework)
      .expect(204)
      .then(res =>
        supertest(app)
        .get(`/api/homework/${idToUpdate}`)
        .expect(expectedHomework)
      )
    }) 
                
    it(`responds with 400 when no required fields supplied`, () => {
                  
      const idToUpdate = 2
        return supertest(app)
        .patch(`/api/homework/${idToUpdate}`)
        .send({ irrelevantField: 'foo' })
        .expect(400, {
            error: {
              message: `Request body must contain either 'homework_id', 'subject', 'homework', 'due_date', 'teacher_id', 'teacher_name' or class_id'`
            }
          })
        })
                
    it(`responds with 204 when updating only a subset of fields`, () => {
                  
      const idToUpdate = 2
      const updatedHomework = {
            homework: 'updated homework',
                               }
      const expectedHomework = {
          ...testHomework[idToUpdate - 1],
          ...updatedHomework
                  }
                            
      return supertest(app)
        .patch(`/api/homework/${idToUpdate}`)
        .send({
            ...updatedHomework,
            fieldToIgnore: 'should not be in GET response'
                            })
        .expect(204)
        .then(res =>
          supertest(app)
          .get(`/api/homework/${idToUpdate}`)
          .expect(expectedHomework)
        )
      })
    })
  })
  
  describe(`POST /homework`, () => {

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
                      
      it(`creates a homework, responding with 201 and the new homework`, function() {
        this.retries(3)
        const newHomework = {
          homework_id: 11,
          subject: 'Math',
          homework: 'test new homework',
          due_date: '2019-04-22T16:28:32.615Z',
          teacher_id: 1,
          teacher_name: "test-teacher-name-1",
          class_id: 2
        }
              
        return supertest(app)
          .post('/api/homework')
          .send(newHomework)
          .expect(201)
          .expect(res => {
            expect(res.body.homework_id).to.eql(newHomework.homework_id)
            expect(res.body.subject).to.eql(newHomework.subject)
            expect(res.body.homework).to.eql(newHomework.homework)
            expect(res.body.due_date).to.eql(newHomework.due_date)
            expect(res.body.teacher_id).to.eql(newHomework.teacher_id)
            expect(res.body.teacher_name).to.eql(newHomework.teacher_name)
            expect(res.body.class_id).to.eql(newHomework.class_id)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/homework/${res.body.id}`)
            })
              .then(postRes =>
                supertest(app)
                  .get(`/api/homework/${postRes.body.id}`)
                  .expect(postRes.body)
                  )
              })
                          
    const requiredFields = ['homework_id', 'subject', 'homework', 'due_date', 'teacher_id', 'teacher_name', 'class_id']
                          
      requiredFields.forEach(field => {
        const newHomework = {
          homework_id: 11,
          subject: 'Math',
          homework: 'test new homework',
          due_date: '2019-04-22T16:28:32.615Z',
          teacher_id: 1,
          teacher_name: "test-teacher-name-1",
          class_id: 2
        }
                    
      
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newHomework[field]
                          
        return supertest(app)
          .post('/api/homework')
          .send(newHomework)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
                                   })
                               })
                             })
                               
      it('removes XSS attack content', () => {
        const { maliciousHomework, expectedHomework } = makeMaliciousHomework();
          return supertest(app)
            .post('/api/homework')
            .send(maliciousHomework)
            .expect(201)
            .expect(res => {
              expect(res.body.homework_id).to.eql(expectedHomework.homework_id)
              expect(res.body.subject).to.eql(expectedHomework.subject)
            expect(res.body.homework).to.eql(expectedHomework.homework)
            expect(res.body.due_date).to.eql(expectedHomework.due_date)
            expect(res.body.teacher_id).to.eql(expectedHomework.teacher_id)
            expect(res.body.teacher_name).to.eql(expectedHomework.teacher_name)
            expect(res.body.class_id).to.eql(expectedHomework.class_id)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/homework/${res.body.id}`)
                                        
                                         })
                                      })
                                    })

    })


