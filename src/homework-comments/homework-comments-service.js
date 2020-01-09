const HomeworkCommentsService = {

    getAllHomeworkComments(knex) {
        return knex.select('*').from('homework_comments')
    },

    getById(knex, id) {
        return knex.from('homework_comments')
        .select('*')
        .where('page_id', id)
        
        
        
    },
    insertComment(knex, newComment) {
        return knex
          .insert(newComment)
          .into('homework_comments')
          .returning('*')
          .then(rows => {
              return rows[0]
              })
            },

    deleteComment(knex, id) {
        return knex('homework_comments')
          .where('comment_id', id)
          .delete()
      },
}


module.exports = HomeworkCommentsService