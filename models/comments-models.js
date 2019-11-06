const knex = require('../db/connection');

exports.createComment = ({ article_id }, { username, body }) => {
  if (!body) return Promise.reject({ status: 400, msg: 'bad request' });

  return knex
    .insert({ article_id, body, author: username })
    .into('comments')
    .returning('*')
    .then(([comment]) => {
      return comment;
    });
};

exports.fetchAllCommentsByArticleId = (
  article_id,
  sortByCol = 'created_at',
  order = 'desc'
) => {
  if (order !== 'desc' && order !== 'asc')
    return Promise.reject({ status: 400, msg: 'bad request' });
  return knex
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where({ article_id })
    .returning('*')
    .orderBy(sortByCol, order)
    .then(data => {
      return data;
    });
};
