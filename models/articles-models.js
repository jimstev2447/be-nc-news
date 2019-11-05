const knex = require('../db/connection');

exports.fetchArticleByArticleId = article_id => {
  return knex
    .select('*')
    .from('articles')
    .where({ article_id })
    .then(([article]) => {
      return article;
    });
};

exports.updateArticle = (article_id, votes) => {
  return knex
    .from('articles')
    .where({ article_id })
    .increment('votes', votes.inc_votes)
    .returning('*')
    .then(([article]) => {
      return article;
    });
};
