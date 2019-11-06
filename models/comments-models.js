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
