const express = require('express')
const path = require('path')
const UpdatesService = require('./updates-service')

const updatesRouter = express.Router()
const jsonBodyParser = express.json()

updatesRouter
  .route('/')



module.exports = updatesRouter