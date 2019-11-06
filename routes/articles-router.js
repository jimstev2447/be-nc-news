const articlesRouter = require('express').Router();
const {
  getArticleByArticleId,
  patchArticleByArticleId
} = require('../controllers/articles-controllers');
const {
  postCommentByArticleId
} = require('../controllers/comments-controllers');
const { server405s } = require('../errors');

articlesRouter
  .route('/:article_id')
  .get(getArticleByArticleId)
  .patch(patchArticleByArticleId)
  .all(server405s);

articlesRouter
  .route('/:article_id/comments')
  .post(postCommentByArticleId)
  .all(server405s);
module.exports = articlesRouter;
