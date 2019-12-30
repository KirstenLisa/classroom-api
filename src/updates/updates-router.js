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


module.exports = updatesRouter