const apiRouter = require('express').Router();
const topicRouter = require('./topics-router');
const usersRouter = require('./users-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');

const { sendDescription } = require('../controllers/api-controller');
const { server405s } = require('../errors');

apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter
  .route('/')
  .get(sendDescription)
  .all(server405s);

module.exports = apiRouter;
