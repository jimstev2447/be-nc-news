const knex = require('../db/connection');

exports.createComment = ({ article_id }, { username, body }) => {
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
  sort_by = 'created_at',
  order = 'desc'
) => {
  if (order !== 'desc' && order !== 'asc')
    return Promise.reject({ status: 400, msg: 'bad request' });
  return knex
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where({ article_id })
    .orderBy(sort_by, order);
};

exports.updateComment = (comment_id, votes) => {
  if (!votes) return Promise.reject({ status: 400, msg: 'bad request' });
  return knex
    .from('comments')
    .where({ comment_id })
    .increment('votes', votes)
    .returning('*')
    .then(([comment]) => {
      return !comment
        ? Promise.reject({ status: 404, msg: 'comment not found' })
        : comment;
    });
};

exports.removeComment = comment_id => {
  return knex
    .from('comments')
    .where({ comment_id })
    .delete();
};

exports.checkComment = comment_id => {
  return knex
    .select('comment_id')
    .from('comments')
    .where({ comment_id })
    .returning('*')
    .then(([data]) => {
      return !data
        ? Promise.reject({ status: 404, msg: 'comment not found' })
        : data;
    });
};
