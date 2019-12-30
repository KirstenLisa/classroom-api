const UpdatesService = {

    getAllUpdates(knex) {
        return knex.select('*').from('updates')
    },

    getById(knex, id) {
        return knex.from('updates')
        .select('*')
        .where('update_id', id)
        .first()
      },
}


module.exports = UpdatesService