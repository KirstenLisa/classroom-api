const express = require('express')
const path = require('path')
const xss = require('xss')
const uuid = require('uuid/v4')
const UpdatesCommentsService = require('./updates-comments-service')
const logger = require('../logger')
const STORE = require('../dummystore')

const updatesCommentsRouter = express.Router()
const jsonBodyParser = express.json()

const serializeUpdateComment = comment => ({
  comment_id: comment.comment_id,
  comment: xss(comment.comment),
  user_name: comment.user_name,
  date: comment.date,
  user_id: comment.user_id,
  page_id: comment.page_id
})

updatesCommentsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    UpdatesCommentsService.getAllUpdatesComments(knexInstance)
    .then(comment => {
      res.json(comment.map(serializeUpdateComment))
    })
    .catch(next)
  })

  .post(jsonBodyParser, (req, res, next) => {
    const { comment, user_name, date, user_id, page_id } = req.body
    const newUpdateComment = { comment, user_name, date, user_id, page_id }

    for (const [key, value] of Object.entries(newUpdateComment)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    newUpdateComment.comment = comment;
    newUpdateComment.user_name = user_name;
    newUpdateComment.date = date;
    newUpdateComment.user_id = user_id;
    newUpdateComment.page_id = page_id;

    UpdatesCommentsService.insertComment(
      req.app.get('db'),
      newUpdateComment
    )
      .then(comment => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.comment_id}`))
          .json(serializeUpdateComment(comment))
      })
      .catch(next)
  })

updatesCommentsRouter
  .route('/:commentId')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db')
    UpdatesCommentsService.getById(
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
    res.json(serializeUpdateComment(res.comment))
 
  })

  .delete((req, res, next) => {
    UpdatesCommentsService.deleteComment(
      req.app.get('db'),
      req.params.commentId
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
 



module.exports = updatesCommentsRouter