const articlesRouter = require('express').Router();
const {
  getArticleByArticleId,
  patchArticleByArticleId
} = require('../controllers/articles-controllers');
const { server405s } = require('../errors');

articlesRouter
  .route('/:article_id')
  .get(getArticleByArticleId)
  .patch(patchArticleByArticleId)
  .all(server405s);

module.exports = articlesRouter;
