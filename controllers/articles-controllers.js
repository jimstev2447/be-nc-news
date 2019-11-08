const {
  fetchAllArticles,
  fetchArticleByArticleId,
  updateArticle
} = require('../models/articles-models');

const { fetchUserByUsername } = require('../models/users-models');
const { checkTopic } = require('../models/topics-models');

exports.getArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleByArticleId(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleByArticleId = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticle(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const username = req.query.author;
  const { query } = req;
  return Promise.all([
    fetchAllArticles(query),
    fetchUserByUsername(username),
    checkTopic(query)
  ])
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
