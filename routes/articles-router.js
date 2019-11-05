const articlesRouter = require('express').Router();
const {
  getArticleByArticleId,
  patchArticleByArticleId
} = require('../controllers/articles-controllers');

articlesRouter
  .route('/:article_id')
  .get(getArticleByArticleId)
  .patch(patchArticleByArticleId);

module.exports = articlesRouter;
