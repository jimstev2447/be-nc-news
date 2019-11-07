const {
  fetchAllArticles,
  fetchArticleByArticleId,
  updateArticle
} = require('../models/articles-models');

const { checkUser } = require('../models/users-models');
const { checkTopic } = require('../models/topics-models');

exports.getArticleByArticleId = (req, res, next) => {
  fetchArticleByArticleId(req.params.article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleByArticleId = (req, res, next) => {
  const votes = req.body.inc_votes;
  const article_id = req.params.article_id;
  updateArticle(article_id, votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const queries = req.query;
  return Promise.all([
    fetchAllArticles(queries),
    checkUser(queries),
    checkTopic(queries)
  ])
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
