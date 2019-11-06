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
