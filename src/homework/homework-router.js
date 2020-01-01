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
  .post(jsonBodyParser, (req, res, next) => {
    const { homework_id, subject, homework, due_date, teacher_id, teacher_name, class_id } = req.body
    const newHomework = { homework_id, subject, homework, due_date, teacher_id, teacher_name, class_id }

    for (const [key, value] of Object.entries(newHomework)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    newHomework.homework_id = homework_id;
    newHomework.subject = subject;
    newHomework.homework = homework;
    newHomework.due_date = due_date;
    newHomework.teacher_id = teacher_id;
    newHomework.teacher_name = teacher_name;
    newHomework.class_id = class_id;

    HomeworkService.insertHomework(
      req.app.get('db'),
      newHomework
    )
      .then(homework => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${homework.id}`))
          .json(serializeHomework(homework))
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

  .patch(jsonBodyParser, (req, res, next) => {
    const { homework_id, subject, homework, due_date, teacher_id, teacher_name, class_id } = req.body
    const homeworkToUpdate = { homework_id, subject, homework, due_date, teacher_id, teacher_name, class_id }

    const numberOfValues = Object.values(homeworkToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'homework_id', 'subject', 'homework', 'due_date', 'teacher_id', 'teacher_name' or class_id'`
        }
      })

    HomeworkService.updateHomework(
      req.app.get('db'),
      req.params.id,
      homeworkToUpdate
    )
  
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })



module.exports = homeworkRouter
