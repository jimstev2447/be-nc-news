const articlesRouter = require('express').Router();
const {
  getAllArticles,
  getArticleByArticleId,
  patchArticleByArticleId
} = require('../controllers/articles-controllers');
const {
  postCommentByArticleId,
  getAllCommentsByArticleId
} = require('../controllers/comments-controllers');
const { server405s } = require('../errors');

articlesRouter
  .route('/')
  .get(getAllArticles)
  .all(server405s);

articlesRouter
  .route('/:article_id')
  .get(getArticleByArticleId)
  .patch(patchArticleByArticleId)
  .all(server405s);

articlesRouter
  .route('/:article_id/comments')
  .post(postCommentByArticleId)
  .get(getAllCommentsByArticleId)
  .all(server405s);

module.exports = articlesRouter;
