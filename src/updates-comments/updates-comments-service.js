const UpdatesCommentsService = {

    getAllUpdatesComments(knex) {
        return knex.select('*').from('updates_comments')
    },

    getById(knex, id) {
        return knex.from('updates_comments')
        .select('*')
        .where('comment_id', id)
        .first()
      },
}


module.exports = UpdatesCommentsService