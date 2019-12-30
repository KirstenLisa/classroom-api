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

    insertHomework(knex, newHomework) {
      return knex
        .insert(newHomework)
        .into('homework')
        .returning('*')
        .then(rows => {
          return rows[0]
          })
        },

    deleteHomework(knex, id) {
        return knex('homework')
          .where('id', id)
          .delete()
      },
}


module.exports = HomeworkService