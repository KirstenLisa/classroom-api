const express = require('express')
const xss = require('xss')
const TeachersService = require('./teachers-service')

const teachersRouter = express.Router()

const serializeTeacher = teacher => ({
    teacher_name: xss(teacher.teacher_name),
    id: teacher.id
  })

teachersRouter
  .route('/')

  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    TeachersService.getAllTeachers(knexInstance)
    .then(teachers => {
      res.json(teachers.map(serializeTeacher))
    })
    .catch(next)
  })


teachersRouter
  .route('/:teacherId')

  .all((req, res, next) => {
    const knexInstance = req.app.get('db')
    TeachersService.getById(
      knexInstance,
      req.params.teacherId
    )
      .then(teacher => {
        if (!teacher) {
          return res.status(404).json({
            error: { message: `Teacher id doesn't exist` }
          })
        }
        res.teacher = teacher
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeTeacher(res.teacher))
  })


  module.exports = teachersRouter