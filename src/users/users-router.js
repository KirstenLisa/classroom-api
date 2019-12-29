const express = require('express')
const path = require('path')
const uuid = require('uuid/v4')
const UsersService = require('./users-service')
const logger = require('../logger')
const STORE = require('../dummystore')

const usersRouter = express.Router()
const jsonBodyParser = express.json()


usersRouter
  .route('/')

  .get((req, res) => {
    res.json(STORE.usersList)
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
  .get((req, res) => {
    const { user_id } = req.params

    const user = STORE.usersList.find(user => user.user_id == user_id)

    if (!user) {
      logger.error(`User with id ${user_id} not found.`)
      return res
        .status(404)
        .send('User Not Found')
    }

    res.json(user)
  })
  .delete((req, res) => {
    const { user_id } = req.params

    const userIndex = STORE.usersList.findIndex(u => u.user_id == user_id)
    
    if (userIndex === -1) {
      logger.error(`User with id ${user_id} not found.`)
      return res
        .status(404)
        .send('User Not Found')
    }

    STORE.usersList.splice(userIndex, 1)

    logger.info(`User with id ${user_id} deleted.`)
    res
      .status(204)
      .end()
  })



module.exports = usersRouter