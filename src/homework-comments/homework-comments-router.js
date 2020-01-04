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

  .post(jsonBodyParser, (req, res, next) => {
    const { comment, user_name, date, user_id, page_id } = req.body
    const newHomeworkComment = { comment, user_name, date, user_id, page_id }

    for (const [key, value] of Object.entries(newHomeworkComment)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    newHomeworkComment.comment = comment;
    newHomeworkComment.user_name = user_name;
    newHomeworkComment.date = date;
    newHomeworkComment.user_id = user_id;
    newHomeworkComment.page_id = page_id;

    HomeworkCommentsService.insertComment(
      req.app.get('db'),
      newHomeworkComment
    )
      .then(comment => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.comment_id}`))
          .json(serializeHomeworkComment(comment))
      })
      .catch(next)
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
    console.log(res.comment)
    res.json(res.comment.map(comment => serializeHomeworkComment(comment)))
 
  })

  
  .delete((req, res, next) => {
    HomeworkCommentsService.deleteComment(
      req.app.get('db'),
      req.params.commentId
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
 



module.exports = homeworkCommentsRouter