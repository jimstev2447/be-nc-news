const knex = require('../db/connection');

exports.fetchArticleByArticleId = article_id => {
  const articleReq = knex
    .select('*')
    .from('articles')
    .where({ article_id })
    .then(([article]) => {
      return article;
    });
  const commentsCountReq = knex
    .from('comments')
    .count('*')
    .where({ article_id });

  return Promise.all([articleReq, commentsCountReq]).then(
    ([article, [{ count }]]) => {
      return !article
        ? Promise.reject({ status: 404, msg: 'article not found' })
        : { ...article, comment_count: count };
    }
  );
};

exports.updateArticle = (article_id, votes) => {
  if (!votes) return Promise.reject({ status: 400, msg: 'bad request' });
  return knex
    .from('articles')
    .where({ article_id })
    .increment('votes', votes)
    .returning('*')
    .then(([article]) => {
      return !article
        ? Promise.reject({ status: 404, msg: 'article not found' })
        : article;
    });
};

exports.checkArticleId = article_id => {
  return knex
    .select('article_id')
    .from('articles')
    .where({ article_id })
    .returning('*')
    .then(([data]) => {
      return !data
        ? Promise.reject({ status: 404, msg: 'article not found' })
        : data;
    });
};

exports.fetchAllArticles = ({
  author,
  topic,
  sort_by = 'created_at',
  order_by = 'desc'
}) => {
  if (order_by !== 'desc' && order_by !== 'asc')
    return Promise.reject({ status: 400, msg: 'bad request' });
  return knex
    .select(
      'articles.author',
      'articles.title',
      'articles.article_id',
      'articles.topic',
      'articles.created_at',
      'articles.votes'
    )
    .from('articles')
    .modify(query => {
      if (author) query.where({ 'articles.author': author });
      if (topic) query.where({ topic });
    })
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by, order_by);
};
