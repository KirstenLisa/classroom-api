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