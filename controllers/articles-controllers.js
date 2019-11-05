const { fetchArticleByArticleId } = require('../models/articles-models');

exports.getArticleByArticleId = (req, res, next) => {
  fetchArticleByArticleId(req.params.article_id)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
