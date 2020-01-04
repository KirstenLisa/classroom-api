const express = require('express')
const path = require('path')
const xss = require('xss')
const UpdatesService = require('./updates-service')

const updatesRouter = express.Router()
const jsonBodyParser = express.json()

const serializeUpdate = update => ({
  update_id: update.update_id,
  headline: xss(update.headline),
  content: xss(update.content),
  class_id: update.class_id,
  author: xss(update.author),
  date: update.date
})


updatesRouter
  .route('/')

  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    UpdatesService.getAllUpdates(knexInstance)
    .then(update => {
      res.json(update.map(serializeUpdate))
    })
    .catch(next)
  })

  .post(jsonBodyParser, (req, res, next) => {
    const { headline, content, class_id, author, date } = req.body
    const newUpdate = { headline, content, class_id, author, date }
    console.log('REQUEST BODY')
    console.log(req.body)

    for (const [key, value] of Object.entries(newUpdate)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    newUpdate.headline = headline;
    newUpdate.content = content;
    newUpdate.class_id = class_id;
    newUpdate.author = author;
    newUpdate.date = date;
    console.log('newUpdate')

    UpdatesService.insertUpdate(
      req.app.get('db'),
      newUpdate
    )
      .then(update => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${update.update_id}`))
          .json(serializeUpdate(update))
      })
      .catch(next)
  })

updatesRouter
  .route('/:updateId')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db')
    UpdatesService.getById(
      knexInstance,
      req.params.updateId
    )
      .then(update => {
        if (!update) {
          return res.status(404).json({
            error: { message: `Update doesn't exist` }
          })
        }
        res.update = update
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUpdate(res.update))
  })

  .delete((req, res, next) => {
    UpdatesService.deleteUpdate(
      req.app.get('db'),
      req.params.updateId
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  .patch(jsonBodyParser, (req, res, next) => {
    const { headline, content, class_id, author, date } = req.body
    const updateToUpdate = { headline, content, class_id, author, date }

    const numberOfValues = Object.values(updateToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'headline', 'content', 'class_id', 'author' or 'date'`
        }
      })

    UpdatesService.updateUpdate(
      req.app.get('db'),
      req.params.updateId,
      updateToUpdate
    )
  
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })



module.exports = updatesRouter