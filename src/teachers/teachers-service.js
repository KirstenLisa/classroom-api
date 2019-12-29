const TeachersService = {

    getAllTeachers(knex) {
        return knex.select('*').from('teachers')
    },

    getById(knex, id) {
        return knex.from('teachers')
        .select('*')
        .where('id', id)
        .first()
      },
}


module.exports = TeachersService