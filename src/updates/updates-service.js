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

    deleteUpdate(knex, id) {
        return knex('updates')
          .where('update_id', id)
          .delete()
      },
}


module.exports = UpdatesService