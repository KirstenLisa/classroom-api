require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const authRouter = require('./auth/auth-router')
const teachersRouter = require('./teachers/teachers-router')
const classesRouter = require('./classes/classes-router')
const usersRouter = require('./users/users-router')
const homeworkRouter = require('./homework/homework-router')
const updatesRouter = require('./updates/updates-router')
const updatesCommentsRouter = require('./updates-comments/updates-comments-router')
const homeworkCommentsRouter = require('./homework-comments/homework-comments-router')


const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, classroom!')
})

app.use('/api/auth', authRouter)
app.use('/api/teachers', teachersRouter)
app.use('/api/classes', classesRouter)
app.use('/api/users', usersRouter)
app.use('/api/homework', homeworkRouter)
app.use('/api/updates', updatesRouter)
app.use('/api/updates-comments', updatesCommentsRouter)
app.use('/api/homework-comments', homeworkCommentsRouter)






app.use(function errorHandler(error, req, res, next) {
   let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
      } else {
        console.error(error)
        response = { message: error.message, error }
   }
      res.status(500).json(response)
 })

module.exports = app