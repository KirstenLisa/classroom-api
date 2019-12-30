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

    deleteUser(knex, id) {
        return knex('classroom_users')
          .where({ id })
          .delete()
    },
}


module.exports = UsersService