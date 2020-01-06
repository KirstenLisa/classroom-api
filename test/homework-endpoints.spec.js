const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const xss = require('xss')
const { seedUsers, seedTeachers, seedClassList, seedHomework, makeAuthHeader, makeMaliciousHomework, makeHomeworkArray, makeTeachersArray, makeClassesArray, makeUsersArray } = require('./test-helpers')

describe(`Homework service object`, function() {

    let db

    const testTeachers = makeTeachersArray()
    const testClasses = makeClassesArray()
    const testUsers = makeUsersArray()
    const testHomework = makeHomeworkArray()


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

      beforeEach('insert teachers', () =>
        seedTeachers(db, testTeachers)
        );

      beforeEach('insert classes', () =>
        seedClassList(db, testClasses)
        );

      beforeEach('insert users', () =>
        seedUsers(db, testUsers)
        );

     
      it(`responds with 401 'Missing basic token' when no basic token`, () => {
        return supertest(app)
          .get(`/api/homework`)
          .expect(401, { error: `Missing basic token` })
           })

      it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
        const userNoCreds = { username: '', password: '' }
          return supertest(app)
            .get(`/api/homework`)
            .set('Authorization', makeAuthHeader(userNoCreds))
            .expect(401, { error: `Unauthorized request` })
            })

      it(`responds 401 'Unauthorized request' when invalid user`, () => {
        const userInvalidCreds = { username: 'user-not', password: 'existy' }
          return supertest(app)
            .get(`/api/homework`)
            .set('Authorization', makeAuthHeader(userInvalidCreds))
            .expect(401, { error: `Unauthorized request` })
          })

      it(`responds 401 'Unauthorized request' when invalid password`, () => {
        const userInvalidPass = { username: testUsers[0].username, password: 'wrong' }
          return supertest(app)
            .get(`/api/homework/1`)
            .set('Authorization', makeAuthHeader(userInvalidPass))
            .expect(401, { error: `Unauthorized request` })
          })

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/homework')
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(200, [])
          })
    
      
          })
      

    context('Given there is homework in the database', () => {

      const testTeachers = makeTeachersArray()
      const testClasses = makeClassesArray()
      const testUsers = makeUsersArray()
      const testHomework = makeHomeworkArray()

      beforeEach('insert teachers', () =>
        seedTeachers(db, testTeachers)
      );

      beforeEach('insert classes', () =>
        seedClassList(db, testClasses)
      );

      beforeEach('insert users', () =>
        seedUsers(db, testUsers)
        );

      beforeEach('insert homework', () =>
        seedHomework(db, testHomework)
        );  

    it(`responds with 401 'Missing basic token' when no basic token`, () => {
      return supertest(app)
        .get(`/api/homework`)
        .expect(401, { error: `Missing basic token` })
      })
    
    it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
      const userNoCreds = { username: '', password: '' }
        return supertest(app)
          .get(`/api/homework`)
          .set('Authorization', makeAuthHeader(userNoCreds))
          .expect(401, { error: `Unauthorized request` })
        })
    
    it(`responds 401 'Unauthorized request' when invalid user`, () => {
      const userInvalidCreds = { username: 'user-not', password: 'existy' }
        return supertest(app)
          .get(`/api/homework`)
          .set('Authorization', makeAuthHeader(userInvalidCreds))
          .expect(401, { error: `Unauthorized request` })
      })
    
    it(`responds 401 'Unauthorized request' when invalid password`, () => {
      const userInvalidPass = { username: testUsers[0].username, password: 'wrong' }
        return supertest(app)
          .get(`/api/homework/1`)
          .set('Authorization', makeAuthHeader(userInvalidPass))
          .expect(401, { error: `Unauthorized request` })
      })
      
    it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
      const userNoCreds = { username: '', password: '' }
        return supertest(app)
          .get(`/api/homework`)
          .set('Authorization', makeAuthHeader(userNoCreds))
          .expect(401, { error: `Unauthorized request` })
      })
      
          

      it('gets homework from the store', () => {
        return supertest(app)
        .get('/api/homework')
        .set('Authorization', makeAuthHeader(testUsers[0]))
        .expect(200, testHomework)
           })
         })
  
         context(`Given an XSS attack homework`, () => {
          const testTeachers = makeTeachersArray()
          const testClasses = makeClassesArray()
          const testUsers = makeUsersArray()
          const { maliciousHomework, expectedHomework } = makeMaliciousHomework()
            
          beforeEach('insert teachers', () =>
          seedTeachers(db, testTeachers)
        );
  
        beforeEach('insert classes', () =>
          seedClassList(db, testClasses)
        );
  
        beforeEach('insert users', () =>
          seedUsers(db, testUsers)
          );
  
        beforeEach('insert homework', () =>
          seedHomework(db, maliciousHomework)
          );  
                      
    it('removes XSS attack content', () => {
      return supertest(app)
        .get(`/api/homework`)
        .set('Authorization', makeAuthHeader(testUsers[0]))
        .expect(200)
        .expect(res => {
          expect(res.body[0].homework).to.eql(expectedHomework.homework)
          })
        })
      })
    })
    

  describe('GET/api/homework/:homeworkId', () => {

    context('Given there is NO homework in the database', () => {
      beforeEach('insert teachers', () =>
      seedTeachers(db, testTeachers)
    );

    beforeEach('insert classes', () =>
      seedClassList(db, testClasses)
    );

    beforeEach('insert users', () =>
      seedUsers(db, testUsers)
      );

   
      it(`responds with 401 'Missing basic token' when no basic token`, () => {
        return supertest(app)
          .get(`/api/homework/123`)
          .expect(401, { error: `Missing basic token` })
           })

      it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
        const userNoCreds = { username: '', password: '' }
          return supertest(app)
            .get(`/api/homework/123`)
                .set('Authorization', makeAuthHeader(userNoCreds))
                .expect(401, { error: `Unauthorized request` })
                })
    
      it(`responds 401 'Unauthorized request' when invalid user`, () => {
        const userInvalidCreds = { username: 'user-not', password: 'existy' }
          return supertest(app)
            .get(`/api/homework/123`)
            .set('Authorization', makeAuthHeader(userInvalidCreds))
            .expect(401, { error: `Unauthorized request` })
              })
    
      it(`responds 401 'Unauthorized request' when invalid password`, () => {
        const userInvalidPass = { username: testUsers[0].username, password: 'wrong' }
          return supertest(app)
            .get(`/api/homework/123`)
            .set('Authorization', makeAuthHeader(userInvalidPass))
            .expect(401, { error: `Unauthorized request` })
              })

      it(`responds 404 the homework doesn't exist`, () => {
        return supertest(app)
          .get(`/api/homework/123`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
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
  
      beforeEach('insert teachers', () =>
        seedTeachers(db, testTeachers)
        );

      beforeEach('insert classes', () =>
        seedClassList(db, testClasses)
        );

      beforeEach('insert users', () =>
        seedUsers(db, testUsers)
        );

      beforeEach('insert homework', () =>
        seedHomework(db, testHomework)
        );  
    
        it(`responds with 401 'Missing basic token' when no basic token`, () => {
          return supertest(app)
            .get(`/api/homework/1`)
            .expect(401, { error: `Missing basic token` })
             })
  
        it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
          const userNoCreds = { username: '', password: '' }
            return supertest(app)
              .get(`/api/homework/1`)
                  .set('Authorization', makeAuthHeader(userNoCreds))
                  .expect(401, { error: `Unauthorized request` })
                  })
      
        it(`responds 401 'Unauthorized request' when invalid user`, () => {
          const userInvalidCreds = { username: 'user-not', password: 'existy' }
            return supertest(app)
              .get(`/api/homework/1`)
              .set('Authorization', makeAuthHeader(userInvalidCreds))
              .expect(401, { error: `Unauthorized request` })
                })
      
        it(`responds 401 'Unauthorized request' when invalid password`, () => {
          const userInvalidPass = { username: testUsers[0].username, password: 'wrong' }
            return supertest(app)
              .get(`/api/homework/1`)
              .set('Authorization', makeAuthHeader(userInvalidPass))
              .expect(401, { error: `Unauthorized request` })
                })
    

    it('responds with 200 and the specified homework', () => {
      const homeworkId = 2
      const expectedHomework = testHomework[homeworkId - 1]
        return supertest(app)
          .get(`/api/homework/${homeworkId}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(200, expectedHomework)
         })
       })
      })
    
      
    

describe('DELETE /homework/:id', () => {
        
  context(`Given no homework`, () => {

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


                    
    it(`responds 404 the homework doesn't exist`, () => {
      return supertest(app)
        .delete(`/api/homework/123`)
        .set('Authorization', makeAuthHeader(testUsers[0]))
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
        
    beforeEach('insert teachers', () =>
    seedTeachers(db, testTeachers)
  );

  beforeEach('insert classes', () =>
    seedClassList(db, testClasses)
  );

  beforeEach('insert users', () =>
    seedUsers(db, testUsers)
    );

  beforeEach('insert homework', () =>
    seedHomework(db, testHomework)
    );  
              
      
    it('removes the homework by ID from the store', () => {
      const idToRemove = 2
      const expectedHomework = testHomework.filter(homework => homework.id !== idToRemove)
        return supertest(app)
          .delete(`/api/homework/${idToRemove}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(204)
          .then(() =>
            supertest(app)
            .get(`/api/homework`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(expectedHomework)
                        )
                    })
                  })
                })            
  
            
describe(`PATCH /api/homework/:homework_id`, () => {
  context(`Given no homework`, () => {

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

  
  
    it(`responds with 404`, () => {
      const homeworkId = 123456
      return supertest(app)
      .patch(`/api/homework/${homeworkId}`)
      .set('Authorization', makeAuthHeader(testUsers[0]))
      .expect(404, { error: { message: `Homework doesn't exist` } })
      })
    })
          
  context('Given there IS homework in the database', () => {
    const testTeachers = makeTeachersArray()
    const testClasses = makeClassesArray()
    const testUsers = makeUsersArray()
    const testHomework = makeHomeworkArray()
        
    beforeEach('insert teachers', () =>
      seedTeachers(db, testTeachers)
  );

  beforeEach('insert classes', () =>
    seedClassList(db, testClasses)
  );

  beforeEach('insert users', () =>
    seedUsers(db, testUsers)
    );

  beforeEach('insert homework', () =>
    seedHomework(db, testHomework)
    );  

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
    console.log('TEST USER')
    console.log(makeAuthHeader(testUsers[0]))
                           
    return supertest(app)
      .patch(`/api/homework/${idToUpdate}`)
      .set('Authorization', makeAuthHeader(testUsers[0]))
      .send(updatedHomework)
      .expect(204)
      .then(res =>
        supertest(app)
        .get(`/api/homework/${idToUpdate}`)
        .set('Authorization', makeAuthHeader(testUsers[0]))
        .expect(expectedHomework)
      )
    }) 
                
    it(`responds with 400 when no required fields supplied`, () => {
                  
      const idToUpdate = 2
        return supertest(app)
        .patch(`/api/homework/${idToUpdate}`)
        .set('Authorization', makeAuthHeader(testUsers[0]))
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
        .set('Authorization', makeAuthHeader(testUsers[0]))
        .send({
            ...updatedHomework,
            fieldToIgnore: 'should not be in GET response'
                            })
        .expect(204)
        .then(res =>
          supertest(app)
          .get(`/api/homework/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(expectedHomework)
        )
      })
    })
  })
  
  describe(`POST /homework`, () => {

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

     
      it(`creates a homework, responding with 201 and the new homework`, function() {
        this.retries(3)
        console.log('TEST USER')
        console.log(makeAuthHeader(testUsers[0]))
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
          .set('Authorization', makeAuthHeader(testUsers[0]))
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
                  .set('Authorization', makeAuthHeader(testUsers[0]))
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
          .set('Authorization', makeAuthHeader(testUsers[0]))
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
            .set('Authorization', makeAuthHeader(testUsers[0]))
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


