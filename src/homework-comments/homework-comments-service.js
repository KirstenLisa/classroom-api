const HomeworkCommentsService = {

    getAllHomeworkComments(knex) {
        return knex.select('*').from('homework_comments')
    },

    getById(knex, id) {
        return knex.from('homework_comments')
        .select('*')
        .where('comment_id', id)
        .first()
      },

    deleteComment(knex, id) {
        return knex('homework_comments')
          .where('comment_id', id)
          .delete()
      },
}


module.exports = HomeworkCommentsService