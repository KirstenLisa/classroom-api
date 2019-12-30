const ClassesService = {

    getAllClasses(knex) {
        return knex.select('*').from('class_list')
    },

    getById(knex, id) {
        return knex.from('class_list')
        .select('*')
        .where('class_id', id)
        .first()
      },
}


module.exports = ClassesService