const express = require('express')
const path = require('path')
const HomeworkService = require('./homework-service')

const homeworkRouter = express.Router()
const jsonBodyParser = express.json()

homeworkRouter
  .route('/')
  .get((req, res) => {
    res.json('Hallo homework')
  })



module.exports = homeworkRouter
