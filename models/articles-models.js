const knex = require('../db/connection');

exports.fetchArticleByArticleId = article_id => {
  return knex
    .select('*')
    .from('articles')
    .where({ article_id });
};
