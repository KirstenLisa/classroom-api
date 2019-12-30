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
}


module.exports = HomeworkCommentsService