const express = require('express')
const path = require('path')
const xss = require('xss')
const HomeworkService = require('./homework-service')

const homeworkRouter = express.Router()
const jsonBodyParser = express.json()

const serializeHomework = homework => ({
  id: homework.id,
  homework_id: homework.homework_id,
  subject: homework.subject,
  homework: xss(homework.homework),
  due_date: homework.due_date,
  teacher_id: homework.teacher_id,
  teacher_name: homework.teacher_name,
  class_id: homework.class_id
})

homeworkRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    HomeworkService.getAllHomework(knexInstance)
    .then(homework => {
      res.json(homework.map(serializeHomework))
    })
    .catch(next)
  })

homeworkRouter
.route('/:id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db')
    HomeworkService.getById(
      knexInstance,
      req.params.id
    )
      .then(homework => {
        if (!homework) {
          return res.status(404).json({
            error: { message: `Homework doesn't exist` }
          })
        }
        res.homework = homework
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeHomework(res.homework))
 
  })
  .delete((req, res, next) => {
    HomeworkService.deleteHomework(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = homeworkRouter
