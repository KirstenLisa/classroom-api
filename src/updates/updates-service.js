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

    insertUpdate(knex, newUpdate) {
      return knex
        .insert(newUpdate)
        .into('updates')
        .returning('*')
        .then(rows => {
          return rows[0]
          })
        },

    deleteUpdate(knex, id) {
      return knex('updates')
          .where('update_id', id)
          .delete()
      },
  
    updateUpdate(knex, id, newUpdateFields) {
      return knex('updates')
          .where('update_id', id)
          .update(newUpdateFields)
      }
}


module.exports = UpdatesService