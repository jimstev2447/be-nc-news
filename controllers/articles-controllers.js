const {
  fetchArticleByArticleId,
  updateArticle
} = require('../models/articles-models');

exports.getArticleByArticleId = (req, res, next) => {
  fetchArticleByArticleId(req.params.article_id)
    .then(article => {
      if (!article)
        return Promise.reject({ status: 404, msg: 'path not found' });
      else res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleByArticleId = (req, res, next) => {
  const votes = req.body;
  const article_id = req.params.article_id;
  updateArticle(article_id, votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
