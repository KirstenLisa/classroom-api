const HomeworkService = {

    getAllHomework(knex) {
        return knex.select('*').from('homework')
    },

    getById(knex, id) {
        return knex.from('homework')
        .select('*')
        .where('id', id)
        .first()
      },
}


module.exports = HomeworkService