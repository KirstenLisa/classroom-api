const UsersService = {

    getAllUsers(knex) {
        return knex.select('*').from('classroom_users')
    },

    getById(knex, id) {
        return knex.from('classroom_users')
        .select('*')
        .where('user_id', id)
        .first()
      },
    
    insertUser(knex, newUser) {
      return knex
        .insert(newUser)
        .into('classroom_users')
        .returning('*')
        .then(rows => {
            return rows[0]
          })
      },

    deleteUser(knex, id) {
        return knex('classroom_users')
          .where('user_id', id )
          .delete()
    },
}


module.exports = UsersService