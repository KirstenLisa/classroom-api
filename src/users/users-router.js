const express = require('express')
const path = require('path')
const xss = require('xss')
const uuid = require('uuid/v4')
const UsersService = require('./users-service')
const logger = require('../logger')
const STORE = require('../dummystore')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

const serializeUser = user => ({
  user_id: user.user_id,
  fullname: xss(user.fullname),
  username: xss(user.username),
  password: xss(user.password),
  class_id: user.class_id,
  user_type: xss(user.user_type)
})

usersRouter
  .route('/')

  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getAllUsers(knexInstance)
    .then(user => {
      res.json(user.map(serializeUser))
    })
    .catch(next)
  })

  .post(jsonBodyParser, (req, res, next) => {
    const { fullname, username, password, class_id, user_type } = req.body
    const newUser = { fullname, username, password, class_id, user_type }

    for (const [key, value] of Object.entries(newUser)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    newUser.fullname = fullname;
    newUser.username = username;
    newUser.password = password;
    newUser.class_id = class_id;
    newUser.user_type = user_type;

    UsersService.insertUser(
      req.app.get('db'),
      newUser
    )
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.user_id}`))
          .json(serializeUser(user))
      })
      .catch(next)
  })

usersRouter
  .route('/:user_id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getById(
      knexInstance,
      req.params.user_id
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User id doesn't exist` }
          })
        }
        res.user = user
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user))
 
  })
  .delete((req, res, next) => {
    UsersService.deleteUser(
      req.app.get('db'),
      req.params.user_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })



module.exports = usersRouter