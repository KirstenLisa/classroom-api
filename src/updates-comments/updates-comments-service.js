const UpdatesCommentsService = {

    getAllUpdatesComments(knex) {
        return knex.select('*').from('updates_comments')
    },

    getById(knex, id) {
        return knex.from('updates_comments')
        .select('*')
        .where('page_id', id)
        
      },
    
    insertComment(knex, newComment) {
      return knex
        .insert(newComment)
        .into('updates_comments')
        .returning('*')
        .then(rows => {
            return rows[0]
            })
          },

    deleteComment(knex, id) {
        return knex('updates_comments')
          .where('comment_id', id)
          .delete()
      },
}


module.exports = UpdatesCommentsService