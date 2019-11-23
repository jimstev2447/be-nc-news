const {
  fetchAllArticles,
  fetchArticleByArticleId,
  updateArticle,
  fetchTotalArticles,
  createArticle,
  removeArticle,
  checkArticleId
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
    fetchTotalArticles(query),
    fetchUserByUsername(username),
    checkTopic(query)
  ])
    .then(([articles, total_count]) => {
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const articleToCreate = req.body;
  createArticle(articleToCreate)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  return Promise.all([removeArticle(article_id), checkArticleId(article_id)])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
