const articlesRouter = require('express').Router();
const {
  getArticleByArticleId
} = require('../controllers/articles-controllers');

articlesRouter.route('/:article_id').get(getArticleByArticleId);

module.exports = articlesRouter;
