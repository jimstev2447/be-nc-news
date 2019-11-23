const topicsRouter = require('express').Router();
const {
  getAllTopics,
  postTopic
} = require('../controllers/topics-controllers');
const { server405s } = require('../errors');

topicsRouter
  .route('/')
  .get(getAllTopics)
  .post(postTopic)
  .all(server405s);

module.exports = topicsRouter;
