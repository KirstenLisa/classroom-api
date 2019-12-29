const express = require('express')
const path = require('path')
const uuid = require('uuid/v4')
const ClassesService = require('./classes-service')
const logger = require('../logger')

const classesRouter = express.Router()
const jsonBodyParser = express.json()


classesRouter
  .route('/')

  .get((req, res) => {
    res.json('Hallo classes')
  })


  module.exports = classesRouter