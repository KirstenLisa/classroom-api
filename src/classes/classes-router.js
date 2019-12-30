const express = require('express')
const path = require('path')
const uuid = require('uuid/v4')
const xss = require('xss')
const ClassesService = require('./classes-service')
const logger = require('../logger')

const classesRouter = express.Router()
const jsonBodyParser = express.json()

const serializeClass = c => ({
  class_id: c.class_id,
  class_name: xss(c.class_name),
  class_teacher: xss(c.class_teacher)
})

classesRouter
  .route('/')

  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ClassesService.getAllClasses(knexInstance)
    .then(c => {
      res.json(c.map(serializeClass))
    })
    .catch(next)
  })


classesRouter
  .route('/:classId')

  .all((req, res, next) => {
    const knexInstance = req.app.get('db')
    ClassesService.getById(
      knexInstance,
      req.params.classId
    )
      .then(c => {
        if (!c) {
          return res.status(404).json({
            error: { message: `Class id doesn't exist` }
          })
        }
        res.c = c
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeClass(res.c))
  })

  module.exports = classesRouter