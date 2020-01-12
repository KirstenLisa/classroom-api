const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
const bcrypt = require('bcryptjs')
const UsersService = {

    getAllUsers(knex) {
        return knex.select('*').from('classroom_users')
    },

    // getById(knex, id) {
    //     return knex.from('classroom_users')
    //     .select('*')
    //     .where('user_id', id)
    //     .first()
    //   },
    
    getByName(knex, username) {
      return knex.from('classroom_users')
      .select('*')
      .where('username', username)
      .first()
    },

    hasUserWithUserName(db, username) {
      return db('classroom_users')
        .where({ username })
        .first()
        .then(user => !!user)
      },

    validatePassword(password) {
      if (password.length < 7) {
        return 'Password must be longer than 7 characters'
        }
      if (password.length > 72) {
        return 'Password must be less than 72 characters'
        }
      if (password.startsWith(' ') || password.endsWith(' ')) {
        return 'Password must not start or end with empty spaces'
        }
      if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
        return 'Password must contain 1 upper case, lower case, number and special character'
        }
        return null
      },

    hashPassword(password) {
      return bcrypt.hash(password, 12)
      },

    
    insertUser(knex, newUser) {
      return knex
        .insert(newUser)
        .into('classroom_users')
        .returning('*')
        .then(([user]) => user)
      },

    deleteUser(knex, id) {
        return knex('classroom_users')
          .where('user_id', id )
          .delete()
    },

  updateUser(knex, id, newUserFields) {
      return knex('classroom_users')
        .where('user_id', id)
        .update(newUserFields)
    }
}


module.exports = UsersService