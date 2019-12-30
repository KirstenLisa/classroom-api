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

    deleteComment(knex, id) {
        return knex('updates_comments')
          .where('comment_id', id)
          .delete()
      },
}


module.exports = UpdatesCommentsService