const express = require('express')
const path = require('path')
const xss = require('xss')
const uuid = require('uuid/v4')
const HomeworkCommentsService = require('./homework-comments-service')
const logger = require('../logger')
const STORE = require('../dummystore')

const homeworkCommentsRouter = express.Router()
const jsonBodyParser = express.json()

const serializeHomeworkComment = comment => ({
  comment_id: comment.comment_id,
  comment: xss(comment.comment),
  user_name: comment.user_name,
  date: comment.date,
  user_id: comment.user_id,
  page_id: comment.page_id
})

homeworkCommentsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    HomeworkCommentsService.getAllHomeworkComments(knexInstance)
    .then(comment => {
      res.json(comment.map(serializeHomeworkComment))
    })
    .catch(next)
  })

  .post(jsonBodyParser, (req, res) => {
    for (const field of ['fullname', 'username', 'password', 'class_id', 'user_type']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send(`'${field}' is required`)
      }
    }
    const { fullname, username, password, class_id, user_type } = req.body

    if (!Number.isInteger(class_id) || class_id < 0 || class_id > 6) {
      logger.error(`Invalid class id '${class_id}' supplied`)
      return res.status(400).send(`'class id' must be between 1 and 6`)
    }

    //if (user_type != 'teacher' || user_type != 'student' || user_type != 'parent') {
    //    logger.error(`Invalid user type '${user_type}' supplied`)
    //    return res.status(400).send(`'user_type' must be teacher, parent or student`)
    //  }
    

    const newUser = { user_id: uuid(), fullname, username, password, class_id, user_type }

    STORE.usersList.push(newUser)

    logger.info(`User with id ${newUser.user_id} created`)
    res
      .status(201)
      .location(`http://localhost:8000/users/${newUser.user_id}`)
      .json(newUser)
  })

homeworkCommentsRouter
  .route('/:commentId')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db')
    HomeworkCommentsService.getById(
      knexInstance,
      req.params.commentId
    )
      .then(comment => {
        if (!comment) {
          return res.status(404).json({
            error: { message: `Comment doesn't exist` }
          })
        }
        res.comment = comment
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeHomeworkComment(res.comment))
 
  })
 



module.exports = homeworkCommentsRouter