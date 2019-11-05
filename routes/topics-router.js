const topicsRouter = require('express').Router();
const { getAllTopics } = require('../controllers/topics-controllers');
const { server405s } = require('../errors');

topicsRouter
  .route('/')
  .get(getAllTopics)
  .all(server405s);

module.exports = topicsRouter;
